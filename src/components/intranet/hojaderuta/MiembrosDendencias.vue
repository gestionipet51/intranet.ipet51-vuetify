<template>
    <v-container>
        <v-data-table :headers="headers" :items="miembros" :items-per-page="5">
            <template v-slot:top>
                <v-toolbar flat>
                        <v-icon color="orange-accent-4">mdi-account-group</v-icon> <span class="red-accent-4"> Miembros de la Dependencia : {{  dependencia.descripcion }}</span>
                        <v-divider class="mx-8" inset vertical ></v-divider>
                        <v-dialog v-model="modalMiembro" max-width="800px">
                            <template v-slot:activator="{ props }">
                                <v-btn class="mb-2" color="primary" variant="tonal" v-bind="props" density="comfortable" icon="mdi-plus" size="large" @click="showModal('create',newMiembroDep)"></v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="text-h6"> <span class="text-h5">{{ dependencia.descripcion }} : {{ modalTitle }}</span></v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="6">
                                            <v-text-field v-model="miembroDep.id" label="Miembro Id" disabled> </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field v-model="miembroDep.dependenciaID" label="Dependencia" disabled></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="4">
                                            <v-text-field v-model="miembroDep.apellido" label="Apellido"></v-text-field>
                                        </v-col>
                                        <v-col cols="4">
                                            <v-text-field v-model="miembroDep.nombres" label="Nombres"></v-text-field>
                                        </v-col>
                                        <v-col cols="4">
                                            <v-select v-model="estadoSel.id" label="Seleccione" :items="estados" item-title="caption" item-value="key" @change="setEstado"></v-select>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                        <v-spacer></v-spacer>
                                            <v-btn color="red-accent-4"   variant="text" @click="close" icon="mdi-close-thick"></v-btn>
                                            <v-btn color="green-darken-1" variant="text" @click="save" icon="mdi-content-save"></v-btn>
                                        <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="modalDelete" max-width="500px">
                                    <v-card color="pink-lighten-4">
                                        <v-card-title class="text-h6">
                                            <v-icon color="red-accent-4">mdi-help-circle</v-icon> <span class="red-accent-4">¿Esta seguro de eliminar este miembro?</span>
                                        </v-card-title>
                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red-accent-4"  variant="text" @click="closeModal" icon="mdi-close-thick"></v-btn>
                                        <v-btn color="blue-darken-1" variant="text" @click="deleteMember" icon="mdi-content-save"></v-btn>
                                        <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                        </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon class="me-2" size="small" color="orange-darken-4" @click="showModal('update',item)">mdi-pencil </v-icon>
                <v-icon class="me-2" size="small" color="red-accent-4"    @click="showModalDelete(item)">mdi-delete </v-icon>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>

import { db } from '../../../firebaseConfig';
import { collection ,addDoc,getDocs,doc,deleteDoc,updateDoc, getPersistentCacheIndexManager } from 'firebase/firestore';

const headerItems = [
            {title:'Id',key:'id',align:'center',class:'d-none'},
            {title:'Apellido',key:'apellido', align: 'center'},
            {title:'Nombre',key:'nombres', align: 'center'},
            {title:'Estado',key:'estado',align : 'center'},
            {title:'Acciones',key:'actions',align:'center'},
        ];
const arrEstados = [{id:1,caption:'Vigente',key:'VI'},
                    {id:2,caption:'No Vigente',key:'NV'}
                    ];

    export default{
        props:['dependencia'],
        data : () => ({
            headers:headerItems,
            itemsPerPage:5,
            editedIten:-1,
            modalMiembro:false,
            modalDelete:false,
            idxMiembroSel:-1,
            grupo:{},
            miembros:[],
            miembroDep:{
                dependenciaID:'',
                id:'',
                apellido:'',
                nombres:'',
                estado:''
            },
            newMiembroDep:{
                dependenciaID:'',
                id:'',
                apellido:'',
                nombres:'',
                estado:''
            },
            estados:[],
            estadoSel:{
                id:'',
                caption:'',
                key:''
            }
        }),
        created(){
            this.init();
            this.fetchMiembros();
        },
        computed:{
            modalTitle:function(){
                return (this.idxMiembroSel === -1) ? 'Nuevo Miembro' : 'Actualizar Miembro'
            },
            setEstado: function () {
                this.miembroDep.estado = this.estadoSel.key;
       
            },
        
        },
        methods:{
            init:function(){
                this.estados = arrEstados;
                this.grupo = this.dependencia;
            },
            fetchMiembros:async function(){
                const querySnapshot = await getDocs(collection(db, "miembrosdependencia"));
                const aux_miembros = querySnapshot.docs
                    .map(doc => ({ id:doc.id, ...doc.data() }));

                this.miembros = aux_miembros.filter((elem) => {return elem.dependenciaID == this.grupo.id})
                this.loading = false;
            },
            close:function(){
                this.modalMiembro = false;
                this.idxMiembroSel = -1;
            },
            closeModal:function(){
                this.modalDelete = false;
                this.idxMiembroSel = -1;
            },
            save:async function(){
                if(this.idxMiembroSel > -1){
                    await this.update();
                }else{
                    await this.create();
                }
                this.close();
                this.fetchMiembros();
            },
            update:async function(){
                try{
                    Object.assign(this.miembros[this.idxMiembroSel], this.miembroDep)
                    await updateDoc(doc(db,"miembrosdependencias",this.miembroDep.id),this.miembroDep)

                }
                catch(error){
                    console.log(error);
                }
            },
            delete: async function(item){
                        this.idxMiembroSel = this.miembros.indexOf(item)
                        this.miembroDep = Object.assign({}, item)
                        this.modalDelete = true
                        await deleteDoc(doc(db,"miembrosdependencia",item.id));
                        await this.fetchMiembros();
            },
            create:async function(){
               
                this.miembros.push(this.miembroDep);
                await addDoc(collection(db, "miembrosdependencia"), this.miembroDep);
                console.log(this.miembroDep);
                
            },
            showModal:function(action,item){

                if(action == 'create'){
                    this.idxMiembroSel = -1;
                    this.miembroDep.id = crypto.randomUUID();
                    this.miembroDep.dependenciaID = this.grupo.id;
                    this.miembroDep.apellido = '';
                    this.miembroDep.nombres = '';
                    this.miembroDep.estado = '';
                }else{
                    this.estadoSel = this.estados.find(elem => elem.key === item.estado )
                    this.idxMiembroSel = this.miembros.indexOf(item);
                    this.miembroDep.id = item.id;
                    this.miembroDep.dependenciaID = item.dependenciaID;
                    this.miembroDep.apellido = item.apellido;
                    this.miembroDep.nombres = item.nombres;
                    this.miembroDep.estado = item.estado;

                }
                this.modalMiembro = true;
                // console.log("Show Modal:" + action );
            },
            showModalDelete:function(item){
                this.modalDelete  = true ;     
            }
        }
    }
</script>