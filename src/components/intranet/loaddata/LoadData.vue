<template>
    <v-container>
        <v-app-bar :elevation="2" color="pink-accent-4" class="bottom-round">
            <v-app-bar-nav-icon icon="mdi-upload"></v-app-bar-nav-icon>
            <v-toolbar-title>Carga de Datos(csv)</v-toolbar-title>
        </v-app-bar>
        <!-- 
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
        -->
    </v-container>


</template>

<script>

 import { db } from '../../../firebaseConfig';
 import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';
 import Papa from "papaparse"; // Importar PapaParse para procesar CSV


 export default {
    data:{
        target:'',
        source:'',
        datosCSV:'',
    },
    methods:{
        
        procesarArchivo(event) {
                this.source = event.target.files[0];
                if (this.source) {
                    Papa.parse(this.source, {
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
                            addDoc(collection(db,this.target ),elemento);  
                            console.log("=>" + elemento.idhex );
                        
                    }) 
                    alert("Datos subidos con éxito: " + respuesta.data.message);
                } catch (error) {
                    console.error("Error al subir datos:", error);
                    alert("Error al subir los datos." );
                }
            },
        
    }
 }

</script>