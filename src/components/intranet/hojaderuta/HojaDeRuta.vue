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
                <v-col cols="3">
                    <v-btn color="blue-darken-3" @click="emitManualChange" icon ="mdi-folder-search-outline" title="Buscar"></v-btn> 
                    <v-btn color="blue-darken-2" @click="showModalResponsables" icon="mdi mdi-account-group" title="Responsables"></v-btn>
                </v-col>
                
                <v-dialog v-model="dialogDependencias" max-width="800px">
                        <v-card>
                            <v-card-title class="text-h5" color="red-accent-4">
                                Responsables de Dependencias
                            </v-card-title>
                            <v-card-text>
                                <!-- v-select 
                                        label="Seleccione Dependencia" 
                                        :items="dependencias" 
                                        item-title="text"
                                        item-value="id"
                                        v-model="idDependenciaSelected"
                                        @change="changeDependencia"
                                ></v-select-->
                                <v-data-table :items="responsables" :headers="headerDeps"> 
                                    <template v-slot:item.actions="{ item }">
                                        <div class="d-flex ga-2 justify-end">
                                        <v-icon color="green-darken-2" icon="mdi-pencil" size="small" @click="edit(item.id)"></v-icon>
                                        <v-icon color="red-darken-4" icon="mdi-delete" size="small" @click="remove(item.id)"></v-icon>
                                        </div>
                                    </template>
                                </v-data-table>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                    <v-btn color="red-accent-4" variant="text" @click="closeModalResponsables" icon="mdi-close-circle-outline"></v-btn>
                                     <v-btn color="blue-darken-4" variant="text" @click="saveResponsables" icon="mdi-content-save-settings"></v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                        </v-card>
                </v-dialog>
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
                                                    item-value ="tag"
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
                                                    item-value ="cursoid"
                                                    v-model="matriculaEdited.bl_responsable"
                                                    required
                                                ></v-select>
                                            </v-col>

                                            <v-col cols="12" md="6" sm="6">
                                                <v-select
                                                    label="Condición"
                                                    :items="opEstados"
                                                    item-title="tag"
                                                    item-value ="tag"
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
                                                    item-value ="cursoid"
                                                    v-model="matriculaEdited.coop_responsable"
                                                    required
                                                ></v-select>
                                            </v-col>

                                            <v-col cols="12" md="3" sm="3">
                                                <v-select
                                                    label="Condición"
                                                    :items="opEstados"
                                                    item-title="tag"
                                                    item-value ="tag"
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
                                                    item-value ="cursoid"
                                                    v-model="matriculaEdited.int_responsable"
                                                    required
                                                ></v-select>
                                            </v-col>

                                            <v-col cols="12" md="6" sm="6">
                                                <v-select
                                                    label="Condición"
                                                    :items="opEstados"
                                                    item-title="tag"
                                                    item-value ="tag"
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

                            <v-dialog v-model="dialogHdr" max-width="1320px" max-height="980px">
                                <v-card>
                                    <v-card-title class="text-h5 text-center">
                                        
                                    </v-card-title>
                                    <v-card-text>
                                        <div ref="pdfComp" id="templatePdf">
                                            <TemplateHdr :matricula="matriculaEdited" :ciclo="ciclo">
                                            </TemplateHdr>
                                        </div>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                                <v-btn color="red-accent-4" variant="text" @click="closeHdr" icon="mdi-close-circle-outline"></v-btn>
                                                <v-btn color="blue-darken-4" variant="text" @click="doPdf" icon="mdi-printer-outline"></v-btn>
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
                            color="light-green-lighten-1"
                            @click="editCooperadora(item)"
                            title="Cooperadora">mdi-account-cash-outline
                        </v-icon>
                        <v-icon
                                class="me-2"
                                size="small"
                                color="orange-lighten-1"
                                @click="editInternado(item)"
                                title="Internado">mdi-bed-single-outline
                        </v-icon>
                        <v-icon
                                class="me-2"
                                size="small"
                                color="red-darken-4"
                                @click="showHojaDeRuta(item)"
                                title="PDF">mdi mdi-file-pdf-box
                        </v-icon>
                    </template>
                </v-data-table>
            </v-row>
            <v-spacer></v-spacer>
    </v-container>
</template>


