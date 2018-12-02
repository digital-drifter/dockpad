<template>
    <v-card>
        <v-toolbar card>
            <v-toolbar-title class="title">Services</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="" class="blue" raised>View docker-compose.yml</v-btn>
        </v-toolbar>
        <v-card-text>
            <v-flex xs12>
                <v-text-field v-model="search" label="Image Name" hint="Search for a Docker image on hub.docker.com" outline append-icon="search" @click:append="onSeachClicked"></v-text-field>
            </v-flex>
        </v-card-text>
        <v-card-actions>

        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class Stack extends Vue {
    search: string = ''

    private async onSeachClicked(): Promise<any> {
      const results = await fetch(`http://0.0.0.0:8888/https://hub.docker.com/v2/repositories/library/${this.search}/tags?page_size=100`).then((r: Response) => r.json())

      console.log(results)
    }
  }
</script>
