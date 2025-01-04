import jwt from 'jsonwebtoken'
import { errorHandlerFunc } from '../errorHandler/errorHandler.js'

const checkLogin = (req, res) => {
    const token = req.cookies?.token
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET)
            return res.redirect('/')
        } catch (err) {
            errorHandlerFunc(err, 'controller/authController', 401, 'Authentication failed')
        }
    }
    return res.redirect('/auth/microsoft/redirect')
}

const handleAuth = (req, res) => {
    if (req.user) {
        const token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie('token', token, { httpOnly: true }) // use in development
        // res.cookie('token', token, { httpOnly: true, secure: true }) // use in production
        return res.redirect('/')
    } else {
        errorHandlerFunc(err, 'controller/authController', 401, 'Authentication failed')
    }
}

const logout = (req, res) => {
    res.clearCookie('token')
    return res.redirect('/')
}

export { checkLogin, handleAuth, logout }