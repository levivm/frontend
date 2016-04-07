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
    StudentHistoryCtrl.$inject = ['$filter', '$http', 'student', 'titleTruncateSize', 'Analytics', 'StudentServerApi', 'datepickerPopupConfig', 'activityList'];

    function StudentHistoryCtrl($filter, $http, student, titleTruncateSize, Analytics, StudentServerApi, datepickerPopupConfig, activityList) {
        var vm = this;
        var api = StudentServerApi;
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
            openDatePicker: openDatePicker,
        });

        activate();

        var orders = [];

        /*      Exposed Functions      */

        function openDatePicker($event, date){
          console.log('openDatePicker');
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

        function updateByQuery(type){
            switch(type){
                case vm.TYPE_ORDER:
                  var params = {
                    page: vm.ordersPaginationOpts.pageNumber,
                    page_size: vm.ordersPaginationOpts.itemsPerPage
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

                  $http.get(api.orders(student.id),
                    {params: params})
                    .then(function(response){
                    vm.orders = response.data;
                    vm.orders.results = $filter('orderBy')(vm.orders.results, 'id', true);
                    vm.ordersPaginationOpts.totalItems = vm.orders.count;
                    vm.orders = vm.orders.results.slice(0, vm.ordersPaginationOpts.itemsPerPage);
                  });
                  break;

            }
        }

        function seeOrder(orderId){
            Analytics.studentEvents.seeOrder(orderId);
        }

        /*       Internal Functions      */

        function _getOrders(){

            student.getOrders().then(success, error);

            function success(ordersResponse){
              orders = ordersResponse;
              orders.results = $filter('orderBy')(orders.results, 'id', true);
              vm.ordersPaginationOpts.totalItems = orders.count;
              vm.orders = orders.results.slice(0, vm.ordersPaginationOpts.itemsPerPage);

            }
            function error(orders){
                console.log('Error retrieving Student Orders History');
            }

        }


        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_REIMBURSE: "Solicitar Reembolso",
                ACTION_FIND_ACTIVITY: "Buscar Actividad",
                ACTION_VIEW_DETAIL: "Ver detalle",
                COPY_SEARCH_ORDERS_HELPER: "Nro de orden",
                COPY_NOT_AVAILABLE: "No Disponible",
                COPY_NA : "N/A",
                COPY_START_DATE: "Fecha inicio: ",
                LABEL_SEARCH:"Revisa toda la informacion de tu orden de compra. "
                + "Puedes incluso solicitar el reembolso del monto total de la orden o el monto "
                + "correspondiente por cada asistente",
                LABEL_EMPTY_ORDERS: "No te has inscrito en ninguna actividad aún. Eso nos parte el corazón. ¿Por qué no te animas hoy a aprender lo que te apasiona?",
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
                HEADER_TOTAL: "Monto"
            });
        }

        function activate() {
            _setStrings();
            _getOrders();
        }

    }

})();
