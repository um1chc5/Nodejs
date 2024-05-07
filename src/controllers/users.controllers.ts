import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import usersService from '~/services/users.services'
import { LogoutRequestBody, RegisterRequestBody } from './../models/requests/user.requests'
import { USER_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enum'

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

  await usersService.resendVerifyEmailController(user_id ?? '')

  return res.status(200).json({
    message: USER_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESSFULLY
  })
}
