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
import likeRouter from './routes/like.routes'
import './utils/fake'
import searchRouter from './routes/search.routes'
import './utils/s3'
import { createServer } from 'http'
import { Server } from 'socket.io'
import kill from 'kill-port'
import SocketModule from './utils/socket'

const app = express()
const port = process.env.PORT
const httpServer = createServer(app)

const IOInstance = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

initFolder()

databaseService.connect().then(() => {
  databaseService.createIndexUsers()
  databaseService.createIndexToken()
  databaseService.indexTweets()
})

app.use(cors())
app.use(express.json())
app.use('/users', userRouter)
app.use('/media', mediaRouter)
app.use('/static', staticRoute)
app.use('/static/videos', express.static(UPLOAD_VIDEO_DIR)) // Express static serving is more stable than  res.sendFile for serving videos.
app.use('/tweets', tweetRouter)
app.use('/bookmarks', bookMarkRouter)
app.use('/likes', likeRouter)
app.use('/search', searchRouter)
app.use(defaultErrorHandler)

kill(port).then(() => {
  httpServer.listen(port, () => {
    console.log('Listening to port', port)
  })
})

SocketModule.init(IOInstance)
