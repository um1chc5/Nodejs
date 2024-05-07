import { Router } from 'express'
import {
  loginController,
  logoutController,
  registerController,
  verifyEmailController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyEmailTokenValidator
} from '~/middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'

const userRouter = Router()

userRouter.post('/login', loginValidator, asyncWrapper(loginController))

userRouter.post('/register', registerValidator, asyncWrapper(registerController))

userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, asyncWrapper(logoutController))

userRouter.post('/verify-email', verifyEmailTokenValidator, asyncWrapper(verifyEmailController))

export default userRouter
