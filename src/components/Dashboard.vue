<template>
    <v-container fill-height fluid grid-list-md>
        <v-layout row wrap>
            <v-flex md4 shrink sm6 xs12>
                <v-card>
                    <v-toolbar card>
                        <v-toolbar-title class="title">Containers</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-list two-line>
                            <v-list-tile avatar v-for="container in containers">
                                <v-list-tile-avatar>
                                    <v-avatar :class="{ [container.indicatorColor]: true }" size="20px">&nbsp;</v-avatar>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ container.Image }}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ container.Status }}</v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-btn-toggle exclusive mandatory v-model="container.action">
                                        <v-btn flat @click="containerExec(container.id, 'start')">
                                            <v-icon :class="{ 'green--text': container.State === 'running' }">play_circle_outline</v-icon>
                                        </v-btn>
                                        <v-btn flat @click="containerExec(container.id, 'pause')">
                                            <v-icon :class="{ 'yellow--text': container.State === 'paused' }">pause</v-icon>
                                        </v-btn>
                                        <v-btn flat @click="containerExec(container.id, 'stop')">
                                            <v-icon :class="{ 'red--text': container.State === 'exited' }">stop</v-icon>
                                        </v-btn>
                                    </v-btn-toggle>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Route } from 'vue-router'
  import { ContainerState } from '@/dockpad'

  @Component
  export default class Dashboard extends Vue {
    containers: any[] = []

    info: any = {}

    beforeRouteEnter (to: Route, from: Route, next: any): void {
      next((vm: Vue & any) => {
        const commands = [
          {
            entity: 'containers',
            action: 'list'
          }
        ]

        vm.$ws.emit('docker', commands, (data: any) => {
          vm.containers = data.values[0].map((container: any) => Object.assign(container, {
            action: container.State === 'running' ? 0 : (container.State === 'paused' ? 1 : 2),
            indicatorColor: vm.indicatorColor(container.State)
          }))
        })

        // vm.$ws.emit('docker', {
        //   command: 'info'
        // }, (info: any) => {
        //   console.log(info)
        //   vm.info = info
        // })
      })
    }

    public indicatorColor (state: ContainerState): string {
      switch (state) {
        case 'running':
          return 'green'
        case 'created':
          return 'green'
        case 'paused':
          return 'yellow'
        case 'exited':
          return 'grey'
        case 'dead':
          return 'red'
      }
    }

    private containerExec(id: string, action: string): void {
      const commands = [
        {
          entity: 'container',
          action: 'get',
          args: [id]
        },
        {
          entity: 'container',
          action
        }
      ]

      const callback = (data: any) => {
        console.log(data)
      }

      this.$ws.emit('docker', commands, callback)
    }
  }
</script>
