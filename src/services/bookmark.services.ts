import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { Bookmark } from '~/models/schemas/Bookmark.schema'

class BookmarkServices {
  async addBookmark(userId: string, tweetId: string) {
    await databaseService.bookmarks.findOneAndUpdate(
      {
        user_id: new ObjectId(userId),
        tweet_id: new ObjectId(tweetId)
      },
      {
        $setOnInsert: new Bookmark({
          _id: new ObjectId(),
          user_id: new ObjectId(userId),
          tweet_id: new ObjectId(tweetId)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
  }

  async deleteBookmark(userId: string, tweetId: string) {
    await databaseService.bookmarks.findOneAndDelete({
      user_id: new ObjectId(userId),
      tweet_id: new ObjectId(tweetId)
    })
  }
}

const bookmarkServices = new BookmarkServices()

export default bookmarkServices
