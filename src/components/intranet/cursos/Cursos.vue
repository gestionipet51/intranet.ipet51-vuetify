<script>

const myCursos=[
    {id:1,ciclo:"PC",anio:1,division:"A"},
    {id:2,ciclo:"PC",anio:1,division:"B"},
    {id:3,ciclo:"PC",anio:1,division:"C"},
    {id:4,ciclo:"PC",anio:1,division:"D"},
    {id:5,ciclo:"PC",anio:2,division:"A"},
    {id:6,ciclo:"PC",anio:2,division:"B"},
    {id:7,ciclo:"PC",anio:2,division:"C"},
    {id:8,ciclo:"PC",anio:2,division:"D"},
    {id:9,ciclo:"PC",anio:3,division:"A"},
    {id:10,ciclo:"PC",anio:3,division:"B"},
    {id:11,ciclo:"PC",anio:3,division:"C"},
    {id:12,ciclo:"PC",anio:3,division:"D"},
    {id:13,ciclo:"SC",anio:4,division:"A"},
    {id:14,ciclo:"SC",anio:4,division:"B"},
    {id:15,ciclo:"SC",anio:4,division:"C"},
    {id:16,ciclo:"SC",anio:4,division:"D"},
    {id:17,ciclo:"SC",anio:5,division:"A"},
    {id:18,ciclo:"SC",anio:5,division:"B"},
    {id:19,ciclo:"SC",anio:5,division:"C"},
    {id:20,ciclo:"SC",anio:5,division:"D"},
    {id:21,ciclo:"SC",anio:6,division:"A"},
    {id:22,ciclo:"SC",anio:6,division:"B"},
    {id:23,ciclo:"SC",anio:6,division:"C"},
    {id:24,ciclo:"SC",anio:6,division:"D"},
    {id:28,ciclo:"SC",anio:7,division:"A"},
    {id:29,ciclo:"SC",anio:7,division:"B"},
    {id:30,ciclo:"SC",anio:7,division:"C"},
    {id:31,ciclo:"SC",anio:7,division:"D"} 
    ];

const cabeceras = [
    { align:'d-none',sortable:false,key:'id'  , title:'Curso Id'},
    { align:'center',sortable:true ,key:'ciclo',title:'Ciclo', },
    { align:'center',sortable:true ,key:'anio',title:'Año'  , },
    { align:'center',sortable:true ,key:'division',title:'Año'  , },
    { aling:'center',sortable:false,key:'descripcion',title:'Descripcion'},
    { align:'center',sortable:false,key:'actions',title:'Acciones',},
];

const myCiclos =[
        { caption : 'Primer Ciclo' ,id:1 ,key :'PC',description:'Ciclo Basico' ,oldkey:'CB'} ,
        { caption : 'Segundo Ciclo',id:2 ,key :'SC',description:'Ciclo Especialidad',oldkey:'CO'} 
];

const anios = [
    { id :1 , ciclo :1 , description:'Primer Año'},
    { id :2 , ciclo :1 , description:'Segundo Año'},
    { id :3 , ciclo :1 , description:'Tercer Año'},
    { id :4 , ciclo :2 , description:'Cuarto Año'},
    { id :5 , ciclo :2 , description:'Quinto Año'},
    { id :6 , ciclo :2 , description:'Sexto Año'},
    { id :7 , ciclo :2 , description:'Septimo Año'}
];


const estados = [
    {id:1,caption:'Activo',key:'AC'},
    {id:2,caption:'Inactivo',key:'IN'}
]
const divisiones =  [ {id:1,division:'A'},{id:2,division:'B'},{id:3,division:'C'},{id:4,division:'D'}];

// console.log(myCursos);

import { db } from '../../../firebaseConfig';
import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';


