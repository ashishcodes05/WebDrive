import { OAuth2Client } from "google-auth-library";
import { open } from "fs/promises";
import { Types } from "mongoose";
import path from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const client = new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri: "postmessage"
})

export const fetchUserFromGoogle = async (code) => {
    const { tokens } = await client.getToken(code);
    const loginTicket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: clientId
    })
    const userData = loginTicket.getPayload();
    return userData;
}

export const driveAuthClient = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
});

export const downloadAndSaveFile = async (file, accessToken) => {
    const { id } = file;
    const metaRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${id}?fields=name,mimeType,size`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );
    if (!metaRes.ok) {
        throw new Error("Failed to fetch file metadata");
    }
    const { name, mimeType, size } = await metaRes.json();
    let downloadUrl;
    let extension = path.extname(name) || ".bin";

    if (mimeType.startsWith("application/vnd.google-apps")) {
        const EXPORT_MAP = {
            "application/vnd.google-apps.document": {
                mime: "application/pdf",
                ext: ".pdf",
            },
            "application/vnd.google-apps.spreadsheet": {
                mime:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ext: ".xlsx",
            },
            "application/vnd.google-apps.presentation": {
                mime: "application/pdf",
                ext: ".pdf",
            },
        };

        const exportInfo = EXPORT_MAP[mimeType];
        if (!exportInfo) {
            throw new Error("Unsupported Google file type");
        }

        downloadUrl = `https://www.googleapis.com/drive/v3/files/${id}/export?mimeType=${exportInfo.mime}`;
        extension = exportInfo.ext;
    } else {
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`;
    }

    const res = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok || !res.body) {
        throw new Error("File download failed");
    }

    const fileId = new Types.ObjectId();
    const fd = await open(`./Storage/${fileId}${extension}`, "w");

    const readable = Readable.fromWeb(res.body);
    const writable = fd.createWriteStream();
    const totalBytes = Number(size);
    await pipeline(readable, writable);
    console.log("Finished Importing")
    return {
        _id: fileId,
        name,
        extension,
        size: totalBytes
    };
};