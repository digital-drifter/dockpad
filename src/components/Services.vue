<template>
    <v-card>
        <v-toolbar card>
            <v-toolbar-title class="title">Service Configuration</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" width="500">
                <v-btn class="blue" raised slot="activator">View docker-compose.yml</v-btn>
                <v-card>
                    <v-card-title class="headline" primary-title>
                        docker-compose.yml
                    </v-card-title>

                    <v-card-text>
                        <template v-for="service in services">

                        </template>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="dialog = false" color="primary" flat>
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
                        <v-autocomplete :items="tags"
                                        :search-input.sync="search"
                                        hint="Search for a Docker image on hub.docker.com"
                                        label="Image Name"
                                        outline
                                        return-object
                                        item-text="image_name"
                                        item-value="id"
                                        v-model="selected">
                        </v-autocomplete>
                    </v-flex>
                    <v-flex sm6 xs12>
                        <v-select :disabled="!tags.length" :items="tags" item-text="name" item-value="id" label="Tags" outline return-object
                                  v-model="tag"></v-select>
                    </v-flex>
                    <v-flex sm1 xs12>
                        <v-btn :disabled="!tag" @click="addService(tag)" class="blue" raised>
                            <v-icon>add</v-icon>
                        </v-btn>
                    </v-flex>

                    <v-divider></v-divider>

                    <v-flex xs12>
                        <v-list class="elevation-10">
                            <v-list-tile :key="service.title" avatar v-for="service in services">
                                <v-list-tile-action>
                                    <v-icon color="pink" v-if="service.icon">star</v-icon>
                                </v-list-tile-action>

                                <v-list-tile-content>
                                    <v-list-tile-title v-text="service.name"></v-list-tile-title>
                                </v-list-tile-content>

                                <v-list-tile-avatar>
                                    <v-avatar>

                                    </v-avatar>
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
        <v-snackbar :timeout="snackbar.timeout" top v-model="snackbar.model">
            {{ snackbar.text }}
            <v-btn @click="snackbar.model = false" color="pink" flat>
                Close
            </v-btn>
        </v-snackbar>
    </v-card>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'

  @Component
  export default class Stack extends Vue {
    dialog: boolean = false

    searching: boolean = false

    search: string = ''

    tag: any = null

    services: any[] = []

    snackbar: any = {
      model: false,
      timeout: 6000,
      text: ''
    }

    repositories: any = []

    // async search (value: string): Promise<any> {
    //
    // }

    selected: any = {}

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

    abortController: AbortController

    @Watch('search')
    onSearchChanged (value: string): void {
      this.querySearch(value).catch((error: any) => {
        console.log(error)
      })
    }

    mounted (): void {
      this.abortController = new AbortController()
    }

    private addService (service: any): void {
      if (!this.services.find((s: any) => s.id === service.id)) {
        this.services.push(service)
      }
    }

    private async querySearch (value: string): Promise<any> {
      console.log(value)
      if (value) {
        this.searching = true

        const url = `https://hub.docker.com/v2/repositories/library/${ value }/tags?page_size=1000`

        await this.$http.get(url)
          .then((tags: any) => {
            console.log(tags)
            this.tags = tags.results.sort((a: any, b: any) => {
              switch (true) {
                case b.id > a.id:
                  return 1
                case b.id < a.id:
                  return -1
                case b.id === a.id:
                  return 0
              }
            }).map((tag: any) => Object.assign(tag, { image_name: `${value}:${tag.name}` }))
          })
          .catch((error: any) => {
            this.snackbar.text = error
            this.snackbar.model = true
            this.searching = false
          })
          .finally(() => {
            this.searching = false
          })
      }
    }
  }
</script>
