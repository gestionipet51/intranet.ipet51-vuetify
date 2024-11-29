<template>
    <v-container>
        <v-app-bar :elevation="2"  color="blue-accent-2" class="bottom-round">
            <v-app-bar-nav-icon icon="mdi-playlist-edit"></v-app-bar-nav-icon>
            <v-toolbar-title class="ml-2 text-h6 text-md-h5">Hoja de Ruta</v-toolbar-title>
        </v-app-bar>
        
            <v-row v-if="loadfile == true ">
                
                    <v-col cols="6">
                        <v-file-input  accept=".csv" label="Subir CSV a Firebase" @change="procesarArchivo"></v-file-input>
                    </v-col>
                        <v-col cols="3">
                            <v-btn :disabled="!datosCSV.length" rounded="lg" @click="enviarDatos" color="indigo-darken-3">
                                Subir Archivo 
                            </v-btn>
                    </v-col>
                </v-row>
        

        <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="6">
                <v-select label="Seleccione Curso" 
                          :items="cursos" 
                          item-title="descripcion" 
                          item-value ="id"        
                          v-model="idCourseSelected"
                          @change="onChange">
                </v-select>
            </v-col>
            <v-col cols="1">
                <v-btn color="blue-darken-3" @click="emitManualChange">
                    Buscar
                </v-btn>
            </v-col>
        </v-row>
        
        <v-row>
            <v-data-table :items="courseSelected" :headers="headers">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Hoja de Ruta</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>

                        <v-dialog v-model="dialogFactory" max-width="500px">
                            <v-card>
                                <v-card-title class="text-h5">{{ itemSelected.apellido }} , {{ itemSelected.nombre }} : Hoja de Ruta - Registro de Taller </v-card-title>
                                <v-card-text>
                                    <v-row dense>
                                        <v-col cols="12" md="6" sm="6">
                                            <v-select
                                                label="Responsable"
                                                :items="tlResponsables"
                                                item-title="nombre" 
                                                item-value ="id"        
                                                v-model="itemSelected.tl_responsable"
                                                required
                                            ></v-select>
                                        </v-col>

                                        <v-col cols="12" md="6" sm="6">
                                            <v-select
                                                label="Condición"
                                                :items="opEstados"
                                                item-title="tag" 
                                                item-value ="id"        
                                                v-model="itemSelected.tl_condicion"
                                                required
                                            ></v-select>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                        <v-btn color="red-accent-4" variant="text" @click="closeFactory" icon="mdi-arrow-u-left-top-bold"></v-btn>
                                        <v-btn color="blue-darken-4" variant="text" @click="updateFactory" icon="mdi-content-save-settings"></v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                            </v-dialog>

                            <v-dialog v-model="dialogBiblioteca" max-width="600px">
                            <v-card>
                                <v-card-title class="text-h5">{{ itemSelected.apellido }} , {{ itemSelected.nombre }} : Hoja de Ruta - Registro de Biblioteca</v-card-title>
                                <v-card-text>
                                    <v-row dense>
                                        <v-col cols="12" md="6" sm="6">
                                            <v-select
                                                label="Responsable"
                                                :items="blResponsables"
                                                item-title="nombre" 
                                                item-value ="id"        
                                                v-model="itemSelected.bl_responsable"
                                                required
                                            ></v-select>
                                        </v-col>

                                        <v-col cols="12" md="6" sm="6">
                                            <v-select
                                                label="Condición"
                                                :items="opEstados"
                                                item-title="tag" 
                                                item-value ="id"        
                                                v-model="itemSelected.bl_condicion"
                                                required
                                            ></v-select>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                        <v-btn color="red-accent-4" variant="text" @click="closeFactory" icon="mdi-arrow-u-left-top-bold"></v-btn>
                                        <v-btn color="blue-darken-4" variant="text" @click="updateFactory" icon="mdi-content-save-settings"></v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                            </v-dialog>

                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon
                        class="me-2"
                        size="small"
                        color="blue-darken-4"
                        @click="editFactory(item)"
                    >
                        mdi-factory
                    </v-icon>
                    <v-icon
                        class="me-2"
                        size="small"
                        color="teal-darken-3"
                        @click="editBiblioteca(item)"
                    >
                        mdi-library
                    </v-icon>
                    <v-icon
                        class="me-2"
                        size="small"
                        color="red-accent-4"
                        @click="editCooperadora(item)"
                        >
                        mdi-currency-usd
                    </v-icon>
                    <v-icon
                            class="me-2"
                            size="small"
                            color="deep-purple-accent-3"
                            @click="editInternado(item)"
                            >
                            mdi-bed-single-outline
                    </v-icon>
                </template>
            </v-data-table>            
        </v-row>

    </v-container>

