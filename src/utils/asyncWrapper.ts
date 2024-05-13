import { NextFunction, Request, RequestHandler, Response } from 'express'

export const asyncWrapper =
  <P, ResBody, ReqBody, ReqQuery>(func: RequestHandler<P, ResBody, ReqBody, ReqQuery>) =>
  async (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
