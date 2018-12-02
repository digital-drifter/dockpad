<template>
    <v-card>
        <v-toolbar card>
            <v-toolbar-title class="title">Docker</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <v-flex xs12>
                <v-autocomplete :items="$docker.images" label="Images" v-model="$docker.selected.image">
                    <template slot="prepend">
                        <svg viewBox="0 0 128 128" width="24px" height="24px">
                            <path d="M124.8 52.1c-4.3-2.5-10-2.8-14.8-1.4-.6-5.2-4-9.7-8-12.9l-1.6-1.3-1.4 1.6c-2.7 3.1-3.5 8.3-3.1 12.3.3 2.9 1.2 5.9 3 8.3-1.4.8-2.9 1.9-4.3 2.4-2.8 1-5.9 2-8.9 2h-6.7v-14.1h-13v-25h-15v12h-25v13h-13v14h-11.2l-.2 1.5c-.5 6.4.3 12.6 3 18.5l1.1 2.2.1.2c7.9 13.4 21.7 19 36.8 19 29.2 0 53.3-13.1 64.3-40.6 7.4.4 15-1.8 18.6-8.9l.9-1.8-1.6-1zm-96.8-13.1h10v11h-10v-11zm13.1 44.2c0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-1.7 1.4-3.1 3.1-3.1 1.7.1 3.1 1.4 3.1 3.1zm-13.1-31.2h10v11h-10v-11zm-13 0h11v11h-11v-11zm27.7 50.2c-15.8-.1-24.3-5.4-31.3-12.4 2.1.1 4.1.2 5.9.2 1.6 0 3.2 0 4.7-.1 3.9-.2 7.3-.7 10.1-1.5 2.3 5.3 6.5 10.2 14 13.8h-3.4zm8.3-39.2h-11v-11h11v11zm0-13h-11v-11h11v11zm13 13h-11v-11h11v11zm0-13h-11v-11h11v11zm0-13h-11v-11h11v11zm13 26h-11v-11h11v11zM38.8 81.2c-.2-.1-.5-.2-.8-.2-1.2 0-2.2 1-2.2 2.2 0 1.2 1 2.2 2.2 2.2s2.2-1 2.2-2.2c0-.3-.1-.6-.2-.8-.2.3-.4.5-.8.5-.5 0-.9-.4-.9-.9.1-.4.3-.7.5-.8z"></path>
                        </svg>
                    </template>
                </v-autocomplete>
            </v-flex>
            <v-flex xs12>
                <v-select :items="$docker.modules"
                          chips
                          deletable-chips
                          label="PHP Modules"
                          multiple
                          v-model="$docker.selected.modules">
                    <template slot="prepend">
                        <svg viewBox="0 0 128 128" width="24px" height="24px">
                            <path fill="#6181B6" d="M64 33.039c-33.74 0-61.094 13.862-61.094 30.961s27.354 30.961 61.094 30.961 61.094-13.862 61.094-30.961-27.354-30.961-61.094-30.961zm-15.897 36.993c-1.458 1.364-3.077 1.927-4.86 2.507-1.783.581-4.052.461-6.811.461h-6.253l-1.733 10h-7.301l6.515-34h14.04c4.224 0 7.305 1.215 9.242 3.432 1.937 2.217 2.519 5.364 1.747 9.337-.319 1.637-.856 3.159-1.614 4.515-.759 1.357-1.75 2.624-2.972 3.748zm21.311 2.968l2.881-14.42c.328-1.688.208-2.942-.361-3.555-.57-.614-1.782-1.025-3.635-1.025h-5.79l-3.731 19h-7.244l6.515-33h7.244l-1.732 9h6.453c4.061 0 6.861.815 8.402 2.231s2.003 3.356 1.387 6.528l-3.031 15.241h-7.358zm40.259-11.178c-.318 1.637-.856 3.133-1.613 4.488-.758 1.357-1.748 2.598-2.971 3.722-1.458 1.364-3.078 1.927-4.86 2.507-1.782.581-4.053.461-6.812.461h-6.253l-1.732 10h-7.301l6.514-34h14.041c4.224 0 7.305 1.215 9.241 3.432 1.935 2.217 2.518 5.418 1.746 9.39zM95.919 54h-5.001l-2.727 14h4.442c2.942 0 5.136-.29 6.576-1.4 1.442-1.108 2.413-2.828 2.918-5.421.484-2.491.264-4.434-.66-5.458-.925-1.024-2.774-1.721-5.548-1.721zM38.934 54h-5.002l-2.727 14h4.441c2.943 0 5.136-.29 6.577-1.4 1.441-1.108 2.413-2.828 2.917-5.421.484-2.491.264-4.434-.66-5.458s-2.772-1.721-5.546-1.721z"></path>
                        </svg>
                    </template>
                </v-select>
            </v-flex>
            <v-flex xs12>
                <v-autocomplete :items="$docker.databases"
                                label="Databases"
                                prepend-icon="group"
                                v-model="$docker.selected.database">
                </v-autocomplete>
            </v-flex>
            <v-flex xs12>
                <v-autocomplete :items="$docker.caches"
                                label="Caches"
                                prepend-icon="group"
                                v-model="$docker.selected.cache">
                </v-autocomplete>
            </v-flex>
            <v-flex xs12>
                <v-autocomplete :items="$docker.webservers"
                                label="Webservers"
                                prepend-icon="http"
                                v-model="$docker.selected.webserver">
                </v-autocomplete>
            </v-flex>
            <v-flex xs12>
                <v-autocomplete :items="$docker.dependencies.composer"
                                label="Composer"
                                prepend-icon="group"
                                v-model="$docker.selected.dependencies.composer">
                </v-autocomplete>
            </v-flex>
            <v-flex xs12>
                <v-autocomplete :items="$docker.dependencies.node"
                                label="Node"
                                prepend-icon="group"
                                v-model="$docker.selected.dependencies.node">
                </v-autocomplete>
            </v-flex>
        </v-card-text>
        <v-card-actions>

        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class Docker extends Vue {

  }
</script>
