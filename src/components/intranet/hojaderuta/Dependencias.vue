<template>
    <v-container>
            <v-app-bar :elevation="2"  color="blue-accent-2" class="bottom-round">
                <v-app-bar-nav-icon icon="mdi-account-multiple"></v-app-bar-nav-icon>
                <v-toolbar-title class="ml-2 text-h6 text-md-h5">Dependencias Hoja de Ruta</v-toolbar-title>
            </v-app-bar>

            <v-row>
                <v-col cols="2"></v-col>
                <v-col cols="5">
                    <v-select label="Seleccione Dependencia"
                        :items="dependencias"
                        item-title="descripcion"
                        item-value ="id"
                        v-model="dependenciaSel"
                        @change="onChange">
                    </v-select>
                </v-col>
                <v-col cols="3">
                        <v-btn color="green-darken-3" @click="showModalDependencias" icon ="mdi mdi-plus" title="Agregar"></v-btn> 
                        <v-btn color="yellow-darken-2" @click="showModalDependencias" icon ="mdi mdi-pencil" title="Editar"></v-btn> 
                        <v-btn color="blue-darken-2" @click="buscarMiembros" icon="mdi mdi-magnify" title="Buscar"></v-btn>
                    </v-col>
            </v-row>
            <v-row>
                <v-col cols="2"></v-col>
                <v-col cols="6">
                    <v-data-table>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>
                                        Miembros Dependencias
                                </v-toolbar-title>
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
                            </v-toolbar>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>

            <v-dialog v-model="dialogDependencias" max-width="800px">
                <v-card>
                    <v-card-title class="text-h5" color="red-accent-4">
                        Dependencias
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="4">
                                <v-text-field v-model="dependenciaEdit.id" label="Dep Id" disabled> </v-text-field></v-col>
                            <v-col cols="4">
                                <v-text-field
                                v-model="dependenciaEdit.descripcion"
                                label="Dependencia"
                                variant="outlined"
                                hide-details
                                single-line
                                cols="1"
                        >
                        </v-text-field></v-col>
                        <v-col>
                            <v-text-field cols="2" label ="Clave" v-model="dependenciaEdit.key" variant="outlined" single-line></v-text-field>
                        </v-col>
                        </v-row>
                        

                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                            <v-btn color="red-accent-4" variant="text" @click="onClose" icon="mdi-close-circle-outline"></v-btn>
                            <v-btn color="blue-darken-4" variant="text" @click="onSave" icon="mdi-content-save-settings"></v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-dialog>

    </v-container>
</template>

<script>
    
    import { db } from '../../../firebaseConfig';
    import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';

    const vDependencias = [{id:1,descripcion:"Biblioteca",key:"BBA"},
                            {id:2,descripcion:"Taller-Laboratorio",key:"TLA"},
                            {id:3,descripcion:"Cooperadora",key:"COO"},
                            {id:4,descripcion:"Internado",key:"INT"}];

    export default {
        data:()=>({
            dialogDependencias:false,
            dependenciaEdit:{
                id:'',
                descripcion:'',
                key:''
            },
            dependenciaSel:'',
            indexSel:-1,
            dependencias:[],
        }),
        methods:{
            showModalDependencias(){
                this.dialogDependencias = true;
            },
            onClose(){
                this.dialogDependencias = false;
                this.indexSel = -1;
            },
            onSave: async () =>{
                if(this.indexSel > -1 )
                    await this.update()
                else
                    await this.create();
            },
            onChange:(ev) => {
                this.dependenciaEdit.id = ev.value;
                if(ev.value > -1 )
                    this.indexSel = this.dependenciaEdit.id
            },
            create:async () => {
                // this.dependencia.id = crypto.randomUUID();
                console.log(crypto.randomUUID());
            },
            onEdit:(elem) => { 
                this.dependencia.id = elem.id;
            }
        }
    }

</script>