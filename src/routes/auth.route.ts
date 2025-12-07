import { registerUser, resendOtp, verifyEmail, verifyOtpAndUser } from '../controller/auth.controller';
import express from 'express';

const route = express.Router();

route.post("/verify-email", verifyEmail);
route.post("/verify-otp", verifyOtpAndUser);
route.post("/resend-otp", resendOtp);
route.post("/register-user", registerUser);

export default route;