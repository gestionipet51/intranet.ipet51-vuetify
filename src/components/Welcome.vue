<template>
    <v-container class="fill-height">
      <v-responsive
        class="align-centerfill-height mx-auto"
        max-width="900"
      >
        <v-img
          class="mb-4"
          height="80"
          src="@/assets/ipet51/logos/logoIpet-lg.png"
        />
  
        <div class="text-center">
          <div class="text-body-2 font-weight-light mb-n1">Bienvenidos al</div>
  
          <h1 class="text-h2 font-weight-bold">Ipet 51 - Nicolas Avellaneda</h1>
        </div>
  
        <div class="py-4" />
  
        <v-row>
          <v-col cols="12">
            <v-card
              class="py-4"
              color="surface-variant"
              image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
              prepend-icon="mdi-rocket-launch-outline"
              rounded="lg"
              variant="outlined"
            >
              <template #image>
                <v-img position="top right" />
              </template>
  
              <template #title>
                <h2 class="text-h5 font-weight-bold">Nuestras Especialidades</h2>
              </template>
  
              <template #subtitle>
                <!--div class="text-subtitle-1">
                  Replace this page by removing <v-kbd>{{ `<HelloWorld />` }}</v-kbd> in <v-kbd>pages/index.vue</v-kbd>.
                </div-->
              </template>
  
              <v-overlay
                opacity=".12"
                scrim="primary"
                contained
                model-value
                persistent
              />
            </v-card>
          </v-col>
  
          <v-col cols="6">
            <v-card
              append-icon="mdi-open-in-new"
              class="py-4 mx-auto"
              color="primary"
              href="/intranet/especialidades/mecanico"
              prepend-icon="mdi-cog"
              rel="noopener noreferrer"
              rounded="lg"
              subtitle=""
              target="_self"
              title="Tecnico en Mecanización"
              variant="text"
              max-width="344"
            >
              <v-overlay
                opacity=".06"
                scrim="primary"
                contained
                model-value
                persistent
              />
              <v-img 
                  height="200px"
                  src="@/assets/ipet51/especialidades/Mecanico-00.png"
              ></v-img>
            </v-card>
          </v-col>
  
          <v-col cols="6">
            <v-card
              append-icon="mdi-open-in-new"
              class="py-4 mx-auto"
              color="purple-darken-1"
              href="/intranet/especialidades/automotores"
              prepend-icon="mdi-car-wrench"
              rel="noopener noreferrer"
              rounded="lg"
              subtitle=""
              target="_self"
              title="Técnico en Automotores"
              variant="text"
              max-width="344"
            >
              <v-overlay
                opacity=".06"
                scrim="primary"
                contained
                model-value
                persistent
              />
              <v-img 
                height="200"
                src="@/assets/ipet51/especialidades/Automotores-00.jpg"
                ></v-img>
            </v-card>
          </v-col>
  
          <v-col cols="6">
            <v-card
              append-icon="mdi-open-in-new"
              class="py-4 mx-auto"
              color="teal-darken-3"
              href="/intranet/especialidades/electronica"
              prepend-icon="mdi-connection"
              rel="noopener noreferrer"
              rounded="lg"
              subtitle=""
              target="_self"
              title="Técnico en Electrónica"
              variant="text"
              max-width="344"
            >
              <v-overlay
                opacity=".06"
                scrim="primary"
                contained
                model-value
                persistent
              />
              <v-img 
                  height="200"
                  src="@/assets/ipet51/especialidades/Electronico01.jpg"
                ></v-img>
            </v-card>
          </v-col>
  
          <v-col cols="6">
            <v-card
              append-icon="mdi-open-in-new"
              class="py-4 mx-auto"
              color="red-accent-4"
              href="/intranet/especialidades/carpinteria"
              prepend-icon="mdi-hand-saw"
              rel="noopener noreferrer"
              rounded="lg"
              target="_self"
              subtitle=""
              title="Técnico en Industrialización de la Madera y el Mueble"
              variant="text"
              max-width="344"
            >
              <v-overlay
                opacity=".06"
                scrim="primary"
                contained
                model-value
                persistent
              />
              <v-img height="200" src="@/assets/ipet51/especialidades/carpinteria-000.jpg"></v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-responsive>
    </v-container>
    <router-view></router-view>
  </template>
  
  <script setup>
    //
  </script>
  