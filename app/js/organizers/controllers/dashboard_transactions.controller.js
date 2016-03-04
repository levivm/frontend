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

    OrganizerTransactionsCtrl.$inject = ['$filter', 'organizer', 'datepickerPopupConfig', 'OrganizerServerApi', 'orders', 'refunds', '$http', 'activities'];
    function OrganizerTransactionsCtrl($filter, organizer, datepickerPopupConfig, OrganizerServerApi, orders, refunds, $http, activities) {

        var vm = this;
        var api = OrganizerServerApi;
        var FORMATS = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];

        angular.extend(vm, {
            organizer: organizer,
            format : FORMATS[0],
            maxStartDate : new Date(),
            password_data: {},
            isCollapsed: true,
            isSaving: false,
            sales: [],
            refunds: [],
            reimbursements: [],
            dateOptions : {
                formatYear: 'yyyy',
                startingDay: 1,
                showWeeks:false,
            },
            queries : {
                saleQuery : null,
                refundQuery : null
            },
            salesPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 10,
                maxPagesSize:10,
                pageNumber: 1
            },
            refundsPaginationOpts: {
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
            refundsFilter: {
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
            TYPE_REFUNDS: 'refunds'
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
           if(date === 'refunds_from_date'){
            vm.refundsFilter.from_date_opened = true;
            vm.refundsFilter.until_date_opened = false;
          }
          if(date === 'refunds_until_date'){
            vm.refundsFilter.until_date_opened = true;
            vm.refundsFilter.from_date_opened = false;
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
                    
                  $http.get(api.orders(organizer.id),
                      {params: params})
                      .then(function(response){
                      vm.sales = response.data;
                      vm.sales.results = $filter('orderBy')(vm.sales.results, 'id', true);
                      vm.salesPaginationOpts.totalItems = vm.sales.count;
                      vm.sales = vm.sales.results.slice(0, vm.salesPaginationOpts.itemsPerPage);
                    });
                  break;
                    
                case vm.TYPE_REFUNDS:
                  var params = {
                    page: vm.refundsPaginationOpts.pageNumber,
                    page_size: vm.refundsPaginationOpts.itemsPerPage
                  };
                  
                  if(vm.refundsFilter.activity)
                    params.activity = vm.refundsFilter.activity;
                    
                  if(vm.refundsFilter.from_date)
                    params.from_date = new Date(vm.refundsFilter.from_date).getTime();
                    
                  if(vm.refundsFilter.until_date)
                    params.until_date = new Date(vm.refundsFilter.until_date).getTime();
                    
                  if(vm.refundsFilter.status)
                    params.status = vm.refundsFilter.status;
                    
                  if(vm.refundsFilter.query)
                    params.id = vm.refundsFilter.query;
                    
                  $http.get(api.refunds(organizer.id),
                      {params: params})
                      .then(function(response){
                      vm.refunds = response.data;
                      vm.refunds.results = $filter('orderBy')(vm.refunds.results, 'id', true);
                      vm.refundsPaginationOpts.totalItems = vm.refunds.count;
                      vm.refunds = vm.refunds.results.slice(0, vm.refundsPaginationOpts.itemsPerPage);
                    });
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

        function _getRefunds(){
          refunds.results = $filter('orderBy')(refunds.results, 'id', true);
          vm.refundsPaginationOpts.totalItems = refunds.count;
          vm.refunds = refunds.results.slice(0, vm.refundsPaginationOpts.itemsPerPage);
            // refunds = $filter('orderBy')(refunds, 'id', true);
            // vm.refundsPaginationOpts.totalItems = refunds.length;
            // vm.refunds = refunds.slice(0, vm.refundsPaginationOpts.itemsPerPage);
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }

            angular.extend(vm.strings, {
                ACTION_REIMBURSE: "Reembolsar",
                ACTION_VIEW_DETAIL: "Ver detalle",
                COPY_EMAIL: "¿Desea cambiar su correo electrónico?",
                COPY_NOT_AVAILABLE : "No Disponible",
                COPY_NA : "N/A",
                COPY_START_DATE : "Fecha de inicio:",
                COPY_SEARCH_ORDERS_HELPER : "Número de orden",
                COPY_NO_ORDERS: "Aún no tienes ordenes en tu historial de Ventas",
                COPY_NO_REIMBURSEMENTS: "Aún no tienes reembolsos en tu historial de Ventas",
                COPY_FINAL_TOTAL_SALES_TOOLTIP: "Este es el monto de venta restando la comisión de Trulii, consulte el detalle "+
                                          "para mayor información",
                COPY_TOTAL_SALES_TOOLTIP: "Este es el monto total de la orden sin contar la comisión de Trulii",
                TAB_SALES: "Ventas",
                TAB_REFUNDS: "Reembolsos",
                LABEL_SEARCH_ORDERS : "Buscar Ordenes",
                LABEL_ORDER: "Orden",
                LABEL_ACTIVITY: "Actividad",
                LABEL_PAYMENT: "Pago",
                LABEL_DETAIL: "Detalle",
                LABEL_DATE: "Fecha de venta",
                LABEL_REFUND_DATE: "Fecha de Reembolso",
                LABEL_REFUND_AMOUNT: "Monto",
                LABEL_REFUND_STATE: "Estado",
                LABEL_ASSISTANT: "Asistente",
                LABEL_TOTAL: "Total Ventas",
                LABEL_EVERYBODY: "Todos",
                LABEL_FINAL_TOTAL: "Ventas Netas",
                LABEL_NO_ORDERS: "No hay ordenes en el historial",
                LABEL_NO_REIMBURSEMENTS: "No hay reembolsos en el historial",
            });
        }

        function _activate() {
          console.log(activities);
            datepickerPopupConfig.showButtonBar = false;
            _setStrings();
            _getOrders();
            _getRefunds();
            console.log('organizer:', organizer);
        }

    }

})();
