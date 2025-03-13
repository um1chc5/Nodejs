import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'

export const getConversation = async (req: Request, res: Response) => {
  const { user_id: from } = req.decode_authorization
  const to = req.query.target_user_id as string

  const conversations = await databaseService.conversations
    .find({
      $or: [
        {
          from: new ObjectId(from),
          to: new ObjectId(to)
        },
        {
          from: new ObjectId(to),
          to: new ObjectId(from)
        }
      ]
    })
    .toArray()

  return res.json({
    message: 'Get conversation successfully',
    result: conversations
  })
}
