import jwt from 'jsonwebtoken'

import { errorHandlerFunc } from '../errorHandler/errorHandler.js'

// cookie token authetication
const authenticateUser = (req, res, next) => {
    const token = req.cookies?.token
    if (!token) {
        return res.redirect('/auth/login')
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (err) {
        errorHandlerFunc(err, 'middleware/authenticate.log', 401, "Authentication failed.")
    }
}

export { authenticateUser }
