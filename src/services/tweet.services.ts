import { TweetRequestBody } from '~/models/requests/tweet.request'
import databaseService from './database.services'
import Tweet from '~/models/schemas/Tweet.schema'
import { ObjectId } from 'mongodb'
import Hashtag from '~/models/schemas/Hashtag.schema'
import { has } from 'lodash'

class TweetService {
  async createTweet(body: TweetRequestBody, user_id: string) {
    const { hashtags } = body
    const finalHashtags = await Promise.all(
      hashtags.map((hashtag) => {
        return databaseService.hashtags
          .findOneAndUpdate(
            { name: hashtag },
            {
              $setOnInsert: new Hashtag({ name: hashtag, _id: new ObjectId() })
            },
            {
              upsert: true,
              returnDocument: 'after'
            }
          )
          .then((value) => {
            return value._id
          })
      })
    )

    return await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        medias: body.medias,
        type: body.type,
        hashtags: finalHashtags,
        mentions: body.mentions,
        parent_id: body.parent_id,
        user_id: new ObjectId(user_id)
      })
    )
  }
}

const tweetService = new TweetService()
export default tweetService
