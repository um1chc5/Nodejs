import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType } from '~/constants/enum'
import { Media } from '../others.mode'

interface ITweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string //  chỉ null khi tweet gốc
  hashtags: ObjectId[]
  mentions: string[]
  medias: Media[]
  guest_views?: number
  user_views?: number
  created_at?: Date
  updated_at?: Date
}

export default class Tweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId //  chỉ null khi tweet gốc
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_views?: number
  user_views?: number
  created_at?: Date
  updated_at?: Date

  constructor({
    _id,
    user_id,
    audience,
    content,
    guest_views,
    parent_id,
    type,
    user_views,
    created_at,
    hashtags,
    medias,
    mentions,
    updated_at
  }: ITweet) {
    const date = new Date()

    this._id = _id
    this.user_id = user_id
    this.audience = audience
    this.content = content
    this.guest_views = guest_views || 0
    this.parent_id = parent_id ? new ObjectId(parent_id) : null
    this.type = type
    this.user_views = user_views || 0
    this.created_at = created_at || date
    this.updated_at = updated_at || date
    this.hashtags = hashtags
    this.mentions = mentions.map((mention) => new ObjectId(mention))
    this.medias = medias
  }
}
