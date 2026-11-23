<template>
    <div>
      <v-img
        class="mx-auto my-6"
        max-width="80"
        src="../../assets/ipet51/logos/logoIpet-lg.png"
      ></v-img>
  
      <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        <v-card-title>Acceso de editores</v-card-title>
        <v-card-text v-if="user">
          <v-alert type="success" variant="tonal" class="mb-4">
            Sesión iniciada como {{ user.email }}
          </v-alert>
          <v-btn color="blue" :loading="loading" block @click="logout">
            Cerrar sesión
          </v-btn>
        </v-card-text>
        <v-form v-else @submit.prevent="login">
          <v-text-field
            v-model="email"
            label="Correo electrónico"
            autocomplete="username"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Contraseña"
            :type="visible ? 'text' : 'password'"
            autocomplete="current-password"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined"
            required
            @click:append-inner="visible = !visible"
          ></v-text-field>
          <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
            {{ error }}
          </v-alert>
          <v-btn
            type="submit"
            class="mb-4"
            color="blue"
            size="large"
            variant="tonal"
            :loading="loading"
            block
          >
            Iniciar sesión
          </v-btn>
          <v-card-text class="text-medium-emphasis text-caption px-0">
            Las cuentas de editores deben ser creadas por un administrador de Firebase.
          </v-card-text>
        </v-form>
      </v-card>
    </div>
  </template>
  <script>
    import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
    import { auth } from "../../firebaseConfig";

    export default {
      data() {
        return {
          email: "",
          password: "",
          visible: false,
          loading: false,
          error: "",
          user: null,
          unsubscribeAuth: null,
        };
      },
      mounted() {
        this.unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          this.user = user;
        });
      },
      beforeUnmount() {
        if (this.unsubscribeAuth) this.unsubscribeAuth();
      },
      methods: {
        async login() {
          this.loading = true;
          this.error = "";
          try {
            await signInWithEmailAndPassword(auth, this.email.trim(), this.password);
            this.password = "";
          } catch (error) {
            console.error("Firebase Authentication sign-in failed.", error);
            this.error = error.code === "auth/invalid-credential"
              ? "Correo o contraseña incorrectos."
              : "No se pudo iniciar sesión. Verifica la conexión y que la cuenta esté habilitada.";
          } finally {
            this.loading = false;
          }
        },
        async logout() {
          this.loading = true;
          this.error = "";
          try {
            await signOut(auth);
          } catch (error) {
            console.error("Firebase Authentication sign-out failed.", error);
            this.error = "No se pudo cerrar la sesión.";
          } finally {
            this.loading = false;
          }
        },
      },
    }
  </script>