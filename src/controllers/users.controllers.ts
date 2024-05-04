import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import usersService from '~/services/users.services'
import { LogoutRequestBody, RegisterRequestBody } from './../models/requests/user.requests'
import { USER_MESSAGES } from '~/constants/messages'

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
