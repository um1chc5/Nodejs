import express from 'express'
import databaseService from './services/database.services'
import userRouter from './routes/users.routes'

const app = express()
const port = 3000

databaseService.connect()

app.use(express.json())

app.use('/users', userRouter)

app.listen(port, () => {
  console.log('Listening to port', port)
})
