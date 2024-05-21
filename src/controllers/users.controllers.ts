import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import usersService from '~/services/users.services'
import {
  ForgotPasswordReqBody,
  LogoutRequestBody,
  RegisterRequestBody,
  ResetPasswordRequestBody,
  VerifyForgotPasswordReqBody
} from './../models/requests/user.requests'
import { USER_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enum'
import { omit } from 'lodash'
import { IUser } from '~/models/schemas/User.schema'
import { ErrorWithStatus } from '~/models/errors.model'
import HttpStatusCode from '~/constants/HttpStatusCode.enum'

export const loginController = async (req: Request, res: Response) => {
  const user = req.user
  if (user) {
    const result = await usersService.login(user)
    return res.status(200).json({
      message: 'Login Successfully',
      result
    })
  }
}

export const registerController = async (
  req: Request<ParamsDictionary, unknown, RegisterRequestBody>,
  res: Response
) => {
  const result = await usersService.register(req.body)
  return res.status(200).json({
    message: USER_MESSAGES.LOGIN_SUCCESSFULLY,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, unknown, LogoutRequestBody>, res: Response) => {
  const refresh_token = req.body.refresh_token
  const result = await usersService.logout(refresh_token)
  return res.status(200).json({
    message: USER_MESSAGES.LOGOUT_SUCCESSFULLY
  })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, unknown, { email_verify_token: string }>,
  res: Response
) => {
  const user_id = req.decode_email_verify_token?.user_id
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

  if (!user) {
    return res.status(404).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }

  // Verified user already
  if (user.email_verify_token === '') {
    return res.status(200).json({
      message: USER_MESSAGES.EMAIL_VERIFIED
    })
  }

  const result = await usersService.verifyEmail(user_id ?? '')

  return res.status(200).json({
    message: USER_MESSAGES.EMAIL_VERIFY_SUCCESSFULLY,
    result
  })
}

export const resendVerifyEmailController = async (req: Request, res: Response) => {
  const user_id = req.decode_authorization?.user_id
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(404).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }

  if (user.verify === UserVerifyStatus.Verified) {
    return res.status(200).json({
      message: USER_MESSAGES.EMAIL_VERIFIED
    })
  }

  await usersService.resendVerifyEmail(user_id ?? '')

  return res.status(200).json({
    message: USER_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESSFULLY
  })
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, unknown, ForgotPasswordReqBody>,
  res: Response
) => {
  const forgot_password_token = await usersService.createForgotPasswordToken(req.user?._id.toString() ?? '')
  return res.status(200).json({
    forgot_password_token
  })
}

export const verifyForgotPasswordTokenController = async (
  req: Request<ParamsDictionary, unknown, VerifyForgotPasswordReqBody>,
  res: Response
) => {
  return res.status(200).json({
    message: USER_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESSFULLY
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, unknown, ResetPasswordRequestBody>,
  res: Response
) => {
  const { password } = req.body
  const user_id = req.user?._id.toString() ?? ''
  await usersService.resetPassword(user_id, password)
  return res.status(200).json({
    message: USER_MESSAGES.CHANGE_PASSWORD_SUCCESSFULLY
  })
}

export const getMeController = async (req: Request, res: Response) => {
  const user_id = req.decode_authorization?.user_id
  const user = await usersService.getUserById(user_id ?? '')
  return res.status(200).json({
    message: USER_MESSAGES.GET_PROFILE_SUCCESSFULLY,
    result: user
  })
}

export const updateProfileController = async (req: Request<ParamsDictionary, unknown, IUser>, res: Response) => {
  const user_id = req.decode_authorization?.user_id ?? ''
  const user = await usersService.getUserById(user_id ?? '')
  if (!user) {
    return res.status(404).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }

  const result = await usersService.updateProfile(user_id, req.body)
  return res.status(200).json({
    message: USER_MESSAGES.UPDATE_PROFILE_SUCCESSFULLY,
    result
  })
}

export const getProfileController = async (req: Request<{ username: string }>, res: Response) => {
  const { username } = req.params
  const user = await usersService.getUserByUsername(username)
  if (!user) {
    return res.status(404).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }
  return res.status(200).json({
    message: USER_MESSAGES.GET_PROFILE_SUCCESSFULLY,
    result: user
  })
}

export const addFollowController = async (
  req: Request<ParamsDictionary, unknown, { followed_user_id: string }>,
  res: Response
) => {
  const { followed_user_id } = req.body
  const user_id = req.decode_authorization?.user_id ?? ''

  const isFollowExisted = await databaseService.followers.findOne({
    user_id: new ObjectId(user_id),
    followed_user_id: new ObjectId(followed_user_id)
  })

  if (isFollowExisted) {
    return res.status(400).json({
      message: USER_MESSAGES.FOLLOW_EXISTED
    })
  }

  await usersService.addFollow(user_id, followed_user_id)
  return res.status(200).json({
    message: USER_MESSAGES.ADD_FOLLOW_SUCCESSFULLY
  })
}

export const removeFollowController = async (
  req: Request<ParamsDictionary, unknown, { followed_user_id: string }>,
  res: Response
) => {
  const { followed_user_id } = req.body
  const user_id = req.decode_authorization?.user_id ?? ''

  const isFollowExisted = await databaseService.followers.findOne({
    user_id: new ObjectId(user_id),
    followed_user_id: new ObjectId(followed_user_id)
  })

  if (!isFollowExisted) {
    return res.status(400).json({
      message: USER_MESSAGES.FOLLOW_NOT_EXISTED
    })
  }

  await usersService.removeFollow(user_id, followed_user_id)
  return res.status(200).json({
    message: USER_MESSAGES.REMOVE_FOLLOW_SUCCESSFULLY
  })
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, unknown, { old_password: string; new_password: string }>,
  res: Response
) => {
  const { new_password, old_password } = req.body

  if (new_password == old_password) {
    throw new ErrorWithStatus({
      message: USER_MESSAGES.PASSWORD_NOT_CHANGE,
      status: HttpStatusCode.BAD_REQUEST
    })
  }

  const user_id = req.decode_authorization?.user_id ?? ''

  await usersService.resetPassword(user_id, req.body.new_password)
  return res.status(200).json({
    message: USER_MESSAGES.CHANGE_PASSWORD_SUCCESSFULLY
  })
}

export const googleOAuthController = async (
  req: Request<ParamsDictionary, unknown, unknown, { code: string }>,
  res: Response
) => {
  const { code } = req.query

  const { access_token, refresh_token, is_new_user } = await usersService.oauth(code)

  return res.redirect(`http://localhost:3000/login/oauth?access_token=${access_token}&refresh_token=${refresh_token}`)
}
