<template>
    <v-container>
        <v-app-bar :elevation="2"  color="blue-accent-2" class="bottom-round">
            <v-app-bar-nav-icon icon="mdi-playlist-edit"></v-app-bar-nav-icon>
            <v-toolbar-title class="ml-2 text-h6 text-md-h5">Hoja de Ruta</v-toolbar-title>
        </v-app-bar>

        <!--v-row>
            
                <v-col cols="6">
                    <v-file-input  accept=".csv" label="Subir CSV a Firebase" @change="procesarArchivo"></v-file-input>
                </v-col>
                    <v-col cols="3">
                        <v-btn :disabled="!datosCSV.length" rounded="lg" @click="enviarDatos" color="indigo-darken-3">
                            Subir Archivo 
                        </v-btn>
                </v-col>
        </v-row-->

        <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="6"><v-select label="Seleccione" :items="cursos" item-title="descripcion" item-value ="id"></v-select></v-col>
        </v-row>

        <v-row>
            
        </v-row>
    </v-container>

</template>


<script>

    import { db } from '../../../firebaseConfig';
    import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';

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
        },
        created(){
            this.initialize();
        }
    }
</script>