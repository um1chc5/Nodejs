import express, { NextFunction, Request, Response } from 'express'
import databaseService from './services/database.services'
import userRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/errors.middlewares'

const app = express()
const port = 4000

databaseService.connect()

app.use(express.json())

app.use('/users', userRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log('Listening to port', port)
})
