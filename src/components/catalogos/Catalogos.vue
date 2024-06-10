<template>
    <v-container>
        <v-app-bar :elevation="2"  color="blue-accent-2" class="bottom-round">
            <v-app-bar-nav-icon icon="mdi-playlist-edit"></v-app-bar-nav-icon>
            <v-toolbar-title class="ml-2 text-h6 text-md-h5">Catalogos</v-toolbar-title>
        </v-app-bar>

        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="8">
                <v-data-table 
                    :headers="headers"
                    :items="roles"
                v-model:items-per-page="itemsPerPage"
                :items-length="totalCatalogos"
                :loading="loading"
                item-value="id"
                :search="search"
                >
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title> Catalogos </v-toolbar-title>
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
                                            <v-col cols="6"><v-text-field v-model="editedCatalogo.id" label="Catalogo Id" disabled> </v-text-field></v-col>
                                        </v-row>
                                        <v-row> 
                                            <v-col cols="6"><v-text-field v-model="editedCatalogo.catalogo" label="Nombre"></v-text-field></v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="8"><v-text-field v-model="editedCatalogo.description" label="Descripción"></v-text-field></v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="3">
                                                <v-select v-model="estadoSel.id" label="Seleccione" :items="estados" item-title="caption" item-value="id" @change="setEstado"></v-select>
                                                <v-text-field v-model="editedCatalogo.status" label="Ciclo" v-show="false"></v-text-field>
                                            </v-col>
                                        </v-row>

                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red-accent-4" variant="text" @click="close" icon="mdi-close-thick"></v-btn>
                                        <v-btn color="green-darken-4" variant="text" @click="save" icon="mdi-content-save-settings"></v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>

                            <v-dialog v-model="dialogDelete" max-width="500px">
                                    <v-card color="pink-lighten-4">
                                        <v-card-title class="text-h6">
                                            <v-icon color="red-accent-4">mdi-help-circle</v-icon> <span class="red-accent-4">¿Esta seguro de eliminar este ROL?</span>
                                        </v-card-title>
                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red-accent-4"  variant="text" @click="closeDelete" icon="mdi-close-thick"></v-btn>
                                        <v-btn color="blue-darken-1" variant="text" @click="confirmDeleteRol" icon="mdi-content-save"></v-btn>
                                        <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                            </v-dialog>

                        </v-toolbar>
                    </template>
                    <template v-slot:item.acciones="{ item }">
                        <v-icon class="me-2" size="small" color="green-darken-4" @click="updateRol(item)">mdi-pencil </v-icon>
                        <v-icon class="me-2" size="small" color="red-accent-4"   @click="deleteRol(item)">mdi-delete </v-icon>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import { db } from '../../firebaseConfig';
import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';

const tblHeader =[
        { align:'center',sortable:false,key:'id'  , title:'Cat.Id'},
        { align:'center',sortable:false,key:'catalog'  , title:'Catalogo'},
        { align:'center',sortable:false,key:'description' , title:'Descripción'},
        { align:'center',sortable:false,kay:'status' ,title:'Estado'},
        { align:'center',sortable:false,key:'actions'  , title:'Acciones'},
];

const estados = [
    { id:'AC',caption:'Activo'},
    { id:'IN',caption:'Inactivo'},
];

export default {
    data :() => ({
        headers: tblHeader,
        catalogos:[],
        itemsPerPage:10,
        search:'',
        loading:false,
        selected:[],
        totalCatalogos: 0,
        singleSelect:false,
        dialog:false,
        dialogDelete:false,
        editedIndex: -1,
        editedCatalogo:{
                id:'',
                catalogo:'',
                description:'',
                status:'',
            },
        estados:estados,
        estadoSel:{
            id:'',
            caption:''
        },

    }),
    methods:{
        init(){
            this.fetchCatalogos();
        },
        close(){
            this.dialog = false;
            this.$nextTick(() => {
                    this.editedCatalogo =  { id:'',catalog:'',description:'',status:''}
                    this.editedIndex = -1;
                })
        },
        fetchCatalogos: async function (){
                const querySnapshot = await getDocs(collection(db,"catalogos"));
                this.cursos = querySnapshot.docs
                                    .map(doc => ({ id:doc.id, ...doc.data() }))
                this.loading = false;
        },
        async save () {

                if(this.editedIndex > -1 ){
                    await this.update() ;       
                }else{
                    await this.create();
                }

                this.close();

                await this.fetchCatalogos();

        },
        async update(){
                // Update
                Object.assign(this.catalogos[this.editedIndex], this.editedCatalogo);
                await updateDoc(doc(db,"catalogos",this.selected),this.editedCatalogo);
            },
        async create(){
                // create
                this.editedCatalogo.id = crypto.randomUUID();
                this.catalogos.push(this.editedCatalogo)
                await addDoc(collection(db,"catalogos"),this.editedCatalogo);
        },
    },
    created(){
        this.init();
    },
    computed:{
        setEstado(){
            this.editedCatalogo.status = this.estadoSel.id;
        }
    }
}

</script>
<style scope>

    .bottom-round {
        border-bottom-left-radius: 5px;
    }
</style>