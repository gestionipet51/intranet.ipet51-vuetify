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
        }),
        methods:{
            initialize(){

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
          // this.initialize()
        },
    }
</script>
<template>
    <v-container>

        <v-app-bar :elevation="2" title="Cursos" color="deep-purple-darken-4"></v-app-bar>

        <v-row no-gutters>
          <v-col></v-col>
          <v-col>
            <v-sheet class="pa-2 ma-2">
              <v-card title="Buscador" flat>
                <template v-slot:text>
                  <v-text-field
                          v-model="search"
                          label="Buscar"
                          prepend-inner-icon="mdi-magnify"
                          variant="outlined"
                          hide-details
                          single-line
                  >
                  </v-text-field>
                </template>
                <v-data-table-server 
                v-model:items-per-page="itemsPerPage"
                :items="serverItems"
                :headers="headers" 
                :items-length="totalItems"
                :loading="loading"
                item-value="id"
                @update:options="loadItems"
                :search="search"
                :single-select="singleSelect"
                >
                <template v-slot:item.actions="{ item }">
                  <v-icon
                    class="me-2"
                    size="small"
                    @click="editItem(item)"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    size="small"
                    @click="deleteItem(item)"
                  >
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table-server>
              <!-- show-select class="elevation-1"-->
            </v-card>
          </v-sheet>
          </v-col>
          <v-col></v-col>
        </v-row>
        
    </v-container>
</template>

