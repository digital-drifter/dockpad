import Vue, { VueConstructor } from 'vue'
import io from 'socket.io-client'

class WebSocketClient {
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

    this.conn.on('message', (e: any) => {
      console.log(e)

      this.callbacks.forEach((callback: ((data: any) => void)) => {
        callback(e)
      })
    })
  }

  send (message: any, cb?: (data: any) => void): void {
    if (cb) {
      this.callbacks.set('test', cb)
    }
    this.conn.send(message)
  }

  emit (event: string, payload: any): void {
    this.conn.emit(event, payload)
  }
}

export default function (vm: VueConstructor<Vue>, options: any) {
  Object.assign(vm.prototype, { $ws: new WebSocketClient(options) })
}
