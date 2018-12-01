export interface IBitbucket {
  repositories: any[]
  repository: any
  authenticated: boolean
  teams: any[]
  user: any
  team: any
  authenticate (): Promise<any>
  getUser(): Promise<any>
  getRepositories(search?: string): Promise<any>
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
