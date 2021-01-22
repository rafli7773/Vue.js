<template>
  <div class="chat">
    <header>
      <Navbar />
    </header>
    <v-main>
    <v-progress-linear
      indeterminate
      color="cyan"
      v-if="loadData"
    ></v-progress-linear>
      <v-container>
        <div class="history">
          <v-row v-for="message in messages" :key="message.id">
            <v-col md="6" cols="12" sm="12">
            <v-alert
                dense
                :color="currentUser === message.user ? 'green' : 'blue'"
              ><small> {{message.user}} </small> <v-divider></v-divider> <v-spacer></v-spacer> <div class="flex flex-wrap">{{message.message}} </div></v-alert>
              </v-col>
            </v-row>
          </div>
      </v-container>
    </v-main>

    <v-footer app>
      <v-row align="center" justify="center">
        <v-col sm="10" xs="9" md="9" class="pesan">
          <v-textarea
            class="mt-5"
            label="Pesan"
            v-model="message"
            auto-grow
            outlined
            row="1"
            row-height="1"
          ></v-textarea>
        </v-col>
        <v-col sm="2" md="2" xs="2">
          <v-btn text @click="saveMessage">
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
import firebase from 'firebase'
require("firebase/firestore");
var db = firebase.firestore();
db.settings({
  timestampsInSnapshot: true,
});
import Navbar from "@/components/Navbar";
export default {
  name: "Chat",
  components: { Navbar },
  data: () => ({
    message: null,
    messages: [],
    currentUser: firebase.auth().currentUser.email,
    loadData: false
  }),
  methods: {
    saveMessage(){
      db.collection("chat").add({
        message: this.message,
        createdAt: new Date(),
        user: this.currentUser
      }).then(() => this.scrollToBottom())
      this.message = null
    },
    scrollToBottom(){
      window.scrollTo(0,document.body.scrollHeight);
    },
    fetchMessages(){
      db.collection("chat").orderBy('createdAt').onSnapshot((querySnapshot) => {
        let allMessages = []
        querySnapshot.forEach((doc) => {
            allMessages.push(doc.data())
        });
        this.messages = allMessages
        setTimeout(() => {
          this.scrollToBottom()
        }, 1000)
        this.loadData = false
      });
    }
  },
  created(){
    this.loadData = true
    this.fetchMessages()
  }
};
</script>

<style scoped>
</style>
