import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BOOKMARK_MESSAGES } from '~/constants/messages'
import { BookmarkTweetReqBody } from '~/models/requests/bookmark.request'
import bookmarkServices from '~/services/bookmark.services'

export const addBookmarkController = async (
  req: Request<ParamsDictionary, unknown, BookmarkTweetReqBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization
  const { tweet_id } = req.body

  await bookmarkServices.addBookmark(user_id, tweet_id)

  return res.status(200).json({
    message: BOOKMARK_MESSAGES.ADD_BOOKMARK_SUCCESSFULLY
  })
}

export const deleteBookmarkController = async (req: Request<{ tweet_id: string }>, res: Response) => {
  const { user_id } = req.decode_authorization
  const { tweet_id } = req.params

  await bookmarkServices.deleteBookmark(user_id, tweet_id)

  return res.status(200).json({
    message: BOOKMARK_MESSAGES.DELETE_BOOKMARK_SUCCESSFULLY
  })
}
