import Vue, { VueConstructor } from 'vue'
import md5 from '../utils'

export default (vm: VueConstructor<Vue>, options: any) => {
  const { host, port } = options

  const createFormData = (obj: any) => {
    const formData = new FormData()

    Object.keys(obj).forEach((key: string) => {
      formData.set(key, (obj as any)[key])
    })

    return formData
  }

  const createHeaders = (obj: any) => {
    const headers = new Headers()

    Object.keys(obj).forEach((key: string) => {
      headers.set(key, (obj as any)[key])
    })

    return headers
  }

  const cache = new Map()

  Object.assign(vm.prototype, {
    $http: new Proxy({}, {
      get: (target: any, p: string) => {
        return async (...args: any[]) => {
          const hash = md5(args[0])

          if (cache.has(hash)) {
            return cache.get(hash)
          }

          let params: any = {
            method: p
          }

          if (args.length > 1) {
            Object.assign(params, { body: createFormData(args[1]) })
          }

          if (args.length > 2) {
            Object.assign(params, { headers: createHeaders(args[2]) })
          }

          return fetch(`http://${ host }:${ port }/${ args[0] }`, params)
            .then((r: Response) => {
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
        }
      }
    })
  })
}
