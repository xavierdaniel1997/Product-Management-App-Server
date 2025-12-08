import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library"; 
import { sendResponse } from "../utils/sendResponse";
import { createUser, findByEmail, updateUser } from "../service/auth.service";
import { generateOtp } from "../utils/generateOTP";
import { EmailType, sendEmail } from "../utils/emailService";
import { createOtp, deleteOtp, findOtp } from "../service/otp.service";
import { IUser, UserRole } from "../types/user";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/generateToken";
import { error } from "console";
import { JwtPayload } from "jsonwebtoken";
import axios from "axios";

const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const existingUser = await findByEmail(email);
        if (existingUser) {
            throw new Error("User already existing");
        }
        const otpCode = generateOtp();
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
        await createOtp({ email, otp: otpCode, expiresAt });
        await sendEmail(email, EmailType.OTP, { otp: otpCode });
        sendResponse(res, 200, null, "Otp send successfully to your email");
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to register the user");
    }
};

const verifyOtpAndUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;
        const validOtp = await findOtp(email, otp);
        if (!validOtp) {
            throw new Error("Invalid OTP");
        }
        if (otp !== validOtp.otp || email !== validOtp.email) {
            throw new Error("Invalid Otp");
        }

        const currentTime = new Date();
        if (otp.expiresAt < currentTime) {
            throw new Error("OTP has expired");
        }

        const user = {
            email,
            role: UserRole.USER,
            isVerified: true,
        };
        await createUser(user);
        await deleteOtp(email);
        sendResponse(res, 200, email, "OTP verifyed successfully");
    } catch (error: any) {
        sendResponse(res, 400, error, "Failed to verify the OTP");
        console.log("error", error);
    }
};

const resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const otpCode = generateOtp();
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
        await createOtp({ email, otp: otpCode, expiresAt });
        await sendEmail(email, EmailType.OTP, { otp: otpCode });
        sendResponse(res, 200, null, "Otp send successfully to your email");
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to resend OTP");
    }
};

const registerUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { firstName, lastName, email, password, confirmPassword } =
            req.body;
        const existingUser = await findByEmail(email);
        if (existingUser && existingUser.isRegComplet) {
            throw new Error("User already existing");
        }
        if (!existingUser || !existingUser.isVerified) {
            throw new Error("User is not verified OTP verification required");
        }
        if (password !== confirmPassword) {
            throw new Error("Password dosen't match");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const registerNewUser: Partial<IUser> = {
            firstName,
            lastName,
            password: hashPassword,
            isRegComplet: true,
        };
        const newUser = await updateUser(email, registerNewUser);
        console.log("user details after registred the new user", newUser);
        if (!newUser) {
            throw new Error("Failed to get th new user details");
        }
        if (
            !newUser._id ||
            !newUser.role ||
            !newUser.firstName ||
            !newUser.lastName ||
            !newUser.email
        ) {
            throw new Error("User detail missing required fields");
        }
        const accessToken = generateAccessToken(
            newUser._id,
            newUser.role,
            newUser.firstName,
            newUser.lastName,
            newUser.email
        );
        const refreshToken = generateRefreshToken(
            newUser._id,
            newUser.role,
            newUser.firstName,
            newUser.lastName,
            newUser.email
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });
        const expiresIn = 15 * 60;
        sendResponse(res,200,{user: newUser }, "User registered successfully");
    } catch (error: any) {
        sendResponse(
            res,
            400,
            null,
            error.message || "Failed to register the user"
        );
    }
};


const loginUser = async (req: Request, res: Response): Promise<void> => {
    console.log("checking the login user details", req.body)
    try {
        const { email, password } = req.body;
        const userData = await findByEmail(email);
        if (!userData) {
            throw new Error("User not fount");
        }
        if (!userData.isVerified) {
            throw new Error(
                "User is not verified. Please complete OTP verification."
            );
        }
        if (!userData.isRegComplet) {
            throw new Error("User registration is incomplete");
        }
        const matchPassword = await bcrypt.compare(password, userData.password!);
        if (!matchPassword) {
            throw new Error("Invalid credentials");
        }
        if (
            !userData._id ||
            !userData.role ||
            !userData.firstName ||
            !userData.lastName ||
            !userData.email
        ) {
            throw new Error("User detail missing required fields");
        }
        const accessToken = generateAccessToken(
            userData._id,
            userData.role,
            userData.firstName,
            userData.lastName,
            userData.email
        );
        const refreshToken = generateRefreshToken(
            userData._id,
            userData.role,
            userData.firstName,
            userData.lastName,
            userData.email
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });
        const expiresIn = 15 * 60;
        sendResponse(
            res,
            200,
            {
                user: userData,
                accessToken,
                expiresIn,
            },
            "User Login successfully"
        );
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to login")
    }
};

const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        sendResponse(res, 200, null, "Logout successfully")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to Logout")
    }
};


const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    const decoded = verifyRefreshToken(token) as JwtPayload;
    const newAccessToken = generateAccessToken(
      decoded._id,
      decoded.role,
      decoded.firstName,
      decoded.lastName,
      decoded.email
    );
    const expiresIn = 15 * 60; 
    sendResponse(res, 200, {accessToken: newAccessToken , expiresIn}, "Access token refreshed")
  } catch (error: any) {
    sendResponse( res, 500, null, error.message || "Failed to refresh access token");
  }
};


const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name } = req.body;

    if (!email) {
      throw new Error("Email is required from Google");
    }

    let user = await findByEmail(email);

    if (!user) {
      const [firstName, ...rest] = (name || "").split(" ");
      const lastName = rest.join(" ");

      user = await createUser({
        email,
        firstName,
        lastName,
        isVerified: true,
        isRegComplet: true,
        role: UserRole.USER,
      });
    }

    if (
      !user._id ||
      !user.role ||
      !user.firstName ||
      !user.lastName ||
      !user.email
    ) {
      throw new Error("User detail missing required fields");
    }

    const accessToken = generateAccessToken(
      user._id,
      user.role,
      user.firstName,
      user.lastName,
      user.email
    );

    const refreshToken = generateRefreshToken(
      user._id,
      user.role,
      user.firstName,
      user.lastName,
      user.email
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    const expiresIn = 15 * 60;

    sendResponse(
      res,
      200,
      {
        user,
        accessToken,
        expiresIn,
      },
      "Google login successful"
    );
  } catch (error: any) {
    sendResponse(
      res,
      400,
      null,
      error.message || "Failed to login with Google"
    );
  }
};

export { verifyEmail, verifyOtpAndUser, resendOtp, registerUser, loginUser, refreshAccessToken, googleLogin, logoutUser};
