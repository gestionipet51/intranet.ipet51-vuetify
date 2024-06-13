import { createRouter,createWebHistory } from "vue-router";
import Welcome from '../components/Welcome.vue';
import Login from '../components/intranet/Login.vue';
import Cursos from '../components/intranet/cursos/Cursos.vue';
import ListarCursos from '../components/intranet/cursos/ListarCursos.vue';
import TecnicoElectronica from '../components/intranet/especialidades/TecnicoElectronica.vue'; 
import TecnicoAutomotores from "@/components/intranet/especialidades/TecnicoAutomotores.vue";
import TecnicoMecanico from "@/components/intranet/especialidades/TecnicoMecanico.vue";
import TecnicoCarpinteria from "@/components/intranet/especialidades/TecnicoCarpinteria.vue";
import PanelHome from "@/components/PanelHome.vue";
import Roles from '@/components/intranet/roles/Roles.vue'
import Catalogos from '@/components/catalogos/Catalogos.vue'
import DetCatalogos from '@/components/catalogos/DetCatalogos.vue'


const routes = [
    { path:'/' , component:Welcome },
    { path:'/panelHome',component:PanelHome },
    { path:'/intranet/roles',component:Roles},
    { path:'/intranet/login/index' , component:Login },
    { path:'/intranet/cursos/index' , component:Cursos },
    { path:'/intranet/cursos/listar' , component:ListarCursos },
    { path:'/intranet/especialidades/electronica', component:TecnicoElectronica },
    { path:'/intranet/especialidades/mecanico',component:TecnicoMecanico },
    { path:'/intranet/especialidades/automotores', component:TecnicoAutomotores },
    { path:'/intranet/especialidades/carpinteria' , component:TecnicoCarpinteria },
    { path:'/catalogos', component:Catalogos },
    { path:'/detalleCatalogos',component:DetCatalogos}
];


const router = createRouter({
    history:createWebHistory(),
    routes,
});


export default router;