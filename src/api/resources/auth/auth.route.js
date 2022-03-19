import express from "express";
import loginController from "./login.controller.js";
import registerController from "./register.controller.js";
import VerifyEmailAccount from "./VerifyEmailController.js";
import forgotPasswordController from "./ForgotPasswordController.js";
import {
    sanitize
} from "../../../middleware/sanitizer";

export const authRouter = express.Router();

authRouter.route("/login").post(sanitize(), loginController.login);
authRouter.route("/register").post(sanitize(), registerController.create);
authRouter.route("/verify-email/:token").get(VerifyEmailAccount.emailVerify);
authRouter
    .route("/account-verify")
    .post(sanitize(), VerifyEmailAccount.sendEmailLink);
authRouter
    .route("/forgot-password")
    .post(sanitize(), forgotPasswordController.sendLink);
authRouter
    .route("/reset-password")
    .post(sanitize(), forgotPasswordController.resetPassword);