</template>


<script>

    import { db } from '../../../firebaseConfig';
    import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';

    import Papa from "papaparse"; // Importar PapaParse para procesar CSV
    import axios from "axios"; // Axios para enviar datos al backend    

    const vEstados = [{id:1,tag:"Completo",key:"COMPLETO"},{id:2,tag:"Pendiente",key:"PENDIENTE"},{id:3,tag:"NO CORRESPONDE",key:"NC"}];

    
    const vResponsables = [{id:1,grupo:"COOPERADORA",nombre:"PERALTA,FLORENCIA"},
                          {id:2,grupo:"TALLER",nombre:"LAZZARO MATAR,CARLOS"},
                          {id:3,grupo:"TALLER",nombre:"GOROCITO,WALTER"},
                          {id:4,grupo:"TALLER",nombre:"VICENTE,JORGE"},
                          {id:5,grupo:"TALLER",nombre:"PERALTA,MARCELO"},
                          {id:6,grupo:"TALLER",nombre:"LELLI,CRISTIAN"},
                          {id:7,grupo:"TALLER",nombre:"CAROSSIA,GUSTAVO"},
                          {id:8,grupo:"BIBLIOTECA",nombre:"PERIN,CLAUDIA"},
                          {id:9,grupo:"BIBLIOTECA",nombre:"PLEVANI,ANGELICA"},
                          {id:10,grupo:"INTERNADO",nombre:"RODRIGUE,ALEX"},
                          {id:11,grupo:"INTERNADO",nombre:"CAYUELA,NICOLAS"},
                          {id:12,grupo:"INTERNADO",nombre:"MARCANTONIO;GERMAN"},
                          {id:13,grupo:"INTERNADO",nombre:"LAMBERTUCCI,FRANCISCO"},
                        ];
    
    export default {
        data(){
            return {
                cursos:'',
                loading:false,
                datosCSV:[],
                matriculas:[],
                courseSelected:[],
                idCourseSelected:'',
                itemsPerPage:10,
                dialogFactory:false,
                dialogLibrary:false,
                dialogPaid:false,
                dialogBedroom:false,
                loadfile: false,
                opEstados:[],
                tlResponsables:[],
                cpResponsables:[],
                blResponsables:[],
                intResponsables:[],
                itemSelected:{},
                headers:[
                    { title:'Id',align:'start',sortable:false,key:'id' },
                    { title:'IdHex',align:'center',sortable:false,key:'idhex'},
                    { title:'Año', align:'center',sortable:false,key:'Año'},
                    { title:'Division',align:'center',sortable:false,key:'División'},
                    { title:'Curso',align:'center',sortable:true,key:'Curso'},
                    // { title:'Curso Id hex',align:'center',sortable:false,key:'curidhex' ,class:'hidden' },
                    // { title:'Cod.Plan Est.',align:'left',sortable:false,key:'Código Plan de Estudio'},
                    // { title:'Plan Estudio',align:'left',sortable:false,key:'Plan de Estudio'},
                    { title:'Orden',align:'center',sortable:false,key:'orden'},
                    { title:'Nro.Doc.',align:'center',sortable:false,key:'nro_documento'},
                    { title:'Apellido',align:'left',sortable:true,key:'apellido'},
                    { title:'Nombres',align:'left',sortable:false,key:'nombre'},
                    { title: 'Actions', key: 'actions', sortable: false },
                ]

            }
        },
        methods:{
            async initialize(){
               
                // this.ciclos = myCiclos;
                this.loading = true;
                await this.fetchCursos();
                await this.fetchMatriculas();
                this.opEstados = vEstados;
                this.tlResponsables = vResponsables.filter(elem => elem.grupo == "TALLER");
                this.cpResponsables = vResponsables.filter(elem => elem.grupo == "COOPERADORA");
                this.blResponsables = vResponsables.filter(elem => elem.grupo == "BIBLIOTECA");
                this.intResponsables = vResponsables.filter(elem => elem.grupo == "INTERNADO");

                console.log(this.matriculas);
             },
            fetchCursos: async function (){
                const querySnapshot = await getDocs(collection(db,"cursos"));
                this.cursos = querySnapshot.docs
                                    .map(doc => ({ id:doc.id, ...doc.data() }))
                                    // .sort((a,b) => a.anio.localCompare(b.anio));
                this.loading = false;
            },
            fetchMatriculas:async function(){
                const qrySnapshot = await getDocs(collection(db,"matriculas"));
                this.matriculas = qrySnapshot.docs
                                 .map(doc => ({id:doc.id ,...doc.data()}));
                this.loading = false;
            },
            cursosProps(item){
                return {
                    id : item.id ,
                    ciclo: item.ciclo,
                    division: item.division,
                    anio : item.anio,
                    descripcion: item.descripcion,
                }
            },
            procesarArchivo(event) {
                const archivo = event.target.files[0];
                if (archivo) {
                    Papa.parse(archivo, {
                    header: true, // Usa la primera fila como encabezado
                    complete: (resultados) => {
                        this.datosCSV = resultados.data; // Guardar los datos procesados
                        console.log("Datos procesados:", this.datosCSV);
                    },
                    error: (error) => {
                        console.error("Error al procesar el archivo:", error);
                    }
                    });
                }
            },
            enviarDatos() {
                try {
                    // const respuesta = await axios.post("http://localhost:3000/subir-csv", this.datosCSV);
                    this.datosCSV.forEach((elemento) => { 
                            addDoc(collection(db,"matriculas"),elemento);  
                            console.log("=>" + elemento.idhex );
                        
                    }) 
                    alert("Datos subidos con éxito: " + respuesta.data.message);
                } catch (error) {
                    console.error("Error al subir datos:", error);
                    alert("Error al subir los datos." );
                }
            },
            onChange(value){
                // 

                console.log(value);
            },
            emitManualChange() {
                const newValue = this.idCourseSelected;
                // this.selectedOption = newValue; // Actualizar el modelo
                // this.$emit('change', newValue); // Emitir el evento manualmente
                console.log('Cambio manual emitido:', newValue);
                this.courseSelected = this.matriculas.filter(elem => elem.curidhex == newValue)
                console.log(this.courseSelected);
            },
            editFactory(item){
                console.log(item);
                this.itemSelected = item;
                this.dialogFactory = true;

            },
            closeFactory(){
                this.itemSelected = null;
                this.dialogFactory = false;
            },
            editBiblioteca(item){
                this.itemSelected = item;
                this.dialogBiblioteca = true;
            },
            closeBiblioteca(){
                this.itemSelected = null;
                this.dialogBiblioteca = false;
            },
            editCooperadora(item){
                this.itemSelected = item;
                this.dialogCooperadora = true;
            },
            closeCooperadora(){
                this.itemSelected = null;
                this.dialogCooperadora = false;
            },
            editInternado(item){
                this.itemSelected = item;
                this.dialogInternado = true;
            },
            closeInternado(){
                this.itemSelected = null;
                this.dialogInternado = false;
            }
        },
        created(){
            this.initialize();
        },
    }
</script>

<style scoped>

.hidden {
    display: none;
}
</style>