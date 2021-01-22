<template>
  <div class="cruds">
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
        <v-row justify="space-around">
          <h4>Daftar Barang</h4>
          <v-col cols="12" md="5">
          <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Cari"
        single-line
        hide-details
      ></v-text-field>
      </v-col>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attr }">
              <v-btn v-on="on" v-bind="attr" @click="dialog = true" >
                +
              </v-btn>
            </template>
            <span>Tambah</span>
          </v-tooltip>
        </v-row>
        <v-row justify="space-around">
          <v-col
            cols="12"
            md="3"
            sm="6"
            v-for="(barang, index) in filterBarang"
            :key="barang.id"
          >
            <v-card>
              <v-card-title v-text="barang.barang"></v-card-title>
              <v-card-subtitle v-text="index + 1"></v-card-subtitle>
              <v-card-text v-text="barang.posisi"></v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-row justify="space-between">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attr }">
                      <v-btn
                        text
                        color="red"
                        v-bind="attr"
                        v-on="on"
                        @click.prevent="hapus(barang.id)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>hapus</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attr }">
                      <v-btn text color="blue" v-bind="attr" v-on="on" @click.prevent="detailBarang(barang.id)">
                        <v-icon>mdi-view-array</v-icon>
                      </v-btn>
                    </template>
                    <span>detail</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attr }">
                      <v-btn text color="green" v-bind="attr" v-on="on" @click.prevent="editBarang(barang.id)">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>edit</span>
                  </v-tooltip>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title>Tambah Barang</v-card-title>
          <v-card-text>
            <v-text-field
              label="Barang"
              value="wei"
              v-model="barang"
            ></v-text-field>
            <v-text-field label="Posisi" v-model="posisi"></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="blue" @click="dialog = false">Batal</v-btn>
            <v-btn text color="green" @click="tambah" :loading="loading">Tambah</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogEdit" width="500">
        <v-card>
          <v-card-title>Edit Barang</v-card-title>
          <v-card-text>
            <v-text-field
              label="Barang"
              v-model="detail.barang"
              autofocus
            ></v-text-field>
            <v-text-field value="woi" label="Posisi" v-model="detail.posisi"></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="blue" @click="dialogEdit = false" >Batal</v-btn>
            <v-btn text color="green" @click="yakinEdit" :loading="loading">Edit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogHapus" width="500">
        <v-card>
          <v-card-title>Hapus Barang: {{detail.barang}}</v-card-title>
          <v-card-text>Yakin Hapus Data </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogHapus = false" color="blue">Batal</v-btn>
            <v-btn text @click="yakin" color="green" :loading="loading">Yakin</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDetail" width="500">
        <v-card>
          <v-card-title>Detail Barang</v-card-title>
          <v-card-text><h3>Barang: {{detail.barang}}</h3></v-card-text>
          <v-card-text><h3>Posisi: {{detail.posisi}}</h3></v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogDetail = false" color="blue">Tutup</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
    <v-snackbar v-model="snackbar" top timeout="10000" color="green">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          Tutup
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import firebase from "firebase";
import Navbar from "@/components/Navbar";
export default {
  name: "Cruds",
  components: {
    Navbar,
  },
  data() {
    return {
      loading: false,
      search: "",
      barangBarang: [],
      dialogDetail: false,
      dialogEdit: false,
      dialog: false,
      barang: "",
      posisi: "",
      snackbar: false,
      text: "",
      dialogHapus: false,
      loadData: false,
      id: [],
      detail: [
        {barang: ""},
        {posisi: ""}
      ]
    };
  },
  created() {
    this.loadData = true
    firebase
      .database()
      .ref("barang_barang")
      .on("value", this.resultData, this.error)
      
  },
  methods: {
    resultData(items) {
      this.barangBarang = [];
      items.forEach((item) => {
        let data = {
          id: item.key,
          barang: item.val().barang,
          posisi: item.val().posisi,
        };
        this.barangBarang.push(data);
        this.loadData = false
      });
    },
    tambah() {
      this.loading = true
      firebase
        .database()
        .ref("barang_barang")
        .push({
          barang: this.barang,
          posisi: this.posisi,
        })
        .then(() => {
          this.loading = false
          this.dialog = false;
          this.barang = "";
          this.posisi = "";
          this.text = "Berhasil di tambah";
          this.snackbar = true;
        });
    },
    hapus(id) {
      this.dialogHapus = true;
      this.id.push(id);
      firebase.database().ref(`barang_barang/${id}`).once("value", (snapshot) => {
        this.detail.barang = snapshot.val().barang
      })
    },
    yakin() {
      this.loading = true
      const id = this.id[this.id.length - 1];
      firebase
        .database()
        .ref(`barang_barang/${id}`)
        .remove()
        .then(() => {
          this.dialogHapus = false;
          this.text = "Berhasil di hapus";
          this.snackbar = true;
          this.loading = false
        });
    },
    detailBarang(id){
      this.dialogDetail = true
      firebase.database().ref(`barang_barang/${id}`).once("value", (snapshot) => {
        this.detail.barang = snapshot.val().barang
        this.detail.posisi = snapshot.val().posisi
      })
    },
    editBarang(id){
      this.dialogEdit = true
      this.id.push(id)
      firebase.database().ref(`barang_barang/${id}`).once("value", (snapshot) => {
        this.detail.barang = snapshot.val().barang
        this.detail.posisi = snapshot.val().posisi
      })
    },
    yakinEdit(){
      this.loading = true
      const id = this.id[this.id.length - 1];
      firebase.database().ref(`barang_barang/${id}`).update({
        barang: this.detail.barang,
        posisi: this.detail.posisi
      }).then(() => {
        this.dialogEdit = false
        this.text = "Berhasil di edit"
        this.snackbar = true
        this.loading = false
      })
    }
  },
  computed: {
    filterBarang(){
      return this.barangBarang.filter((barang) => {
        return barang.barang.match(this.search)
      })
    }
  }
};
</script>
