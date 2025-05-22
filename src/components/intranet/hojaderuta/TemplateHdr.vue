<template>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    
    <div ref="pdfContent">
        <div class="container pdng-20">
        <div class="row">
            <div class="col-md-12 text-center">
                <h3><strong>Hoja de Ruta</strong></h3>
            </div>
        </div>
        <div class="row border1">

            <header class="header  text-center">
                <h4>Instituto Provincial de Educación Técnica N° 51 "Nicolas Avellaneda"</h4>

                <br>

                <table class="table">
                    <thead>
                        <tr>
                            <th>Estudiante</th>
                            <th>Curso-Division</th>
                            <th>Condicion</th>
                            <th>Ciclo</th>
                            <th>Especialidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{matricula.apellido}},{{matricula.nombre}}</td>
                            <td>{{matricula.Curso}}</td>
                            <td>{{COND}}</td>
                            <td>{{ciclo}}</td>
                            <td>{{matricula.plan_estudio}}</td>
                        </tr>
                    </tbody>
                </table>
                
               <div class="row">
                <h6 class="font-sm">El estudiante entrega todos los elementos a cargo y cancela los compromisos con las siguientes observaciones
                </h6>
               </div>
            </header>
        </div>

        <br>
        <br>
        <table class="table table-bordered">
            <thead>
                <th scope="col" class="text-center">V°B° Cooperadora</th>
                <th scope="col" class="text-center">V°B° Taller-Laboratorio</th>
                <th scope="col" class="text-center">V°B° Internado</th>
                <th scope="col" class="text-center">V°B° Biblioteca</th>
            </thead>
            <tbody>
                <tr scope="row">
                    <td class="text-center">
                        {{matricula.coop_condicion}}
                        <br>
                        Cuotas Pendientes : 
                        {{matricula.coop_cuotas}}
                        <br>
                    </td>
                    <td class="text-center">
                        {{matricula.tl_condicion}}
                    </td>
                    <td class="text-center">
                         {{matricula.int_condicion}}
                    </td>
                    <td class="text-center">
                        {{matricula.bl_condicion}}
                    </td>
                </tr>
                <tr>
                    <td class="text-center">{{matricula.coop_responsable}}</td>
                    <td class="text-center">{{matricula.tl_responsable}}</td>
                    <td class="text-center">{{matricula.int_responsable}}</td>
                    <td class="text-center">{{matricula.bl_responsable}}</td>
                </tr>
            </tbody>
        </table>
        <br>
        <br>
        <hr class="border1">
        <div class="row">
            <div class="col-md-4 text-center">
                Firma Padre/Madre/Tutor
            </div>
            <div class="col-md-4"></div>
            <div class="col-md-4 text-center">
                Firma Estudiante
            </div>
        </div>
        <br>

        <div class="row border1 firmasello">
            <div class="col-md-8 font-sm">
                <p>Autoridad Competente</p>
                <br>
                <p>El estudiante ha cancelado los compromisos el dia : <strong>{{fecha.toLocaleDateString('es-AR')}}</strong></p>
    
                <p>Marcos Juarez, <strong>{{DIA}}</strong> de <strong>{{MES}}</strong> de  <strong>{{ANIO}}</strong></p>
            </div>
            <div class="col-md-4 text-center">
                <div class="row">
                    <div class="col-md-4">
                        <SelloIpet></SelloIpet>
                    </div>
                    <div class="col-md-4">
                        <FirmaIpet></FirmaIpet>
                    </div>
                </div>
                <div class="pie-firma text-center font-sm">Sello y Firma Dirección</div>
            </div>

        </div>
        <footer>
            <br>
            <div class="row">
                <span class="font-xx-sm"><strong>Nota:</strong>La  presente hoja de ruta debe presentarse ante la autoridad escolas con el V°B° de todas las dependencias</span>
            </div>
        </footer>
    </div>
    </div>
</template>


<script>

    import html2canvas from 'html2canvas'
    import jsPDF from 'jspdf'

    const titleHeaders = [
        {id:1,tag:"Estudiante"},
        {id:2,tag:"Curso-Comision"},
        {id:3,tag:"Condición"},
        {id:4,tag:"Ciclo"},
        {id:5,tag:"Especialidad"}
    ];

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];
    import selloIpet from './SelloIpet.vue';
    import firmaIpet from './FirmaIpet.vue';

    export default {
        components:{
            selloIpet,firmaIpet
        },
        props:{
            matricula:{
                type:Object,
                required:true
            },
            ciclo:'',          
        },
        data:() => ({
                fecha:{},
                DIA:'',
                MES:'',
                ANIO:'',
                COND:'Regular'
        }),
        created(){
            this.fecha = new Date();
            this.DIA = this.fecha.getDate();
            this.MES = meses[this.fecha.getMonth()];
            this.ANIO = this.fecha.getFullYear();
        },
        methods:{
            async generarPDF(){
                const element = this.$refs.pdfContent

                const canvas = await html2canvas(element)
                const imgData = canvas.toDataURL('image/png')

                const pdf = new jsPDF('l', 'mm', 'a4')
                const pdfWidth = pdf.internal.pageSize.getWidth()
                const pdfHeight = pdf.internal.pageSize.getHeight()

                const imgProps = pdf.getImageProperties(imgData)
                const imgWidth = pdfWidth * 0.9 // 90% del ancho A4
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width

                // Centramos la imagen
                const x = (pdfWidth - imgWidth) / 2
                const y = (pdfHeight - imgHeight) / 2

                pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
                const sNombreTemplate =  'HojaDeRuto.pdf' ; // 'HDR-'+ alumno.apellido + '_' + alumno.nombre + '.pdf';
                pdf.save(sNombreTemplate)
            }
        }
        
    }
</script>

<style>
 .border1{
            border: 1px solid black;
        }
        .header{
            margin-left: 0;
            margin-top:0;
            height: 180px;
        }
        .font-lg{
            font-size:larger;
        }
        .font-2lg{
            font-size: xx-large;
        }
        .font-sm{
            font-size: small;
        }
        .font-xx-sm{
            font-size: x-small;
        }

        body {
            padding-top: 10px;
        }

        h6{
            float:left;
        }

        #encabezado{
            padding-top: 20px;
        }
        .font-cur{
            font-style: italic;
            font-weight: 500;
        }

        .firmasello{
            height: 180px;;
        }
        
        .pie-firma{
            padding-top: 0px;
        }
        .pdng-20{
            padding-top: 140px;
        }

</style>