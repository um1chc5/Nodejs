import { ObjectId } from 'mongodb'

export interface ILike {
  _id?: ObjectId
  user_id: ObjectId
  created_at?: Date
  tweet_id: ObjectId
}

export class Like implements ILike {
  _id?: ObjectId
  user_id: ObjectId
  created_at?: Date
  tweet_id: ObjectId
  constructor({ _id, created_at, user_id, tweet_id }: ILike) {
    this._id = _id
    this.created_at = created_at || new Date()
    this.user_id = user_id
    this.tweet_id = tweet_id
  }
}
