import { Server, Socket } from 'socket.io'

interface SendChatMessage {
  from: string
  to: string
  content: string
}

type ReceiveChatMessage = Omit<SendChatMessage, 'to'>

class SocketModule {
  static ioInstance: Server
  static connections = new Map<string, { socket_id: string }>()
  static socketIdToUserId = new Map<string, string>()

  static init(ioInstance: Server) {
    this.ioInstance = ioInstance
    this.initConnection()
  }
  private static initConnection() {
    this.ioInstance.on('connection', (socket) => {
      this.chatEventListener(socket)
    })
  }

  private static chatEventListener(socket: Socket) {
    socket.on('disconnect', () => {
      const userId = this.socketIdToUserId.get(socket.id)
      if (userId) {
        this.connections.delete(userId)
        this.socketIdToUserId.delete(socket.id)
        console.log(`Disconnected: ${userId} (${socket.id})`)
      }
    })

    socket.on('init-connect', (data) => {
      this.connections.set(data.user_id, {
        socket_id: socket.id
      })
      this.socketIdToUserId.set(socket.id, data.user_id)
    })
    socket.on('send-chat-message', (data: SendChatMessage) => {
      const { socket_id } = this.connections.get(data.to)
      console.log(socket_id, data)
      socket.to(socket_id).emit('receive-chat-message', {
        from: data.from,
        content: data.content
      } satisfies ReceiveChatMessage)
    })
  }
}

export default SocketModule
