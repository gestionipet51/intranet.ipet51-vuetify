<template>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <div ref="pdfContent">
        <div id="pdfContent" class="">
                <v-container class="report">
                        <v-row>
                            <v-col cols="12" class="text-center">
                                <div class="font-title-2"><strong>Hoja de Ruta</strong></div>
                            </v-col>
                        </v-row>
                        <br>
                        <v-row>
                            <v-col cols="12">
                                    <div class="font-title-1 text-center">Instituto Provincial de Educación Técnica N° 51 "Nicolas Avellaneda"</div>
                            </v-col>
                        </v-row>
                        <br>
                        <v-row class="text-center">
                            <v-col cols="12">
                               <v-row>
                                        <v-col>Estudiante</v-col>
                                        <v-col>Curso-Division</v-col>
                                        <v-col>Condicion</v-col>
                                        <v-col>Ciclo</v-col>
                                        <v-col>Especialidad</v-col>
                                </v-row>
                                <hr>
                                <v-row class="font-sm">
                                    <v-col>{{matricula.apellido}},{{matricula.nombre}}</v-col>
                                    <v-col>{{matricula.Curso}}</v-col>
                                    <v-col>{{COND}}</v-col>
                                    <v-col>{{ciclo}}</v-col>
                                    <v-col>{{matricula.plan_estudio}}</v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row class="font-sm text-center">
                            <v-col>
                                <div class="font-sm">
                                    El estudiante entrega todos los elementos a cargo y cancela los compromisos con las siguientes observaciones
                                </div>
                            </v-col>
                        </v-row>
                        <br>
                        <br>
                        <br>
                        <v-row>
                                <v-col cols="12">
                                    <table class="table">
                                        <thead>
                                            <tr class="">
                                                <th scope="col" class="text-center">V°B° Cooperadora</th>
                                                <th scope="col" class="text-center">V°B° Taller-Laboratorio</th>
                                                <th scope="col" class="text-center">V°B° Internado</th>
                                                <th scope="col" class="text-center">V°B° Biblioteca</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="font-sm">
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
                                            <tr scope="row" class="font-sm">
                                                <td class="text-center">{{matricula.coop_responsable}}</td>
                                                <td class="text-center">{{matricula.tl_responsable}}</td>
                                                <td class="text-center">{{matricula.int_responsable}}</td>
                                                <td class="text-center">{{matricula.bl_responsable}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </v-col>
                        </v-row>
                        <br>
                        <br>
                        <br>
                        <v-row>
                            <v-col cols="5" class="font-xx-sm text-center">
                                <hr>
                                Firma Padre/Madre/Tutor
                            </v-col>
                            <v-col cols="2"></v-col>
                            <v-col cols="5" class="font-xx-sm text-center">
                                <hr>
                                Firma Estudiante
                            </v-col>
                        </v-row>
                        <br>
                        <v-row class="">
                                <v-col  cols="8" class="font-sm">
                                    <v-container>
                                        <p>Autoridad Competente</p>
                                        <br>
                                        <p>El estudiante ha cancelado los compromisos el dia : <strong>{{fecha.toLocaleDateString('es-AR')}}</strong></p>
                                        <br>
                                        <p>Marcos Juarez, <strong>{{DIA}}</strong> de <strong>{{MES}}</strong> de  <strong>{{ANIO}}</strong></p>
                                    </v-container>
                                </v-col>
                                <v-col cols="4">
                                    <v-row>
                                        <v-col cols="4" class="text-center">
                                            <FirmaIpet></FirmaIpet>
                                        </v-col>
                                        <v-col cols="1"></v-col>
                                        <v-col cols="4" class="text-center">
                                            <SelloIpet></SelloIpet>
                                        </v-col>
                                    </v-row>
                                    <v-row class="pie-firma text-center font-sm">
                                        <v-col cols="12">
                                            Sello y Firma Dirección
                                        </v-col>
                                    </v-row>
                                </v-col>
                        </v-row>
                        <br>
                        <v-row>
                            <v-col cols="12">
                                <span class="font-xx-sm">
                                    <strong>Nota:</strong>La  presente hoja de ruta debe presentarse ante la autoridad escolas con el V°B° de todas las dependencias
                                </span>
                            </v-col>
                        </v-row>
                </v-container>
            </div>
    </div>
</template>


<script>

    // import html2canvas from 'html2canvas'
    // import html2pdf from 'html2pdf.js';
    // import jsPDF from 'jspdf'

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
            
            doPDF(){
                
                // const element = this.$refs.pdfContent
                // const docPdf = new jsPDF('l', 'mm', 'a4');
                // const pdfWidth = docPdf.internal.pageSize.getWidth();
                // const pdfHeight = docPdf.internal.pageSize.getHeight();

                // const element = document.getElementById("pdfContent");
                /*
                    // element.classList.add('pt-80');
                    const canvas = await html2canvas(element);
                    const imgData = canvas.toDataURL('image/png');

                    const imgProps = docPdf.getImageProperties(imgData);
                    const imgWidth = pdfWidth * 0.9 ;// 90% del ancho A4
                    const imgHeight = ((imgProps.height * imgWidth) / imgProps.width) ;

                    // Centramos la imagen
                    const x = ((pdfWidth - imgWidth) / 2) ;
                    const y = ((pdfHeight - imgHeight) / 2) + 10 ;

                    docPdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
                
                const sNombreTemplate =  'HojaDeRuta.pdf' ; // 'HDR-'+ alumno.apellido + '_' + alumno.nombre + '.pdf';
                docPdf.save(sNombreTemplate);
               */

               // var opts = {
               //  margin : {top:2,right:3,bottom:2,left:3},
               //  filename : 'HojaDeRuta.pdf',
               //  image: { type:'jpeg' , quality : 0.90 },
               //  html2canvas: { scale: 0.2, useCORS: true},
               //  jsPDF: { unit :'mm',format:'A4',orientation:'landscape'},
               //  pagebrak: { mode:['avoid-all','css','legacy']}
               // }

               // html2pdf().set(opts).from(element).save();
               // html2pdf(element,opts);

               /**
                * 
                docPdf.html(element,{
                    callback:function(pdf){
                        pdf.save('HojaDeRuta.pdf')
                    },
                    opts
                    })
                */

                return this.$refs.pdfContent;
            }
            
            /** 
            doPDF(){
                const options = {
                    margin:[10,10,10,10],
                    filename: 'hoja_de_ruta.pdf',
                    image: { type: 'jpeg', quality:0.98},
                    html2canvas:{scale: 3 ,logging:true,useCORS:true },
                    jsPDF : { unit:'mm',format:'A4',orientation:'landscape'}
                }

                const el = document.getElementById('pdfContent');

                html2pdf().set(options).from(el.innerHTML).save();
            }
            */
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

    .font-title-2{
        font-size:1.5rem;
    }

    .font-title-1{
        font-size:1.8rem;
    }

    .font-ita{
        font-style: italic;
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
            height: 200px;
            max-height: 220px;
        }
        
      .pie-firma{
            padding-top: 0px;
        }
      .pt-20{
            padding-top: 20px;
        }

      .pt-40{
        padding-top: 40px;
      }

      .pt-60{
        padding-top: 60px;
      }

      .pt-80{
        padding-top : 80px; 
      }

      .pt-120{
        padding-top:120px;
      }

      .pt-160{
        padding-top: 160px;
      }

      .bdr-red-1{
        border:1px solid red;
      }

      .report{
        /*
        width:100%;
        padding-top: 50px;
        min-height:100vh;
        padding: 40px;
        */
        display:flex;
        flex-direction: column;
        background: #fff;
      }
</style>