export default {
        data:() =>({
            cursos:[],
            headers : cabeceras,
            itemsPerPage:10,
            loading:false,
            totalCursos: 0,
            search:'',
            selected:[],
            singleSelect:false,
            dialog:false,
            dialogDelete:false,
            editedIndex: -1,
            editedCurso:{
                id:'',
                ciclo:'',
                anio:'',
                division:'',
                descripcion:''
            },
            ciclos:[],
            cicloSel:{
                id:'',
                key:'',
                caption:'',
                description:'',
                oldkey:''
                },
            estados:estados
        }),
        methods:{
            initialize(){
                // this.cursos = myCursos;
                this.ciclos = myCiclos;
                this.loading = true;
             },
            fetchCursos: async function (){
                const querySnapshot = await getDocs(collection(db,"cursos"));
                this.cursos = querySnapshot.docs
                                    .map(doc => ({ id:doc.id, ...doc.data() }))
                                    // .sort((a,b) => a.anio.localCompare(b.anio));
                this.loading = false;
            },
            sendData(){
                  let result = this.cursos.map((item) => { return { ...item,isActive:this.selected.includes(item)}})
            },
            updateCurso (item) {
                        
                        // const curso = this.cursos.find(curso => curso.id == item.id )
                        this.cicloSel = this.ciclos.find(ciclo => ciclo.key == item.ciclo );
                        this.selected = item;
                        this.editedIndex = this.cursos.indexOf(item);
                        this.editedCurso = { ...this.selected };
                        this.updateCurso.ciclo = this.cicloSel.key;
                        this.dialog = true;
            },
            async deleteCurso (item) {
                        
                        this.editedIndex = this.cursos.indexOf(item)
                        this.editedCurso = Object.assign({}, item)
                        this.dialogDelete = true
                        await deleteDoc(doc(db,"cursos",item.id));
                        await this.fetchCursos();
            },

            cancel(){
                this.dialog = false;
                this.selected = null;
                this.cicloSel = null;
                this.editedCurso = { id:0,ciclo:'',anio:0,division:'',descripcion:''}
            },
            confirmDeleteCurso () {
                this.cursos.splice(this.editedIndex, 1)
                this.closeDelete()
            },
            close () {
                this.dialog = false;
                this.$nextTick(() => {
                    this.editedCurso =  { id:0,ciclo:'',anio:0,division:'',descripcion:''}
                    this.editedIndex = -1;
                })
            },
            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                this.editedCurso = Object.assign({}, { id:0,ciclo:'',anio:0,division:'',descripcion:''} )
                this.editedIndex = -1;
                })
            },

           
            async save () {

                if(this.editedIndex > -1 ){
                    await this.update() ;       
                }else{
                    await this.create();
                }

                this.close();
                await this.fetchCursos();

            },

            itemProps(ciclo){
                    return {
                       title: ciclo.caption,
                       value: ciclo.id
                    }
            },
            async update(){
                // Update
                
                try{
                    Object.assign(this.cursos[this.editedIndex], this.editedCurso)
                    await updateDoc(doc(db,"cursos",this.selected.id),this.editedCurso)

                }
                catch(error){
                    console.log(error);
                }
            },
            async create(){
                // create
                this.editedCurso.id = crypto.randomUUID();
                this.cursos.push(this.editedCurso)
                await addDoc(collection(db,"cursos"),this.editedCurso);
            },

        },
        computed: {
            formTitle () {
                    return (this.editedIndex === -1) ? 'Nuevo Curso' : 'Actualizar Curso'
            },
            descriptionCiclo(){
                return this.ciclos.find(ciclo => ciclo.key ==  this.editedCurso.ciclo);
            },
            setCiclo(){

                if(this.editedIndex === -1 ){
                    /* nuevo Curso */
                    if(this.cicloSel.id != ''){
                        this.cicloSel = this.ciclos.find((c) => c.id === this.cicloSel.id);
                        this.editedCurso.ciclo = this.cicloSel.key;

                    }
                }
                
                console.log(this.cicloSel);
            },
        },
        watch: {
          dialog (val) {
            val || this.close()
          },
          dialogDelete (val) {
            val || this.closeDelete()
          },
        },
        async created () {
            await this.fetchCursos();
            this.initialize();
            this.loading = false;
        },
    }
</script>
<!--   @update:options="loadItems" -->
<template>
    <v-container>
        <v-app-bar :elevation="2" title="Cursos" color="deep-purple-darken-4"></v-app-bar>
        <v-row no-gutters>
          <v-col cols="2"></v-col>
          <v-col cols="6">
                <v-data-table 
                :headers="headers" 
                :items="cursos"
                v-model:items-per-page="itemsPerPage"
                :items-length="totalCursos"
                :loading="loading"
                item-value="id"
                :search="search"
                :single-select="singleSelect"
                >
                    <template v-slot:top>
                        <v-toolbar flat>
                                <v-toolbar-title>CRUD</v-toolbar-title>
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
                                        <v-btn class="mb-2" color="primary" variant="elevated" v-bind="props"><v-icon>mdi-plus</v-icon></v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title>
                                                <span class="text-h5"> {{ formTitle }}</span>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="12" md="6" sm="6">
                                                        <v-text-field v-model="editedCurso.id" label="Curso Id" disabled> </v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" md="4" sm="4"> 
                                                        <v-select v-model="cicloSel.id" label="Seleccione" :items="ciclos" item-title="caption" item-value="id" @change="setCiclo"></v-select>
                                                        <v-text-field v-model="editedCurso.ciclo" label="Ciclo" v-show="false"></v-text-field> 
                                                    </v-col>
                                                    <v-col cols="12" md="2" sm="4"> 
                                                        <v-text-field v-model="editedCurso.anio" label="Año"></v-text-field> 
                                                    </v-col>
                                                    <v-col cols="12" md="2" sm="4"> 
                                                        <v-text-field v-model="editedCurso.division" label="División"></v-text-field> 
                                                    </v-col>
                                                    <v-col cols="12" md="4" sm="4">
                                                        <v-text-field v-model="editedCurso.descripcion" label="Descripción"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="red-accent-4" variant="text" @click="close" icon="mdi-arrow-u-left-top-bold"></v-btn>
                                            <v-btn color="green-darken-4" variant="text" @click="save" icon="mdi-content-save-settings"></v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                                <v-dialog v-model="dialogDelete" max-width="500px">
                                    <v-card color="pink-lighten-4">
                                        <v-card-title class="text-h6">
                                            <v-icon color="red-accent-4">mdi-help-circle</v-icon> <span class="red-accent-4">¿Esta seguro de eliminar este curso?</span>
                                        </v-card-title>
                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red-accent-4"  variant="text" @click="closeDelete" icon="mdi-close-thick"></v-btn>
                                        <v-btn color="blue-darken-1" variant="text" @click="confirmDeleteCurso" icon="mdi-content-save"></v-btn>
                                        <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                    </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon class="me-2" size="small" color="green-darken-4" @click="updateCurso(item)">mdi-pencil </v-icon>
                        <v-icon class="me-2" size="small" color="red-accent-4"   @click="deleteCurso(item)">mdi-delete </v-icon>
                    </template>
                    <template v-slot:no-data>
                        <v-btn
                            color="primary"
                            @click="initialize"
                        >
                            Reset
                        </v-btn>
                    </template>
              </v-data-table>
              <!-- show-select class="elevation-1"-->
          </v-col>
          <v-col></v-col>
        </v-row>
        
    </v-container>
</template>

