<template>
    <v-card>
        <v-toolbar card>
            <v-toolbar-title class="title">Docker</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <v-flex xs12>
                <v-autocomplete :items="$docker.images"
                                label="Images"
                                prepend-icon="group"
                                v-model="$docker.selected.image">
                </v-autocomplete>
            </v-flex>
            <v-flex xs12>
                <v-select :items="$docker.modules"
                          label="PHP Modules"
                          multiple
                          chips
                          deletable-chips
                          prepend-icon="group"
                          v-model="$docker.selected.modules">
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
                                prepend-icon="group"
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
