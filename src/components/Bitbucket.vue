<template>
    <v-card>
        <v-toolbar card>
            <v-toolbar-title class="title">Bitbucket</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="$bitbucket.authenticate()" class="blue" raised v-if="!authenticated">Sign In</v-btn>
            <v-btn @click="$bitbucket.refresh()" class="blue" raised v-else>Refresh Token</v-btn>
        </v-toolbar>
        <v-card-text>
            <v-container fluid full-height grid-list-md>
                <v-layout row wrap>
                    <v-flex sm6 xs12>
                        <v-autocomplete :disabled="!authenticated"
                                        :items="$bitbucket.teams"
                                        @change="onTeamChanged"
                                        clearable
                                        item-text="display_name"
                                        item-value="uuid"
                                        label="Teams"
                                        outline
                                        prepend-icon="group"
                                        return-object
                                        v-model="teams.selected">
                            <v-slide-x-reverse-transition mode="out-in" slot="append-outer">
                                <v-icon @click="$bitbucket.getTeams()">refresh</v-icon>
                            </v-slide-x-reverse-transition>
                        </v-autocomplete>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex sm6 xs12>
                        <v-text-field append-outer-icon="search"
                                      clearable
                                      label="Search Repositories"
                                      outline
                                      v-model="search">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-progress-linear :active="loading"
                                           color="blue"
                                           indeterminate>
                        </v-progress-linear>
                    </v-flex>
                    <v-flex xs12>
                        <v-data-table :headers="headers"
                                      :items="items"
                                      :pagination.sync="pagination"
                                      class="elevation-15"
                                      hide-actions
                                      hide-headers>
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.name }}</td>
                                <td class="text-xs-right">{{ props.item.project.name }}</td>
                                <td class="text-xs-right">{{ props.item.updated_on | datetime }}</td>
                                <td>
                                    <v-btn @click="confirmClone(props.item)" icon>
                                        <v-icon flat>get_app</v-icon>
                                    </v-btn>
                                </td>
                            </template>
                        </v-data-table>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-flex class="text-xs-center pt-2" xs12>
                <v-pagination :length="pages" v-model="page"></v-pagination>
            </v-flex>
        </v-card-text>
        <v-dialog v-model="dialog">
            <v-card>
                <v-toolbar card flat>
                    <v-toolbar-title class="title">Clone Repository</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container fluid grid-list-sm>
                        <v-layout row wrap>
                            <v-flex xs6>
                                <v-text-field :value="repository.full_name"
                                              label="Full Name"
                                              outline
                                              prepend-icon="label"
                                              readonly>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field :value="repoDir"
                                              @click:append=""
                                              label="Source Directory"
                                              outline
                                              prepend-icon="folder"
                                              readonly>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea :value="stdout"
                                            label="Console Log"
                                            outline
                                ></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="dialog = false" raised>
                        Cancel
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="clone" raised>
                        Clone
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'

  @Component({
    filters: {
      datetime (value: string): string {
        const d = new Date(value)

        return `${ d.getFullYear() }-${ d.getMonth() }-${ d.getDate() } ${ d.getHours() }:${ d.getMinutes() }:${ d.getSeconds() }`
      }
    }
  })
  export default class Bitbucket extends Vue {
    private teams: any = {
      selected: null,
      loading: false,
      search: ''
    }

    // private repositories: any = {
    //   selected: null,
    //   loading: false,
    //   search: ''
    // }

    // private branches: any = {
    //   selected: null,
    //   loading: false,
    //   search: ''
    // }

    private repository: any = {}

    private commands: any = {
      clone: {
        text: ''
      }
    }

    private dialog: boolean = false

    private loading: boolean = false

    private repositories: any = {}

    private search: string = ''

    private stdout: string = ''

    public _pagination: any = {
      descending: true,
      page: 1,
      rowsPerPage: 10,
      sortBy: 'name',
      totalItems: 0
    }

    get repoDir (): string {
      if (this.repository) {
        return `${ this.$bitbucket.repoDir }/${ this.repository.slug }`
      }

      return ''
    }

    get page (): number {
      return this.repositories ? this.repositories.page : 1
    }

    set page (page: number) {
      this.loading = true
      this.$bitbucket.getRepositories(this.teams.selected, page)
        .then((data: any) => {
          this.repositories = data
        })
        .finally(() => {
          this.loading = false
        })
    }

    get pages () {
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }

    get items (): any[] {
      return this.repositories && Array.isArray(this.repositories.items) ? this.repositories.items : []
    }

    get pagination (): any {
      let pagination = this._pagination || {
        descending: true,
        page: 1,
        rowsPerPage: 10,
        sortBy: 'name',
        totalItems: 0
      }
      pagination.page = this.repositories && this.repositories.page ? this.repositories.page : 1
      pagination.totalItems = this.repositories && this.repositories.size ? this.repositories.size : 0

      return pagination
    }

    set pagination (pagination) {
      this._pagination = pagination
    }

    headers: any[] = [
      {
        text: 'Repository',
        align: 'left',
        sortable: true,
        value: 'name'
      },
      {
        text: 'Project',
        value: 'project.name'
      },
      {
        text: 'Last Updated',
        value: 'owner.updated_on'
      },
      {
        text: 'Actions'
      }
    ]

    authenticated: boolean = false

    public created (): void {
      this.$emitter.$on('authenticated', (authenticated: boolean) => {
        this.authenticated = authenticated
      })
    }

    async onTeamChanged (team: any): Promise<any> {
      this.loading = true
      this.repositories = await this.$bitbucket.getRepositories(team)
      this.loading = false
    }

    private clone (): void {
      const command: string = `git clone --progress --verbose https://x-token-auth:${ this.$bitbucket.accessToken }@bitbucket.org/${ this.repository.full_name }.git ${ this.repoDir }`

      this.$ws.send(command, (data) => {
        this.stdout += data
      })
    }

    private confirmClone (repository: any): void {
      this.repository = repository
      this.dialog = true
    }

    private sendCmd (item: any): void {
      this.$ws.send('docker ps -a')
      this.$ws.emit('docker', { all: true })
      // this.$ws.send(`git clone https://x-token-auth:${ this.$bitbucket.accessToken }@bitbucket.org/${ item.full_name }.git`)
    }

    public generate (): void {
      console.log(this.repositories)

      this.commands.clone.text = `git clone https://x-token-auth:${ this.$bitbucket.accessToken }@bitbucket.org/${ this.repositories.selected.full_name }.git`

      // const headers = new Headers()
      // headers.set('Content-Type', 'application/json; charset=utf-8')

      this.$http.apiPost('api/exec', {
        foo: 'bar'
      })
        .then((json: any) => console.log(json))

      // fetch('http://0.0.0.0:3333/api/exec', {
      //   method: 'post',
      //   body: JSON.stringify({ foo: 'bar' }),
      //   headers
      // })
      //   .then((res: Response) => res.json())
      //   .then((json: any) => console.log(json))
    }

    @Watch('$bitbucket.oauth', { deep: true, immediate: true })
    onBitbucketChanged (value: any): void {
      if (value && value.hasOwnProperty('access_token')) {
        const d = new Date(value.expires_at)
        this.authenticated = d > (new Date())
      } else {
        this.authenticated = false
      }
    }

    @Watch('search')
    onRepositoriesSearchChanged (value: string): void {
      this.loading = true
      this.$bitbucket.getRepositories(this.teams.selected, 1, value)
        .then((data: any) => {
          this.repositories = data
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
</script>
