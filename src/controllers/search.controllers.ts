import { Request, Response } from 'express'
import { MediaTypeQuery, PeopleFollow } from '~/constants/enum'
import searchService from '~/services/search.services'

export const searchController = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const content = req.query.content as string
  const media_type = req.query.media_type as MediaTypeQuery
  const people_follow = req.query.people_follow as PeopleFollow
  const user_id = req.decode_authorization.user_id

  const result = await searchService.search({
    limit,
    page,
    content,
    media_type,
    people_follow,
    user_id
  })
  
  return res.json({
    message: 'Search successfully',
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
