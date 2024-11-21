<template>
    <v-container>
        <v-app-bar :elevation="2"  color="blue-accent-2" class="bottom-round">
            <v-app-bar-nav-icon icon="mdi-playlist-edit"></v-app-bar-nav-icon>
            <v-toolbar-title class="ml-2 text-h6 text-md-h5">Hoja de Ruta</v-toolbar-title>
        </v-app-bar>

        <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="6"><v-select label="Seleccione" :items="cursos" :item-props="cursosProps"></v-select></v-col>
        </v-row>
    </v-container>

</template>


<script>
    const vCursos=[ {id:1,tag:"Primer Año A",anio:1,division:"A", ciclo:"PC"},
                    {id:2,tag:"Primer Año B",anio:1,division:"B", ciclo:"PC"},
                    {id:3,tag:"Primer Año C",anio:1,division:"C", ciclo:"PC"},
                    {id:4,tag:"Primer Año D",anio:1,division:"D", ciclo:"PC"}];


    import { db } from '../../../firebaseConfig';
    import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';

    export default {
        data:()=>{
            return {
                cursos:'',
                loading:false,
            }
        },
        methods:{
            async initialize(){
               
                // this.ciclos = myCiclos;
                this.loading = true;
                await this.fetchCursos();
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
            }
        },
        created(){
            this.initialize();
        }
    }
</script>