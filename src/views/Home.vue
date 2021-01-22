<template>
  <div class="home">
    <header>
      <Navbar />
    </header>
    <v-main>
      <v-container>
        <h1>Halo {{currentUser}}</h1>
      </v-container>
    </v-main>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from 'firebase/app'
import Navbar from '@/components/Navbar'
export default {
  name: 'Home',
  data(){
    return{
      currentUser: firebase.auth().currentUser.email
    }
  },
  components: {
    Navbar
  },
  methods: {
    logout(){
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.go("/daftar");
          this.loading = false;
        });
    }
  }
}
</script>
