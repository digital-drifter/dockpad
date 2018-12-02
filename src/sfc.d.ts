import Vue from 'vue'
import { IBitbucket, IDocker } from '@/dockpad'

declare module 'vue/types/vue' {
  interface Vue {
    $bitbucket: IBitbucket
    $docker: IDocker
    $emitter: Vue
  }
}
