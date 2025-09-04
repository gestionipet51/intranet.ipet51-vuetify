<template>
    <v-container>
        <v-data-table :headers="headers" :items-per-page="5">
            <template v-slot:top>
                <v-toolbar flat>
                        <v-icon color="red-accent-4">mdi-playlist-star</v-icon> <span class="red-accent-4">Miembros de la Dependencia</span>
                        <v-divider class="mx-8" inset vertical ></v-divider>
                        <v-dialog v-model="dlgDeps" max-width="800px">
                            <template v-slot:activator="{ props }">
                                <v-btn class="mb-2" color="primary" variant="tonal" v-bind="props" density="comfortable" icon="mdi-plus" size="large"></v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="text-h6"> <span class="text-h5"> {{ modalTitle }}</span></v-card-title>
                                <v-card-text>

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

    export default{
        props:['dependencias'],
        data : () => ({
            headers:headerItems,
            itemsPerPage:5,
            editedIten:-1,
        }),
        computed:{
            modalTitle:function(){
                return (this.editedItem === -1) ? 'Nuevo Miembro' : 'Actualizar Miembro'
            }
        }
    }
</script>