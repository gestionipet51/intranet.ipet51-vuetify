<template>
    <v-layout class="">
      <div>
          <v-app-bar color="blue-darken-2" :class="elevation-10">
            <v-img
                class="mx-2"
                max-height="60"
                max-width="50"
                src="@/assets/ipet51/logos/logoIpet-sm.png"
                contain
                />
                <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-title class="ml-2 text-h6 text-md-h5">Intranet Ipet 51</v-toolbar-title>
          </v-app-bar>
      </div>
  
      <v-navigation-drawer>
        <v-list>
          <v-list-item title="Panel de Trabajo"></v-list-item>
          <v-divider></v-divider>
          <v-list-item v-for="i in items" 
                        :id="i.id" 
                        link 
                        :title="i.caption" 
                        :disabled="i.disable" 
                        :prepend-icon="i.icon"
                        :href="i.target" 
            >
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <v-main class="d-flex align-center justify-center" style="min-height: 900px;">
        <router-view></router-view>
      </v-main>
    </v-layout>
  </template>


<script>

    const menues = [
        { id:"0", caption:"Login", icon:"mdi-login" ,target:"/intranet/login"},
        { id:"1", caption:"Home",icon:"mdi-home-outline",class:"",disable:false ,target:"/"},
        { id:"2", caption:"Cursos",icon:"mdi-file-account-outline",class:"",disable:false ,target:"/intranet/cursos/index"},
        { id:"3", caption:"Roles",icon:"mdi-account-card-outline",class:"",disable:true ,target:"/roles"},
        { id:"4", caption:"Catalogos", icon:"mdi-playlist-edit",class:"",disable:true ,target:"/catalogos"},
        { id:"5", caption:"Det.Catlogos", icon:"mdi-text-box-edit-outline",class:"",disable:true ,target:"/roles"},
        { id:"6", caption:"Horarios", icon:"mdi-clock-outline",class:"",disable:true ,target:"/horarios"},
        { id:"7", caption:"Esp.Curriculares", icon:"mdi-application-array-outline",class:"",disable:true ,target:"/espacioscurriculares"},
        { id:"8", caption:"Areas", icon:"mdi-group",class:"",disable:true ,target:"/areas"},
        { id:"9", caption:"Departamentos", icon:"mdi-office-building-outline",class:"",disable:true ,target:"/departamentos"},
        { id:"10", caption:"Docentes", icon:"mdi-account-group-outline",class:"",disable:true ,target:"/docentes"},
    ];

    export default {
        data() {
            return {
                items:menues
            }
        }
    }
</script>