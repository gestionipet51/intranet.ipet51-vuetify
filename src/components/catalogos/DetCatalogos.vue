<template>
    <v-container>
        <v-row>  
            <v-col cols="12">
                <v-data-table 
                    :headers="headers"
                    :items-per-page="5"
                    >
                    <template v-slot:top>
                        <v-toolbar flat>
                        <v-icon color="red-accent-4">mdi-playlist-star</v-icon> <span class="red-accent-4">Items del Catalogo</span>
                        <v-divider class="mx-8" inset vertical ></v-divider>
                        <v-text-field
                            v-model="search"
                            label="Buscar"
                            prepend-inner-icon="mdi-magnify"
                            variant="outlined"
                            hide-details
                            single-line
                            cols="1"
                        ></v-text-field>
                        <v-divider class="mx-8" inset vertical ></v-divider>
                        <v-dialog v-model="dialogCRU" max-width="800px">
                            <template v-slot:activator="{ props }">
                                <v-btn class="mb-2" color="primary" variant="tonal" v-bind="props" density="comfortable" icon="mdi-plus" size="large"></v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="text-h6"> <span class="text-h5"> {{ formTitle }}</span></v-card-title>            
                                <v-card-text>
                                    <v-row>
                                        <v-col><v-text-field v-model="editedItem.catalogoid" label="Catalogo"></v-text-field></v-col>
                                        <v-col><v-text-field v-model="editedItem.itemid" label="Item"></v-text-field></v-col>
                                    </v-row>
                                     <v-row>
                                        <v-col><v-text-field v-model="editedItem.item" label="item"></v-text-field></v-col>
                                        <v-col><v-text-field v-mode="editedItem.description" label="Descripción"></v-text-field></v-col>
                                        <v-col>
                                            <v-select v-model="estadoSel.id" label="Seleccione" :items="estados" item-title="caption" item-value="id" @change="setEstado"></v-select>
                                            <v-text-field v-model="editedItem.status" label="Ciclo" v-show="false"></v-text-field>

                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                            
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                        <v-btn color="red-accent-4"   variant="text" @click="closeDialogCRU" icon="mdi-close-thick"></v-btn>
                                        <v-btn color="green-darken-1" variant="text" @click="saveItem" icon="mdi-content-save"></v-btn>
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

            </v-col>
        </v-row>
                           
    </v-container>    
</template>

<script>

const arrEstados = [
    { id:'AC',caption:'Activo'},
    { id:'IN',caption:'Inactivo'},
];


const headerItems = [
            {title:'Catalogo Id',key:'catalogoid',align:'center',class:'d-none'},
            {title:'ItemId',key:'itemid', align : 'center'},
            {title:'Item',key:'itemid',align: 'center'},
            {title:'Descripcion',key:'description', align: 'center'},
            {title:'Estado',key:'status',align : 'center'},
            {title:'Acciones',key:'actions',align:'center'},
        ];


export default {
    props:['catalogoId'],
    data: () =>({
        headers:headerItems,
        itemsPerPage:5,
        search:'',
        loading:false,
        selected:[],
        totalItems: 0,
        singleSelect:false,
        dialogCRU:false,
        dialogDEL:false,
        editedIndex: -1,
        editedItem:{
                itemid:'',
                catalogoid:'',
                item:'',
                description:'',
                status:'',
            },
        estados:arrEstados,
        estadoSel:{
            id:'',
            caption:''
        },        
    }),
    computed:{
            setEstado(){
                  this.editedItem.status = this.estadoSel.id;
            },
            formTitle(){
             return (this.editedItem === -1) ? 'Nuevo Item' : 'Actualizar Item'
            }
        },
    methods:{
            closeDialogCRU(){
                this.dialogCRU = false;
                this.$nextTick(() => {
                        this.editedItem =  { itemid:'', catalogoid:'', item:'', description:'', status:''};
                        this.editedIndex = -1;
                    })
            },
            closeDialogDEL(){
                this.dialogDEL = false; 
            }
        },
    watch: {
          dialogCRU (val) {
            val || this.closeDialogCRU()
          },
          dialogDEL (val) {
            val || this.closeDialogDEL()
          },
    },
    created(){
        console.log(this.catalogoId);
    }
}
</script>