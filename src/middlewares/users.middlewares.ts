import { checkSchema } from 'express-validator'
import usersService from '~/services/users.services'
import validate from '~/utils/validations'

export const registerValidator = validate(
  checkSchema({
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
            throw new Error('Email is already existed')
          }
          return isEmailExisted
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
  })
)
