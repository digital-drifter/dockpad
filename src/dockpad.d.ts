export interface IBitbucket {
  repositories: any
  authenticated: boolean
  teams: any[]
  user: any
  accessToken: string
  repoDir: string

  authenticate (): Promise<any>

  refresh (): Promise<any>

  clone (repository: any): void

  getUser (): Promise<any>

  getTeams (): Promise<any>

  getRepositories (team: any, page?: number, search?: string): Promise<any>

  getBranches (team: any, repository: any): Promise<any>
}

export interface IBitbucketOauth {
  access_token: string
  expires_in: number
  refresh_token: string
  scopes: string
  token_type: string
}

export interface IDocker {
  images: string[]
  modules: string[]
  databases: string[]
  caches: string[]
  dependencies: {
    composer: string[]
    node: string[]
  }
  webservers: string[]
}

export interface IWebSocketClient {
  emit (event: string, payload: any, cb?: (data: any) => void): void

  send (message: any, cb?: (data: any) => void): void
}

export type ContainerState = 'created' | 'restarting' | 'running' | 'paused' | 'exited' | 'dead'
