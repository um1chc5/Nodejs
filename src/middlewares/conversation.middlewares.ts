import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HttpStatusCode from '~/constants/HttpStatusCode.enum'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/errors.model'
import databaseService from '~/services/database.services'
import validate from '~/utils/validations'

export const conversationValidator = validate(
  checkSchema(
    {
      target_user_id: {
        notEmpty: true,
        isString: true,
        isMongoId: {
          errorMessage: USER_MESSAGES.INVALID_USER_ID
        },
        custom: {
          options: async (value) => {
            const user = await databaseService.users.findOne({
              _id: new ObjectId(value)
            })

            if (user === null) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.USER_NOT_FOUND,
                status: HttpStatusCode.NOT_FOUND
              })
            }

            return true
          }
        }
      }
    },
    ['query']
  )
)
