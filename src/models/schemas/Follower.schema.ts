import { ObjectId } from 'mongodb'

export interface IFollower {
  _id?: ObjectId
  user_id: ObjectId
  created_at?: Date
  followed_user_id: ObjectId
}

export class Follower {
  _id?: ObjectId
  user_id: ObjectId
  created_at?: Date
  followed_user_id: ObjectId
  constructor({ _id, created_at, user_id, followed_user_id }: IFollower) {
    this._id = _id
    this.created_at = created_at || new Date()
    this.user_id = user_id
    this.followed_user_id = followed_user_id
  }
}
