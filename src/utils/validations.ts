import express from 'express'
import { body, validationResult, ContextRunner, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import HttpStatusCode from '~/constants/HttpStatusCode.enum'
import { EntityError, ErrorWithStatus } from '~/models/errors.model'
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)

    // Continue if there is no errors
    if (errors.isEmpty()) {
      return next()
    }

    const errorsObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })

    for (const key in errorsObject) {
      const error = errorsObject[key]
      const { msg } = error
      // console.log(errorsObject)
      if (msg instanceof ErrorWithStatus && msg.status !== HttpStatusCode.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[key] = error
    }

    // console.log(entityError)

    next(entityError)
  }
}

export default validate
