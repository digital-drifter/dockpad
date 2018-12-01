import Vue, { VueConstructor } from 'vue'
import { IDocker } from '@/dockpad'

class Docker implements IDocker {
  public readonly databases: string[] = []
  public readonly caches: string[] = []
  public readonly dependencies: { composer: string[], node: string[] }
  public readonly images: string[] = []
  public readonly modules: string[] = []
  public readonly webservers: string[] = []

  public selected: { [p: string]: any } = {
    caches: [],
    databases: [],
    dependencies: { composer: [], node: [] },
    image: '',
    modules: [],
    webserver: ''
  }

  constructor (options: IDocker) {
    this.caches = options.caches
    this.databases = options.databases
    this.dependencies = options.dependencies
    this.images = options.images
    this.modules = options.modules
    this.webservers = options.webservers
  }
}

export default (vm: VueConstructor<Vue>, options: any) => {
  Object.defineProperty(vm.prototype, '$docker', {
    value: new Docker(options)
  })
}
