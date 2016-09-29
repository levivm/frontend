/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentHistoryCtrl
 * @description Handles Student History Dashboard
 * @requires activities
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentHistoryCtrl', StudentHistoryCtrl);
    StudentHistoryCtrl.$inject = ['$filter', '$http', 'student', 'titleTruncateSize', 'Analytics', 'datepickerPopupConfig', 'activityList', 'orders'];

    function StudentHistoryCtrl($filter, $http, student, titleTruncateSize, Analytics, datepickerPopupConfig, activityList, orders) {
        var vm = this;
        var FORMATS = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];

        angular.extend(vm,{
            activities: null,
            activityList: activityList,
            options: {actions: ['view']},
            updateByQuery:updateByQuery,
            seeOrder:seeOrder,
            format : FORMATS[0],
            maxStartDate : new Date(),
            queries : {
                orderQuery : null,
                assistantQuery : null
            },
            ordersPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 10,
                pageNumber: 1,
                maxPagesSize : 10
            },
            TYPE_ORDER: 'order',
            titleSize: titleTruncateSize,
            ordersFilter: {
              from_date: null,
              until_date: null,
              from_date_opened: false,
              until_date_opened: false,
              status: null,
              query: null,
              activity: null
            },
            dateOptions : {
                formatYear: 'yyyy',
                startingDay: 1,
                showWeeks:false,
            },
            openDatePicker: openDatePicker,
            filterById: filterById,
            search:false
        });

        activate();

       // var orders = [];

        /*      Exposed Functions      */

        function openDatePicker($event, date){
          $event.preventDefault();
          $event.stopPropagation();

          if(date === 'orders_from_date'){
            vm.ordersFilter.from_date_opened = true;
            vm.ordersFilter.until_date_opened = false;
          }
          if(date === 'orders_until_date'){
            vm.ordersFilter.until_date_opened = true;
            vm.ordersFilter.from_date_opened = false;
          }
        }
        
        function filterById() {
            setTimeout(function(){ updateByQuery(vm.TYPE_ORDER) }, 1000);
        }
        
        function updateByQuery(type){
            switch(type){
                case vm.TYPE_ORDER:
                  var params = {
                    page: vm.ordersPaginationOpts.pageNumber,
                    pageSize: vm.ordersPaginationOpts.itemsPerPage
                  };

                  if(vm.ordersFilter.activity)
                    params.activity = vm.ordersFilter.activity;

                  if(vm.ordersFilter.from_date)
                    params.from_date = new Date(vm.ordersFilter.from_date).getTime();

                  if(vm.ordersFilter.until_date)
                    params.until_date = new Date(vm.ordersFilter.until_date).getTime();

                  if(vm.ordersFilter.status)
                    params.status = vm.ordersFilter.status;

                  if(vm.ordersFilter.query)
                    params.id = vm.ordersFilter.query;
                    
                  student.getOrders(params).then(success, error);
                  
                  break;

            }
        }

        function seeOrder(orderId){
            Analytics.studentEvents.seeOrder(orderId);
        }

        /*       Internal Functions      */

        function success(ordersResponse){
            vm.search = true;
            orders = ordersResponse;
            _setOrders();
        }
        function error(orders){
            //console.log('Error retrieving Student Orders History');
        }
        
        function _setOrders() {
            orders.results = $filter('orderBy')(orders.results, 'id', true);
            vm.ordersPaginationOpts.totalItems = orders.count;
            vm.orders = orders.results.slice(0, vm.ordersPaginationOpts.itemsPerPage);
        }


        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_REIMBURSE: "Solicitar Reembolso",
                ACTION_FIND_ACTIVITY: "A ver qué encuentro",
                ACTION_VIEW_DETAIL: "Ver detalle",
                COPY_SEARCH_ORDERS_HELPER: "Nro de orden",
                COPY_NOT_AVAILABLE: "No Disponible",
                COPY_NA : "N/A",
                COPY_START_DATE: "Fecha inicio: ",
                TAB_HISTORY: "Transacciones",
                COPY_HISTORY: "Estas son las transacciones realizadas",
                LABEL_SEARCH:"Revisa toda la informacion de tu orden de compra. "
                + "Puedes incluso solicitar el reembolso del monto total de la orden o el monto "
                + "correspondiente por cada asistente",
                LABEL_EMPTY_ORDERS: "No tienes ninguna transacción porque aún no te has inscrito a ninguna actividad. Eso nos destroza el corazón. ¿Qué tal si pruebas buscando alguito?",
                LABEL_EMPTY_SEARCH_ORDERS: "No hay ninguna orden que cumpla con los párametros de busqueda.",
                LABEL_EVERYBODY: "Todos",
                COPY_EMPTY_ORDERS: "Parece ser el momento perfecto para que descubras una nueva pasión, aprendas un nuevo pasatiemo o mejores tu curriculo",
                TAB_ORDERS: "Compras",
                PLURALIZE_ASSISTANT: "{} asistente",
                PLURALIZE_ASSISTANTS: "{} asistentes",
                HEADER_ORDER: "Orden",
                HEADER_ACTIVITY: "Actividad",
                HEADER_PAYMENT: "Pago",
                HEADER_DETAIL: "Detalle",
                HEADER_STATUS: "Estatus",
                HEADER_ASSISTANT: "Asistente",
                HEADER_PURCHASE_DATE: "Fecha de compra",
                HEADER_TOTAL: "Monto",
                STATUS_CANCELLED: "Cancelada"
            });
        }

        function activate() {
            _setStrings();
           _setOrders();
        }

    }

})();
