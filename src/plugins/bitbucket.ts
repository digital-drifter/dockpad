import Vue, { VueConstructor } from 'vue'
import { IBitbucket } from '@/dockpad'

class Bitbucket implements IBitbucket {
  private readonly key: string = ''
  private secret: string = ''

  constructor (options: { [p: string]: any }) {
    this.key = options.key
    this.secret = options.secret
  }

  public authenticate (): Promise<any> {
    return this.popup(`https://bitbucket.org/site/oauth2/authorize?client_id=${ this.key }&response_type=code`)

    // return fetch(`https://bitbucket.org/site/oauth2/authorize?client_id=${ this.key }&response_type=token`)
    //   .then((res: Response) => {
    //     console.log(res)
    //   })
    //   .catch((error: any) => {
    //     console.error(error)
    //   })
  }

  private popup (baseUrl: string): any {
    const windowArea: any = {
      width: Math.floor(window.outerWidth * 0.8),
      height: Math.floor(window.outerHeight * 0.5)
    }

    if (windowArea.width < 1000) { windowArea.width = 1000 }
    if (windowArea.height < 630) { windowArea.height = 630 }

    windowArea.left = Math.floor(window.screenX + ((window.outerWidth - windowArea.width) / 2))
    windowArea.top = Math.floor(window.screenY + ((window.outerHeight - windowArea.height) / 8))

    const sep = (baseUrl.indexOf('?') !== -1) ? '&' : '?'
    const url = `${ baseUrl }${ sep }`
    const windowOpts = `toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,width=${ windowArea.width },height=${ windowArea.height },left=${ windowArea.left },top=${ windowArea.top }`
    const authWindow = window.open(url, 'dockpadPopup', windowOpts)
    const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent'
    const eventer = (window as any)[eventMethod]
    const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message'

    // Listen to message from child window
    return new Promise((resolve, reject) => {
      eventer(messageEvent, (e: MessageEvent) => {
        console.log(window.location)

        if (e.origin !== 'http://localhost:8080') {
          authWindow.close()
          reject('Not allowed')
        }

        if (e.data) {
          resolve(JSON.parse(e.data))
          authWindow.close()
        } else {
          authWindow.close()
          reject('Unauthorised')
        }
      }, false)
    })
  }
}

export default (vm: VueConstructor<Vue>, options: any) => {
  Object.defineProperty(vm.prototype, '$bitbucket', {
    value: new Bitbucket(options)
  })
}
