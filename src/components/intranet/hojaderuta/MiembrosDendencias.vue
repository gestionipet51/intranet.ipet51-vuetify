<template>
    <v-container>
        <v-data-table :headers="headers" :items-per-page="5">
            <template v-slot:top>
                <v-toolbar flat>
                        <v-icon color="orange-accent-4">mdi-account-group</v-icon> <span class="red-accent-4"> Miembros de la Dependencia : {{  dependencia.descripcion }}</span>
                        <v-divider class="mx-8" inset vertical ></v-divider>
                        <v-dialog v-model="modalMiembro" max-width="800px">
                            <template v-slot:activator="{ props }">
                                <v-btn class="mb-2" color="primary" variant="tonal" v-bind="props" density="comfortable" icon="mdi-plus" size="large" @click="showModal('create')"></v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="text-h6"> <span class="text-h5">{{ dependencia.descripcion }} : {{ modalTitle }}</span></v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="6">
                                            <v-text-field v-model="miembroDep.id" label="Miembro Id" disabled> </v-text-field>
                                        </v-col>
                                        <v-col cols="4">
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
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon class="me-2" size="small" color="green-darken-4" @click="updateItem(item)">mdi-pencil </v-icon>
                <v-icon class="me-2" size="small" color="red-accent-4"   @click="deleteItem(item)">mdi-delete </v-icon>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>

const headerItems = [
            {title:'Id',key:'miembroid',align:'center',class:'d-none'},
            {title:'Miembro',key:'description', align: 'center'},
            {title:'Estado',key:'status',align : 'center'},
            {title:'Acciones',key:'actions',align:'center'},
        ];
const arrEstados = [
    {id:1,caption:'Vigente',key:'VI'},
    {id:2,caption:'No Vigente',key:'NV'}
];

    export default{
        props:['dependencia'],
        data : () => ({
            headers:headerItems,
            itemsPerPage:5,
            editedIten:-1,
            modalMiembro:false,
            idxMiembroSel:-1,
            dependencia:{},
            miembros:[],
            miembroDep:{
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
            this.miembroDep.dependenciaID = this.dependencia.descripcion;
        },
        computed:{
            modalTitle:function(){
                return (this.idxMiembroSel === -1) ? 'Nuevo Miembro' : 'Actualizar Miembro'
            },
            setEstado: function () {
                this.miembroDep.estado = this.estadoSel.id;
       
            },
            getDependencia: function(){
                return this.dependencia.id;
            }
        },
        methods:{
            init:function(){
                this.estados = arrEstados;
            },
            close:function(){
                this.modalMiembro = false;
                this.idxMiembroSel = -1;
            },
            save:function(){
                if(this.idxMiembroSel === -1){
                    this.update();
                }else{
                    this.create();
                }
            },
            update:function(){

            },
            create:async function(){
               
                this.miembros.push(this.miebroDep);
                await addDoc(collection(db, "miembrosDependencia"), this.miembroDep);
                console.log(this.miembroDep);
                
            },
            showModal:function(action){
                this.idxMiembroSel = -1;
                this.miembroDep.dependencia = this.dependencia.id;
                console.log("Show Modal:" + action );
                this.miembroDep.id = crypto.randomUUID();
            }
        }
    }
</script>