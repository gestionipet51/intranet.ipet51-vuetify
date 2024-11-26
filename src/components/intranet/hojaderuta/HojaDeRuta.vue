<template>
    <v-container>
        <v-app-bar :elevation="2"  color="blue-accent-2" class="bottom-round">
            <v-app-bar-nav-icon icon="mdi-playlist-edit"></v-app-bar-nav-icon>
            <v-toolbar-title class="ml-2 text-h6 text-md-h5">Hoja de Ruta</v-toolbar-title>
        </v-app-bar>
        <!--
            <v-row>
                
                    <v-col cols="6">
                        <v-file-input  accept=".csv" label="Subir CSV a Firebase" @change="procesarArchivo"></v-file-input>
                    </v-col>
                        <v-col cols="3">
                            <v-btn :disabled="!datosCSV.length" rounded="lg" @click="enviarDatos" color="indigo-darken-3">
                                Subir Archivo 
                            </v-btn>
                    </v-col>
                </v-row>
        -->

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
                                <v-card-title class="text-h5">Hoja de Ruta: Registro de Taller </v-card-title>
                                <v-card-text>
                                    
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue-darken-1" variant="text" @click="closeFactory">Cancel</v-btn>
                                    <v-btn color="blue-darken-1" variant="text" @click="updateFactory">OK</v-btn>
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
                        @click="editLibrary(item)"
                    >
                        mdi-library
                    </v-icon>
                    <v-icon
                        class="me-2"
                        size="small"
                        color="red-accent-4"
                        @click="editPaid(item)"
                        >
                        mdi-currency-usd
                    </v-icon>
                    <v-icon
                            class="me-2"
                            size="small"
                            color="deep-purple-accent-3"
                            @click="editBedroom(item)"
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

    /*
    const vCondicion = [{id:1,tag:"Completo",key:"COMPLETO"},{id:2,tag:"Pendiente",key:"PENDIENTE"},{id:3,tag:"NO CORRESPONDE",key:"NC"}];

    const vAutorizante = [{id:1,grupo:"COOPERADORA",nombre:"PERALTA,FLORENCIA"},
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
    */
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
                    { title:'Nro.Doc.',align:'center',sortable:false,key:'Nro. Documento'},
                    { title:'Apellido',align:'left',sortable:true,key:'Apellido'},
                    { title:'Nombres',align:'left',sortable:false,key:'Nombre'},
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
                const qrySnapshot = await getDocs(collection(db,"matricula"));
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
                            // addDoc(collection(db,"matricula"),elemento);  
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
                this.dialogFactory = true;

            },
            closeFactory(){
                this.dialogFactory = false;
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