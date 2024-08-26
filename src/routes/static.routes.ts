import { Router } from 'express'
import { serveStaticImage, serveStaticStreamingVideo, serveStaticVideo } from '~/controllers/media.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'

const staticRoute = Router()

staticRoute.get('/images/:name', serveStaticImage)
staticRoute.get('/videos-stream/:name', serveStaticStreamingVideo)

export default staticRoute
