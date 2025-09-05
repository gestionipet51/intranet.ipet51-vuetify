<template>
    <v-container>
            <v-app-bar :elevation="2"  color="blue-accent-2" class="bottom-round">
                <v-app-bar-nav-icon icon="mdi-account-multiple"></v-app-bar-nav-icon>
                <v-toolbar-title class="ml-2 text-h6 text-md-h5">Dependencias Hoja de Ruta</v-toolbar-title>
            </v-app-bar>
            <v-row>
                <v-col cols="2"></v-col>
                <v-col cols="6">
                    <v-data-table
                    :items="dependencias"
                    :headers="tblHeaders"
                    v-model:items-per-page="itemsPerPage"
                    :items-length="totalDeps"
                    :loading="loading"
                    :search="search"
                    show-expand
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>
                                        Dependencias Isep
                                </v-toolbar-title>
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
                                    <v-dialog v-model="dialogDependencias" max-width="800px">
                                        <template v-slot:activator="{ props }">
                                            <v-btn class="mb-2" color="primary" variant="tonal" v-bind="props" density="comfortable" icon="mdi-plus" size="large"></v-btn>
                                        </template>
                                        <v-card>
                                            <v-card-title class="text-h5" color="red-accent-4">
                                                {{  modalTitle }}
                                            </v-card-title>
                                            <v-card-text>
                                                <v-row>
                                                    <v-col cols="4">
                                                        <v-text-field v-model="dependenciaEdit.id" label="Dep Id" disabled> </v-text-field></v-col>
                                                    <v-col cols="4">
                                                        <v-text-field
                                                            v-model="dependenciaEdit.descripcion"
                                                            label="Dependencia"
                                                            variant="outlined"
                                                            hide-details
                                                            single-line
                                                            cols="1"
                                                        >
                                                        </v-text-field>
                                                    </v-col>
                                                <v-col>
                                                    <v-text-field cols="2" label ="Clave" v-model="dependenciaEdit.key" variant="outlined" single-line></v-text-field>
                                                </v-col>
                                                </v-row>
                                                

                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                    <v-btn color="red-accent-4" variant="text" @click="close" icon="mdi-close-circle-outline"></v-btn>
                                                    <v-btn color="blue-darken-4" variant="text" @click="save" icon="mdi-content-save-settings"></v-btn>
                                                <v-spacer></v-spacer>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                            </v-toolbar>
                        </template>
                        <template v-slot:expanded-row="{ columns, item }">
                            <tr>
                                    <td :colspan="columns.length">
                                        <MiembrosDep :dependencia="item"></MiembrosDep>
                                    </td>
                                </tr>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon class="me-2" size="small" color="green-darken-4" @click="updateDep(item)">mdi-pencil </v-icon>
                            <v-icon class="me-2" size="small" color="red-accent-4"   @click="deleteDep(item)">mdi-delete </v-icon>
                    </template>
                    </v-data-table>
                </v-col>
            </v-row>

            

    </v-container>
</template>

<script>
    
    import { db } from '../../../firebaseConfig';
    import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';

    import MiembrosDep from './DependenciasMiembros.vue';

    const vDependencias = [{id:1,descripcion:"Biblioteca",key:"BBA"},
                            {id:2,descripcion:"Taller-Laboratorio",key:"TLA"},
                            {id:3,descripcion:"Cooperadora",key:"COO"},
                            {id:4,descripcion:"Internado",key:"INT"}];
    const tblHeader =[
        { align:'center',sortable:false,key:'id' , title:'Dep.Id'},
        { align:'center',sortable:false,key:'key'  , title:'Clave'},
        { align:'center',sortable:false,key:'descripcion' , title:'Descripción'},
        { align:'center',sortable:false,key:'status' ,title:'Estado'},
        { align:'center',sortable:false,key:'actions'  , title:'Acciones'},
];

    export default {
        data() { 
                return {
                        itemsPerPage: 10,
                        search: "",
                        loading: false,
                        totalDeps: 0,
                        selected: [],
                        dialogDependencias:false,
                        tblHeaders:tblHeader,
                        dependenciaEdit:{
                            id:'',
                            descripcion:'',
                            key:''
                        },
                        dependenciaSel:'',
                        indexSel:-1,
                        dependencias:[],
                        }
        },
        computed:{
            modalTitle: function(){
                return (this.indexSel === -1) ? "Nueva Dependencia" : "Actualizar Dependencia";
            }
        },
        components:{
            MiembrosDep,
        },
        methods:{
            async init() {
                await this.fetchDependencias();
            },
            showModalDependencias(){
                this.dialogDependencias = true;
            },
            close(){
                this.dialogDependencias = false;
                this.indexSel = -1;
            },
            async fetchDependencias() {
                const querySnapshot = await getDocs(collection(db, "dependencias"));
                this.dependencias = querySnapshot.docs
                    .map(doc => ({ id:doc.id, ...doc.data() }));
                this.loading = false;
            },
            async save() {
                if(this.indexSel > -1 )
                    await this.update()
                else
                    await this.create();

                this.close();
                await this.fetchDependencias();
            },
            change:function(ev){
                this.dependenciaEdit.id = ev.value;
                if(ev.value > -1 )
                    this.indexSel = this.dependenciaEdit.id
            },
            async create(){
                this.dependenciaEdit.id = crypto.randomUUID();
                this.dependencias.push(this.dependenciaEdit);
                await addDoc(collection(db, "dependencias"), this.dependenciaEdit);
                console.log(this.dependencias);
            },
            onEdit:(elem) => { 
                this.dependenciaEdit.id = elem.id;
            },
            updateDep:function(){

            },
            deleteDep:function(){

            }
        },
        created(){
            this.init();
        }
    }

</script>