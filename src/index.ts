import express, { NextFunction, Request, Response } from 'express'
import databaseService from './services/database.services'
import userRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/errors.middlewares'
import mediaRouter from './routes/media.routes'
import { initFolder } from './utils/file'
import { UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRoute from './routes/static.routes'
import cors from 'cors'
import tweetRouter from './routes/tweet.routes'
import bookMarkRouter from './routes/bookmark.routes'

const app = express()
const port = process.env.PORT

initFolder()

databaseService.connect().then(() => {
  databaseService.createIndexUsers()
  databaseService.createIndexToken()
})

app.use(cors())
app.use(express.json())
app.use('/users', userRouter)
app.use('/media', mediaRouter)
app.use('/static', staticRoute)
app.use('/static/videos', express.static(UPLOAD_VIDEO_DIR)) // Express static serving is more stable than  res.sendFile for serving videos.
app.use('/tweets', tweetRouter)
app.use('/bookmarks', bookMarkRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log('Listening to port', port)
})
