/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerTransactionsCtrl
 * @description Handles Transactions section for Organizer Dashboard
 * @requires organizer
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerTransactionsCtrl', OrganizerTransactionsCtrl);

    OrganizerTransactionsCtrl.$inject = ['$filter', 'organizer', 'datepickerPopupConfig', 'OrganizerServerApi', 'orders', '$http', 'activities'];
    function OrganizerTransactionsCtrl($filter, organizer, datepickerPopupConfig, OrganizerServerApi, orders, $http, activities) {

        var vm = this;
        var api = OrganizerServerApi;
        var FORMATS = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];

        angular.extend(vm, {
            organizer: organizer,
            format : FORMATS[0],
            maxStartDate : new Date(),
            activities: activities,
            password_data: {},
            isCollapsed: true,
            isSaving: false,
            sales: [],
            dateOptions : {
                formatYear: 'yyyy',
                startingDay: 1,
                showWeeks:false,
            },
            queries : {
                saleQuery : null,
            },
            salesPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 10,
                maxPagesSize:10,
                pageNumber: 1
            },
            salesFilter: {
              from_date: null,
              until_date: null,
              from_date_opened: false,
              until_date_opened: false,
              status: null,
              query: null,
              activity: null
            },
            updateByQuery:updateByQuery,
            openDatePicker: openDatePicker,
            TYPE_SALES: 'sales',
        });

        _activate();
        var sales = $filter('orderBy')(orders, 'id', true);

        //--------- Exposed Functions ---------//

        function openDatePicker($event, date){
          console.log('openDatePicker');
          $event.preventDefault();
          $event.stopPropagation();

          if(date === 'sales_from_date'){
            vm.salesFilter.from_date_opened = true;
            vm.salesFilter.until_date_opened = false;
          }
          if(date === 'sales_until_date'){
            vm.salesFilter.until_date_opened = true;
            vm.salesFilter.from_date_opened = false;
          }
        }

        function updateByQuery(type){
            switch(type){
                case vm.TYPE_SALES:

                  var params = {
                    page: vm.salesPaginationOpts.pageNumber,
                    page_size: vm.salesPaginationOpts.itemsPerPage
                  };

                  if(vm.salesFilter.activity)
                    params.activity = vm.salesFilter.activity;

                  if(vm.salesFilter.from_date)
                    params.from_date = new Date(vm.salesFilter.from_date).getTime();

                  if(vm.salesFilter.until_date)
                    params.until_date = new Date(vm.salesFilter.until_date).getTime();

                  if(vm.salesFilter.status)
                    params.status = vm.salesFilter.status;

                  if(vm.salesFilter.query)
                    params.id = vm.salesFilter.query;
                  
                  organizer.getOrders(vm.salesPaginationOpts.pageNumber, vm.salesPaginationOpts.itemsPerPage)
                  .then(function(response){
                      vm.sales = response.data;
                      vm.sales.results = $filter('orderBy')(vm.sales.results, 'id', true);
                      vm.salesPaginationOpts.totalItems = vm.sales.count;
                      vm.sales = vm.sales.results.slice(0, vm.salesPaginationOpts.itemsPerPage);
                  })
                  
                  break;
            }
        }

        //--------- Internal Functions ---------//

        function _getOrders(){
          sales = orders;
          sales.results = $filter('orderBy')(orders.results, 'id', true);
          vm.salesPaginationOpts.totalItems = sales.count;
          vm.sales = sales.results.slice(0, vm.salesPaginationOpts.itemsPerPage);


        }


        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }

            angular.extend(vm.strings, {
                ACTION_VIEW_DETAIL: "Ver detalle",
                ACTION_CREATE_ACTIVITY: "Crear actividad",
                COPY_EMAIL: "¿Desea cambiar su correo electrónico?",
                COPY_NOT_AVAILABLE : "No Disponible",
                COPY_NA : "N/A",
                COPY_START_DATE : "Fecha de inicio:",
                COPY_SEARCH_ORDERS_HELPER : "Nro. orden",
                COPY_NO_ORDERS: "No has hecho ninguna venta hasta ahora. Mientras tanto, ¿por qué no te animas a publicar una actividad?",
                COPY_FINAL_TOTAL_SALES_TOOLTIP: "Este es el monto de venta restando la comisión de Trulii, consulte el detalle "+
                                          "para mayor información",
                COPY_TOTAL_SALES_TOOLTIP: "Este es el monto total de la orden sin contar la comisión de Trulii",
                TAB_SALES: "Ventas",
                LABEL_SEARCH_ORDERS : "Buscar Ordenes",
                LABEL_ORDER: "Orden",
                LABEL_ACTIVITY: "Actividad",
                LABEL_PAYMENT: "Pago",
                LABEL_DETAIL: "Detalle",
                LABEL_DATE: "Fecha de venta",
                LABEL_ASSISTANT: "Asistente",
                LABEL_TOTAL: "Total Ventas",
                LABEL_EVERYBODY: "Todos",
                LABEL_FINAL_TOTAL: "Ventas Netas",
                LABEL_NO_ORDERS: "No hay ordenes en el historial",
            });
        }

        function _activate() {
            datepickerPopupConfig.showButtonBar = false;
            _setStrings();
            _getOrders();
            console.log('organizer:', organizer);
        }

    }

})();
