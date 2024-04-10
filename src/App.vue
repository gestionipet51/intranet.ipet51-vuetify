<template>
  <v-app>
    <v-main>
      <!--Welcome /-->
      <Panel></Panel>
      <!--RouterView></RouterView-->
    </v-main>
    <AppFooter @cambiar-tema="toggleTheme"/>
  </v-app>
</template>

<script setup>
  //
import { createApp,ref } from 'vue';
import { useTheme } from 'vuetify';
import HelloWorld from './components/HelloWorld.vue';
import Welcome from './components/Welcome.vue'
import Panel from './components/PanelHome.vue';

const theme = useTheme()

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}



</script>
