import express from 'express';

import { checkLogin, handleAuth, logout } from '../controller/authController.js';
import { errorHandlerWrapper } from '../errorHandler/errorHandler.js';

const router = express.Router();

// Token is verified if exists otherwise redirects to Google auth.
router.get('/login', errorHandlerWrapper(checkLogin, 'controller/authController'));

// Handles Google callback.
router.get('/google/redirect', errorHandlerWrapper(handleAuth, 'controller/authController'));

// Handles logout.
router.get('/logout', errorHandlerWrapper(logout, 'controller/authController'));

export { router as authRouter };
