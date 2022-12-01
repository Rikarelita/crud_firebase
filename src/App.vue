<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Navbar</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <a class="nav-link" href="#">
              Home
              <span class="sr-only">(current)</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container">
      <div class="card">
        <b-button v-b-modal.modal-prevent-closing class="mt-2 mb-2 col-2 ml-4">
          Tambah Data
        </b-button>

        <div class="card-body">
          <b-table striped hover :fields="field" :items="users" show-empty>
            <template v-slot:cell(index)="row">
              <p class="text-center">
                {{ row.index + 1 }}
              </p>
            </template>
            <template v-slot:cell(action)="row">
              <button
                @click="getOneData(row.item)"
                class="btn btn-warning mr-2"
              >
                Edit
              </button>

              <button @click="deleteData(row.item.key)" class="btn btn-danger">
                Delete
              </button>
            </template>
          </b-table>
        </div>
      </div>
    </div>

    <!-- crete data  modal -->
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Tambah Data"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            v-model="user.name"
            :state="nameState"
            required
          />
        </b-form-group>
        <b-form-group
          label="Email"
          label-for="email-input"
          invalid-feedback="Email is required"
          :state="emailState"
        >
          <b-form-input
            id="name-input"
            type="email"
            v-model="user.email"
            :state="emailState"
            required
          />
        </b-form-group>
        <b-form-group
          label="phone"
          label-for="email-input"
          invalid-feedback="Phone is required"
          :state="phoneState"
        >
          <b-form-input
            id="name-input"
            type="number"
            v-model="user.phone"
            :state="phoneState"
            required
          />
        </b-form-group>
      </form>
    </b-modal>
    <!-- end create modal -->

    <!-- edit modal -->
    <b-modal
      ref="modal-edit"
      title="Edit Data"
      @ok="handleEdit"
      @cancel="handleCancel"
    >
      <form ref="form" @submit.stop.prevent="handleUpdate">
        <b-form-group
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            v-model="user.name"
            :state="nameState"
            required
          />
        </b-form-group>
        <b-form-group
          label="Email"
          label-for="email-input"
          invalid-feedback="Email is required"
          :state="emailState"
        >
          <b-form-input
            id="name-input"
            type="email"
            v-model="user.email"
            :state="emailState"
            required
          />
        </b-form-group>
        <b-form-group
          label="phone"
          label-for="email-input"
          invalid-feedback="Phone is required"
          :state="phoneState"
        >
          <b-form-input
            id="name-input"
            type="number"
            v-model="user.phone"
            :state="phoneState"
            required
          />
        </b-form-group>
      </form>
    </b-modal>
    <!-- end Edit Modal -->
  </div>
</template>

<script>
import { db } from "./firebaseDb";
export default {
  name: "App",
  data() {
    return {
      users: [],
      user: {
        name: "",
        email: "",
        phone: "",
      },
      nameState: null,
      emailState: null,
      phoneState: null,

      field: [
        { key: "index", label: "No" },
        { key: "name", label: "Nama" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "action", label: "action" },
      ],
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    deleteData(id) {
      if (window.confirm("kamu yakin mau hapus data ini?")) {
        db.collection("users")
          .doc(id)
          .delete()
          .then(() => {
            alert("data berhasil dihapus");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      this.phoneState = valid;
      this.emailState = valid;

      return valid;
    },
    resetModal() {
      this.name = "";
      this.nameState = null;
    },
    handleOk(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleEdit(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault();
      // Trigger submit handler
      this.handleUpdate();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Push the name to submitted names
      db.collection("users")
        .add(this.user)
        .then(() => {
          alert("user berhasil dibuat");

          this.user.name = "";
          this.user.email = "";
          this.user.phone = "";

          this.loadData();
        })
        .catch((err) => {
          console.log(err);
        });
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    },
    getOneData(data) {
      this.user.key = data.key;
      this.user.name = data.name;
      this.user.email = data.email;
      this.user.phone = data.phone;

      this.$refs["modal-edit"].show();
    },
    handleUpdate() {
      db.collection("users")
        .doc(this.user.key)
        .update(this.user)
        .then(() => {
          alert("data berhasil diubah");
          delete this.user.key;
          this.$refs["modal-edit"].hide();

          // reset form value
          this.user.name = "";
          this.user.email = "";
          this.user.phone = "";

          this.loadData();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCancel() {
      delete this.user.key;
      this.user.name = "";
      this.user.email = "";
      this.user.phone = "";
    },

    loadData() {
      db.collection("users").onSnapshot((snapshotChange) => {
        this.users = [];
        snapshotChange.forEach((doc) => {
          this.users.push({
            key: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            phone: doc.data().phone,
          });
        });
      });
    },
  },
};
</script>
