import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import usersService from '~/services/users.services'
import { RegisterRequestBody } from './../models/requests/user.requests'
import { USER_MESSAGES } from '~/constants/messages'
import { WithId } from 'mongodb'
import { IUser } from '~/models/schemas/User.schema'

export const loginController = async (req: Request, res: Response) => {
  const { user } = req as Request & { user: WithId<IUser> }
  const result = await usersService.login(user)
  return res.status(200).json({
    message: 'Login Successfully',
    result
  })
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
