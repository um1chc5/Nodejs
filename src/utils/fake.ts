import { ObjectId } from 'mongodb'
import { faker } from '@faker-js/faker'
import { RegisterRequestBody } from '~/models/requests/user.requests'
import { TweetRequestBody } from '~/models/requests/tweet.request'
import { MediaType, TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enum'
import databaseService from '~/services/database.services'
import { User } from '~/models/schemas/User.schema'
import { hashPassword } from './encrypt'
import { Follower } from '~/models/schemas/Follower.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Tweet from '~/models/schemas/Tweet.schema'

const PASSWORD = 'Duoc123!'

const MYID = new ObjectId('66d7dc2f90b9c6ca77240493')

const USER_COUNT = 400

const createRandomUser = () => {
  const user: RegisterRequestBody = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: PASSWORD,
    date_of_birth: faker.date.birthdate().toISOString()
  }

  return user
}

const createRandomTweet = () => {
  const tweet: TweetRequestBody = {
    type: TweetType.Tweet,
    audience: TweetAudience.Everyone,
    content: faker.lorem.paragraph({
      min: 10,
      max: 80
    }),
    hashtags: ['NodeJS', 'MongoDB', 'ExpressJS', 'Swagger', 'Docker', 'Socket.io'],
    medias: [
      {
        type: MediaType.Image,
        url: faker.image.url()
      }
    ],
    mentions: [],
    parent_id: null
  }

  return tweet
}

const users: RegisterRequestBody[] = faker.helpers.multiple(createRandomUser, {
  count: USER_COUNT
})

const insertMultipleUsers = async (users: RegisterRequestBody[]) => {
  console.log('Creating users...')
  const result = await Promise.all(
    users.map(async (user) => {
      const user_id = new ObjectId()
      await databaseService.users.insertOne(
        new User({
          ...user,
          _id: user_id,
          username: `user${user_id.toString()}`,
          password: hashPassword(user.password),
          date_of_birth: new Date(user.date_of_birth),
          verify: UserVerifyStatus.Verified
        })
      )
      return user_id
    })
  )
  console.log('Finish creating fake users, total users: ', result.length)
  return result
}

const followMultipleUsers = async (user_id: ObjectId, followed_user_ids: ObjectId[]) => {
  console.log('Start following...')
  const result = await Promise.all(
    followed_user_ids.map((followed_user_id) => {
      return databaseService.followers.insertOne(
        new Follower({
          user_id,
          followed_user_id
        })
      )
    })
  )

  console.log(`Followed success ${result.length} users`)
}

const checkAndCreateHashtags = async (hashtags: string[]) => {
  const hashtagDocument = await Promise.all(
    hashtags.map((hashtag) => {
      return databaseService.hashtags.findOneAndUpdate(
        { name: hashtag },
        {
          $setOnInsert: new Hashtag({ name: hashtag, _id: new ObjectId() })
        },
        { upsert: true, returnDocument: 'after' }
      )
    })
  )
  return hashtagDocument
}

const insertTweet = async (user_id: ObjectId, tweet: TweetRequestBody) => {
  const hashtags = await checkAndCreateHashtags(tweet.hashtags)
  const result = await databaseService.tweets.insertOne(
    new Tweet({
      audience: tweet.audience,
      content: tweet.content,
      medias: tweet.medias,
      type: tweet.type,
      hashtags: hashtags.map((hashtag) => hashtag._id),
      mentions: tweet.mentions,
      parent_id: tweet.parent_id,
      user_id
    })
  )
  return result
}

const insertMultipleTweets = async (ids: ObjectId[]) => {
  console.log('Creating tweets...')
  let count = 0
  const result = await Promise.all(
    ids.map(async (id, index) => {
      await Promise.all([insertTweet(id, createRandomTweet()), insertTweet(id, createRandomTweet())])
      count += 2
      console.log(`Created ${count} tweets`)
    })
  )
  console.log('finish creating tweets')
  return result
}

const runFake = () => {
  console.log('run fake.ts')
  insertMultipleUsers(users).then((ids) => {
    followMultipleUsers(new ObjectId(MYID), ids).catch((err) => {
      console.log('err following', JSON.stringify(err, null, 2))
    })
    insertMultipleTweets(ids).catch((err) => {
      console.log('err creating tweets', JSON.stringify(err, null, 2))
    })
  })
}

// runFake()
