<template>
    <v-container>
        <v-app-bar :elevation="2"  color="deep-purple-darken-3">
            <v-app-bar-nav-icon icon="mdi-account-card-outline"></v-app-bar-nav-icon>
            <v-toolbar-title class="ml-2 text-h6 text-md-h5">Roles</v-toolbar-title>
        </v-app-bar>

        <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="6">
                <v-data-table :headers="header"></v-data-table>
            </v-col>
            <v-col></v-col>
        </v-row>
    </v-container>
</template>


<script>

const tblHeader =[
{ align:'center',sortable:false,key:'id'  , title:'Rol Id'},
{ align:'center',sortable:false,key:'rol'  , title:'Rol'},
{ align:'center',sortable:false,key:'acciones'  , title:'Acciones'},
];

import { db } from '../../../firebaseConfig';
import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';

export default {
    data :() => ({
        headers:tblHeader,
        roles:[],

    })
}

</script>