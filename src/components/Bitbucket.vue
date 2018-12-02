<template>
    <v-card>
        <v-toolbar card>
            <v-toolbar-title class="title">Bitbucket</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="!authenticated" @click="$bitbucket.authenticate()" class="blue" raised>Sign In</v-btn>
            <v-btn v-else @click="$bitbucket.refresh()" class="blue" raised>Refresh Token</v-btn>
        </v-toolbar>
        <v-card-text>
            <v-flex xs12>
                <v-autocomplete :disabled="!authenticated"
                                :items="$bitbucket.teams"
                                item-text="display_name"
                                item-value="uuid"
                                label="Teams"
                                prepend-icon="group"
                                return-object
                                outline
                                clearable
                                v-model="teams.selected">
                    <v-slide-x-reverse-transition mode="out-in" slot="append-outer">
                        <v-icon @click="$bitbucket.getTeams()">refresh</v-icon>
                    </v-slide-x-reverse-transition>
                </v-autocomplete>
            </v-flex>
            <v-flex xs12>
                <v-autocomplete :disabled="!teams.selected"
                                :items="$bitbucket.repositories"
                                :loading="repositories.loading"
                                :search-input.sync="repositories.search"
                                item-text="name"
                                item-value="uuid"
                                label="Repositories"
                                prepend-icon="code"
                                return-object
                                no-filter
                                outline
                                clearable
                                v-model="repositories.selected">
                    <v-slide-x-reverse-transition mode="out-in" slot="append-outer">
                        <v-icon @click="$bitbucket.getRepositories(teams.selected)">refresh</v-icon>
                    </v-slide-x-reverse-transition>
                </v-autocomplete>
            </v-flex>
            <v-flex xs12>
                <v-autocomplete :disabled="!repositories.selected"
                                :items="$bitbucket.branches"
                                :loading="branches.loading"
                                :search-input.sync="branches.search"
                                item-text="name"
                                item-value="uuid"
                                label="Branches"
                                prepend-icon="code"
                                return-object
                                no-filter
                                outline
                                clearable
                                v-model="branches.selected">
                    <v-slide-x-reverse-transition mode="out-in" slot="append-outer">
                        <v-icon @click="$bitbucket.getBranches(teams.selected, repositories.selected)">refresh</v-icon>
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
    private teams: any = {
      selected: null,
      loading: false,
      search: ''
    }

    private repositories: any = {
      selected: null,
      loading: false,
      search: ''
    }

    private branches: any = {
      selected: null,
      loading: false,
      search: ''
    }

    authenticated: boolean = false

    created (): void {
      this.$emitter.$on('authenticated', (authenticated: boolean) => {
        this.authenticated = authenticated
      })
    }

    @Watch('$bitbucket.oauth', { deep: true, immediate: true })
    onBitbucketChanged (value: any): void {
      console.log(value)
    }

    @Watch('repositories.search')
    onRepositoriesSearchChanged (value: string): void {
      if (this.authenticated && this.teams.selected && !this.repositories.loading) {
        this.repositories.loading = true

        this.$bitbucket.getRepositories(this.teams.selected, value)
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
