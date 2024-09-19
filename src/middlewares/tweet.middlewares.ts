import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType } from '~/constants/enum'
import { TWEET_MESSAGES } from '~/constants/messages'
import { getEnumValues } from '~/utils/other'
import validate from '~/utils/validations'

const tweetTypes = getEnumValues(TweetType)
const tweetAudiences = getEnumValues(TweetAudience)
const mediaTypes = getEnumValues(MediaType)

export const createTweetValidator = validate(
  checkSchema({
    type: {
      isIn: {
        options: [tweetTypes],
        errorMessage: 'Invalid tweet type'
      }
    },
    audience: {
      isIn: {
        options: [tweetAudiences],
        errorMessage: 'Invalid tweet audience'
      }
    },
    content: {
      isString: true,
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          const hashtags = req.body.hashtags as string[]
          const mentions = req.body.mentions as string[]

          if (
            [TweetType.Comment, TweetType.QuoteTweet, TweetType.Tweet].includes(type) &&
            isEmpty(hashtags) &&
            isEmpty(mentions) &&
            value === ''
          ) {
            throw new Error(TWEET_MESSAGES.CONTENT_NOT_EMPTY_STRING)
          }

          if (type === TweetType.Retweet && value !== '') {
            throw new Error(TWEET_MESSAGES.CONTENT_MUST_EMPTY_STRING)
          }
          return true
        }
      }
    },
    parent_id: {
      optional: true,
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          if (type === TweetType.Tweet && value !== null) {
            throw new Error(TWEET_MESSAGES.PARENT_ID_NULL)
          }

          if ([TweetType.Comment, TweetType.QuoteTweet, TweetType.Retweet].includes(type) && !value) {
            throw new Error(TWEET_MESSAGES.PARENT_ID_REQUIRED)
          }
          return true
        }
      }
    },
    hashtags: {
      optional: true,
      isArray: true,
      custom: {
        options: (value) => {
          if (value.some((hashtag: unknown) => typeof hashtag !== 'string')) {
            throw new Error(TWEET_MESSAGES.HASHTAGS_MUST_STRINGS)
          }
          return true
        }
      }
    },
    mentions: {
      optional: true,
      isArray: true,
      custom: {
        options: (value) => {
          if (value.some((item: string) => !ObjectId.isValid(item))) {
            throw new Error(TWEET_MESSAGES.MENTION_INVALID_USER_ID)
          }
          return true
        }
      }
    },
    medias: {
      optional: true,
      isArray: true,
      custom: {
        options: (value) => {
          if (
            value.some((item: any) => {
              return typeof item.url !== 'string' || !mediaTypes.includes(item.type)
            })
          ) {
            throw new Error(TWEET_MESSAGES.INVALID_MEDIA_OBJECT)
          }
          return true
        }
      }
    }
  })
)
