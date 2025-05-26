<template>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    
    <div ref="pdfContent" class="pdng-20" id="hdrprn">
            <div class="bdr-black-1">
                <div class="row">
                        <div class="col-md-12 text-center">
                            <h3 class=""><strong>Hoja de Ruta</strong></h3>
                        </div>
                </div>
                <div class="row">
                        <div class="col-md-12">
                            <div class="text-center">
                                <h4>Instituto Provincial de Educación Técnica N° 51 "Nicolas Avellaneda"</h4>
                            </div>
                        </div>
                </div>
                <br>
                <div class="row container text-center">
                    <div class="col-md-12">
                        <table class="table font-sm">
                            <thead>
                                <tr class="">
                                    <th class="">Estudiante</th>
                                    <th class="">Curso-Division</th>
                                    <th class="">Condicion</th>
                                    <th class="">Ciclo</th>
                                    <th class="">Especialidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="">
                                    <td class="">{{matricula.apellido}},{{matricula.nombre}}</td>
                                    <td class="">{{matricula.Curso}}</td>
                                    <td class="">{{COND}}</td>
                                    <td class="">{{ciclo}}</td>
                                    <td class="">{{matricula.plan_estudio}}</td>
                                </tr>
                            </tbody>
                        </table>  
                    </div>
                </div>
                <div class="row container">
                    <h6 class="font-sm">El estudiante entrega todos los elementos a cargo y cancela los compromisos con las siguientes observaciones
                    </h6>
                </div>
            </div>
            <div class="container ">
            <br>
            <br>
            <div class="row container">
                <div class="col-md-12">
                    <table class="table">
                        <thead>
                            <tr class="bdr-black-1">
                                <th scope="col" class="text-center bdr-black-1">V°B° Cooperadora</th>
                                <th scope="col" class="text-center bdr-black-1">V°B° Taller-Laboratorio</th>
                                <th scope="col" class="text-center bdr-black-1">V°B° Internado</th>
                                <th scope="col" class="text-center bdr-black-1">V°B° Biblioteca</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr scope="row" class="bdr-black-1">
                                <td class="text-center bdr-black-1">
                                    {{matricula.coop_condicion}}
                                    <br>
                                    Cuotas Pendientes : 
                                    {{matricula.coop_cuotas}}
                                    <br>
                                </td>
                                <td class="text-center bdr-black-1">
                                    {{matricula.tl_condicion}}
                                </td>
                                <td class="text-center bdr-black-1">
                                    {{matricula.int_condicion}}
                                </td>
                                <td class="text-center">
                                    {{matricula.bl_condicion}}
                                </td>
                            </tr>
                            <tr scope="row" class="bdr-black-1">
                                <td class="text-center bdr-black-1">{{matricula.coop_responsable}}</td>
                                <td class="text-center">{{matricula.tl_responsable}}</td>
                                <td class="text-center bdr-black-1">{{matricula.int_responsable}}</td>
                                <td class="text-center">{{matricula.bl_responsable}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <br>
            <br>
            <div class="row container">
                <div class="col-md-5 text-center">
                    <hr>
                    Firma Padre/Madre/Tutor
                </div>
                <div class="col-md-2"></div>
                <div class="col-md-5 text-center">
                    <hr>
                    Firma Estudiante
                </div>
            </div>
            <br>

            <div class="row container bdr-black-1 firmasello">
                <div class="col-md-8 font-sm">
                    <br>
                    <p>Autoridad Competente</p>
                    <br>
                    <p>El estudiante ha cancelado los compromisos el dia : <strong>{{fecha.toLocaleDateString('es-AR')}}</strong></p>
                    <br>
                    <p>Marcos Juarez, <strong>{{DIA}}</strong> de <strong>{{MES}}</strong> de  <strong>{{ANIO}}</strong></p>
                </div>
                <div class="col-md-4">
                    <div class="row">
                        <div class="col-md-4">
                            <FirmaIpet></FirmaIpet>
                        </div>
                        <div class="col-md-4">
                            <SelloIpet></SelloIpet>
                        </div>
                    </div>
                    <div class="pie-firma text-center font-sm">Sello y Firma Dirección</div>
                </div>

            </div>
            <div class="row">
                <footer>
                    <br>
                    <div class="row">
                        <span class="font-xx-sm"><strong>Nota:</strong>La  presente hoja de ruta debe presentarse ante la autoridad escolas con el V°B° de todas las dependencias</span>
                    </div>
                </footer>
            </div>
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

                // const element = document.getElementById("hdrprn");

                const canvas = await html2canvas(element)
                const imgData = canvas.toDataURL('image/png')

                const docPdf = new jsPDF('l', 'mm', 'a4')
            
                const pdfWidth = docPdf.internal.pageSize.getWidth()
                const pdfHeight = docPdf.internal.pageSize.getHeight()

                const imgProps = docPdf.getImageProperties(imgData)
                const imgWidth = pdfWidth * 0.9 // 90% del ancho A4
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width

                // Centramos la imagen
                const x = (pdfWidth - imgWidth) / 2
                const y = (pdfHeight - imgHeight) / 2

                docPdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
            
               const sNombreTemplate =  'HojaDeRuta.pdf' ; // 'HDR-'+ alumno.apellido + '_' + alumno.nombre + '.pdf';
               docPdf.save(sNombreTemplate);

               /*
               docPdf.html(el , {
                    callback:function(pdf){
                        pdf.save(sNombreTemplate)

                    },
                    x:15,
                    y:0,
                    html2canvas:{ scale:0.20}

                })
                */
            }
        }
        
    }
</script>

<style>
    .bdr-black-1{
            border: 1px solid black;
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
            padding-top: 0px;
        }
      .brdr-red-1{
        border:1px solid red;
      }
</style>