<template>
    <v-card>
        <v-toolbar card>
            <v-toolbar-title class="title">Service Configuration</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" width="500">
                <v-btn slot="activator" class="blue" raised>View docker-compose.yml</v-btn>
                <v-card>
                    <v-card-title class="headline" primary-title>
                        docker-compose.yml
                    </v-card-title>

                    <v-card-text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat @click="dialog = false">
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>
        <v-progress-linear :active="searching" :indeterminate="true"></v-progress-linear>
        <v-card-text>
            <v-container fluid full-height grid-list-md>
                <v-layout row wrap>
                    <v-flex sm5 xs12>
                        <v-text-field @click:append="onSeachClicked" append-icon="search"
                                      hint="Search for a Docker image on hub.docker.com" label="Image Name" outline
                                      v-model="search"></v-text-field>
                    </v-flex>
                    <v-flex sm6 xs12>
                        <v-select :disabled="!tags.length" :items="tags" v-model="tag" return-object item-text="name" item-value="id" label="Tags"
                                  outline></v-select>
                    </v-flex>
                    <v-flex sm1 xs12>
                        <v-btn raised fab small class="blue" :disabled="!tag" @click="addService(tag)">
                            <v-icon>add</v-icon>
                        </v-btn>
                    </v-flex>

                    <v-divider></v-divider>

                    <v-flex xs12>
                        <v-list>
                            <v-list-tile v-for="service in services" :key="service.title" avatar>
                                <v-list-tile-action>
                                    <v-icon v-if="service.icon" color="pink">star</v-icon>
                                </v-list-tile-action>

                                <v-list-tile-content>
                                    <v-list-tile-title v-text="service.name"></v-list-tile-title>
                                </v-list-tile-content>

                                <v-list-tile-avatar>
                                    <img :src="service.avatar">
                                </v-list-tile-avatar>
                            </v-list-tile>
                        </v-list>
                    </v-flex>

                    <!--<v-flex xs12>-->
                        <!--<v-switch :label="`MySQL ${services.db.enabled ? 'Enabled' : 'Disabled'}`"-->
                                  <!--v-model="services.db.enabled"></v-switch>-->
                        <!--<span v-show="services.db.enabled">-->
                    <!--<v-text-field label="Database Name" v-model="services.db.name"></v-text-field>-->
                    <!--<v-text-field label="Host" v-model="services.db.host"></v-text-field>-->
                    <!--<v-text-field label="Username" v-model="services.db.username"></v-text-field>-->
                    <!--<v-text-field label="Password" v-model="services.db.password"></v-text-field>-->
                <!--</span>-->
                    <!--</v-flex>-->
                </v-layout>
            </v-container>
        </v-card-text>
        <v-card-actions>

        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class Stack extends Vue {
    dialog: boolean = false

    searching: boolean = false

    search: string = ''

    tag: any = null

    services: any[] = []

    // services: { [k: string]: any } = {
    //   db: {
    //     enabled: false,
    //     name: '',
    //     host: '',
    //     username: '',
    //     password: ''
    //   }
    // }

    tags: any[] = []

    private addService (service: any): void {
      if (!this.services.find((s: any) => s.id === service.id)) {
        this.services.push(service)
      }
    }

    private async onSeachClicked (): Promise<any> {
      if (this.search) {
        this.searching = true

        const url = `https://hub.docker.com/v2/repositories/library/${ this.search }/tags?page_size=1000`

        const tags = await this.$http.get(url).catch((error: any) => {
          console.log(error)
          this.searching = false
        })

        this.tags = tags.results.sort((a: any, b: any) => {
          switch (true) {
            case b.id > a.id:
              return 1
            case b.id < a.id:
              return -1
            case b.id === a.id:
              return 0
          }
        })

        this.searching = false
      }
    }
  }
</script>
