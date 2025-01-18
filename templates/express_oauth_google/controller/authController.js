import axios from "axios";
import jwt from "jsonwebtoken";

import { errorHandlerFunc } from "../errorHandler/errorHandler.js";
import { googleConfig } from "../config/config.js";

const checkLogin = (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return res.redirect("/");
        } catch (err) {
            errorHandlerFunc(
                err,
                "controller/authController",
                401,
                "Authentication failed",
            );
        }
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
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    // res.cookie('token', token, { httpOnly: true, secure: true }) // Use in production.
    return res.redirect("/");
};

const logout = (req, res) => {
    res.clearCookie("token");
    return res.redirect("/");
};

export { checkLogin, handleAuth, logout };
