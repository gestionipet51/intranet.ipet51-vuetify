<script>
const myCursos=[
              {id:1,ciclo:"CB",anio:1,division:"A"},
              {id:2,ciclo:"CB",anio:1,division:"B"},
              {id:3,ciclo:"CB",anio:1,division:"C"},
              {id:4,ciclo:"CB",anio:1,division:"D"},
              {id:5,ciclo:"CB",anio:2,division:"A"},
              {id:6,ciclo:"CB",anio:2,division:"B"},
              {id:7,ciclo:"CB",anio:2,division:"C"},
              {id:8,ciclo:"CB",anio:2,division:"D"},
              {id:9,ciclo:"CB",anio:3,division:"A"},
              {id:10,ciclo:"CB",anio:3,division:"B"},
              {id:11,ciclo:"CB",anio:3,division:"C"},
              {id:12,ciclo:"CB",anio:3,division:"D"},
              {id:13,ciclo:"CO",anio:4,division:"A"},
              {id:14,ciclo:"CO",anio:4,division:"B"},
              {id:15,ciclo:"CO",anio:4,division:"C"},
              {id:16,ciclo:"CO",anio:4,division:"D"},
              {id:17,ciclo:"CO",anio:5,division:"A"},
              {id:18,ciclo:"CO",anio:5,division:"B"},
              {id:19,ciclo:"CO",anio:5,division:"C"},
              {id:20,ciclo:"CO",anio:5,division:"D"},
              {id:21,ciclo:"CO",anio:6,division:"A"},
              {id:22,ciclo:"CO",anio:6,division:"B"},
              {id:23,ciclo:"CO",anio:6,division:"C"},
              {id:24,ciclo:"CO",anio:6,division:"D"},
              {id:28,ciclo:"CO",anio:7,division:"A"},
              {id:29,ciclo:"CO",anio:7,division:"B"},
              {id:30,ciclo:"CO",anio:7,division:"C"},
              {id:31,ciclo:"CO",anio:7,division:"D"}
              
              ];
const cabeceras = [
    { title:'Id'   , align:'start' ,sortable:false,key:'id'},
    { title:'Ciclo', align:'center',sortable:true ,key:'ciclo'},
    { title:'Año'  , align:'center',sortable: false,key:'anio'},
    { title:'División',align:'center',sortable:false,key:'division'},
    { title:'Acciones',align:'center',sortable:false,key:'actions'},
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


const divisiones =  [ {id:1,division:'A'},{id:2,division:'B'},{id:3,division:'C'},{id:4,division:'D'}];

// console.log(myCursos);

import { db } from '../../../firebaseConfig';
import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc } from 'firebase/firestore';


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
                id:0,
                ciclo:'',
                anio:0,
                division:''
            },
            ciclos:[],
            ciclo:{
                id:0,
                key:'',
                caption:'',
                description:''
            },
            cicloSel:-1,
        }),
        methods:{
            initialize(){
                this.cursos = myCursos;
                this.ciclos = myCiclos;
                this.loading = true;
             },
            fetchCursos: async function (){
                const querySnapshot = await getDocs(collection(db,"Cursos"));
                this.cursos = querySnapshot.docs
                                    .map(doc => ({ id:doc.id, ...doc.data() }))
                                    .sort((a,b) => a.anio.localCompare(b.anio));
                this.loading = false;
            },
            sendData(){
                  let result = this.cursos.map((item) => { return { ...item,isActive:this.selected.includes(item)}})
            },
            editCurso (item) {
                        /*
                        this.editedIndex = this.cursos.indexOf(item)
                        this.editedCurso = Object.assign({}, item)
                        this.dialog = true
                        */
                        const curso = this.cursos.find(curso => curso.id == item.id )
                        this.editedIndex = this.cursos.indexOf(item);
                        this.editedCurso = { ...curso };
                        this.selected = item.id;
                        this.cicloSel = this.ciclos.find(ciclo => ciclo.oldkey == curso.ciclo);
                        this.dialog = true;
            },
            async deleteCurso (item) {
                        
                        this.editedIndex = this.cursos.indexOf(item)
                        this.editedCurso = Object.assign({}, item)
                        this.dialogDelete = true
                        // await deleteDoc(doc(db,"myCursos",item.id));
                        // await this.fetchCursos();

            },
            async submitCurso(){
                    if(this.selected){
                        await updateDoc(doc(db,"myCursos",this.selected),this.editedCurso)
                    }else{
                        await addDoc(collection(db,"myCursos"),this.editedCurso);
                    }

                    this.cancel();
                    await this.fetchmyCursos();
            }, 
            cancel(){
                this.dialog = false;
                this.selected = null;
                this.editedCurso = { id:0,ciclo:'',anio:0,division:''}
            },
            confirmDeleteCurso () {
                this.cursos.splice(this.editedIndex, 1)
                this.closeDelete()
            },
            close () {
                this.dialog = false
                this.$nextTick(() => {
                this.editedCurso = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                })
            },
            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                this.editedCurso = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                })
            },
            save () {
                if (this.editedIndex > -1) {
                Object.assign(this.cursos[this.editedIndex], this.editedCurso)
                } else {
                this.cursos.push(this.editedCurso)
                }
                this.close()
            },
            itemProps(ciclo){
                    return {
                       title: ciclo.caption,
                       value: ciclo.id
                    }
            }

        },
        computed: {
            formTitle () {
                    return (this.editedIndex === -1) ? 'Nuevo Curso' : 'Actualizar Curso'
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
          <v-col cols="4"></v-col>
          <v-col cols="4">
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
                                                <v-col cols="12" md="2" sm="4">
                                                    <v-text-field v-model="editedCurso.id" label="Id" disabled> </v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="4" sm="4"> 
                                                    <v-select label="Seleccione" :items="ciclos" item-title="caption" item-value="id" v-model="cicloSel"></v-select>
                                                </v-col>
                                                <v-col cols="12" md="2" sm="4"> 
                                                    <v-text-field v-model="editedCurso.anio" label="Año"></v-text-field> 
                                                </v-col>
                                                <v-col cols="12" md="2" sm="4"> 
                                                    <v-text-field v-model="editedCurso.division" label="División"></v-text-field> 
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
                                    <!--v-icon class="me-2" size="small" color="red-accent-4"   @click="closeDelete">mdi-close-thick</v-icon-->
                                    <v-btn color="red-accent-4"  variant="text" @click="closeDelete" icon="mdi-close-thick"></v-btn>
                                    <v-btn color="blue-darken-1" variant="text" @click="confirmDeleteCurso" icon="mdi-content-save"></v-btn>
                                    <v-spacer></v-spacer>
                                    </v-card-actions>
                                </v-card>
                                </v-dialog>
                    </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                    <v-icon class="me-2" size="small" color="green-darken-4" @click="editCurso(item)">mdi-pencil </v-icon>
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