<script>

    import { db } from '../../../firebaseConfig';
    import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';

    import Papa from "papaparse"; // Importar PapaParse para procesar CSV
    // import axios from "axios"; // Axios para enviar datos al backend

    import { jsPDF } from "jspdf";

    import html2canvas from 'html2canvas';

    import plantillaHTML from '@/assets/plantillas/hdr.html?raw';
    
    import TemplateHdr from './TemplateHdr.vue';
    import firmaIpet from '@/assets/plantillas/images/image1.png'
    import selloIpet from '@/assets/plantillas/images/image2.png'


    const vEstados = [{id:1,tag:"COMPLETO",key:"CO"},{id:2,tag:"PENDIENTE",key:"PE"},{id:3,tag:"NO CORRESPONDE",key:"NC"}];
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];
   

    const vResponsables = [{id:1,grupo:"COOPERADORA",nombre:"GRIGHINI,CAMILA"},
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

    const vHeaderDependencias =[
                { title: "Id Dependencia", align: "start", sortable: false, key: "id" },
                { title: "Dependencia", align: "center", sortable: false, key: "grupo" },
                { title: "Responsable", align: "center", sortable: false, key: "nombre" },
                { title: "Actions", key: "actions", sortable: false },
            ];

    export default {
    components:{
        TemplateHdr
    },
    data() {
        return {
            cursos: "",
            loading: false,
            datosCSV: [],
            matriculas: [],
            courseSelected: [],
            idCourseSelected: "",
            itemsPerPage: 10,
            dialogFactory: false,
            dialogLibrary: false,
            dialogCooperadora: false,
            dialogInternado: false,
            dialogHdr: false,
            loadfile: false,
            opEstados: [],
            tlResponsables: [],
            cpResponsables: [],
            blResponsables: [],
            intResponsables: [],
            matriculaSelected: {},
            editedIndex: 0,
            matriculaEdited: {},
            ciclo:'',
            headers: [
                { title: "Id", align: "start", sortable: false, key: "id" },
                { title: "Curso", align: "center", sortable: false, key: "curidhex" },
                { title: "Año", align: "center", sortable: false, key: "Año" },
                { title: "Division", align: "center", sortable: false, key: "División" },
                { title: "Curso", align: "center", sortable: true, key: "Curso" },
                // { title:'Curso Id hex',align:'center',sortable:false,key:'curidhex' ,class:'hidden' },
                // { title:'Cod.Plan Est.',align:'left',sortable:false,key:'Código Plan de Estudio'},
                // { title:'Plan Estudio',align:'left',sortable:false,key:'Plan de Estudio'},
                { title: "Orden", align: "center", sortable: false, key: "orden" },
                { title: "Nro.Doc.", align: "center", sortable: false, key: "nro_documento" },
                { title: "Apellido", align: "left", sortable: true, key: "apellido" },
                { title: "Nombres", align: "left", sortable: false, key: "nombre" },
                { title: "Actions", key: "actions", sortable: false },
            ],
            HTML_template: "",
            userData: null,
            imprimible:'',
            fecha:{},
            DIA:'',
            MES:'',
            ANIO:'',
            dialogDependencias:false,
            responsables: [],
            dependencias:[{id:1,text:"Cooperadora"},{id:2,text:"Taller"},{id:3,text:"Internado"},{id:4,text:"Biblioteca"}],
            idDependenciaSelected:"",
            headerDeps:vHeaderDependencias,
        };
    },
    methods: {
        async initialize() {
            // this.ciclos = myCiclos;
            this.loading = true;
            await this.fetchCursos();
            await this.fetchMatriculas();
            this.opEstados = vEstados;
            this.tlResponsables = vResponsables.filter(elem => elem.grupo == "TALLER");
            this.cpResponsables = vResponsables.filter(elem => elem.grupo == "COOPERADORA");
            this.blResponsables = vResponsables.filter(elem => elem.grupo == "BIBLIOTECA");
            this.intResponsables = vResponsables.filter(elem => elem.grupo == "INTERNADO");
            this.responsables = vResponsables;
            this.HTML_template = plantillaHTML;
            // console.log(this.matriculas);
        },
        fetchCursos: async function () {
            const querySnapshot = await getDocs(collection(db, "cursos"));
            this.cursos = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => a.anio - b.anio);
            this.loading = false;
        },
        fetchMatriculas: async function () {
            const qrySnapshot = await getDocs(collection(db, "matriculas"));
            this.matriculas = qrySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => a.matriculaid - b.matriculaid);
            this.loading = false;
        },
        cursosProps(item) {
            return {
                id: item.cursoid,
                ciclo: item.ciclo,
                division: item.division,
                anio: item.anio,
                descripcion: item.descripcion,
            };
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
                    addDoc(collection(db, "matriculas"), elemento);
                    console.log("=>" + elemento.idhex);
                });
                alert("Datos subidos con éxito: " + respuesta.data.message);
            }
            catch (error) {
                console.error("Error al subir datos:", error);
                alert("Error al subir los datos.");
            }
        },
        onChange(value) {
            console.log(value);
        },
        emitManualChange() {
            const newValue = this.idCourseSelected;
            const index = this.cursos.findIndex(x => x.id == newValue);
            console.log("Cambio manual emitido:", newValue);
            this.courseSelected = this.matriculas.filter(elem => elem.curidhex == this.cursos[index].cursoid);
            console.log(this.courseSelected);
        },
        editFactory(item) {
            /**
             * Se invoca desde el icono factory del datatable: selecciona el registro actual[item]
             */
            console.log("Edit Factory:");
            let matricula = this.matriculas.find(x => x.matriculaid === item.matriculaid);
            this.matriculaSelected = this.matriculas.findIndex(x => x.matriculaid === item.matriculaid);
            this.matriculaEdited = { ...matricula };
            this.dialogFactory = true;
        },
        async saveFactory() {
            if (this.matriculaSelected > -1) {
                await this.updateFactory();
            }
            else {
                // await this.create();
                console.log("Create");
            }
            this.closeFactory();
            await this.fetchMatriculas();
        },
        async updateFactory() {
            // Update
            try {
                Object.assign(this.matriculas[this.matriculaSelected], this.matriculaEdited);
                await updateDoc(doc(db, "matriculas", this.matriculaEdited.id), this.matriculaEdited);
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        },
        closeFactory() {
            this.dialogFactory = false;
        },
        async saveLibrary() {
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
        editLibrary(item) {
            console.log("Edit Library:");
            let matricula = this.matriculas.find(x => x.matriculaid === item.matriculaid);
            this.matriculaSelected = this.matriculas.findIndex(x => x.matriculaid === item.matriculaid);
            this.matriculaEdited = { ...matricula };
            this.dialogLibrary = true;
        },
        async updateLibrary() {
            // Update
            try {
                Object.assign(this.matriculas[this.matriculaSelected], this.matriculaEdited);
                await updateDoc(doc(db, "matriculas", this.matriculaEdited.id), this.matriculaEdited);
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        },
        closeLibrary() {
            this.dialogLibrary = false;
        },
        async saveCooperadora() {
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
        async updateCooperadora() {
            // Update
            try {
                Object.assign(this.matriculas[this.matriculaSelected], this.matriculaEdited);
                await updateDoc(doc(db, "matriculas", this.matriculaEdited.id), this.matriculaEdited);
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        },
        editCooperadora(item) {
            /**
             * Se invoca desde el icono factory del datatable: selecciona el registro actual[item]
             */
            console.log("Edit Cooperadora:");
            let matricula = this.matriculas.find(x => x.matriculaid === item.matriculaid);
            this.matriculaSelected = this.matriculas.findIndex(x => x.matriculaid === item.matriculaid);
            this.matriculaEdited = { ...matricula };
            this.dialogCooperadora = true;
        },
        closeCooperadora() {
            this.dialogCooperadora = false;
        },
        async saveInternado() {
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
        async updateInternado() {
            // Update
            try {
                Object.assign(this.matriculas[this.matriculaSelected], this.matriculaEdited);
                await updateDoc(doc(db, "matriculas", this.matriculaEdited.id), this.matriculaEdited);
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        },
        editInternado(item) {
            console.log("Edit Internado:");
            let matricula = this.matriculas.find(x => x.matriculaid === item.matriculaid);
            this.matriculaSelected = this.matriculas.findIndex(x => x.matriculaid === item.matriculaid);
            this.matriculaEdited = { ...matricula };
            this.dialogInternado = true;
            console.log(this.matriculaEdited);
        },
        closeInternado() {
            this.dialogInternado = false;
        },
        async showHojaDeRuta(item) {
            console.log("Show Dialogo Hoja De Ruta");
            let matricula = this.matriculas.find(x => x.matriculaid === item.matriculaid);
            this.matriculaSelected = this.matriculas.findIndex(x => x.matriculaid === item.matriculaid);
            this.matriculaEdited = { ...item };
            console.log(this.matriculaEdited);
            this.ciclo = (this.matriculaEdited.Año <4)? "Primer Ciclo":"Segundo Ciclo";
            this.dialogHdr = true;
        },
        closeHdr() {
            this.dialogHdr = false;
        },
        async printHdr() {

           const hdrPdf = this.$refs.pdfComp;

           // const imprimible = document.getElementById('printPdf')
           // imprimible.appendChild(hdrPdf)
           /*
            const element = document.getElementById('pdfContent');
           */
            /*
                const opt = {
                        margin: 10 ,
                        filename:'hdr.pdf',
                        image: { type:'jpeg',quality:0.98 },
                        html2canvas: { scale : 2 , dpi : 400 , letterRendering: true },
                        jsPDF: { unit:'mm',format:'a4',orientation:'landscape'}
                };

                html2pdf().from(contenidoPdf).set(opt).save();
            */

            const canvas = await html2canvas(hdrPdf,{allowTaint:true }) ; 

            const imgData = canvas.toDataURL('image/jpg',1.0);

            const docPdf = new jsPDF('l','mm','a4')

            const pdfWidth = docPdf.internal.pageSize.getWidth();
            const pdfHeight = docPdf.internal.pageSize.getHeight();

            const imgProps = docPdf.getImageProperties(imgData);
            const imgWidth = pdfWidth * 0.9 // 90% del ancho A4
            const imgHeight = ((imgProps.height * imgWidth) / imgProps.width) ;


            const x = (pdfWidth - imgWidth) / 2 ;
            const y = ((pdfHeight - imgHeight) / 2) ;

            // docPdf.line(0, y , pdfWidth, y );
            docPdf.addImage(imgData,'PNG',x,y,imgWidth,imgHeight )

            docPdf.save('Hdr.pdf')
        },
    
        doPdf(){
            const pdfDoc = new jsPDF('l','mm','A4');
            pdfDoc.setFont("helvetica", "bold");
            pdfDoc.text("Hoja de Ruta",130,20);
            pdfDoc.setFont("helvetica", "normal");
            pdfDoc.text("Instituto Provincial de Educación Técnica N° 51 \"Nicolas Avellaneda\" ", 60, 30);

            pdfDoc.setFont("helvetica", "bold");
            pdfDoc.setFontSize(10);
            pdfDoc.text("Estudiante",30,50);
            pdfDoc.text("Curso-Division",90,50);
            pdfDoc.text("Condición",140,50);
            pdfDoc.text("Ciclo",180,50);
            pdfDoc.text("Especialidad",230,50);
            pdfDoc.line(10, 52, 280, 52); 
            pdfDoc.setFont("helvetica", "italic");
            pdfDoc.setFontSize(8);
            pdfDoc.text(this.matriculaEdited.apellido + "," + this.matriculaEdited.nombre,40,56,null,null,"center");
            pdfDoc.text(this.matriculaEdited.Curso ,100,56,null,null,"center");
            pdfDoc.text(this.ciclo,185,56,null,null,"center");
            pdfDoc.text("Regular",148,56,null,null,"center");
            pdfDoc.text(this.matriculaEdited.plan_estudio,240,56,null,null,"center");
            pdfDoc.setFontSize(6);
            pdfDoc.text("El estudiante entrega todos los elementos a cargo y cancela los compromisos con las siguientes observaciones",140,65,null,null,"center");
            pdfDoc.setFontSize(10);
            pdfDoc.setFont("helvetica", "bold");
            pdfDoc.text("V°B° Cooperadora",30,80);
            pdfDoc.text("V°B° Taller-Laboratorio",90,80);
            pdfDoc.text("V°B° Internado",160,80);
            pdfDoc.text("V°B° Biblioteca",220,80);
            pdfDoc.setFont("helvetica", "normal");
            pdfDoc.line(22, 82, 260, 82);
            pdfDoc.text(this.matriculaEdited.coop_condicion,35,88);
            pdfDoc.text("Cuotas Pendientes:" + this.matriculaEdited.coop_cuotas ,28,95);

            pdfDoc.text(this.matriculaEdited.tl_condicion,96,88);
            pdfDoc.text(this.matriculaEdited.int_condicion,162,88);
            pdfDoc.text(this.matriculaEdited.bl_condicion,222,88);

            pdfDoc.setLineDash([0.5]);
            pdfDoc.line(22, 98, 260, 98);
            pdfDoc.setFont("helvetica", "normal");
            pdfDoc.setFontSize(8);
            pdfDoc.text(this.matriculaEdited.coop_responsable,28,104);
            pdfDoc.text(this.matriculaEdited.tl_responsable,88,104);
            pdfDoc.text(this.matriculaEdited.int_responsable,158,104);
            pdfDoc.text(this.matriculaEdited.bl_responsable,218,104);

            pdfDoc.setLineDash([0]);
            pdfDoc.line(22, 120, 120, 120);
            pdfDoc.setFontSize(6);
            pdfDoc.text("Firma Padre/Madre/Tutor",56,123);

            pdfDoc.line(160, 120, 260, 120);
            pdfDoc.setFontSize(6);
            pdfDoc.text("Firma Estudiante",196,123);

            pdfDoc.rect(10,138,270,52);
            pdfDoc.setFontSize(10);
            pdfDoc.text("Autoridad Competente",12,144);
            pdfDoc.text("El estudiante ha cancelado los compromisos el dia: " + this.fechaEntrega , 12,162);
            pdfDoc.text("Marcos Juarez , " + this.DIA + " de " + this.MES + " de " + this.ANIO , 12,182);
            
            
            pdfDoc.setFontSize(6);
            pdfDoc.addImage(firmaIpet,200,140,40,50)
            pdfDoc.addImage(selloIpet,240,140,40,50)
            pdfDoc.text("Sello y Firma",240,186);
            pdfDoc.text("Nota: la presente hoja de ruta deb presentarse ante la autoridad escolar con el V°B° de todas las dependencias",12,194);

            var pdfName = "HDR_" + this.matriculaEdited.apellido + "_" + this.matriculaEdited.nombre + ".pdf";
            pdfDoc.save(pdfName);

        },
        async cargarDocumento() {
            this.signIn();
            this.initClient();
            this.signOut();

        },
        async initClient() {
            gapi.load("client:auth2", async () => {
                await gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    scope: SCOPES,
                    discoveryDocs: ["https://docs.googleapis.com/$discovery/rest?version=v1"],
                });
                const authInstance = gapi.auth2.getAuthInstance();
                isAuthenticated.value = authInstance.isSignedIn.get();
                authInstance.isSignedIn.listen((status) => {
                    isAuthenticated.value = status;
                });
            });
        },
        // Iniciar sesión con Google
        async signIn() {
            await gapi.auth2.getAuthInstance().signIn();
        },
        // Cerrar sesión
        signOut() {
            gapi.auth2.getAuthInstance().signOut();
            isAuthenticated.value = false;
        },
        showModalResponsables(){
            this.dialogDependencias = true;
        },
        closeModalResponsables(){
            this.dialogDependencias = false;
        },
        saveResponsables(){
            console.log("Guardar Responsables");
            this.closeModalResponsables();
        },
        changeDependencia(value){
            this.idDependenciaSelected = value;
            this.responsables = vResponsables.filter(elem => (elem.grupo == this.idDependenciaSelected))
            console.log(this.responsables);
        }
    },
    created() {
        this.initialize();
        this.fecha = new Date();
        this.DIA = this.fecha.getDate();
        this.MES = meses[this.fecha.getMonth()];
        this.ANIO = this.fecha.getFullYear();
    },
    computed: {
        alumno() {
            return this.matriculaSelected.apellido + " , " + this.matriculaSelected.nombre;
        },
        fechaEntrega(){
            return this.fecha.toLocaleDateString('es-AR');
        }
    },
    mounted() {
    },
    components: { TemplateHdr }
}

</script>

<style scoped>
    @page{
        height: 297mm;
        width:  210mm;
    }
    .hidden {
        display: none;
    }

    .pt-160{
        padding-top: 160px;
    }
</style>
