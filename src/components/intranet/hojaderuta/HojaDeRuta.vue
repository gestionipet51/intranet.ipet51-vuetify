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
                    <v-btn color="blue-darken-3" @click="emitManualChange" icon ="mdi-folder-search-outline" title="Buscar"> 
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

                        <v-dialog v-model="dialogFactory" max-width="600px">
                            <v-card>
                                <v-card-title class="text-h5" color="red-accent-4">Hoja de Ruta - Registro de Taller : {{ matriculaEdited.apellido }} , {{ matriculaEdited.nombre }} 

                                </v-card-title>
                                <v-card-text>
                                    <v-row dense>
                                        <v-col cols="12" md="6" sm="6">
                                            <v-select
                                                label="Responsable"
                                                :items="tlResponsables"
                                                item-title="nombre" 
                                                item-value ="cursoid"        
                                                v-model="matriculaEdited.tl_responsable"
                                                required
                                            ></v-select>
                                        </v-col>

                                        <v-col cols="12" md="6" sm="6">
                                            <v-select
                                                label="Condición"
                                                :items="opEstados"
                                                item-title="tag" 
                                                item-value ="id"        
                                                v-model="matriculaEdited.tl_condicion"
                                                required
                                            ></v-select>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                        <v-btn color="red-accent-4" variant="text" @click="closeFactory" 
                                               icon="mdi-close-circle-outline"></v-btn>
                                        <v-btn color="blue-darken-4" variant="text" @click="saveFactory" icon="mdi-content-save-settings"></v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-dialog v-model="dialogLibrary" max-width="600px">
                            <v-card>
                                <v-card-title class="text-h5">
                                    Hoja de Ruta - Registro de Biblioteca : {{ matriculaEdited.apellido }} , {{ matriculaEdited.nombre }} 
                                </v-card-title>
                                <v-card-text>
                                    <v-row dense>
                                        <v-col cols="12" md="6" sm="6">
                                            <v-select
                                                label="Responsable"
                                                :items="blResponsables"
                                                item-title="nombre" 
                                                item-value ="id"        
                                                v-model="matriculaEdited.bl_responsable"
                                                required
                                            ></v-select>
                                        </v-col>

                                        <v-col cols="12" md="6" sm="6">
                                            <v-select
                                                label="Condición"
                                                :items="opEstados"
                                                item-title="tag" 
                                                item-value ="id"        
                                                v-model="matriculaEdited.bl_condicion"
                                                required
                                            ></v-select>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                        <v-btn color="red-accent-4" variant="text" @click="closeLibrary" icon="mdi-close-circle-outline"></v-btn>
                                        <v-btn color="blue-darken-4" variant="text" @click="saveLibrary" icon="mdi-content-save-settings"></v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-dialog v-model="dialogCooperadora" max-width="700px">
                            <v-card>
                                <v-card-title class="text-h5">
                                    Hoja de Ruta - Registro de Cooperadora : {{ matriculaEdited.apellido }} , {{ matriculaEdited.nombre }} 
                                </v-card-title>
                                <v-card-text>
                                    <v-row dense>
                                        <v-col cols="12" md="6" sm="6">
                                            <v-select
                                                label="Responsable"
                                                :items="cpResponsables"
                                                item-title="nombre" 
                                                item-value ="id"        
                                                v-model="matriculaEdited.coop_responsable"
                                                required
                                            ></v-select>
                                        </v-col>

                                        <v-col cols="12" md="3" sm="3">
                                            <v-select
                                                label="Condición"
                                                :items="opEstados"
                                                item-title="tag" 
                                                item-value ="id"        
                                                v-model="matriculaEdited.coop_condicion"
                                                required
                                            ></v-select>
                                        </v-col>

                                        <v-col cols="12" md="3" sm="3">
                                            <v-text-field label="Cuotas Pendientes" v-model="matriculaEdited.coop_cuotas"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                        <v-btn color="red-accent-4" variant="text" @click="closeCooperadora" icon="mdi-close-circle-outline"></v-btn>
                                        <v-btn color="blue-darken-4" variant="text" @click="saveCooperadora" icon="mdi-content-save-settings"></v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-dialog v-model="dialogInternado" max-width="600px">
                            <v-card>
                                <v-card-title class="text-h5">
                                    Hoja de Ruta - Registro de Internado : {{ matriculaEdited.apellido }} , {{ matriculaEdited.nombre }} 
                                </v-card-title>
                                <v-card-text>
                                    <v-row dense>
                                        <v-col cols="12" md="6" sm="6">
                                            <v-select
                                                label="Responsable"
                                                :items="intResponsables"
                                                item-title="nombre" 
                                                item-value ="id"        
                                                v-model="matriculaEdited.int_responsable"
                                                required
                                            ></v-select>
                                        </v-col>

                                        <v-col cols="12" md="6" sm="6">
                                            <v-select
                                                label="Condición"
                                                :items="opEstados"
                                                item-title="tag" 
                                                item-value ="id"        
                                                v-model="matriculaEdited.int_condicion"
                                                required
                                            ></v-select>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                        <v-btn color="red-accent-4" variant="text" @click="closeInternado" icon="mdi-close-circle-outline"></v-btn>
                                        <v-btn color="blue-darken-4" variant="text" @click="saveInternado" icon="mdi-content-save-settings"></v-btn>
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
                        title="Taller">mdi-factory
                    </v-icon>
                    <v-icon
                        class="me-2"
                        size="small"
                        color="teal-darken-3"
                        @click="editLibrary(item)"
                        title="Biblioteca">mdi-library
                    </v-icon>
                    <v-icon
                        class="me-2"
                        size="small"
                        color="red-accent-4"
                        @click="editCooperadora(item)"
                        title="Cooperadora">mdi-account-cash-outline
                    </v-icon>
                    <v-icon
                            class="me-2"
                            size="small"
                            color="deep-purple-accent-3"
                            @click="editInternado(item)"
                            title="Internado">mdi-bed-single-outline
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

    const vEstados = [{id:1,tag:"COMPLETO",key:"CO"},{id:2,tag:"PENDIENTE",key:"PE"},{id:3,tag:"NO CORRESPONDE",key:"NC"}];

    
    const vResponsables = [{id:1,grupo:"COOPERADORA",nombre:"PERALTA,FLORENCIA"},
                          {id:2,grupo:"TALLER",nombre:"LAZZARO MATAR,CARLOS"},
                          {id:3,grupo:"TALLER",nombre:"GOROCITO,WALTER"},
                          {id:4,grupo:"TALLER",nombre:"VICENTE,JORGE"},
                          {id:5,grupo:"TALLER",nombre:"PERALTA,MARCELO"},
                          {id:6,grupo:"TALLER",nombre:"LELLI,CRISTIAN"},
                          {id:7,grupo:"TALLER",nombre:"CAROSSIA,GUSTAVO"},
                          {id:8,grupo:"BIBLIOTECA",nombre:"PERIN,CLAUDIA"},
                          {id:9,grupo:"BIBLIOTECA",nombre:"PLEVANI,ANGELICA"},
                          {id:10,grupo:"INTERNADO",nombre:"RODRIGUEZ,ALEX"},
                          {id:11,grupo:"INTERNADO",nombre:"CAYUELA,NICOLAS"},
                          {id:12,grupo:"INTERNADO",nombre:"MARCANTONIO,GERMAN"},
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
                dialogCooperadora:false,
                dialogInternado:false,
                loadfile: false,
                opEstados:[],
                tlResponsables:[],
                cpResponsables:[],
                blResponsables:[],
                intResponsables:[],
                matriculaSelected:{},
                editedIndex:0,
                matriculaEdited:{},
                headers:[
                    { title:'Id',align:'start',sortable:false,key:'id' },
                    { title:'Curso',align:'center',sortable:false,key:'curidhex'},
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

                // console.log(this.matriculas);
             },
            fetchCursos: async function (){
                const querySnapshot = await getDocs(collection(db,"cursos"));
                this.cursos = querySnapshot.docs
                                    .map(doc => ({ id:doc.id, ...doc.data() }))
                                    .sort((a,b) => a.anio - b.anio)
                this.loading = false;
            },
            fetchMatriculas:async function(){
                const qrySnapshot = await getDocs(collection(db,"matriculas"));
                this.matriculas = qrySnapshot.docs
                                 .map(doc => ({id:doc.id ,...doc.data()}))
                                 .sort((a,b)=> a.matriculaid - b.matriculaid );
                this.loading = false;
            },
            cursosProps(item){
                return {
                    id : item.cursoid ,
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
                const index = this.cursos.findIndex(x => x.id == newValue);
                console.log('Cambio manual emitido:', newValue);
                this.courseSelected = this.matriculas.filter(elem => elem.curidhex == this.cursos[index].cursoid);
                console.log(this.courseSelected);
            },

            editFactory(item){
                /**
                 * Se invoca desde el icono factory del datatable: selecciona el registro actual[item]
                 */
                console.log("Edit Factory:");
                let matricula  = this.matriculas.find(x => x.matriculaid === item.matriculaid );
                this.matriculaSelected = this.matriculas.findIndex(x => x.matriculaid === item.matriculaid );
                this.matriculaEdited = {...matricula};
                this.dialogFactory = true;
            },

            async saveFactory() {

                if (this.matriculaSelected  > -1) {
                    await this.updateFactory();
                }
                else {
                    // await this.create();
                    console.log("Create");
                }
                this.closeFactory();
                await this.fetchMatriculas();
            },


            async updateFactory(){
                // Update
                try {
                    Object.assign(this.matriculas[this.matriculaSelected], this.matriculaEdited);
                    await updateDoc(doc(db,"matriculas", this.matriculaEdited.id) , this.matriculaEdited );
                    return true;                    
                } catch (error) {
                    console.log(error);
                    return false;
                }
            },
            closeFactory(){
                this.dialogFactory = false;
            },
            async saveLibrary(){
                if (this.editedIndex > -1) {
                    await this.updateLibrary();
                }
                else {
                    // await this.create();
                    console.log("Create Library");
                }
                this.closeLibrary();
                await this.fetchMatriculas();
            },
            editLibrary(item){
                console.log("Edit Library:");
                let matricula  = this.matriculas.find(x => x.matriculaid === item.matriculaid );
                this.matriculaSelected = this.matriculas.findIndex(x => x.matriculaid === item.matriculaid );
                this.matriculaEdited = {...matricula};
                this.dialogLibrary = true;
            },
            async updateLibrary(){
                // Update

                try {
                    Object.assign(this.matriculas[this.matriculaSelected], this.matriculaEdited);
                    await updateDoc(doc(db,"matriculas", this.matriculaEdited.id) , this.matriculaEdited );
                    return true; 
                    
                } catch (error) {
                    console.log(error);
                    return false;
                }
            },

            closeLibrary(){
                this.dialogLibrary = false;
            },

            async saveCooperadora(){
                if (this.editedIndex > -1) {
                    await this.updateCooperadora();
                }
                else {
                    // await this.create();
                    console.log("Create Cooperadora");
                }
                
                this.closeCooperadora();
                await this.fetchMatriculas();
            },

            async updateCooperadora(){
                // Update
                try {
                    Object.assign(this.matriculas[this.matriculaSelected], this.matriculaEdited);
                    await updateDoc(doc(db,"matriculas", this.matriculaEdited.id) , this.matriculaEdited );
                    return true;                    
                } catch (error) {
                    console.log(error);
                    return false;
                }
            },

            editCooperadora(item){
                /**
                 * Se invoca desde el icono factory del datatable: selecciona el registro actual[item]
                 */
                 console.log("Edit Cooperadora:");
                let matricula  = this.matriculas.find(x => x.matriculaid === item.matriculaid );
                this.matriculaSelected = this.matriculas.findIndex(x => x.matriculaid === item.matriculaid );
                this.matriculaEdited = {...matricula};
                this.dialogCooperadora = true;
            },
            closeCooperadora(){
                this.dialogCooperadora = false;
            },

            async saveInternado(){
                if (this.editedIndex > -1) {
                    await this.updateInternado();
                }
                else {
                    // await this.create();
                    console.log("Create Internado");
                }
                this.closeInternado();
                await this.fetchMatriculas();
            },

            async updateInternado(){
                // Update
                try {
                    Object.assign(this.matriculas[this.matriculaSelected], this.matriculaEdited);
                    await updateDoc(doc(db,"matriculas", this.matriculaEdited.id) , this.matriculaEdited );
                    return true;                    
                } catch (error) {
                    console.log(error);
                    return fa
                }
            },   

            editInternado(item){
                console.log("Edit Internado:");
                let matricula  = this.matriculas.find(x => x.matriculaid === item.matriculaid );
                this.matriculaSelected = this.matriculas.findIndex(x => x.matriculaid === item.matriculaid );
                this.matriculaEdited = {...matricula};
                this.dialogInternado = true;
            },
            closeInternado(){
                this.dialogInternado = false;
            }
        },
        created(){
            this.initialize();
        },
        computed : {
            alumno(){
                return this.matriculaSelected.apellido + " , " + this.matriculaSelected.nombre;
            }
        }
    }

</script>

<style scoped>

.hidden {
    display: none;
}
</style>