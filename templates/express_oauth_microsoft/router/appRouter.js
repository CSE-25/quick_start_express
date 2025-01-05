import express from 'express'

import { authenticateUser } from '../middleware/authenticate.js'
import { getUserHomePage } from '../controller/appController.js'
import { errorHandlerWrapper } from '../errorHandler/errorHandler.js'

const router = express.Router()

// Home page where user info is displayed.
router.get('/', authenticateUser, errorHandlerWrapper(getUserHomePage, 'controller/appController'))

export { router as appRouter }
