import Vue from 'vue'
import { IBitbucket } from '@/dockpad'

declare module 'vue/types/vue' {
  interface Vue {
    $bitbucket: IBitbucket
  }
}
