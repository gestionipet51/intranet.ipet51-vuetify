<template>
    <v-container>
        <v-app-bar :elevation="2"  color="blue-accent-2" class="bottom-round">
            <v-app-bar-nav-icon icon="mdi-playlist-edit"></v-app-bar-nav-icon>
            <v-toolbar-title class="ml-2 text-h6 text-md-h5">Hoja de Ruta</v-toolbar-title>
        </v-app-bar>

            <v-row v-if="loadfile == true ">

                <v-expansion-panels variant="accordion">
                    <v-expansion-panel>
                        <v-expansion-panel-title>
                            Actualizar Matricula
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-row align="center">
                                <v-col cols="6" sm="4">
                                    <v-file-input
                                        accept=".csv,text/csv"
                                        label="Seleccionar CSV de matrículas"
                                        hide-details
                                        :disabled="reemplazando"
                                        @change="procesarArchivo">
                                    </v-file-input>
                                </v-col>
                                <v-col cols="6" sm="3" class="d-flex align-center justify-end">
                                    <v-btn
                                        :disabled="!datosCSV.length || reemplazando"
                                        :loading="reemplazando"
                                        rounded="lg"
                                        @click="previsualizarReemplazo"
                                        color="indigo-darken-3">
                                        Revisar reemplazo
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>

                    
            </v-row>

            <v-alert v-if="errorImportacion" type="error" variant="tonal" class="mb-4">
                {{ errorImportacion }}
            </v-alert>
            <v-alert v-if="errorCarga" type="error" variant="tonal" class="mb-4">
                {{ errorCarga }}
                <v-btn class="mt-2" variant="outlined" to="/intranet/login/index">
                    Iniciar sesión
                </v-btn>
            </v-alert>
            <v-alert v-if="mensajeImportacion" type="success" variant="tonal" class="mb-4">
                {{ mensajeImportacion }}
            </v-alert>

            <v-dialog v-model="dialogReemplazoMatriculas" max-width="600px" :persistent="reemplazando">
                <v-card>
                    <v-card-title class="text-h5">Confirmar reemplazo de matrículas</v-card-title>
                    <v-card-text v-if="resumenReemplazo">
                        <p>Se actualizarán {{ resumenReemplazo.actualizadas }} matrículas.</p>
                        <p>Se agregarán {{ resumenReemplazo.nuevas }} matrículas.</p>
                        <p>Se eliminarán {{ resumenReemplazo.eliminadas }} registros que no estén en el CSV.</p>
                        <v-alert type="warning" variant="tonal" class="mt-3">
                            La colección será reemplazada en una única operación atómica. Se conservará el ID
                            técnico existente; las nuevas matrículas recibirán uno nuevo. El curso se asignará
                            según año y división.
                        </v-alert>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn variant="text" :disabled="reemplazando" @click="dialogReemplazoMatriculas = false">
                            Cancelar
                        </v-btn>
                        <v-btn color="red-darken-2" :loading="reemplazando" @click="confirmarReemplazo">
                            Confirmar reemplazo
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

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
                                                    item-title="docente"
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
                                                    item-title="docente"
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
                                                    item-title="docente"
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
                                                    item-title="docente"
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

    import { markRaw } from "vue";
    import { db } from '../../../firebaseConfig';
    import { collection, addDoc, getDocs, getDocsFromServer, doc, deleteDoc, updateDoc, writeBatch, getPersistentCacheIndexManager } from 'firebase/firestore';

    import Papa from "papaparse"; // Importar PapaParse para procesar CSV
    // import axios from "axios"; // Axios para enviar datos al backend

    import { jsPDF } from "jspdf";

    import html2canvas from 'html2canvas';

    import plantillaHTML from '@/assets/plantillas/hdr.html?raw';
    
    import TemplateHdr from './TemplateHdr.vue';
    import firmaIpet from '@/assets/plantillas/images/image1.png'
    import selloIpet from '@/assets/plantillas/images/image2.png'
    import Docentes from '../docentes/Docentes.vue';


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

    const mapeoMatriculas = {
        id: "matriculaid",
        "Año": "Año",
        "División": "División",
        "Curso": "Curso",
        "Código Plan de Estudio": "cod_plan_estudio",
        "Plan de Estudio": "plan_estudio",
        orden: "orden",
        "Nro. Documento": "nro_documento",
        Apellido: "apellido",
        Nombre: "nombre",
        "Fecha Nacimiento": "fecha_nacimiento",
        "Condición Cooperadora": "coop_condicion",
        Cuotas: "coop_cuotas",
        "Responsable Cooperadora": "coop_responsable",
        "Condición Taller Laboratorio": "tl_condicion",
        "Responsable TL": "tl_responsable",
        "Condición Bco Libros": "bl_condicion",
        "Responsable BL": "bl_responsable",
        "Condición Internado": "int_condicion",
        "Responsable Internado": "int_responsable",
        Fecha: "fecha_registro",
    };

    const normalizarClave = (valor) => String(valor ?? "").trim().toLocaleLowerCase();
    const claveCurso = (anio, division) => `${normalizarClave(anio)}|${normalizarClave(division)}`;

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
            dialogReemplazoMatriculas: false,
            resumenReemplazo: null,
            reemplazoMatriculas: null,
            reemplazando: false,
            errorImportacion: "",
            errorCarga: "",
            mensajeImportacion: "",
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
            idDependenciaSelected:"",
            headerDeps:vHeaderDependencias,
            dependencias:[],
            miembrosdependencias:[],
        };
    },
    methods: {
        async initialize() {
            this.loading = true;
            this.errorCarga = "";
            try {
                await Promise.all([
                    this.fetchCursos(),
                    this.fetchMatriculas(),
                    this.fetchDependencias(),
                    this.fetchMiembrosDependencias(),
                ]);

                this.opEstados = vEstados;
                this.responsables = vResponsables;
                this.HTML_template = plantillaHTML;
                this.tlResponsables = this.miembrosdependencias.filter((elem) => (elem.dependenciaID == (this.dependencias.find(dep => dep.key == "TLA")).id));
                this.tlResponsables.forEach(el => { el.docente = el.apellido + "," + el.nombres; });
                this.cpResponsables = this.miembrosdependencias.filter((elem) => (elem.dependenciaID == (this.dependencias.find(dep => dep.key == "COO")).id));
                this.cpResponsables.forEach(el => { el.docente = el.apellido + "," + el.nombres; });
                this.blResponsables = this.miembrosdependencias.filter((elem) => (elem.dependenciaID == (this.dependencias.find(dep => dep.key == "BBL")).id));
                this.blResponsables.forEach(el => { el.docente = el.apellido + "," + el.nombres; });
                this.intResponsables = this.miembrosdependencias.filter((elem) => (elem.dependenciaID == (this.dependencias.find(dep => dep.key == "INT")).id));
                this.intResponsables.forEach(el => { el.docente = el.apellido + "," + el.nombres; });
            } catch (error) {
                console.error("No se pudo cargar Hoja de Ruta.", error);
                this.errorCarga = error.code === "permission-denied"
                    ? "No tienes permiso para consultar matrículas. Inicia sesión con una cuenta de editor."
                    : `No se pudo cargar Hoja de Ruta: ${error.message}`;
            } finally {
                this.loading = false;
            }
        },
        fetchCursos: async function () {
            const querySnapshot = await getDocs(collection(db, "cursos"));
            this.cursos = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => a.anio - b.anio);
        },
        fetchMatriculas: async function () {
            const qrySnapshot = await getDocs(collection(db, "matriculas"));
            this.matriculas = qrySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => a.matriculaid - b.matriculaid);
        },
        fetchDependencias: async function(){
            const qrySnapshot = await getDocs(collection(db, "dependencias"));
            this.dependencias = qrySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => a.id - b.id);
        },
        fetchMiembrosDependencias: async function(){
            const qrySnapshot = await getDocs(collection(db, "miembrosdependencia"));
            this.miembrosdependencias = qrySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => a.id - b.id);
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
            const archivo = event?.target?.files?.[0] || (Array.isArray(event) ? event[0] : null);
            this.datosCSV = [];
            this.resumenReemplazo = null;
            this.reemplazoMatriculas = null;
            this.errorImportacion = "";
            this.mensajeImportacion = "";

            if (!archivo) return;

            Papa.parse(archivo, {
                header: true,
                skipEmptyLines: true,
                transformHeader: (header) => header.trim(),
                complete: (resultados) => {
                    if (resultados.errors.length) {
                        this.errorImportacion = `No se pudo leer el CSV: ${resultados.errors[0].message}`;
                        console.error("Error al procesar CSV de matrículas:", resultados.errors);
                        return;
                    }
                    this.datosCSV = resultados.data.filter((fila) =>
                        Object.values(fila).some((valor) => String(valor ?? "").trim() !== "")
                    );
                    if (!this.datosCSV.length) {
                        this.errorImportacion = "El CSV no contiene matrículas.";
                    }
                },
                error: (error) => {
                    this.errorImportacion = `No se pudo leer el CSV: ${error.message}`;
                    console.error("Error al procesar CSV de matrículas:", error);
                }
            });
        },
        async previsualizarReemplazo() {
            this.errorImportacion = "";
            this.mensajeImportacion = "";
            this.reemplazoMatriculas = null;

            try {
                const filas = this.datosCSV;
                if (!filas?.length) throw new Error("Seleccione un CSV con matrículas.");

                const encabezados = Object.keys(filas[0]);
                const esperados = Object.keys(mapeoMatriculas);
                if (encabezados.length !== esperados.length || esperados.some((campo) => !encabezados.includes(campo))) {
                    throw new Error("Los encabezados del CSV no coinciden con el formato de matrículas esperado.");
                }

                const ids = filas.map((fila) => String(fila.id ?? "").trim());
                if (ids.some((id) => !id) || new Set(ids).size !== ids.length) {
                    throw new Error("El CSV contiene IDs vacíos o duplicados.");
                }

                const [matriculasSnapshot, cursosSnapshot] = await Promise.all([
                    getDocsFromServer(collection(db, "matriculas")),
                    getDocsFromServer(collection(db, "cursos"))
                ]);
                const matriculasPorId = new Map();
                for (const matriculaDoc of matriculasSnapshot.docs) {
                    const id = String(matriculaDoc.data().matriculaid ?? "").trim();
                    if (!id) continue;
                    const coincidencias = matriculasPorId.get(id) || [];
                    coincidencias.push(matriculaDoc);
                    matriculasPorId.set(id, coincidencias);
                }

                const idsAmbiguos = ids.filter((id) => (matriculasPorId.get(id) || []).length > 1);
                if (idsAmbiguos.length) {
                    throw new Error(`${idsAmbiguos.length} IDs del CSV tienen más de una coincidencia en Firestore.`);
                }

                const cursosPorClave = new Map();
                for (const cursoDoc of cursosSnapshot.docs) {
                    const curso = cursoDoc.data();
                    const clave = claveCurso(curso.anio, curso.division);
                    const coincidencias = cursosPorClave.get(clave) || [];
                    coincidencias.push(curso);
                    cursosPorClave.set(clave, coincidencias);
                }
                const clavesCurso = filas.map((fila) => claveCurso(fila["Año"], fila["División"]));
                const cursosNoEncontrados = clavesCurso.filter((clave) => {
                    const coincidencias = cursosPorClave.get(clave) || [];
                    return coincidencias.length !== 1 || !coincidencias[0].cursoid;
                }).length;
                if (cursosNoEncontrados) {
                    throw new Error(`${cursosNoEncontrados} filas no tienen un curso único por año y división.`);
                }

                const matriculasExistentes = new Map(ids.map((id) => [id, (matriculasPorId.get(id) || [])[0] || null]));
                const documentosConservados = new Set(
                    [...matriculasExistentes.values()].filter(Boolean).map((matriculaDoc) => matriculaDoc.ref.path)
                );
                const documentosAEliminar = matriculasSnapshot.docs.filter(
                    (matriculaDoc) => !documentosConservados.has(matriculaDoc.ref.path)
                );
                const operaciones = filas.length + documentosAEliminar.length;
                if (operaciones > 500) {
                    throw new Error(`El reemplazo requiere ${operaciones} escrituras; Firestore permite hasta 500 por lote.`);
                }

                const actualizadas = [...matriculasExistentes.values()].filter(Boolean).length;
                const nuevas = filas.length - actualizadas;
                this.reemplazoMatriculas = markRaw({
                    filas,
                    ids,
                    matriculasExistentes,
                    documentosAEliminar,
                    cursosPorClave,
                    clavesCurso,
                });
                this.resumenReemplazo = {
                    actualizadas,
                    nuevas,
                    eliminadas: documentosAEliminar.length,
                };
                this.dialogReemplazoMatriculas = true;
            } catch (error) {
                this.errorImportacion = error.message;
                console.error("Error al validar reemplazo de matrículas:", error);
            }
        },
        async confirmarReemplazo() {
            if (!this.reemplazoMatriculas || this.reemplazando) return;

            this.reemplazando = true;
            this.errorImportacion = "";
            this.mensajeImportacion = "";
            let loteAplicado = false;
            try {
                const plan = this.reemplazoMatriculas;
                const [matriculasActuales, cursosActuales] = await Promise.all([
                    getDocsFromServer(collection(db, "matriculas")),
                    getDocsFromServer(collection(db, "cursos"))
                ]);
                const rutasEsperadas = new Set([
                    ...[...plan.matriculasExistentes.values()].filter(Boolean).map((matriculaDoc) => matriculaDoc.ref.path),
                    ...plan.documentosAEliminar.map((matriculaDoc) => matriculaDoc.ref.path)
                ]);
                const rutasActuales = new Set(matriculasActuales.docs.map((matriculaDoc) => matriculaDoc.ref.path));
                if (rutasActuales.size !== rutasEsperadas.size || [...rutasActuales].some((ruta) => !rutasEsperadas.has(ruta))) {
                    throw new Error("La colección cambió después de la vista previa. Vuelva a validar el CSV.");
                }

                const cursosPorClaveActuales = new Map();
                for (const cursoDoc of cursosActuales.docs) {
                    const curso = cursoDoc.data();
                    const clave = claveCurso(curso.anio, curso.division);
                    const coincidencias = cursosPorClaveActuales.get(clave) || [];
                    coincidencias.push(curso);
                    cursosPorClaveActuales.set(clave, coincidencias);
                }
                if (plan.clavesCurso.some((clave) => {
                    const coincidencias = cursosPorClaveActuales.get(clave) || [];
                    return coincidencias.length !== 1 || !coincidencias[0].cursoid;
                })) {
                    throw new Error("El catálogo de cursos cambió después de la vista previa. Vuelva a validar el CSV.");
                }
                plan.cursosPorClave = cursosPorClaveActuales;

                const batch = writeBatch(db);
                for (let i = 0; i < plan.filas.length; i++) {
                    const fila = plan.filas[i];
                    const matriculaDoc = plan.matriculasExistentes.get(plan.ids[i]);
                    const curso = plan.cursosPorClave.get(plan.clavesCurso[i])[0];
                    const datos = {};
                    for (const [campoOrigen, campoDestino] of Object.entries(mapeoMatriculas)) {
                        datos[campoDestino] = fila[campoOrigen] ?? "";
                    }
                    datos.curidhex = curso.cursoid;
                    if (matriculaDoc?.data().idhex !== undefined) {
                        datos.idhex = matriculaDoc.data().idhex;
                    }
                    const referencia = matriculaDoc?.ref || doc(collection(db, "matriculas"));
                    batch.set(referencia, datos);
                }
                for (const matriculaDoc of plan.documentosAEliminar) {
                    batch.delete(matriculaDoc.ref);
                }

                await batch.commit();
                loteAplicado = true;

                const verificacion = await getDocsFromServer(collection(db, "matriculas"));
                const idsVerificados = new Map();
                for (const matriculaDoc of verificacion.docs) {
                    const id = String(matriculaDoc.data().matriculaid ?? "").trim();
                    if (id) idsVerificados.set(id, matriculaDoc.data());
                }
                const camposIncorrectos = plan.filas.some((fila, i) => {
                    const actual = idsVerificados.get(plan.ids[i]);
                    const curso = plan.cursosPorClave.get(plan.clavesCurso[i])[0];
                    return !actual || Object.entries(mapeoMatriculas).some(([origen, destino]) =>
                        String(actual[destino] ?? "").trim() !== String(fila[origen] ?? "").trim()
                    ) || String(actual.curidhex ?? "") !== String(curso.cursoid);
                });
                if (verificacion.size !== plan.filas.length || idsVerificados.size !== plan.filas.length || camposIncorrectos) {
                    throw new Error("La escritura se aplicó, pero la verificación posterior no coincide con el CSV.");
                }

                this.matriculas = verificacion.docs
                    .map((matriculaDoc) => ({ id: matriculaDoc.id, ...matriculaDoc.data() }))
                    .sort((a, b) => a.matriculaid - b.matriculaid);
                const cursoSeleccionado = this.cursos.find((curso) => curso.id === this.idCourseSelected);
                this.courseSelected = cursoSeleccionado
                    ? this.matriculas.filter((matricula) => matricula.curidhex == cursoSeleccionado.cursoid)
                    : [];
                this.dialogReemplazoMatriculas = false;
                this.reemplazoMatriculas = null;
                this.resumenReemplazo = null;
                this.mensajeImportacion = `Reemplazo completado y verificado: ${verificacion.size} matrículas.`;
            } catch (error) {
                this.errorImportacion = loteAplicado
                    ? `El lote se aplicó, pero no se pudo verificar: ${error.message}`
                    : `No se pudo reemplazar la colección: ${error.message}`;
                if (loteAplicado) {
                    this.dialogReemplazoMatriculas = false;
                    this.reemplazoMatriculas = null;
                    this.resumenReemplazo = null;
                }
                console.error("Error al reemplazar matrículas:", error);
            } finally {
                this.reemplazando = false;
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
                console.log("Create");
            }
            this.closeFactory();
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
            if (this.matriculaSelected > -1) {
                await this.updateLibrary();
            }
            else {
                console.log("Create Library");
            }
            this.closeLibrary();
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
            if (this.matriculaSelected > -1) {
                await this.updateCooperadora();
            }
            else {
                console.log("Create Cooperadora");
            }
            this.closeCooperadora();
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
            if (this.matriculaSelected > -1) {
                await this.updateInternado();
            }
            else {
                console.log("Create Internado");
            }
            this.closeInternado();
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
        },
        docente: function (elem){
            return elem.miembrosdependencias.apellido + " , " +  elem.miembrosdependencias.nombre;
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
        },
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
