import jwt from "jsonwebtoken";
import { refreshAccessToken } from "../controller/authController.js";
import { errorHandlerFunc } from "../errorHandler/errorHandler.js";

const authenticateUser = (req, res, next) => {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    if (!accessToken && refreshToken) {
        return refreshAccessToken(req, res); // Refresh access token if expired.
    }
    if (!accessToken) {
        return res.redirect("/auth/login");
    }

    try {
        const user = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError" && refreshToken) {
            console.log("[INFO]: Access token expired. Refreshing...");
            return refreshAccessToken(req, res);
        }

        errorHandlerFunc(
            err,
            res,
            "middleware/authenticate.log",
            401,
            "Authentication failed",
        );
    }
};

export { authenticateUser };
