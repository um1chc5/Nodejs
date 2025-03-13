import { Router } from 'express'
import {
  addFollowController,
  changePasswordController,
  forgotPasswordController,
  getMeController,
  refreshTokensPairController,
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

userRouter.post(
  '/login',
  // #swagger.tags = ['User']
  loginValidator,
  asyncWrapper(loginController)
)

userRouter.post(
  '/register',
  // #swagger.tags = ['User']

  registerValidator,
  asyncWrapper(registerController)
)

userRouter.post(
  '/refresh-tokens-pair',
  // #swagger.tags = ['User']
  refreshTokenValidator,
  asyncWrapper(refreshTokensPairController)
)

userRouter.post(
  '/logout',
  // #swagger.tags = ['User']
  accessTokenValidator,
  refreshTokenValidator,
  asyncWrapper(logoutController)
)

userRouter.post(
  '/verify-email',
  // #swagger.tags = ['User']
  verifyEmailTokenValidator,
  asyncWrapper(verifyEmailController)
)

userRouter.post(
  '/resend-verify-email',
  // #swagger.tags = ['User']
  accessTokenValidator,
  asyncWrapper(resendVerifyEmailController)
)

userRouter.post(
  '/forgot-password',
  // #swagger.tags = ['User']
  forgotPasswordValidator,
  asyncWrapper(forgotPasswordController)
)

userRouter.post(
  '/verify-forgot-password',
  // #swagger.tags = ['User']
  forgotPasswordTokenValidator,
  asyncWrapper(verifyForgotPasswordTokenController)
)

userRouter.post(
  '/reset-password',
  // #swagger.tags = ['User']
  resetPasswordValidator,
  asyncWrapper(resetPasswordController)
)

userRouter.get(
  '/me',
  // #swagger.tags = ['User']
  accessTokenValidator,
  asyncWrapper(getMeController)
)

userRouter.patch(
  '/update-me',
  // #swagger.tags = ['User']
  accessTokenValidator,
  asyncWrapper(verifiedUserValidator),
  updateProfileValidator,
  asyncWrapper(updateProfileController)
)

userRouter.get(
  '/get-profile/:username',
  // #swagger.tags = ['User']
  accessTokenValidator,
  asyncWrapper(getProfileController)
)

userRouter.post(
  '/follow/add',
  // #swagger.tags = ['User']
  accessTokenValidator,
  asyncWrapper(verifiedUserValidator),
  followValidator,
  asyncWrapper(addFollowController)
)

userRouter.post(
  '/follow/remove',
  // #swagger.tags = ['User']
  accessTokenValidator,
  asyncWrapper(verifiedUserValidator),
  followValidator,
  asyncWrapper(removeFollowController)
)

userRouter.post(
  '/change-password',
  // #swagger.tags = ['User']
  accessTokenValidator,
  changePasswordValidator,
  asyncWrapper(changePasswordController)
)

userRouter.get(
  '/oauth/google',
  // #swagger.tags = ['User']
  asyncWrapper(googleOAuthController)
)

export default userRouter
