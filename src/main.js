import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";

var firebaseConfig = {
  apiKey: "AIzaSyCyMyZhzOQPI9Zs6IWSkPPpxjFj833KyFk",
  authDomain: "admin-kuple.firebaseapp.com",
  databaseURL: "https://admin-kuple-default-rtdb.firebaseio.com",
  projectId: "admin-kuple",
  storageBucket: "admin-kuple.appspot.com",
  messagingSenderId: "390806901596",
  appId: "1:390806901596:web:45e5d01b77f1ac154e6799",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false;

let app;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      vuetify,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
