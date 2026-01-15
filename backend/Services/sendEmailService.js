import nodemailer from "nodemailer";
import Otp from "../Models/otpModel.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendEmail = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    try {
        await Otp.updateOne({email}, {otp: otp}, {upsert: true});
        const info = await transporter.sendMail({
            from: `"Webdrive" <webdrive.cloud@gmail.com>`,
            to: email,
            subject: "Your Webdrive verification code",
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Webdrive OTP</title>
            <style>
                body {
                margin: 0;
                padding: 0;
                background-color: #f4f4f5;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
                    Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
                }
                .container {
                max-width: 520px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                }
                .header {
                background: #4f46e5;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                font-size: 22px;
                font-weight: 600;
                }
                .content {
                padding: 32px 28px;
                color: #18181b;
                }
                .content p {
                margin: 0 0 14px;
                font-size: 15px;
                line-height: 1.6;
                }
                .otp-box {
                margin: 28px 0;
                text-align: center;
                }
                .otp {
                display: inline-block;
                font-size: 32px;
                letter-spacing: 6px;
                font-weight: 700;
                color: #4f46e5;
                background: #f4f4ff;
                padding: 14px 28px;
                border-radius: 10px;
                }
                .footer {
                padding: 20px 28px;
                background: #fafafa;
                font-size: 13px;
                color: #71717a;
                text-align: center;
                }
                .footer a {
                color: #4f46e5;
                text-decoration: none;
                font-weight: 500;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                Webdrive
                </div>

                <div class="content">
                <p>Hello,</p>

                <p>
                    Use the following One-Time Password (OTP) to verify your email address
                    for your <strong>Webdrive</strong> account.
                </p>

                <div class="otp-box">
                    <div class="otp">${otp}</div>
                </div>

                <p>
                    This OTP is valid for <strong>10 minutes</strong>.  
                    Please do not share this code with anyone.
                </p>

                <p>
                    If you didn’t request this verification, you can safely ignore this email.
                </p>
                </div>

                <div class="footer">
                © ${new Date().getFullYear()} Webdrive ·
                <a href="#">Privacy Policy</a>
                </div>
            </div>
            </body>
            </html>
        `,
        });

        console.log("Message sent:", info.messageId);
        return { success: true, message: "OTP sent successfully" };
    } catch (err) {
        console.log(err)
        return { success: false, message: "OTP couldn't be sent" };
    }
};