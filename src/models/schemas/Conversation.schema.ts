import { ObjectId } from 'mongodb'

export interface IConversation {
  _id?: ObjectId
  from: ObjectId
  to: ObjectId
  content: string
  created_at?: Date
  updated_at?: Date
}

export class Conversation {
  _id?: ObjectId
  from: ObjectId
  to: ObjectId
  content: string
  created_at: Date
  updated_at: Date

  constructor({ _id, from, to, content, created_at, updated_at }: IConversation) {
    const date = new Date()
    this._id = _id
    this.from = from
    this.to = to
    this.content = content
    this.created_at = created_at ?? date
    this.updated_at = updated_at ?? date
  }
}
