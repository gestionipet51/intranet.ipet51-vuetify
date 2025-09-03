<template>
    <v-container>
        <v-app-bar :elevation="2" color="green-darken-3" class="bottom-round">
            <v-app-bar-nav-icon icon="mdi-office-building-outline"></v-app-bar-nav-icon>
            <v-toolbar-title>Departamentos</v-toolbar-title>
        </v-app-bar>

        <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="6">
                <v-data-table   
                    :headers="headers" 
                    :items="departamentos">
                    <template v-slot:top>
                        <v-toolbar flat>
                                <v-toolbar-title>CRUD - Departamentos </v-toolbar-title>
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
                                        <v-btn class="mb-2" color="primary" variant="tonal"  v-bind="props" density="comfortable" icon="mdi-plus" size="large"></v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title>
                                                <span class="text-h5"> {{ formTitle }}</span>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="12" md="6" sm="6">
                                                        <v-text-field v-model="editedDepto.id" label="Depto Id" disabled> </v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" md="6" sm="4"> 
                                                        <v-text-field v-model="editedDepto.nombre" label="Nombre"></v-text-field> 
                                                    </v-col>
                                                    <v-col cols="12" md="2" sm="4"> 
                                                        <v-text-field v-model="editedDepto.codigo" label="Codigo"></v-text-field> 
                                                    </v-col>
                                                    <v-col cols="12" md="3" sm="4">
                                                        <v-select v-model="editedDepto.estado" label="Seleccione Estado" :items="estadosVigencia" item-title="caption" item-value="id" ></v-select>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
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
                                            <v-icon color="red-accent-4">mdi-help-circle</v-icon> <span class="red-accent-4">¿Esta seguro de eliminar esteDepartamento?</span>
                                        </v-card-title>
                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red-accent-4"  variant="text" @click="closeDelete" icon="mdi-close-thick"></v-btn>
                                        <v-btn color="blue-darken-1" variant="text" @click="confirmDeleteDepto" icon="mdi-content-save"></v-btn>
                                        <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                    </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.acciones="{ item }">
                        <v-icon class="me-2" size="small" color="green-darken-4" @click="updateDepto(item)">mdi-pencil </v-icon>
                        <v-icon class="me-2" size="small" color="red-accent-4"   @click="deleteDepto(item)">mdi-delete </v-icon>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    
import { db } from '../../../firebaseConfig';
import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';

const tableHeaders = [
    { align:'d-none',sortable:false,key:'id'  , title:'Depto Id'},
    { align:'center',sortable:true ,key:'nombre',title:'Nombre', },
    { align:'center',sortable:true ,key:'codigo',title:'Codigo'  , },
    { align:'center',sortable:true ,key:'estado',title:'Estado'  , },
    { align:'center',sortable:false,key:'acciones',title:'Acciones',},
];

const estados = [
    {id:1,caption:'Vigente',key:'VI'},
    {id:2,caption:'No Vigente',key:'NV'}
]

export default{
    data :() => ({
            departamentos:[],
            headers : tableHeaders,
            itemsPerPage:10,
            loading:false,
            totalDeptos: 0,
            search:'',
            selected:[],
            singleSelect:false,
            dialog:false,
            dialogDelete:false,
            editedIndex: -1,
            editedDepto:{
                id:'',
                nombre:'',
                codigo:'',
                estado:'',
            },
            estadosVigencia:[],
            estadoSelected:0,
    }),
    methods:{
        async init(){
           await this.fetchDeptos();
           this.estadosVigencia = estados;
           this.estadoSelected = 1;
        },
        close(){
            this.dialog = false;
            this.$nextTick(() => {
                    this.editedDepto =  { id:'',nombre:'',codigo:'',estado:''}
                    this.editedIndex = -1;
                })
        },
        async create(){
                // create
                this.editedDepto.id = crypto.randomUUID();
                this.departamentos.push(this.editedDepto)
                await addDoc(collection(db,"departamentos"),this.editedDepto);
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

        updateDepto(item){
            this.selected = item;
            this.editedIndex = this.departamentos.indexOf(item);
            this.editedDepto = { ...this.selected };
            this.dialog = true;
        },
        deleteDepto(item){
            this.editedIndex = this.departamentos.indexOf(item)
            this.editedDepto = Object.assign({}, item)
            this.dialogDelete = true;
        },
        async fetchDeptos (){
                const querySnapshot = await getDocs(collection(db,"departamentos"));
                this.departamentos = querySnapshot.docs
                                    .map(doc => ({ id:doc.id, ...doc.data() }))
                this.loading = false;
        },     
    },
    computed:{
        formTitle ()    {
            return (this.editedIndex === -1) ? 'Nuevo Departamento' : 'Actualizar Departamento'
        }
    },
    created(){
       this.init();
    }
}
</script>