import { Request, Response } from 'express'

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

export const registerController = (req: Request, res: Response) => {
  const { email, password } = req.body

  return res.status(200).json({
    message: 'Login Successfully'
  })
}
