<script>
const cursos=[
              {id:1,ciclo:"CB",anio:1,division:"A"},
              {id:2,ciclo:"CB",anio:1,division:"B"},
              {id:3,ciclo:"CB",anio:1,division:"C"},
              {id:4,ciclo:"CB",anio:1,division:"D"},
              {id:5,ciclo:"CB",anio:2,division:"A"},
              {id:6,ciclo:"CB",anio:2,division:"B"},
              {id:7,ciclo:"CB",anio:2,division:"C"},
              {id:8,ciclo:"CB",anio:2,division:"D"},
              {id:9,ciclo:"CB",anio:3,division:"A"},
              {id:10,ciclo:"CB",anio:3,division:"B"},
              {id:11,ciclo:"CB",anio:3,division:"C"},
              {id:12,ciclo:"CB",anio:3,division:"D"},
              {id:13,ciclo:"CO",anio:4,division:"A"},
              {id:14,ciclo:"CO",anio:4,division:"B"},
              {id:15,ciclo:"CO",anio:4,division:"C"},
              {id:16,ciclo:"CO",anio:4,division:"D"},
              {id:17,ciclo:"CO",anio:5,division:"A"},
              {id:18,ciclo:"CO",anio:5,division:"B"},
              {id:19,ciclo:"CO",anio:5,division:"C"},
              {id:20,ciclo:"CO",anio:5,division:"D"},
              {id:21,ciclo:"CO",anio:6,division:"A"},
              {id:22,ciclo:"CO",anio:6,division:"B"},
              {id:23,ciclo:"CO",anio:6,division:"C"},
              {id:24,ciclo:"CO",anio:6,division:"D"},
              {id:28,ciclo:"CO",anio:7,division:"A"},
              {id:29,ciclo:"CO",anio:7,division:"B"},
              {id:30,ciclo:"CO",anio:7,division:"C"},
              {id:31,ciclo:"CO",anio:7,division:"D"}
              
              ];
const cabeceras = [
    { title:'Id'   , align:'start' ,sortable:false,key:'id'},
    { title:'Ciclo', align:'center',sortable:true ,key:'ciclo'},
    { title:'Año'  , align:'center',sortable: false,key:'anio'},
    { title:'División',align:'center',sortable:false,key:'division'},
    { title:'Acciones',align:'center',sortable:false,key:'acciones'},
];

// console.log(cursos);

const FakeAPI = {
    async fetch ({ page, itemsPerPage, sortBy }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          const items = cursos.slice();
            
          if (sortBy.length) {
            const sortKey = sortBy[0].key
            const sortOrder = sortBy[0].order
            items.sort((a, b) => {
              const aValue = a[sortKey];
              const bValue = b[sortKey];
              return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
            })
          }

          const paginated = items.slice(start, end);

          resolve({ items: paginated, total: items.length })
        }, 500)
      })
    },
  }

export default {
        data:() =>({
            itemsPerPage:10,
            headers : cabeceras,
            serverItems:[],
            loading:true,
            totalItems: 0,
            search:'',
            selected:[],
            singleSelect:false,
            dialog:false,
            dialogDelete:false,
            editedIndex: -1,
            editedItem:{
                id:0,
                ciclo:'',
                anio:0,
                division:''
            }
        }),
        methods:{
            initialize(){
                this.serverItems = cursos;
             },
            loadItems({ page,itemsPerPage,sortBy }){
                this.loading = true;
                FakeAPI.fetch({ page , itemsPerPage,sortBy }).then(({items , total}) =>{ 
                    this.serverItems = items;
                    this.totalItems = total ;
                    this.loading = false;
                    })
            },
            sendData(){
                  let result = this.serverItems.map((item) => { return { ...item,isActive:this.selected.includes(item)}})
            },
            editItem (item) {
                        this.editedIndex = this.serverItems.indexOf(item)
                        this.editedItem = Object.assign({}, item)
                        this.dialog = true
            },
            deleteItem (item) {
                        this.editedIndex = this.serverItems.indexOf(item)
                        this.editedItem = Object.assign({}, item)
                        this.dialogDelete = true
            },
            deleteItemConfirm () {
                this.serverItems.splice(this.editedIndex, 1)
                this.closeDelete()
            },
            close () {
                this.dialog = false
                this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                })
            },
            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                })
            },
            save () {
                if (this.editedIndex > -1) {
                Object.assign(this.serverItems[this.editedIndex], this.editedItem)
                } else {
                this.serverItems.push(this.editedItem)
                }
                this.close()
            },

        },
        computed: {
            formTitle () {
                    return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },
        watch: {
          dialog (val) {
            val || this.close()
          },
          dialogDelete (val) {
            val || this.closeDelete()
          },
        },
        created () {
          this.initialize()
        },
    }
</script>
<template>
    <v-container>

        <v-app-bar :elevation="2" title="Cursos" color="deep-purple-darken-4"></v-app-bar>

        <v-row no-gutters>
          <v-col cols="3"></v-col>
          <v-col cols="6">
            <v-sheet class="pa-2 ma-2">
                <v-data-table-server 
                :headers="headers" 
                :items="serverItems"
                v-model:items-per-page="itemsPerPage"
                :items-length="totalItems"
                :loading="loading"
                item-value="id"
                @update:options="loadItems"
                :search="search"
                :single-select="singleSelect"
                >
                <template v-slot:top>
                  <v-toolbar flat>
                        <v-toolbar-title>CRUD</v-toolbar-title>
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
                        <v-divider
                            class="mx-8"
                            inset
                            vertical
                            ></v-divider>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ props }">
                                <v-btn class="mb-2" color="primary" variant="elevated" v-bind="props"> Nuevo Curso</v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                        <span class="text-h5"> {{ formTitle }}</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field v-model="editedItem.id" label="Id"> </v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="6"> 
                                                <v-text-field v-model="editedItem.anio" label="Año"></v-text-field> 
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                  </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil </v-icon>
                  <v-icon class="me-2" size="small" @click="deleteItem(item)" >mdi-delete   </v-icon>
                </template>
              </v-data-table-server>
              <!-- show-select class="elevation-1"-->
          </v-sheet>
          </v-col>
          <v-col></v-col>
        </v-row>
        
    </v-container>
</template>

