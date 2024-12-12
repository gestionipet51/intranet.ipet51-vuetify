<template>
    <v-container>
        <v-app-bar :elevation="2" color="green-darken-3" class="bottom-round">
            <v-app-bar-nav-icon icon="mdi-office-building-outline"></v-app-bar-nav-icon>
            <v-toolbar-title>Departamentos</v-toolbar-title>
        </v-app-bar>

        <v-row no-gutters>
          <v-col cols="2"></v-col>
          <v-col cols="6">
                <v-data-table   
                    :headers="headers" 
                    :items="cursos">

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
                                        <v-btn class="mb-2" color="primary" variant="elevated" v-bind="props"><v-icon>mdi-plus</v-icon></v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title>
                                                <span class="text-h5"> {{ formTitle }}</span>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="12" md="6" sm="6">
                                                        <v-text-field v-model="editedCurso.id" label="Curso Id" disabled> </v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" md="4" sm="4"> 
                                                        <v-select v-model="cicloSel.id" label="Seleccione" :items="ciclos" item-title="caption" item-value="id" @change="setCiclo"></v-select>
                                                        <v-text-field v-model="editedCurso.ciclo" label="Ciclo" v-show="false"></v-text-field> 
                                                    </v-col>
                                                    <v-col cols="12" md="2" sm="4"> 
                                                        <v-text-field v-model="editedCurso.anio" label="Año"></v-text-field> 
                                                    </v-col>
                                                    <v-col cols="12" md="2" sm="4"> 
                                                        <v-text-field v-model="editedCurso.division" label="División"></v-text-field> 
                                                    </v-col>
                                                    <v-col cols="12" md="4" sm="4">
                                                        <v-text-field v-model="editedCurso.descripcion" label="Descripción"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="red-accent-4" variant="text" @click="close" icon="mdi-arrow-u-left-top-bold"></v-btn>
                                            <v-btn color="green-darken-4" variant="text" @click="save" icon="mdi-content-save-settings"></v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                                <v-dialog v-model="dialogDelete" max-width="500px">
                                    <v-card color="pink-lighten-4">
                                        <v-card-title class="text-h6">
                                            <v-icon color="red-accent-4">mdi-help-circle</v-icon> <span class="red-accent-4">¿Esta seguro de eliminar este curso?</span>
                                        </v-card-title>
                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red-accent-4"  variant="text" @click="closeDelete" icon="mdi-close-thick"></v-btn>
                                        <v-btn color="blue-darken-1" variant="text" @click="confirmDeleteCurso" icon="mdi-content-save"></v-btn>
                                        <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                    </v-dialog>
                        </v-toolbar>
                    </template>

                </v-data-table>
        </v-col>
        </v-row>
    </v-container>
</template>

<script>
    
import { db } from '../../../firebaseConfig';
import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';

const tableHeaders = [
    { align:'d-none',sortable:false,key:'id'  , title:'Depto Id'},
    { align:'center',sortable:true ,key:'nombre',title:'Nombre', },
    { align:'center',sortable:true ,key:'codigo',title:'Codigo'  , },
    { align:'center',sortable:true ,key:'estado',title:'Estado'  , },
    { align:'center',sortable:false,key:'actions',title:'Acciones',},
];

export default{
    data:() => ({
            departamentos:[],
            headers : tableHeaders,
            itemsPerPage:10,
            loading:false,
            totalCursos: 0,
            search:'',
            selected:[],
            singleSelect:false,
            dialog:false,
            dialogDelete:false,
            editedIndex: -1,
    })
}
</script>