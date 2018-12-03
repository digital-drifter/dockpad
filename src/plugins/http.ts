import Vue, { VueConstructor } from 'vue'
import debounce from 'debounce-async'
import md5 from '../utils'

export default (vm: VueConstructor<Vue>, options: any) => {
  const { api, proxy } = options

  const createFormData = (obj: any) => {
    const formData = new FormData()

    Object.keys(obj).forEach((key: string) => {
      formData.set(key, obj[key])
    })

    return formData
  }

  const createHeaders = (obj: any) => {
    const headers = new Headers()

    Object.keys(obj).forEach((key: string) => {
      headers.set(key, obj[key])
    })

    return headers
  }

  const cache = new Map()

  let abortController: AbortController

  let active: boolean = false

  Object.assign(vm.prototype, {
    $http: new Proxy({}, {
      get: (target: any, p: string) => {
        return async (...args: any[]) => {
          if (active && abortController) {
            abortController.abort()
            active = false
          }

          let host: string
          let port: string
          let method: string

          switch (true) {
            case p.startsWith('api'):
              host = api.host
              port = api.port
              method = p.slice(3).toLowerCase()
              break
            case p.startsWith('proxy'):
              host = proxy.host
              port = proxy.port
              method = p.slice(5).toLowerCase()
              break
            default:
              return Promise.reject(`Invalid request: ${p}`)
          }

          const hash = md5(args[0])

          if (cache.has(hash)) {
            return Promise.resolve(cache.get(hash))
          }

          let params: any = {
            method
          }

          if (args.length > 1 && args[1]) {
            Object.assign(params, { body: createFormData(args[1]) })
          }

          if (args.length > 2 && args[2]) {
            Object.assign(params, { headers: createHeaders(args[2]) })
          }

          active = true

          abortController = new AbortController()

          Object.assign(params, { signal: abortController.signal })

          const url: string = `http://${ host }:${ port }/${ args[0] }`

          console.log(url)

          console.log(params)

          const req = (url: string) => new Promise(resolve => resolve(fetch(url, params)))

          const debounced = debounce(req, 800)

          return debounced(url).then((r: Response) => {
            if (r.ok) {
              return r.json()
            }

            return Promise.reject(r.statusText)
          })
            .then((json: any) => {
              cache.set(hash, json)

              return json
            })
            .catch((error: any) => Promise.reject(error))
            .finally(() => {
              active = false
            })
        }
      }
    })
  })
}
