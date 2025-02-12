import axios from "axios";
import jwt from "jsonwebtoken";

import { errorHandlerFunc } from "../errorHandler/errorHandler.js";
import { googleConfig } from "../config/config.js";

const checkLogin = (req, res) => {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    if (accessToken) {
        try {
            jwt.verify(accessToken, process.env.JWT_SECRET);
            return res.redirect("/");
        } catch (err) {
            console.log("[INFO]: Access token expired or invalid.");
        }
    }

    if (refreshToken) {
        return refreshAccessToken(req, res);
    }

    const options = {
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: googleConfig.scope,
    };

    const queryParams = new URLSearchParams(options).toString();
    return res.redirect(`${googleConfig.authUrl}?${queryParams}`);
};

const handleAuth = async (req, res) => {
    const { error, code } = req.query;
    if (error == "access_denied") {
        // Redirect to home if user cancels authentication.
        return res.redirect("/");
    }

    try {
        // Exchange code for tokens.
        const { data: tokens } = await axios.post(googleConfig.tokenUrl, {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_CALLBACK_URL,
            grant_type: "authorization_code",
        });

        // Fetch user profile.
        const { data: googleUser } = await axios.get(
            `${googleConfig.userInfoUrl}&access_token=${tokens.access_token}`,
        );

        const user = { email: googleUser.email, name: googleUser.name };
        const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: "10s",
        });

        // Set cookies for access and refresh tokens.
        res.cookie("access_token", accessToken, { httpOnly: true });
        res.cookie("refresh_token", tokens.refresh_token, { httpOnly: true });

        return res.redirect("/");
    } catch (err) {
        errorHandlerFunc(
            err,
            res,
            "controller/authController.log",
            500,
            "Authentication failed",
        );
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;

        // Use refresh token to get a new access token.
        const { data: tokens } = await axios.post(googleConfig.tokenUrl, {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
        });

        // Decode user information from the token.
        const { data: googleUser } = await axios.get(
            `${googleConfig.userInfoUrl}&access_token=${tokens.access_token}`,
        );

        const user = { email: googleUser.email, name: googleUser.name };
        const newAccessToken = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: "10s",
        });

        // Update access token cookie.
        res.cookie("access_token", newAccessToken, { httpOnly: true });
        return res.redirect("/");
    } catch (err) {
        errorHandlerFunc(
            err,
            res,
            "controller/authController.log",
            401,
            "Failed to refresh access token",
        );
    }
};

const logout = (req, res) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token"); // Clear refresh token as well.
    return res.redirect("/");
};

export { checkLogin, handleAuth, logout, refreshAccessToken };
