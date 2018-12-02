import Vue, { VueConstructor } from 'vue'
import { IBitbucket, IBitbucketOauth } from '@/dockpad'
import { emitter } from '@/plugins/emitter'

class Bitbucket implements IBitbucket {
  private readonly baseUrl: string = 'https://bitbucket.org'
  private readonly apiBaseUrl: string = 'https://api.bitbucket.org'
  private readonly version: string = '2.0'

  private state: Map<string, any> = new Map()

  constructor (options: { [p: string]: any }) {
    this.state.set('bitbucket_oauth_key', options.key)
    this.state.set('bitbucket_oauth_secret', options.secret)

    const teams = localStorage.getItem('bitbucket_teams')
    const repositories = localStorage.getItem('bitbucket_repositories')
    const branches = localStorage.getItem('bitbucket_branches')

    this.state.set('bitbucket_teams', teams ? JSON.parse(teams) : [])
    this.state.set('bitbucket_repositories', repositories ? JSON.parse(repositories) : [])
    this.state.set('bitbucket_branches', branches ? JSON.parse(branches) : [])
  }

  public get authenticated (): boolean {
    try {
      return !!this.oauth.access_token
    } catch (e) {
      return false
    }
  }

  public get repositories (): any[] {
    return this.state.get('bitbucket_repositories')
  }

  public set repositories (repositories: any[]) {
    this.state.set('bitbucket_repositories', repositories)
  }

  public get branches (): any[] {
    return this.state.get('bitbucket_branches')
  }

  public set branches (branches: any[]) {
    this.state.set('bitbucket_branches', branches)
  }

  public get user (): any {
    return JSON.parse(localStorage.getItem('bitbucket_user') as string)
  }

  public set user (value: any) {
    localStorage.setItem('bitbucket_user', JSON.stringify(value))
  }

  public get teams (): any[] {
    return this.state.get('bitbucket_teams')
  }

  public set teams (teams: any[]) {
    this.state.set('bitbucket_teams', teams)
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
    return 'Basic ' + Buffer.from(`${ this.state.get('bitbucket_oauth_key') }:${ this.state.get('bitbucket_oauth_secret') }`).toString('base64')
  }

  public authenticate (): Promise<any> {
    window.addEventListener('message', (e: any) => {
      if (e.data.hasOwnProperty('code')) {
        const formData = new FormData()

        formData.append('grant_type', 'client_credentials')
        formData.append('code', e.data.code)

        const headers = new Headers()

        headers.set('Authorization', this.basicAuth)

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
          .then(() => {
            return this.getUser()
          })
          .catch((error: any) => {
            console.error(error)
          })
          .finally(() => {
            emitter.$emit('authenticated', this.authenticated)
          })
      }
    })

    return this.popup(`${ this.baseUrl }/site/oauth2/authorize?client_id=${ this.state.get('bitbucket_oauth_key') }&response_type=code`)
  }

  public getUser (): Promise<any> {
    return fetch(`${ this.apiBaseUrl }/${ this.version }/user`, {
      headers: this.headers
    })
      .then((response: Response) => {
        if (response.ok) {
          return response.json()
        }

        return Promise.reject(response.statusText)
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

  public getRepositories (team: any, search?: string): Promise<any> {
    let url: string = `${ this.apiBaseUrl }/${ this.version }/repositories/${team.uuid}`
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

  public getBranches (team: any, repository: any): Promise<any> {
    return fetch(`${ this.apiBaseUrl }/${ this.version }/repositories/${team.uuid}/${repository.uuid}/refs/branches`, {
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

  public refresh (): Promise<any> {
    const formData = new FormData()
    const headers = new Headers()

    formData.append('grant_type', 'refresh_token')
    formData.append('refresh_token', this.oauth.refresh_token)

    headers.set('Authorization', this.basicAuth)

    return fetch(`${ this.baseUrl }/site/oauth2/access_token`, {
      method: 'post',
      body: formData,
      headers
    })
      .then((response: Response) => response.json())
      .then((data: IBitbucketOauth) => {
        this.oauth = data
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
  Object.assign(vm.prototype, { $bitbucket: new Bitbucket(options) })
}
