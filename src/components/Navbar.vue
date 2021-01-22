<template>
  <div class="navbar">
    <v-app-bar app>
      <v-container>
        <v-row align="center">
          <v-app-bar-nav-icon @click="toggleNav"></v-app-bar-nav-icon>
          <h2>Hmm</h2>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attr }">
              <v-btn v-bind="attr" v-on="on" text @click="dialog = true" >
                <v-icon>mdi-logout</v-icon>
              </v-btn>
            </template>
            <span>Logout</span>
          </v-tooltip>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" @change="toggleNav" temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Application
          </v-list-item-title>
          <v-list-item-subtitle>
            Kuple
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          router
          :to="item.path"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>
          Logout
        </v-card-title>
        <v-card-text>
          Yakin mau Logout?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false" >
            Batal
          </v-btn>
          <v-btn color="green" text @click="logout" :loading="loading">
            Yakin
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: "Navbar",
  data() {
    return {
      dialog: false,
      loading: false,
      drawer: false,
      items: [
        {title: 'Home', icon: 'mdi-home', path: "/"},
        {title: 'CRUDS', icon: 'mdi-table-edit', path: "/cruds"},
        {title: 'Chat', icon: 'mdi-chat', path: 'chat'},
      ]
    };
  },
  methods: {
    toggleNav(){
      this.drawer = !this.drawer
    },
    logout(){
      this.loading = true
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.go("/login");
          this.loading = false;
        });
    }
  }
};
</script>
