import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { TWEET_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import validate from '~/utils/validations'

export const bookmarkValidator = validate(
  checkSchema({
    tweet_id: {
      notEmpty: true,
      isString: true,
      custom: {
        options: async (value: string) => {
          if (!ObjectId.isValid(value)) {
            throw new Error(TWEET_MESSAGES.INVALID_TWEET_ID)
          }

          const tweet = await databaseService.tweets.findOne({ _id: new ObjectId(value) })
          if (!tweet) {
            throw new Error(TWEET_MESSAGES.INVALID_TWEET_ID)
          }

          return true
        }
      }
    }
  })
)
