import jwt from 'jsonwebtoken'

import { errorHandlerFunc } from '../errorHandler/errorHandler.js'

// Cookie token authentication.
const authenticateUser = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.redirect('/auth/login');
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        // Renew token if it gets expired.
        if (err.name === 'TokenExpiredError') {
            try {
                const user = jwt.decode(token);
                const newToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie('token', newToken, { httpOnly: true });
                req.user = user;
                return next();
            } catch (decodeErr) {
                console.error(`[ERROR]: ${decodeErr.message}`);
                errorHandlerFunc(err, res, 'middleware/authenticate.log', 401, 'Authentication failed');
                return res.redirect('/auth/login');
            }
        }
        errorHandlerFunc(err, res, 'middleware/authenticate.log', 401, 'Authentication failed');
    }
};


export { authenticateUser };
