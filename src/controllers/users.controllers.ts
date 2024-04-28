import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import usersService from '~/services/users.services'
import { RegisterRequestBody } from './../models/requests/user.requests'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === '' && password == '') {
    return res.status(200).json({
      message: 'Login Successfully'
    })
  }
  return res.status(400).json({
    error: 'something went wrong'
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, unknown, RegisterRequestBody>,
  res: Response
) => {
  console.log(req.body)
  try {
    const result = await usersService.register(req.body)
    console.log(result)
    return res.status(200).json({
      message: 'Login Successfully',
      result
    })
  } catch (error) {
    console.log(error)
  }
}
