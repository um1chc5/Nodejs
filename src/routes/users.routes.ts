import { Router } from 'express'
import {
  addFollowController,
  changePasswordController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  googleOAuthController,
  loginController,
  logoutController,
  registerController,
  removeFollowController,
  resendVerifyEmailController,
  resetPasswordController,
  updateProfileController,
  verifyEmailController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  changePasswordValidator,
  followValidator,
  forgotPasswordTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateProfileValidator,
  verifiedUserValidator,
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

userRouter.get('/me', accessTokenValidator, asyncWrapper(getMeController))

userRouter.patch(
  '/update-me',
  accessTokenValidator,
  asyncWrapper(verifiedUserValidator),
  updateProfileValidator,
  asyncWrapper(updateProfileController)
)

userRouter.get('/get-profile/:username', accessTokenValidator, asyncWrapper(getProfileController))

userRouter.post(
  '/follow/add',
  accessTokenValidator,
  asyncWrapper(verifiedUserValidator),
  followValidator,
  asyncWrapper(addFollowController)
)

userRouter.post(
  '/follow/remove',
  accessTokenValidator,
  asyncWrapper(verifiedUserValidator),
  followValidator,
  asyncWrapper(removeFollowController)
)

userRouter.post(
  '/change-password',
  accessTokenValidator,
  changePasswordValidator,
  asyncWrapper(changePasswordController)
)

userRouter.get('/oauth/google', asyncWrapper(googleOAuthController))

export default userRouter
