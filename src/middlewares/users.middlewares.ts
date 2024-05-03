import { checkSchema } from 'express-validator'
import HttpStatusCode from '~/constants/HttpStatusCode.enum'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/errors.model'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { hashPassword } from '~/utils/encrypt'
import { verifyToken } from '~/utils/jwt'
import validate from '~/utils/validations'

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 1,
            max: 100
          }
        },
        trim: true
      },
      email: {
        notEmpty: true,
        isEmail: true,
        trim: true,
        custom: {
          options: async (value) => {
            const isEmailExisted = await usersService.checkEmailExist(value)
            if (isEmailExisted) {
              throw new Error(USER_MESSAGES.EXISTED_EMAIL)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: 'Password min length is 6, max length is 50'
        },
        isStrongPassword: {
          options: {
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1
          },
          errorMessage: 'Password requires lowercase, uppercase, symbol and number'
        }
      },
      date_of_birth: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          }
        }
      }
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: true,
        isEmail: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })

            if (user === null) {
              throw new Error(USER_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT)
            }

            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: 'Password min length is 6, max length is 50'
        },
        isStrongPassword: {
          options: {
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1
          },
          errorMessage: 'Password requires lowercase, uppercase, symbol and number'
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        errorMessage: USER_MESSAGES.REQUIRED_ACCESS_TOKEN,
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.REQUIRED_ACCESS_TOKEN,
                status: HttpStatusCode.UNAUTHORIZED
              })
            }
            const decode_authorization = await verifyToken({ token: access_token })
            req.decode_authorization = decode_authorization
            return true
          }
        }
      }
    },
    ['headers']
  )
)
