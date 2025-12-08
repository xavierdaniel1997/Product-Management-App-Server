import { googleLogin, loginUser, logoutUser, refreshAccessToken, registerUser, resendOtp, verifyEmail, verifyOtpAndUser } from '../controller/auth.controller';
import express from 'express';

const router = express.Router();

router.post("/verify-email", verifyEmail);
router.post("/verify-otp", verifyOtpAndUser);
router.post("/resend-otp", resendOtp);
router.post("/register-user", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/google-login", googleLogin);
router.post("/logout", logoutUser);


export default router;