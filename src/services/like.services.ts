import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { Like } from '~/models/schemas/Like.schema'

class LikeServices {
  async addLike(user_id: string, tweet_id: string) {
    await databaseService.likes.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Like({
          _id: new ObjectId(),
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
  }

  async unLike(user_id: string, tweet_id: string) {
    await databaseService.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
  }
}

const likeServices = new LikeServices()

export default likeServices
