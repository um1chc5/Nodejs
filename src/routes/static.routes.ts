import { Router } from 'express'
import {
  serverM3u8Controller,
  serverTransportStreamController,
  serveStaticImage,
  serveStaticStreamingVideo
} from '~/controllers/media.controllers'

const staticRoute = Router()

staticRoute.get(
  '/images/:name',
  // #swagger.tags = ['Static']
  serveStaticImage
)
staticRoute.get(
  '/videos-stream/:name',
  // #swagger.tags = ['Static']
  serveStaticStreamingVideo
)
staticRoute.get(
  '/video-hls/:id',
  // #swagger.tags = ['Static']
  serverM3u8Controller
)
staticRoute.get(
  '/video-hls/:id/:v/:segment',
  // #swagger.tags = ['Static']
  serverTransportStreamController
)

export default staticRoute
