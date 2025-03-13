import { Server as HttpServer } from 'http'
import { Server as IOSServer, Socket } from 'socket.io'
import { UserVerifyStatus } from '~/constants/enum'
import HttpStatusCode from '~/constants/HttpStatusCode.enum'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/errors.model'
import { verifyToken } from './jwt'
import { TokenPayload } from '~/models/schemas/Tokens.schema'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import { Conversation } from '~/models/schemas/Conversation.schema'

interface SendChatMessage {
  to: string
  content: string
}

interface ReceiveChatMessage {
  from: string
  content: string
}

class SocketModule {
  static ioInstance: IOSServer
  static connections = new Map<string, { socket_id: string }>()

  static init(httpServer: HttpServer) {
    const ioInstance = new IOSServer(httpServer, {
      cors: {
        origin: '*'
      }
    })

    this.ioInstance = ioInstance
    this.initConnection()
  }
  private static initConnection() {
    this.ioInstance.use(async (socket, next) => {
      const { Authorization } = socket.handshake.auth
      const access_token = Authorization.split(' ')[1]
      try {
        const decode_authorization = await verifyToken({
          token: access_token,
          secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN
        })
        const { verify } = decode_authorization
        if (verify !== UserVerifyStatus.Verified) {
          throw new ErrorWithStatus({
            message: USER_MESSAGES.USER_NOT_VERIFIED,
            status: HttpStatusCode.FORBIDDEN
          })
        }

        // Truyền decode authorization
        socket.handshake.auth.decoded_authorization = decode_authorization
        next()
      } catch (error) {
        next({
          message: 'Unauthorized',
          name: 'UnauthorizedError',
          data: error
        })
      }
    })
    this.ioInstance.on('connection', (socket) => {
      this.chatEventListener(socket)
    })
  }

  private static chatEventListener(socket: Socket) {
    const userId = (socket.handshake.auth.decoded_authorization as TokenPayload).user_id

    this.connections.set(userId, {
      socket_id: socket.id
    })
    console.log(this.connections)
    socket.on('disconnect', () => {
      if (userId) {
        this.connections.delete(userId)
        console.log(`Disconnected: ${userId} (${socket.id})`)
      }
    })

    socket.on('send-chat-message', async (data: SendChatMessage) => {
      const { socket_id } = this.connections.get(data.to)

      const newConversation = new Conversation({
        from: new ObjectId(userId),
        to: new ObjectId(data.to),
        content: data.content
      })

      const result = await databaseService.conversations.insertOne(newConversation)

      socket.emit('send_message_success', {
        payload: {
          ...newConversation,
          _id: result.insertedId
        }
      })

      socket.to(socket_id).emit('receive-chat-message', {
        from: userId,
        content: data.content
      } satisfies ReceiveChatMessage)
    })
  }
}

export default SocketModule
