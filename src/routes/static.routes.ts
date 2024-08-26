import { Router } from 'express'
import {
  serverM3u8Controller,
  serverTransportStreamController,
  serveStaticImage,
  serveStaticStreamingVideo
} from '~/controllers/media.controllers'

const staticRoute = Router()

staticRoute.get('/images/:name', serveStaticImage)
staticRoute.get('/videos-stream/:name', serveStaticStreamingVideo)
staticRoute.get('/video-hls/:id', serverM3u8Controller)
staticRoute.get('/video-hls/:id/:v/:segment', serverTransportStreamController)

export default staticRoute
