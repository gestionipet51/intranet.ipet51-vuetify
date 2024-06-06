<template>
    <v-container>
        <v-app-bar :elevation="2"  color="deep-purple-darken-3">
            <v-app-bar-nav-icon icon="mdi-account-card-outline"></v-app-bar-nav-icon>
            <v-toolbar-title class="ml-2 text-h6 text-md-h5">Roles</v-toolbar-title>
        </v-app-bar>

        <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="6">
                <v-data-table :headers="headers">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title>CRUD - Roles </v-toolbar-title>
                            <v-text-field
                                v-model="search"
                                label="Buscar"
                                prepend-inner-icon="mdi-magnify"
                                variant="outlined"
                                hide-details
                                single-line
                                cols="1"
                            >
                            </v-text-field>
                            <v-divider class="mx-8" inset vertical ></v-divider>
                            <v-dialog v-model="dialog" max-width="800px">
                                <template v-slot:activator="{ props }">
                                    <v-btn class="mb-2" color="primary" variant="tonal" v-bind="props" density="comfortable" icon="mdi-plus" size="large"></v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>
                                            <span class="text-h5"> {{ formTitle }}</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="4"><v-text-field v-model="editedRol.id" label="Rol Id" disabled> </v-text-field></v-col>
                                            <v-col cols="4"><v-text-field v-model="editedRol.rol" label="Rol"></v-text-field></v-col>
                                            <v-col cols="2"><v-text-field v-model="editedRol.code" label="Codigo"></v-text-field></v-col>
                                        </v-row>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red-accent-4" variant="text" @click="close" icon="mdi-close-thick"></v-btn>
                                        <v-btn color="green-darken-4" variant="text" @click="save" icon="mdi-content-save-settings"></v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>
                </v-data-table>
            </v-col>
            <v-col></v-col>
        </v-row>
    </v-container>
</template>


<script>

const tblHeader =[
{ align:'center',sortable:false,key:'id'  , title:'Rol Id'},
{ align:'center',sortable:false,key:'rol'  , title:'Rol'},
{ align:'center',sortable:false,key:'code' , title:'Codigo'},
{ align:'center',sortable:false,key:'acciones'  , title:'Acciones'},
];

import { db } from '../../../firebaseConfig';
import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';

export default {
    data :() => ({
        headers:tblHeader,
        roles:[],
        itemsPerPage:10,
        search:'',
        loading:false,
        selected:[],
        totalRoles: 0,
        singleSelect:false,
        dialog:false,
        dialogDelete:false,
        editedIndex: -1,
        editedRol:{
                id:'',
                rol:'',
                code:'',
            },

    }),
    methods:{
        init(){

        },
        close(){
            this.dialog = false;
            this.$nextTick(() => {
                    this.editedRol =  { id:'',rol:'',code:''}
                    this.editedIndex = -1;
                })
        },
        async update(){
                // Update
                Object.assign(this.roles[this.editedIndex], this.editedRol)
                await updateDoc(doc(db,"roles",this.selected),this.editedRol)
            },
        async create(){
                // create
                this.editedRol.id = crypto.randomUUID();
                this.roles.push(this.editedRol)
                await addDoc(collection(db,"roles"),this.editedRol);
            },
        async save () {

                if(this.editedIndex > -1 ){
                    await this.update() ;       
                }else{
                    await this.create();
                }

                this.close();

                await this.fetchRoles();

            },
        async fetchRoles (){
                const querySnapshot = await getDocs(collection(db,"roles"));
                this.roles = querySnapshot.docs
                                    .map(doc => ({ id:doc.id, ...doc.data() }))
                this.loading = false;
        },

        
    },
    computed:{
        formTitle ()    {
            return (this.editedIndex === -1) ? 'Nuevo ROL' : 'Actualizar ROL'
        }
    },
    async created(){
        await this.fetchRoles();
    }
}

</script>