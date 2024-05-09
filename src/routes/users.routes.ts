import { Router } from 'express'
import {
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  verifyEmailController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  forgotPasswordTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyEmailTokenValidator
} from '~/middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'

const userRouter = Router()

userRouter.post('/login', loginValidator, asyncWrapper(loginController))

userRouter.post('/register', registerValidator, asyncWrapper(registerController))

userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, asyncWrapper(logoutController))

userRouter.post('/verify-email', verifyEmailTokenValidator, asyncWrapper(verifyEmailController))

userRouter.post('/resend-verify-email', accessTokenValidator, asyncWrapper(resendVerifyEmailController))

userRouter.post('/forgot-password', forgotPasswordValidator, asyncWrapper(forgotPasswordController))

userRouter.post(
  '/verify-forgot-password',
  forgotPasswordTokenValidator,
  asyncWrapper(verifyForgotPasswordTokenController)
)

userRouter.post('/reset-password', resetPasswordValidator, asyncWrapper(resetPasswordController))

export default userRouter
