import express from "express";
import passport from "passport";

import {
    checkLogin,
    handleAuth,
    logout,
} from "../controller/authController.js";
import { errorHandlerWrapper } from "../errorHandler/errorHandler.js";

const router = express.Router();

// Token is verified if exists otherwise redirects to microsoft auth.
router.get(
    "/login",
    errorHandlerWrapper(checkLogin, "controller/authController"),
);

// Microsoft auth occurs here by calling microsoft strategy middleware.
router.get(
    "/microsoft/redirect",
    passport.authenticate("microsoft", { session: false }),
    errorHandlerWrapper(handleAuth, "controller/authController"),
);

// Handles logout.
router.get("/logout", errorHandlerWrapper(logout, "controller/authController"));

export { router as authRouter };
