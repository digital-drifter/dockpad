import Vue from 'vue'
import { IBitbucket, IDocker, IWebSocketClient } from '@/dockpad'

declare module 'vue/types/vue' {
  interface Vue {
    $bitbucket: IBitbucket
    $docker: IDocker
    $emitter: Vue
    $http: any
    $ws: IWebSocketClient
  }
}
