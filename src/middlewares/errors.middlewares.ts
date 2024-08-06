import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import HttpStatusCode from '~/constants/HttpStatusCode.enum'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json(omit(err, 'status'))
}
