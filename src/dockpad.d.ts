export interface IBitbucket {
  repositories: any[]
  authenticated: boolean
  teams: any[]
  user: any

  authenticate (): Promise<any>

  refresh (): Promise<any>

  getUser (): Promise<any>

  getTeams (): Promise<any>

  getRepositories (team: any, search?: string): Promise<any>

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
