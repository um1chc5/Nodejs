import { config } from 'dotenv'
import { Db, MongoClient } from 'mongodb'
import { IFollower } from '~/models/schemas/Follower.schema'
import { RefreshToken } from '~/models/schemas/Tokens.schema'
import { IUser } from '~/models/schemas/User.schema'
import VideoStatus from '~/models/schemas/VideoStatus.schema'

config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.jerqvrf.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (err) {
      console.log(err)
    } finally {
      // Ensures that the client will close when you finish/error
      // await this.client.close()
    }
  }

  createIndexUsers() {
    this.users.createIndex({ username: 1, password: 1 })
    this.users.createIndex({ email: 1 }, { unique: true })
    this.users.createIndex({ username: 1 }, { unique: true })
  }

  createIndexToken() {
    this.refreshToken.createIndex({ token: 1 })
    this.refreshToken.createIndex(
      { exp: 1 },
      {
        expireAfterSeconds: 0
      }
    )
  }

  get users() {
    return this.db.collection<IUser>(process.env.DB_USER)
  }

  get refreshToken() {
    return this.db.collection<RefreshToken>(process.env.DB_REFRESH_TOKEN)
  }

  get followers() {
    return this.db.collection<IFollower>(process.env.DB_FOLLOWERS)
  }

  get videoStatus() {
    return this.db.collection<VideoStatus>(process.env.DB_VIDEO_STATUS_COLLECTION)
  }
}

const databaseService = new DatabaseService()
export default databaseService
