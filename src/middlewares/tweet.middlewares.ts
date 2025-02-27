import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enum'
import HttpStatusCode from '~/constants/HttpStatusCode.enum'
import { TWEET_MESSAGES, USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/errors.model'
import databaseService from '~/services/database.services'
import { getEnumValues } from '~/utils/other'
import validate from '~/utils/validations'
import { asyncWrapper } from './../utils/asyncWrapper'
import Tweet from '~/models/schemas/Tweet.schema'

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

export const tweetIdValidator = validate(
  checkSchema(
    {
      tweet_id: {
        isMongoId: {
          errorMessage: TWEET_MESSAGES.INVALID_TWEET_ID
        },
        custom: {
          options: async (value, { req }) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: TWEET_MESSAGES.INVALID_TWEET_ID,
                status: HttpStatusCode.BAD_REQUEST
              })
            }
            const [tweet] = await databaseService.tweets
              .aggregate<Tweet>([
                {
                  $match: {
                    _id: ObjectId.createFromHexString(value)
                  }
                },
                {
                  $lookup: {
                    from: 'hashtags',
                    localField: 'hashtags',
                    foreignField: '_id',
                    as: 'hashtags'
                  }
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'mentions',
                    foreignField: '_id',
                    as: 'mentions'
                  }
                },
                {
                  $addFields: {
                    mentions: {
                      $map: {
                        input: '$mentions',
                        as: 'mention',
                        in: {
                          _id: '$$mention._id',
                          name: '$$mention.name',
                          username: '$$mention.username',
                          email: '$$mention.email'
                        }
                      }
                    }
                  }
                },
                {
                  $lookup: {
                    from: 'bookmarks',
                    localField: '_id',
                    foreignField: 'tweet_id',
                    as: 'bookmarks'
                  }
                },
                {
                  $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'tweet_id',
                    as: 'likes'
                  }
                },
                {
                  $lookup: {
                    from: 'tweets',
                    localField: '_id',
                    foreignField: 'parent_id',
                    as: 'tweet_children'
                  }
                },
                {
                  $addFields: {
                    bookmarks: {
                      $size: '$bookmarks'
                    },
                    likes: {
                      $size: '$likes'
                    },
                    retweet_count: {
                      $size: {
                        $filter: {
                          input: '$tweet_children',
                          as: 'item',
                          cond: {
                            $eq: ['$$item.type', TweetType.Retweet]
                          }
                        }
                      }
                    },
                    comment_count: {
                      $size: {
                        $filter: {
                          input: '$tweet_children',
                          as: 'item',
                          cond: {
                            $eq: ['$$item.type', TweetType.Comment]
                          }
                        }
                      }
                    },
                    quote_count: {
                      $size: {
                        $filter: {
                          input: '$tweet_children',
                          as: 'item',
                          cond: {
                            $eq: ['$$item.type', TweetType.QuoteTweet]
                          }
                        }
                      }
                    }
                  }
                },
                {
                  $project: {
                    tweet_children: 0
                  }
                }
              ])
              .toArray()

            if (!tweet) {
              throw new ErrorWithStatus({
                message: TWEET_MESSAGES.INVALID_TWEET_ID,
                status: HttpStatusCode.NOT_FOUND
              })
            }
            req.tweet = tweet
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const audienceValidator = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const tweet = req.tweet

  if (tweet.audience !== TweetAudience.TwitterCircle) {
    return next() // Skip validation if the audience is not Twitter Circle
  }

  // Check if user is logged in
  if (!req.decode_authorization) {
    throw new ErrorWithStatus({
      status: HttpStatusCode.UNAUTHORIZED,
      message: USER_MESSAGES.REQUIRED_ACCESS_TOKEN
    })
  }

  // Check if user account is deleted or locked
  const author = await databaseService.users.findOne({ _id: new ObjectId(tweet.user_id) })
  if (!author || author.verify === UserVerifyStatus.Banned) {
    throw new ErrorWithStatus({
      status: HttpStatusCode.NOT_FOUND,
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }

  const { user_id } = req.decode_authorization
  const isInTwitterCircle = Boolean(author.tweet_circle?.some((id) => id.equals(user_id)))

  if (!isInTwitterCircle && !author._id.equals(user_id)) {
    throw new ErrorWithStatus({
      status: HttpStatusCode.FORBIDDEN,
      message: TWEET_MESSAGES.NOT_IN_TWITTER_CIRCLE
    })
  }

  next() // Only one next() call at the end
})
