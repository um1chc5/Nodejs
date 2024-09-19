import { ObjectId } from 'mongodb'

interface HashtagType {
  _id?: ObjectId
  name: string
  updated_at?: Date
}

export default class Hashtag {
  _id?: ObjectId
  name: string
  updated_at?: Date
  constructor({ _id, name, updated_at }: HashtagType) {
    this._id = _id
    this.name = name
    this.updated_at = updated_at
  }
}
