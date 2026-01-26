import { OAuth2Client } from "google-auth-library";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const client = new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri: "postmessage"
})

export const fetchUserFromGoogle = async(code) => {
    const { tokens } = await client.getToken(code);
    const loginTicket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: clientId
    })
    const userData = loginTicket.getPayload();
    return userData;
}