import Vue, { VueConstructor } from 'vue'
import io from 'socket.io-client'
import { IWebSocketClient } from '@/dockpad'

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: any) => {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)

    return v.toString(16)
  })
}

class WebSocketClient implements IWebSocketClient {
  conn: SocketIOClient.Socket

  callbacks: Map<string, ((data: any) => void)> = new Map()

  constructor (options: any) {
    this.conn = io(`ws://${ options.host }:${ options.port }`)

    this.conn.on('open', () => {
      console.log('Connection opened')
    })

    this.conn.on('close', (e: any) => {
      console.log('Connection closed')
    })

    this.conn.on('error', (e: any) => {
      console.error('Connection error')
    })

    this.conn.on('message', (payload: any) => {
      if (this.callbacks.has(payload.id)) {
        const callback = this.callbacks.get(payload.id)

        callback!.call(null, payload)

        this.callbacks.delete(payload.id)
      }
    })
  }

  send (message: any, cb?: (data: any) => void): void {
    const id = uuid()

    if (cb) {
      this.callbacks.set(id, cb)
    }

    this.conn.send({ id, message })
  }

  emit (event: string, commands: any[], cb?: (data: any) => void): void {
    const id = uuid()

    if (cb) {
      this.callbacks.set(id, cb)
    }

    this.conn.emit(event, { id, commands })
  }
}

export default function (vm: VueConstructor<Vue>, options: any) {
  Object.assign(vm.prototype, { $ws: new WebSocketClient(options) })
}
