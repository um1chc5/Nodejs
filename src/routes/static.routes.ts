import { Router } from 'express'
import { serveStaticImage, serveStaticVideo } from '~/controllers/media.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'

const staticRoute = Router()

staticRoute.get('/images/:name', serveStaticImage)
staticRoute.get('/videos/:name', serveStaticVideo)

export default staticRoute
