import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType } from '~/constants/enum'
import { Media } from '../others.mode'

export interface TweetRequestBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId //  chỉ null khi tweet gốc
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
}
