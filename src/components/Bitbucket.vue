<template>
    <v-card>
        <v-toolbar card>
            <v-toolbar-title class="title">Bitbucket</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="$bitbucket.authenticate()" class="blue" raised v-if="!authenticated">Sign In</v-btn>
            <v-btn @click="$bitbucket.refresh()" class="blue" raised v-else>Refresh Token</v-btn>
        </v-toolbar>
        <v-card-text>
            <v-flex xs12>
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
            <!--<v-flex xs12>-->
            <!--<v-autocomplete :disabled="!teams.selected"-->
            <!--:items="$bitbucket.repositories"-->
            <!--:loading="repositories.loading"-->
            <!--:search-input.sync="repositories.search"-->
            <!--item-text="name"-->
            <!--item-value="uuid"-->
            <!--label="Repositories"-->
            <!--prepend-icon="code"-->
            <!--return-object-->
            <!--no-filter-->
            <!--outline-->
            <!--clearable-->
            <!--v-model="repositories.selected">-->
            <!--<v-slide-x-reverse-transition mode="out-in" slot="append-outer">-->
            <!--<v-icon @click="$bitbucket.getRepositories(teams.selected)">refresh</v-icon>-->
            <!--</v-slide-x-reverse-transition>-->
            <!--</v-autocomplete>-->
            <!--</v-flex>-->
            <!--<v-flex xs12>-->
            <!--<v-autocomplete :disabled="!repositories.selected"-->
            <!--:items="$bitbucket.branches"-->
            <!--:loading="branches.loading"-->
            <!--:search-input.sync="branches.search"-->
            <!--item-text="name"-->
            <!--item-value="uuid"-->
            <!--label="Branches"-->
            <!--prepend-icon="code"-->
            <!--return-object-->
            <!--no-filter-->
            <!--outline-->
            <!--clearable-->
            <!--v-model="branches.selected">-->
            <!--<v-slide-x-reverse-transition mode="out-in" slot="append-outer">-->
            <!--<v-icon @click="$bitbucket.getBranches(teams.selected, repositories.selected)">refresh</v-icon>-->
            <!--</v-slide-x-reverse-transition>-->
            <!--</v-autocomplete>-->
            <!--</v-flex>-->
            <!--<v-flex xs12>-->
            <!--<v-text-field outline-->
            <!--prepend-icon="get_app"-->
            <!--readonly-->
            <!--:value="commands.clone.text"-->
            <!--label="Clone">-->
            <!--<v-slide-x-reverse-transition mode="out-in" slot="append-outer">-->
            <!--<v-icon @click="$bitbucket.clone(repositories.selected)">file_copy</v-icon>-->
            <!--</v-slide-x-reverse-transition>-->
            <!--</v-text-field>-->
            <!--</v-flex>-->
            <v-flex xs12>
                <v-data-table hide-actions
                              :headers="headers"
                              :items="items"
                              :loading="loading"
                              :pagination.sync="pagination"
                              class="elevation-1">
                    <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.name }}</td>
                        <td class="text-xs-right">{{ props.item.project.name }}</td>
                        <td class="text-xs-right">{{ props.item.updated_on }}</td>
                        <td>
                            <v-btn @click="" icon>
                                <v-icon flat>get_app</v-icon>
                            </v-btn>
                        </td>
                    </template>
                </v-data-table>
                <v-pagination :length="Math.ceil(pagination.totalItems / pagination.rowsPerPage)"
                              v-model="page"></v-pagination>
            </v-flex>
        </v-card-text>
        <v-card-actions>
            <!--<v-spacer></v-spacer>-->
            <!--<v-btn @click="generate" class="teal" raised :disabled="!repositories.selected">-->
            <!--<v-icon small flat left>arrow_drop_down_circle</v-icon>-->
            <!--<span>Build</span>-->
            <!--</v-btn>-->
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'

  @Component
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

    private branches: any = {
      selected: null,
      loading: false,
      search: ''
    }

    private commands: any = {
      clone: {
        text: ''
      }
    }

    private loading: boolean = false

    private repositories: any = {}

    public _pagination: any = {
      descending: true,
      page: 1,
      rowsPerPage: 10,
      sortBy: 'name',
      totalItems: 0
    }

    public _page: number = 1

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
      return this.repositories ? (this.repositories.size / 10) : 0
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

    @Watch('repositories.search')
    onRepositoriesSearchChanged (value: string): void {
      if (this.authenticated && this.teams.selected && !this.repositories.loading) {
        this.repositories.loading = true

        this.$bitbucket.getRepositories(this.teams.selected, this.page, value)
          .catch((error: any) => {
            console.log(error)
          })
          .finally(() => {
            this.repositories.loading = false
          })
      }
    }
  }
</script>
