<template>
    <v-container>
        <v-app-bar :elevation="2"  color="blue-accent-2" class="bottom-round">
            <v-app-bar-nav-icon icon="mdi-playlist-edit"></v-app-bar-nav-icon>
            <v-toolbar-title class="ml-2 text-h6 text-md-h5">Hoja de Ruta</v-toolbar-title>
        </v-app-bar>

        <v-row>
            <v-col cols="2" sm="2" md="2"></v-col>
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
    </v-container>
      <v-alert v-if="errorImportacion" type="error" variant="tonal" class="mb-4">
                {{ errorImportacion }}
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

</template>


<script>

    import { db } from '../../../firebaseConfig';
import { collection, writeBatch, doc, getDocs, addDoc, deleteDoc, updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';

import Papa from "papaparse"; // Importar PapaParse para procesar CSV
import axios from "axios"; // Axios para enviar datos al backend
    export default {
        data:()=>{
            return {
                cursos:'',
                loading:false,
                datosCSV:[],
            }
        },
        methods:{
            async initialize(){
               
                // this.ciclos = myCiclos;
                this.loading = true;
                await this.fetchCursos();
                console.log(this.cursos);
             },
            fetchCursos: async function (){
                const querySnapshot = await getDocs(collection(db,"cursos"));
                this.cursos = querySnapshot.docs
                                    .map(doc => ({ id:doc.id, ...doc.data() }))
                                    // .sort((a,b) => a.anio.localCompare(b.anio));
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
                        console.log("Datos procesados:", this.datosCSV.length);
                    },
                    error: (error) => {
                        console.error("Error al procesar el archivo:", error);
                    }
                    });
                }
            },
            async enviarDatos() {
                if (!this.datosCSV?.length) {
                    alert("No hay datos para subir.");
                    return;
                }
                try {
                    await this.batchImportMatriculas(this.datosCSV);
                    alert("Datos subidos con éxito: " + this.datosCSV.length + " registros");
                } catch (error) {
                    console.error("Error al subir datos:", error);
                    alert("Error al subir los datos.");
                }
            },
            async batchImportMatriculas(entries) {
                let batch = writeBatch(db);
                let counter = 0;

                for (const elemento of entries) {
                    batch.set(doc(collection(db, "matriculas")), elemento);
                    counter += 1;

                    if (counter % 250 === 0) {
                        await batch.commit();
                        batch = writeBatch(db);
                    }
                }

                if (counter % 250 !== 0) {
                    await batch.commit();
                }
            },
        },
        created(){
            this.initialize();
        }
    }
</script>