<template>
    <v-container>
        <v-app-bar :elevation="2"  color="deep-purple-darken-3">
            <v-app-bar-nav-icon icon="mdi-account-card-outline"></v-app-bar-nav-icon>
            <v-toolbar-title class="ml-2 text-h6 text-md-h5">Roles</v-toolbar-title>
        </v-app-bar>
    </v-container>
</template>


<script>

import { db } from '../../../firebaseConfig';
import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';



</script>