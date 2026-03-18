import { sendEmail } from "./sendEmailService.js";

class OtpManager {
    async sendVerificationCode(email){
        return await sendEmail(email);
    }

    async verifyOtp(enteredOtp, email){
        const storedOtp = await Otp.findOne({ email });
        const isValid = await storedOtp.compareOtp(enteredOtp);
        if (isValid) {
            await storedOtp.deleteOne();
            return true;
        }
        return false;
    }

}

export default new OtpManager();