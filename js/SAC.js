
//var server = "http://192.168.2.41:81/SAC";
var server = "http://sac.soyoda.com/SAC_Intranet_CL";
var controller = "";
var fieldHide = "";

//---------------------------------------------------------------------------------------------------------------------------
//Ajax SAC Controller
//---------------------------------------------------------------------------------------------------------------------------
function AjaxSAC(controllerAction, dataPost, loader, callback) {
    if (loader){$("#loader_sys").show();}
    $.ajax({
        url: server + controllerAction,
        type: "post",
        data: dataPost,
        success: function (data) {
            $("#loader_sys").hide();
            callback(data);
        },error: function (jqXHR, ajaxOptions, thrownError) {
            //callback(formatErrorMessage(jqXHR, ajaxOptions));
            alerta(formatErrorMessage(jqXHR, ajaxOptions));
            $("#loader_sys").hide();
        }
    });
}

//Contenedor General
function contentPage(ContenedorGlobal) {
    $("#content_master").hide();
    $("#loader_sys").show();
    $("#content_master").load(ContenedorGlobal, function () {
        setTimeout("$('#content_master').show(200);", 500); 
        setTimeout("$('#loader_sys').hide();", 500);
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Respuestas de Error
//---------------------------------------------------------------------------------------------------------------------------
function formatErrorMessage(jqXHR, exception) {
    if (jqXHR.status === 0) { return ('Not connected.\nPlease verify your network connection.'); }
    else if (jqXHR.status == 404) { return ('The requested page not found. [404]'); }
    else if (jqXHR.status == 500) { return ('Internal Server Error [500].'); }
    else if (exception === 'parsererror') { return ('Requested JSON parse failed.'); }
    else if (exception === 'timeout') { return ('Time out error.'); }
    else if (exception === 'abort') { return ('Ajax request aborted.'); }
    else {
        return ('Uncaught Error.\n' + jqXHR.responseText);
    }
}

//---------------------------------------------------------------------------------------------------------------------------
//Eventos de Escritura onKeyPress
//---------------------------------------------------------------------------------------------------------------------------
function validaEvento(e) {
    var keynum;
    if (window.event)
        { keynum = e.keyCode; }
    else if (e.which)
        { keynum = e.which; }
    return keynum;
}


//---------------------------------------------------------------------------------------------------------------------------
//Alertas de Sistema
//---------------------------------------------------------------------------------------------------------------------------
function alerta(alert_mensaje) {
    $("#alert_sys").show();
    $("#alert_titulo").html("Sac Ventas");
    $("#alert_mensaje").html(alert_mensaje);
    setTimeout(function () {$("#alert_button").focus();}, 100);
}

//---------------------------------------------------------------------------------------------------------------------------
//Alertas de Sistema
//---------------------------------------------------------------------------------------------------------------------------
function modal_sys(sys_modal_contenido,sys_modal_titulo,sys_modal_accion) {
    $("#sys_modal").show();
    $("#sys_modal_titulo").html(sys_modal_titulo);
    $("#sys_modal_contenido").html(sys_modal_contenido);
    $("#sys_modal_accion").html(sys_modal_accion);
}


//---------------------------------------------------------------------------------------------------------------------------
//Alertas de Sistema - Cerrar
//---------------------------------------------------------------------------------------------------------------------------
function alerta_cerrar() {
    $("#alert_sys").hide();
    $("#sys_modal").hide();
}

//---------------------------------------------------------------------------------------------------------------------------
//Ejecuciones con Timers de Pagina
//---------------------------------------------------------------------------------------------------------------------------
function AppTimers() {
    //Notificaciones Top
    //-------------------------------------------------------------
    AppGestorNotificacion();

    setInterval(function () { AppGestorNotificacion(); }, 600000); //10 minutos
}

//Notificaciones Top
function AppGestorNotificacion() {
    AjaxSAC("/Index/AppGestorNotificacion", '', false, function (callback) {
        $("#AppGestorNotificacion_Top").html(callback);
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Carga option en Contenedor
//---------------------------------------------------------------------------------------------------------------------------
function loadOption(option) {
    AjaxSAC(option, "", true, function (callback) {
        $("#contenedor").html(callback);
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Enter para buscador
//---------------------------------------------------------------------------------------------------------------------------
function searchEnter(evento) {
    var key = validaEvento(evento);
    if (key == 13) { searchList(); } else { return true; }
}

//---------------------------------------------------------------------------------------------------------------------------
//Carga Buscador List
//---------------------------------------------------------------------------------------------------------------------------
function searchOdoo(table){
       $( "#txt_search" ).autocomplete({
           source: function(request, response){
               var dataPost = {
                   table_Name : table
               };
                  
               AjaxSAC("/Configuracion/ConsultaApp", dataPost, true, function (callback) {
                   var colums = JSON.parse(callback);
                   response(colums);
               });
                    
           },  
           multiselect: true,
           change:function(){
                $( "#txt_search" ).val("");
           }       
       });
}

function storeSearch(){
    var tempSearch = $("#txt_search").val();
    $("#tempSearch").val(tempSearch);
}
//---------------------------------------------------------------------------------------------------------------------------
//Pagineo Derecha
//---------------------------------------------------------------------------------------------------------------------------
function searchList() {
        AjaxSAC(controller, "", true, function (callback) {
            $("#AppList").html(callback);
        });
    }
//---------------------------------------------------------------------------------------------------------------------------
//Agregar html
//---------------------------------------------------------------------------------------------------------------------------
function AppApendHtml() {
        var x = document.getElementsByName("newlineCal");
        var dato=0;
            for (i = 0; i < x.length; i++) {
                var num = document.getElementsByName("newlineCal")[i].value;
                dato=num;
            }

        var dataPost = {
            cant: dato,
            vend_id: $("#vend_id").val()
        };
        AjaxSAC(controller+"New", dataPost, true, function (callback) {
            $("#Appbody").append(callback);
            setTimeout(function () {
            select2();
            timepicker();            
            //datemask3();
        }, 100);
        });
    }

function AppApendLinePed() {
        var x = document.getElementsByName("newlineinput");
        var dato=0;
            for (i = 0; i < x.length; i++) {
                var num = document.getElementsByName("newlineinput")[i].value;
                dato=num;
            }
        
        var dataPost = {
            cant: dato
        };
        AjaxSAC(controller+"New", dataPost, true, function (callback) {
            $("#gridRow").append(callback);
            select2();
        });
        setTimeout(function(){
            select2();
        },300);
    
    } 

//---------------------------------------------------------------------------------------------------------------------------
//Agregar html
//---------------------------------------------------------------------------------------------------------------------------
function AppRemoveHtml(idtag) {
        $("#"+idtag).remove();
}

function AppRemoveHtmlPedido(idtag) {
        $("#"+idtag).remove();
        var id = idtag.replace("newline","");
        var cantdesc = document.getElementsByName("descitem");
        var desc=0;
        
        for (var i = 0 ;i<cantdesc.length; i++) {
            desc=desc+parseFloat(cantdesc[i]);
        };
        
        $("#DESCTOT").val(desc);
}


//---------------------------------------------------------------------------------------------------------------------------
//Pagineo Derecha
//---------------------------------------------------------------------------------------------------------------------------
function searchListPagDerecha() {
    var dataPost = {
        txt_search: $("#txt_search").val(),
        var_PaginaActual: parseInt($("#hdn_pagina").val()) + 1
    };
    AjaxSAC(controller, dataPost, true, function (callback) {
        $("#AppList").html(callback);
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Pagineo Izquierda
//---------------------------------------------------------------------------------------------------------------------------
function searchListPagIzquierda() {
    var dataPost = {
        txt_search: $("#txt_search").val(),
        var_PaginaActual: parseInt($("#hdn_pagina").val()) - 1
    };
    AjaxSAC(controller, dataPost, true, function (callback) {
        $("#AppList").html(callback);
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Edit Formulario 
//---------------------------------------------------------------------------------------------------------------------------
function AppNuevo() {
    AjaxSAC(controller+'Edit', "", true, function (callback) {
        $("#AppContent_Edit").html(callback);
        $("#AppContent_List").hide();
        $("#AppContent_Cabecera").hide();
        $("#AppContent_Edit").show();
        
    });
}

function AppNuevoReload(control) {
    var dataPost = {
        txt_id: '',
        id_vend: $("#vend_id").val(),
    };
    AjaxSAC(controller+control, dataPost, true, function (callback) {
        $("#AppContent_Edit").html(callback);
        $("#AppContent_List").hide();
        $("#AppContent_Edit").show();
        searchList();
    });
}

            
function AppNuevoCal() {
    var dataPost = {
        txt_id: '',
        id_vend:''
    };
    AjaxSAC(controller+'EditCalendar', dataPost, true, function (callback) {
        $("#AppContent_Edit").html(callback);
        $("#AppContent_List").hide();
        $("#AppContent_Edit").show();

        searchList();
    });
}

function AppNuevoMap() {
    var dataPost = {
        txt_id: '',
        id_vend:''
    };
    AjaxSAC(controller+'EditMap', dataPost, true, function (callback) {
        $("#AppContent_Edit").html(callback);
        $("#AppContent_List").hide();
        $("#AppContent_Edit").show();

        searchList();
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Edit Formulario 
//---------------------------------------------------------------------------------------------------------------------------
function AppEdit_(id) {
    var dataPost = {
        txt_id: id
    };
    AjaxSAC(controller+'Edit', dataPost, true, function (callback) {
        $("#AppContent_Edit").html(callback);
        $("#AppContent_List").hide();
        $("#AppContent_Cabecera").hide();
        $("#AppContent_Edit").show();

        searchList();
    });
}

function AppEditCal(id) {
    var dataPost = {
        txt_id: id
    };
    AjaxSAC(controller+'EditCalendar', dataPost, true, function (callback) {
        $("#AppContent_Edit").html(callback);
        $("#AppContent_List").hide();
        $("#AppContent_Edit").show();

        searchList();
    });
}

function AppEditMap(id) {
    var dataPost = {
        txt_id: id
    };
    AjaxSAC(controller+'EditMap', dataPost, true, function (callback) {
        $("#AppContent_Edit").html(callback);
        $("#AppContent_List").hide();
        $("#AppContent_Edit").show();

        searchList();
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Cerrar Edit Formulario 
//---------------------------------------------------------------------------------------------------------------------------
function edit_cerrar_() {
    $("#AppContent_Edit").html("");
    $("#AppContent_List").show();
    $("#AppContent_Edit").hide();
    searchList();
}

//---------------------------------------------------------------------------------------------------------------------------
//Delete Formulario 
//---------------------------------------------------------------------------------------------------------------------------
function AppDelete(id) {
    var dataPost = {
        txt_id: id
    };
    AjaxSAC(controller+'Delete', dataPost, true, function (callback) {
        alerta(callback);
        searchList();
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Marcado de Checks
//---------------------------------------------------------------------------------------------------------------------------
function AppMarcarChecks() {
    var checks="";
    
    if($("#hdn_checks").val()=="0")
    {
        $("input:checkbox").each(function () {
            try{
            $("#"+$(this).attr('id')).prop('checked',true);
            }catch(e){}
        });
        $("#hdn_checks").val("1");
    }
    else
    {
        $("input:checkbox").each(function () {
            $("#"+$(this).attr('id')).prop('checked',false);
        });
        $("#hdn_checks").val("0");
    }
}

//---------------------------------------------------------------------------------------------------------------------------
//Eliminado de Registros marcados por Checks
//---------------------------------------------------------------------------------------------------------------------------
function AppEliminar() {
    var checks="";
    $("input:checkbox:checked").each(function () {
        checks=checks+($(this).attr('id'))+'|';
    });

    if(checks=='')
    {
        alerta("Por favor seleccionar un elemento");
        return false;
    }
    else
    {
        var dataPost = {
            txt_cadena: checks
        };
        AjaxSAC(controller+'DeleteChecks', dataPost, true, function (callback) {
            alerta(callback);
            searchList();
        });
    }
}

function InicializarFullCalendar(){
    $('#calendar').fullCalendar
    ({
        //defaultView: 'agendaWeek',
        //eventColor: '#D73925',
        //weekends: false,
        fixedWeekCount: false,
        editable: false,
        selectable: true,
        firstDay: 1,
        //timezone:"UTC",
        allDaySlot:false, 
        columnFormat: "ddd",
        dayNames: ['Domingo','Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
        dayNamesShort: ['Domingo','Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        select: function (start, end, allDay) { PushEvento(start,end); } ,
        eventClick: function(calEvent, jsEvent, view) {PushEvento(new Date(calEvent.start),new Date(calEvent.start));}
    });   
    $('.fc-today-button').hide();//BUTTON TODAY
    //$('.fc-button').hide();//BUTTON IZQ-DER
    //$('.fc-toolbar').hide();//TOOLBAR TOP
    //$('.fc-left').html($('.fc-left').html().replace("h2", "strong"));
    $('.fc-toolbar').css("padding", 0);
    $('.fc-toolbar').css("padding-left", 5);
}

//Solo Numeros
function SoloNumero(idnum){
   $('#'+idnum).numeric('.');
}

//Solo Numeros
function SoloNumeroCantidad(idnum){
   $('#'+idnum).numeric('');
}

//Solo Numeros verificar Vacios
function SoloNumeroEmpty(idnum){
   if($('#'+idnum).val()==''){return 0;}
   return $('#'+idnum).val();
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------
//  Inicio de Nuevas Funciones
//--------------------------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------------
//Metodo Multibusqueda
//---------------------------------------------------------------------------------------------------------------------------
function searchOdoo(table){
       $( "#txt_search" ).autocomplete({
           source: function(request, response){
               var dataPost = {
                   table_Name : table
               };
                  
               AjaxSAC("/Configuracion/ConsultaApp", dataPost, true, function (callback) {
                   var colums = JSON.parse(callback);
                   response(colums);
               });
                    
           },  
           multiselect: true,
           change:function(){
                $( "#txt_search" ).val("");
           }       
       });
}

//---------------------------------------------------------------------------------------------------------------------------
//Guardar Busquedas en input temporal
//---------------------------------------------------------------------------------------------------------------------------
function storeSearch(){
    var tempSearch = $("#txt_search").val();
    $("#tempSearch").val(tempSearch);
}

//---------------------------------------------------------------------------------------------------------------------------
//Busqueda y Carga de lista 
//---------------------------------------------------------------------------------------------------------------------------
function searchOdooEnter(evento,page){
    var key = validaEvento(evento);
    if (key == 13) { 
        var searchField = document.getElementsByName("searchOdoo");
        var searchStrTemp="";
        var searchStr="";
        var indice=0;

        if(searchField.length != 0){

            for (var i = 0; i < searchField.length ; i++) {
                searchStrTemp = searchField[i].textContent;
                if(indice == 0){
                    searchStrTemp = "( "+searchStrTemp.replace(":", " LIKE '%")+"%' ";
                    indice++;
                }else{
                    searchStrTemp = " AND "+searchStrTemp.replace(":", " LIKE '%")+"%' ";
                }

                searchStr=searchStr+searchStrTemp;
            }

            searchStr=searchStr+" )";
        }

        var dataPost = {
            txt_search: searchStr,
            var_PaginaActual: page,
        };
        AjaxSAC(controller, dataPost, true, function (callback) {
            $("#AppList").html(callback);
                //setTimeout(function(){
                for (var i = 0; i < fieldHide.length ; i++) {
                    document.getElementById(fieldHide[i]).style.display = 'none';
                }
            //},80);
        });

    } else { return true; }
}

//---------------------------------------------------------------------------------------------------------------------------
//Nuevo Ejecutar busqueda y carga de lista
//---------------------------------------------------------------------------------------------------------------------------
function exeSearchOdoo( ) {
    var e = jQuery.Event("keypress")
    e.which = 13;
    e.keyCode=13;
    searchOdooEnter(e,1);
}

//---------------------------------------------------------------------------------------------------------------------------
//Nuevo Habilitar campos de edicion 
//---------------------------------------------------------------------------------------------------------------------------
function AllowAppEdit(evento) {
    var styleField="border:1; background:F0EEFF;";
    var styleDiv="display:inline;";

    if(evento == false){
        styleField="border:none; background:#FFFFFF;";
        styleDiv="display:none;";
    }
    
    var editField = document.getElementsByName("editField");
    for (var i = 0; i < editField.length; i++) {
           var editFieldTemp =  editField[i];
           editFieldTemp.style.cssText=styleField;
           editFieldTemp.readOnly=false;
        };

    var divOption = document.getElementById("Option_Content");
    divOption.style.cssText=styleDiv;
}

//---------------------------------------------------------------------------------------------------------------------------
//Nuevo Cerrar Edicion
//---------------------------------------------------------------------------------------------------------------------------
function edit_cerrar() {
    $("#AppContent_Edit").html("");
    $("#AppContent_List").show();
    $("#AppContent_Edit").hide();
    exeSearchOdoo();
}

//---------------------------------------------------------------------------------------------------------------------------
//Nuevo edicion
//---------------------------------------------------------------------------------------------------------------------------
function AppEdit(id) {
    var dataPost = {
        txt_id: id
    };
    AjaxSAC(controller+'Edit', dataPost, true, function (callback) {
        $("#AppContent_Edit").html(callback);
        $("#AppContent_List").hide();
        $("#AppContent_Edit").show();
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Nuevo Pagineo Derecha
//---------------------------------------------------------------------------------------------------------------------------
function searchListPagDerecha() {
    var e = jQuery.Event("keypress")
    e.which = 13;
    e.keyCode=13;
    var page = parseInt($("#hdn_pagina").val()) + 1;
    searchOdooEnter(e,page);
    $("#hdn_pagina").val(page);
}


//---------------------------------------------------------------------------------------------------------------------------
//Nuevo Pagineo Izquierda
//---------------------------------------------------------------------------------------------------------------------------
function searchListPagIzquierda() {
    var e = jQuery.Event("keypress")
    e.which = 13;
    e.keyCode=13;
    var page = parseInt($("#hdn_pagina").val()) - 1;
    searchOdooEnter(e,page);
    $("#hdn_pagina").val(page);
}

//---------------------------------------------------------------------------------------------------------------------------
//Nuevo Exportar a Excel
//---------------------------------------------------------------------------------------------------------------------------
function excelExport(namefile,name) {
    $("#tableExport").table2excel({
    exclude: ".noExl",
    name: name,
    filename: namefile
    });
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------
//  Fin de Nuevas Funciones
//--------------------------------------------------------------------------------------------------------------------------------------------------------

//Generacion de Eventos Calendario Supervisor
function PushEventCalendar(TipoVisualizacion) 
{
    GenerateArraysEvents(TipoVisualizacion,function (callback) {
        $('#calendar').fullCalendar('addEventSource', callback);
    });
}


function GenerateArraysEvents(TipoVisualizacion,callback){
    $("#calendar").fullCalendar('removeEvents');
    var events = new Array();
    for (i in obj_Eventos) 
    {
        var fechainicio = new Date(obj_Eventos[i].FECHACREACION);
        var fechafin = new Date();
        fechafin.setMonth(fechafin.getMonth() + 1);
            
        var dia_exe = fechainicio.getUTCDate();
        var mes_exe = fechainicio.getUTCMonth();
        var ano_exe = fechainicio.getUTCFullYear();
        var dif = fechafin - fechainicio;
        var dias = Math.floor(dif / (1000 * 60 * 60 * 24));

        if (obj_Eventos[i].FRECUENCIA == "SEMANAL" && (TipoVisualizacion=="Todos" || TipoVisualizacion=="Semanal")) 
        {
            event = new Object();
            event.id =  obj_Eventos[i].REGID,
            event.title = obj_Eventos[i].CARDNAME,
            event.start = new Date(ano_exe, mes_exe, dia_exe, parseInt(obj_Eventos[i].HORA), 0),
            event.end   = new Date(ano_exe, mes_exe, dia_exe, parseInt(obj_Eventos[i].HORA), 0),
            event.color = obj_Eventos[i].COLOR;
            events.push(event);
        }

        if (obj_Eventos[i].FRECUENCIA == "QUINCENAL" && (TipoVisualizacion=="Todos" || TipoVisualizacion=="Quincenal")) 
        {
            event = new Object();
            event.id =  obj_Eventos[i].REGID,
            event.title = obj_Eventos[i].CARDNAME,
            event.start = new Date(ano_exe, mes_exe, dia_exe, parseInt(obj_Eventos[i].HORA), 0),
            event.end   = new Date(ano_exe, mes_exe, dia_exe, parseInt(obj_Eventos[i].HORA), 0),
            event.color = obj_Eventos[i].COLOR;
            events.push(event);
        }

        if (obj_Eventos[i].FRECUENCIA == "MENSUAL" && (TipoVisualizacion=="Todos" || TipoVisualizacion=="Mensual")) 
        {
            event = new Object();
            event.id =  obj_Eventos[i].REGID,
            event.title = obj_Eventos[i].CARDNAME,
            event.start = new Date(ano_exe, mes_exe, dia_exe, parseInt(obj_Eventos[i].HORA), 0),
            event.end   = new Date(ano_exe, mes_exe, dia_exe, parseInt(obj_Eventos[i].HORA), 0),
            event.color = obj_Eventos[i].COLOR;
            events.push(event);
        }

    }
    callback(events);
}



function ArraysEventsDia(callback) {
      var fecha_consulta = new Date();
//    fecha_consulta.setFullYear(ano);
//    fecha_consulta.setMonth(mes-1);
//    fecha_consulta.setDate(dia);
    var events = new Array();
    for (i in obj_Eventos) {

        var GETDIA = fecha_consulta.getDay();
        var DIA = 0;
        switch (obj_Eventos[i].DIAREAL) {
            case "LUNES": DIA = 1; break;
            case "MARTES": DIA = 2; break;
            case "MIERCOLES": DIA = 3; break;
            case "JUEVES": DIA = 4; break;
            case "VIERNES": DIA = 5; break;
            case "SABADO": DIA = 6; break;
            case "DOMINGO": DIA = 7; break;
        }

        if (obj_Eventos[i].FRECUENCIA == "DIARIO") {
            event = new Object();
            event.CARDCODE = obj_Eventos[i].CARDCODE;
            event.CARDNAME = obj_Eventos[i].CARDNAME;
            event.HORA = String(parseInt(obj_Eventos[i].HORA));
            event.LATITUD = obj_Eventos[i].LATITUD;
            event.LONGITUD = obj_Eventos[i].LONGITUD;
            events.push(event);
        }

        if (obj_Eventos[i].FRECUENCIA == "SEMANAL" && DIA==GETDIA) {
            event = new Object();
            event.CARDCODE = obj_Eventos[i].CARDCODE;
            event.CARDNAME = obj_Eventos[i].CARDNAME;
            event.HORA = String(parseInt(obj_Eventos[i].HORA));
            event.LATITUD = obj_Eventos[i].LATITUD;
            event.LONGITUD = obj_Eventos[i].LONGITUD;
            events.push(event);
        }

        if (obj_Eventos[i].FRECUENCIA == "QUINCENAL") {
            var fechainicio = new Date(obj_Eventos[i].FECHACREACION);
            var fechafin = new Date();

            for (fechainicio; fechainicio <= fecha_consulta; fechainicio.setDate(fechainicio.getDate() + 14)) {
                var diaIni = fechainicio.getDate();
                var mesIni = fechainicio.getMonth();
                var anoIni = fechainicio.getFullYear();
                var diaFin = fecha_consulta.getDate();
                var mesFin = fecha_consulta.getMonth();
                var anoFin = fecha_consulta.getFullYear();
                if (diaIni == diaFin) {
                    if (mesIni == mesFin) {
                        if (anoIni == anoFin) {
                            event = new Object();
                            event.CARDCODE = obj_Eventos[i].CARDCODE;
                            event.CARDNAME = obj_Eventos[i].CARDNAME;
                            event.HORA = String(parseInt(obj_Eventos[i].HORA));
                            event.LATITUD = obj_Eventos[i].LATITUD;
                            event.LONGITUD = obj_Eventos[i].LONGITUD;
                            events.push(event);
                        }
                    }
                }
            }
        }

        if (obj_Eventos[i].FRECUENCIA == "MENSUAL") {
            var fechainicio = new Date(obj_Eventos[i].FECHACREACION);
            var fechafin = new Date();

            for (fechainicio; fechainicio <= fecha_consulta; fechainicio.setDate(fechainicio.getDate() + 28)) {
                var diaIni = fechainicio.getDate();
                var mesIni = fechainicio.getMonth();
                var anoIni = fechainicio.getFullYear();
                var diaFin = fecha_consulta.getDate();
                var mesFin = fecha_consulta.getMonth();
                var anoFin = fecha_consulta.getFullYear();
                if (diaIni == diaFin) {
                    if (mesIni == mesFin) {
                        if (anoIni == anoFin) {
                            event = new Object();
                            event.CARDCODE = obj_Eventos[i].CARDCODE;
                            event.CARDNAME = obj_Eventos[i].CARDNAME;
                            event.HORA = String(parseInt(obj_Eventos[i].HORA));
                            event.LATITUD = obj_Eventos[i].LATITUD;
                            event.LONGITUD = obj_Eventos[i].LONGITUD;
                            events.push(event);
                        }
                    }
                }
            }
        }

    }

    callback(events);
}


function fn_fechaformato(FECHA,TIPO,RETORNO){
    var DIA = "";
    var GETDIA = FECHA.getDay();
    var GMONTH = FECHA.getMonth()+1;
    var MONTH ="";
    MONTH = ((GMONTH.toString().length > 1)? GMONTH : "0"+GMONTH.toString())

    if(TIPO==0){
        switch (GETDIA) {
            case 1:      DIA = "LUNES"; break;
            case 2:      DIA = "MARTES"; break;
            case 3:      DIA = "MIERCOLES"; break;
            case 4:      DIA = "JUEVES"; break;
            case 5:      DIA = "VIERNES"; break;
            case 6:      DIA = "SABADO"; break;
            case 7:      DIA = "DOMINGO"; break;
        }
        DIA=DIA+"  "+FECHA.getDate()+"/"+MONTH +"/"+FECHA.getFullYear();
    }

    if(TIPO==1){
        DIA= FECHA.getFullYear()+"-"+ MONTH +"-"+FECHA.getDate()+" "+FECHA.getHours()+":"+FECHA.getMinutes();
    }

    if(TIPO==2){
        DIA= FECHA.getFullYear()+"-"+ MONTH +"-"+FECHA.getDate();
    }
    
    RETORNO(DIA);
}

function startCursor(obj){
    $("#"+obj).focus(function() {
        setTimeout((function(el) {
            var strLength = el.value.length;
            return function() {
                if(el.setSelectionRange !== undefined) {
                    el.setSelectionRange(strLength, strLength);
                } else {
                    $(el).val(el.value);
                }
        }}(this)), 0);
    });
}

function fn_focus(obj){
    $("#"+obj).focus();
}

function fecActual() {
    var currentdate = new Date();
    var Year    = currentdate.getFullYear();
    var mes     = currentdate.getMonth() + 1;
    var day = currentdate.getDate();
    var hour    = currentdate.getHours();
    var minute = currentdate.getMinutes();
    var second = currentdate.getSeconds();

    if (String(mes).length == 1) {
        mes = '0' + mes;
    }
    if (String(day).length == 1) {
        day = '0' + day;
    }
    if (String(hour).length == 1) {
        hour = '0' + hour;
    }
    if (String(minute).length == 1) {
        minute = '0' + minute;
    }
    if (String(second).length == 1) {
        second = '0' + second;
    }

    var datetime = Year + "-" + mes + "-" + day + " " + hour + ":" + minute + ":" + second;
    return datetime;
}

function horaActual() {
    var currentdate = new Date();
   
    var hour    = currentdate.getHours();
    var minute = currentdate.getMinutes();
    var second = currentdate.getSeconds();

    if (String(hour).length == 1) {
        hour = '0' + hour;
    }
    if (String(minute).length == 1) {
        minute = '0' + minute;
    }
    if (String(second).length == 1) {
        second = '0' + second;
    }

    var hourTime = hour + ":" + minute + ":" + second;
    return hourTime;
}

function unique(list) {
    var result = [];
    $.each(list, function (i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

