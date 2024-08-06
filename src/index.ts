import express, { NextFunction, Request, Response } from 'express'
import databaseService from './services/database.services'
import userRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/errors.middlewares'
import mediaRouter from './routes/media.routes'
import { initFolder } from './utils/file'
import { UPLOAD_IMAGE_DIR } from './constants/dir'
import { serveStaticImage } from './controllers/media.controllers'

const app = express()
const port = process.env.PORT

initFolder()

databaseService.connect()

app.use(express.json())
app.use('/users', userRouter)
app.use('/media', mediaRouter)
app.use('/static/:image', serveStaticImage)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log('Listening to port', port)
})
