<template>
    <v-app dark id="inspire">
        <v-navigation-drawer app clipped fixed v-model="drawer">
            <v-list dense>
                <v-list-tile @click="">
                    <v-list-tile-action>
                        <v-icon>dashboard</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Dashboard</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="">
                    <v-list-tile-action>
                        <v-icon>settings</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Settings</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app clipped-left fixed>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Dockpad</v-toolbar-title>
        </v-toolbar>
        <v-content>
            <v-container fill-height fluid grid-list-lg>
                <v-layout row wrap>
                    <v-flex xs12 sm6 md4 shrink>
                        <bitbucket></bitbucket>
                    </v-flex>
                    <v-flex xs12 sm6 md4 shrink>
                        <docker></docker>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
        <v-footer app fixed>
            <span>&copy; {{ (new Date()).getFullYear() }}</span>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import Bitbucket from './components/Bitbucket.vue'
  import Docker from './components/Docker.vue'

  @Component({
    components: {
      Bitbucket,
      Docker
    }
  })
  export default class App extends Vue {
    public name: string = 'App'

    private drawer: boolean = true
  }
</script>
