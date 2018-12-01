import Vue, { VueConstructor } from 'vue'
import qs from 'qs'
import { IBitbucket, IBitbucketOauth } from '@/dockpad'

class Bitbucket implements IBitbucket {
  private readonly key: string = ''
  private readonly secret: string = ''
  private readonly baseUrl: string = 'https://bitbucket.org'
  private readonly apiBaseUrl: string = 'https://api.bitbucket.org'
  private readonly version: string = '2.0'

  constructor (options: { [p: string]: any }) {
    this.key = options.key
    this.secret = options.secret
  }

  public get authenticated (): boolean {
    try {
      return !!this.oauth.access_token
    } catch (e) {
      return false
    }
  }

  public get repositories (): any[] {
    try {
      return JSON.parse(localStorage.getItem('bitbucket_repositories') as string)
    } catch (e) {
      return []
    }
  }

  public set repositories (value: any[]) {
    localStorage.setItem('bitbucket_repositories', JSON.stringify(value))
  }

  public get branches (): any[] {
    try {
      return JSON.parse(localStorage.getItem('bitbucket_branches') as string)
    } catch (e) {
      return []
    }
  }

  public set branches (value: any[]) {
    localStorage.setItem('bitbucket_branches', JSON.stringify(value))
  }

  public get branch (): any {
    try {
      return JSON.parse(localStorage.getItem('bitbucket_branch') as string)
    } catch (e) {
      return {} as any
    }
  }

  public set branch (value: any) {
    localStorage.setItem('bitbucket_branch', JSON.stringify(value))
  }

  public get repository (): any {
    try {
      return JSON.parse(localStorage.getItem('bitbucket_repository') as string)
    } catch (e) {
      return {}
    }
  }

  public set repository (value: any) {
    localStorage.setItem('bitbucket_repository', JSON.stringify(value))
  }

  public get user (): any {
    return JSON.parse(localStorage.getItem('bitbucket_user') as string)
  }

  public set user (value: any) {
    localStorage.setItem('bitbucket_user', JSON.stringify(value))
  }

  public get team (): any {
    return JSON.parse(localStorage.getItem('bitbucket_team') as string)
  }

  public set team (value: any) {
    localStorage.setItem('bitbucket_team', JSON.stringify(value))
  }

  public get teams (): any[] {
    try {
      return JSON.parse(localStorage.getItem('bitbucket_teams') as string)
    } catch (e) {
      return []
    }
  }

  public set teams (value: any[]) {
    localStorage.setItem('bitbucket_teams', JSON.stringify(value))
  }

  private get oauth (): IBitbucketOauth {
    try {
      return JSON.parse(localStorage.getItem('bitbucket_oauth') || '')
    } catch (e) {
      return {} as IBitbucketOauth
    }
  }

  private set oauth (value: IBitbucketOauth) {
    localStorage.setItem('bitbucket_oauth', JSON.stringify(value))
  }

  private get headers (): Headers {
    const headers = new Headers()

    headers.set('Authorization', `Bearer ${ this.oauth.access_token }`)

    return headers
  }

  private get basicAuth (): string {
    return 'Basic ' + Buffer.from(`${ this.key }:${ this.secret }`).toString('base64')
  }

  public authenticate (): Promise<any> {
    window.addEventListener('message', (e: any) => {
      if (e.data.hasOwnProperty('code')) {
        const formData = new FormData()

        formData.append('grant_type', 'client_credentials')
        formData.append('code', e.data.code)

        const headers = new Headers()

        headers.set('Authorization', 'Basic ' + Buffer.from(`${ this.key }:${ this.secret }`).toString('base64'))

        return fetch(`${ this.baseUrl }/site/oauth2/access_token`, {
          method: 'post',
          body: formData,
          headers
        })
          .then((res: Response) => {
            return res.json()
          })
          .then((obj: IBitbucketOauth) => {
            this.oauth = obj
          })
          .catch((error: any) => {
            console.error(error)
          })
      }
    })

    return this.popup(`${ this.baseUrl }/site/oauth2/authorize?client_id=${ this.key }&response_type=code`)
  }

  public getUser (): Promise<any> {
    return fetch(`${ this.apiBaseUrl }/${ this.version }/user`, {
      headers: this.headers
    })
      .then((response: Response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((data: any) => {
        this.user = data
      })
  }

  public getTeams (): Promise<any> {
    return fetch(`${ this.apiBaseUrl }/${ this.version }/teams?role=admin`, {
      headers: this.headers
    })
      .then((response: Response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((data: any) => {
        this.teams = data.values
      })
  }

  public getRepositories (search?: string): Promise<any> {
    let url: string = `${ this.apiBaseUrl }/${ this.version }/repositories/${this.team.uuid}`
    if (search) {
      url += `?q=name${encodeURIComponent('~"' + search + '"')}`
    }
    return fetch(url, {
      headers: this.headers
    })
      .then((response: Response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((data: any) => {
        this.repositories = data.values
      })
  }

  public getBranches (): Promise<any> {
    return fetch(`${ this.apiBaseUrl }/${ this.version }/repositories/${this.team.uuid}/${this.repository.uuid}/refs/branches`, {
      headers: this.headers
    })
      .then((response: Response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((data: any) => {
        this.branches = data.values
      })
  }

  private refresh (): Promise<any> {
    const formData = new FormData()

    formData.append('grant_type', 'refresh_token')
    formData.append('refresh_token', this.oauth.refresh_token)

    return fetch(`${ this.baseUrl }/site/oauth2/access_token`, {
      method: 'post',
      body: formData,
      headers: this.headers
    })
      .then((response: Response) => response.json())
      .then((data: any) => {
        console.log(data)
      })
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
    const authWindow = window.open(url, 'Bitbucket API', windowOpts)
    const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent'
    const eventer = (window as any)[eventMethod]
    const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message'

    // Listen to message from child window
    return new Promise((resolve, reject) => {
      eventer(messageEvent, (e: MessageEvent) => {
        if (authWindow) {
          if (e.origin !== 'http://localhost:8080') {
            authWindow.close()
            reject('Not allowed')
          }

          const params = new URLSearchParams(authWindow.location.search)

          if (params.has('code') && (params.get('code') as string).length) {
            resolve(params.get('code') as string)
            authWindow.close()
          } else {
            resolve('waiting...')
          }
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
