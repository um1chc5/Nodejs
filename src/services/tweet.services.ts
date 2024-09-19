import { TweetRequestBody } from '~/models/requests/tweet.request'
import databaseService from './database.services'
import Tweet from '~/models/schemas/Tweet.schema'
import { ObjectId } from 'mongodb'

class TweetService {
  async createTweet(body: TweetRequestBody) {
    const { hashtags, mentions } = body
    const finalHashtags = await Promise.all(
      hashtags.map(async (hashtag) => {
        const result = await databaseService.hashtags.findOne({ name: hashtag })
        if (!result) {
          const new_id = new ObjectId()
          await databaseService.hashtags.insertOne({ _id: new_id, name: hashtag })
          return new_id
        }
        return result._id
      })
    )

    databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        medias: body.medias,
        type: body.type,
        hashtags: finalHashtags,
        mentions: body.mentions,
        parent_id: body.parent_id
      })
    )
  }
}

const tweetService = new TweetService()
export default tweetService
