<template>
    <v-card>
        <v-toolbar card>
            <v-toolbar-title class="title">Bitbucket</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="authenticate" class="blue" raised>{{ $bitbucket.authenticated ? 'Refresh Token' : 'Sign In' }}</v-btn>
        </v-toolbar>
        <v-card-text>
            <v-flex xs12>
                <v-autocomplete :items="$bitbucket.teams"
                                label="Teams"
                                prepend-icon="group"
                                item-text="display_name"
                                item-value="uuid"
                                return-object
                                v-model="$bitbucket.team">
                    <v-slide-x-reverse-transition mode="out-in" slot="append-outer">
                        <v-icon @click="$bitbucket.getTeams">refresh</v-icon>
                    </v-slide-x-reverse-transition>
                </v-autocomplete>
            </v-flex>
            <v-flex xs12>
                <v-autocomplete :items="$bitbucket.repositories"
                                label="Repositories"
                                prepend-icon="code"
                                item-text="name"
                                item-value="uuid"
                                return-object
                                :loading="repositories.loading"
                                :search-input.sync="repositories.search"
                                v-model="$bitbucket.repository">
                    <v-slide-x-reverse-transition mode="out-in" slot="append-outer">
                        <v-icon @click="$bitbucket.getRepositories">refresh</v-icon>
                    </v-slide-x-reverse-transition>
                </v-autocomplete>
            </v-flex>
            <v-flex xs12>
                <v-autocomplete :items="$bitbucket.branches"
                                label="Branches"
                                prepend-icon="code"
                                item-text="name"
                                item-value="uuid"
                                return-object
                                :loading="branches.loading"
                                :search-input.sync="branches.search"
                                v-model="$bitbucket.branch">
                    <v-slide-x-reverse-transition mode="out-in" slot="append-outer">
                        <v-icon @click="$bitbucket.getBranches">refresh</v-icon>
                    </v-slide-x-reverse-transition>
                </v-autocomplete>
            </v-flex>
        </v-card-text>
        <v-card-actions>

        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'

  @Component
  export default class Bitbucket extends Vue {
    private repositories: any = {
      loading: false,
      search: ''
    }

    private branches: any = {
      loading: false,
      search: ''
    }

    public mounted (): void {
      if (this.$bitbucket.authenticated) {
        this.$bitbucket.getUser()
          .catch((error: any) => {
            console.log(error)
          })
      }
    }

    private authenticate (): void {
      this.$bitbucket.authenticate()
        .then(async () => {
          await this.$bitbucket.getUser()
        })
        .catch((error: any) => {
          console.log(error)
        })
    }

    @Watch('repositories.search')
    onRepositoriesSearchChanged (value: string): void {
      if (!this.repositories.loading) {
        this.repositories.loading = true

        this.$bitbucket.getRepositories(value)
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
