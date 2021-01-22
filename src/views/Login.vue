<template>
  <div class="login">
    <header>
      <v-row align-content="center" justify="center" class="mt-16">
        <h1>Masuk</h1>
      </v-row>
    </header>
    <v-main>
      <v-container>
        <v-form ref="form" v-model="valid">
        <v-row align-content="center" justify="center">
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Email"
              outlined
              v-model="email"
              :rules="emailRules"
            ></v-text-field>
            <v-text-field
              label="Password"
              type="password"
              v-model="password"
              outlined
              :rules="passwordRules"
            ></v-text-field>
          <v-btn class="mb-5" @click="login" :loading="loading">Masuk</v-btn>
            <v-spacer></v-spacer>
            <router-link to="daftar" class="text-decoration-none"><v-btn text>Belum punya akun? Daftar</v-btn></router-link>
          </v-col>
        </v-row>
        </v-form>
      </v-container>
    </v-main>
    <v-snackbar
      v-model="snackbar" color="red" top timeout="10000"
    >
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: "Daftar",
  data() {
    return {
      valid: true,
      text: "",
      email: "",
      password: "",
      snackbar: false,
      loading: false,
      emailRules: [
        (v) => !!v || "E-mail harus diisi",
        (v) => /.+@.+/.test(v) || "E-mail tidak valid",
      ],
      passwordRules: [
        (v) => !!v || "Password harus diisi",
        (v) => v.length >= 7 || "Password harus lebih dari 7 karakter",
      ],
    };
  },
  methods: {
    login(){
      if(this.$refs.form.validate()){
        this.loading = true
          firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .then((user) => {
            console.log(user);
            console.log('berhasil');
            this.loading = false
            this.$router.push('/')
          }).catch(err => {
            if(err.code === "auth/user-not-found"){
              this.text = "Email belum terdaftar"
            }else if(err.code === "auth/wrong-password"){
              this.text = "Password salah"
              this.password = ""
            }
            this.snackbar = true
            this.loading = false
          })
      }
    }
  }
};
</script>
