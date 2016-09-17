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

    OrganizerTransactionsCtrl.$inject = ['$http', '$filter', '$modal', 'organizer', 'OrganizerServerApi', 'orders', 'balances',  'activities', 'withdraws', 'bankingInfo', 'bankingData', 'datepickerPopupConfig', 'Toast'];
    function OrganizerTransactionsCtrl($http, $filter, $modal, organizer, OrganizerServerApi, orders, balances, activities, withdraws, bankingInfo, bankingData, datepickerPopupConfig, Toast) {

        var vm = this;
        var api = OrganizerServerApi;
        var FORMATS = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        var STATUS_APPROVED = 'Aprobado',
            STATUS_DECLINED = 'Rechazado',
            STATUS_PENDING = 'Pendiente';

        var STATUS_APPROVED_BACK = 'approved',
            STATUS_DECLINED_BACK = 'declined',
            STATUS_PENDING_BACK = 'pending';

        var MIN_MOUNT = 30000;
        var sales;
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
            withDrawsPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 5,
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
            withDraw: withDraw,
            changePageWithdraws:changePageWithdraws,
            filterById: filterById,
            minMount:MIN_MOUNT
        });
        
        _activate();

        //--------- Exposed Functions ---------//

        function openDatePicker($event, date){
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
          
          //updateByQuery(vm.TYPE_SALES);
        }
        
        function filterById() {
            setTimeout(function(){ updateByQuery(vm.TYPE_SALES); }, 1000);
        }

        function updateByQuery(type){
            switch(type){
                case vm.TYPE_SALES:

                  var params = {
                    page: vm.salesPaginationOpts.pageNumber,
                    pageSize: vm.salesPaginationOpts.itemsPerPage
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
                  organizer.getOrders(params)
                  .then(function(response){
                      vm.sales = response;
                      vm.sales.results = $filter('orderBy')(vm.sales.results, 'id', true);
                      vm.salesPaginationOpts.totalItems = vm.sales.count;
                      vm.sales = vm.sales.results.slice(0, vm.salesPaginationOpts.itemsPerPage);
                  })
                  
                  break;
            }
        }
        function withDraw(){
          if(vm.balances.available<=MIN_MOUNT){
              Toast.error(vm.strings.DELETE_AVAILABLE_ERROR);
              return;
          }
          var modalInstance = $modal.open({
              templateUrl : 'partials/organizers/messages/confirm_withdraw.html',
              controller : 'ModalInstanceCtrl',
              controllerAs:'modal',
              size : 'lg'
          });

          modalInstance.result.then(function () {
             organizer.postWithDraw()
                      .then(success, error)
          });

          function success(data) {
            vm.balances.available = data.new_available_amount;
            Toast.setPosition("toast-top-center");
            Toast.success(vm.strings.COPY_WITHDRAW_SUCCESS);
            changePageWithdraws();

          }
          function error(response) {
              console.log(response);
          }
        }

        function changePageWithdraws(){
            organizer.getWithDraw(vm.withDrawsPaginationOpts.pageNumber, vm.withDrawsPaginationOpts.itemsPerPage)
                     .then(function (response) {
                       vm.withdrawals = response.results;
                       vm.withDrawsPaginationOpts.totalItems = response.count;
                       vm.withdrawals = response.results.slice(0, vm.withDrawsPaginationOpts.itemsPerPage);
                       _mapWithdraws();
                      });
        }
        //--------- Internal Functions ---------//

        function _getOrders(){
          sales = orders;
          sales.results = $filter('orderBy')(orders.results, 'id', true);
          vm.salesPaginationOpts.totalItems = sales.count;
          vm.sales = sales.results.slice(0, vm.salesPaginationOpts.itemsPerPage);


        }

        function _getBalances(){
          vm.balances = balances;
          vm.withdrawals = withdraws.results;
          vm.withDrawsPaginationOpts.totalItems = withdraws.count;
          vm.withdrawals = withdraws.results.slice(0, vm.withDrawsPaginationOpts.itemsPerPage);

        }
        function _mapWithdraws(){
          vm.withdrawals = vm.withdrawals.map(mapStatus);
          function mapStatus(withdraw){
            switch (withdraw.status) {
              case STATUS_PENDING_BACK:
                withdraw.status = STATUS_PENDING;
                break;
              case STATUS_APPROVED_BACK:
                withdraw.status = STATUS_APPROVED;
                break;
              case STATUS_DECLINED_BACK:
                withdraw.status = STATUS_DECLINED;
                break;
            }
            return withdraw;
          }
        }
        
         function _setOrganizerBankingData(){

            if(!(_.isEmpty(bankingData))){ 
                var current_bank_data = _.find(bankingInfo.banks, 
                                                { 'bank_name': bankingData.bank });
                vm.bank = current_bank_data.bank_name;
                vm.accountBank = bankingData.account.substr(bankingData.account.length -4); 
            }
        }
        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }

            angular.extend(vm.strings, {
                ACTION_VIEW_DETAIL: "Ver detalle",
                ACTION_CREATE_ACTIVITY: "Crear actividad",
                ACTION_BALANCE_WITHDRAW: "Solicitar dinero",
                COPY_EMAIL: "¿Desea cambiar su correo electrónico?",
                COPY_NOT_AVAILABLE : "No Disponible",
                COPY_NA : "N/A",
                COPY_START_DATE : "Fecha de inicio:",
                COPY_SEARCH_ORDERS_HELPER : "Nro. orden",
                COPY_SALES: "Estas son las transacciones realizadas",
                COPY_NO_ORDERS: "No has hecho ninguna venta hasta ahora. Mientras tanto, ¿por qué no te animas a publicar una actividad?",
                COPY_FINAL_TOTAL_SALES_TOOLTIP: "Este es el monto de venta restando la comisión de Trulii, consulte el detalle "+
                                          "para mayor información",
                COPY_TOTAL_SALES_TOOLTIP: "Este es el monto total de la orden sin contar la comisión de Trulii",
                COPY_TITLE_BALANCE: "Balance",
                COPY_BALANCE_AVAILABLE: "Monto disponible",
                COPY_BALANCE_UNAVAILABLE: "Monto no disponible",
                TAB_BALANCE: "Transacciones > Balance",
                TAB_SALES: "Transacciones > Ventas",
                TAB_WITHDRAWALS: "Transacciones > Historial de retiros",
                COPY_WITHDRAWALS: "Revisa todos los retiros que has solicitado en la plataforma desde el mas reciente hasta el primero.",
                COPY_NO_WITHDRAWALS: "Hasta ahora no has solicitado ningún retiro a tu cuenta bancaria. Recuerads que puedes solicitar el monto disponible cuando desees.",
                COPY_BALANCE: "Revisa la cantidad de dinero que tienes disponible para solicitar la transferencia a tu cuenta. Solicita el retiro cuando quieras.",
                COPY_BALANCE_NOTE: "El monto será transferido a tu cuenta de",
                COPY_TOOLTIP_MOUNT_AVAILABLE: "Este es el monto disponible a ser trasnferido a tu cuenta.",
                COPY_TOOLTIP_MOUNT_UNAVAILABLE: "Aún no puedes solicitar la transferencia de este monto",
                COPY_WITHDRAW_SUCCESS: "Su retiro está siendo procesado.",
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
                SEARCH_BALANCE_PLACEHOLDER: "Busca por nro. orden, fecha de retiro o monto solicitado",
                LABEL_BALANCE_ORDER: "Nro. retiro petición",
                LABEL_BALANCE_DATE: "Fecha de Retiro",
                LABEL_BALANCE_MOUNT: "Monto solicitado",
                LABEL_BALANCE_STATUS: "Estatus",
                LABEL_CURRENCY: "COP",
                LABE_DESCRIPTION: "Descripción",
                COPY_BALANCE_ACCOUNT: "El monto será transferido a tu cuenta de ",
                DELETE_AVAILABLE_ERROR: "No tiene suficiemente monto para solicitarlo",
                STATUS_APPROVED: 'Aprobado',
                STATUS_DECLINED: 'Rechazado',
                STATUS_PENDING: 'Pendiente'

            });
        }

        function _activate() {
            datepickerPopupConfig.showButtonBar = false;
            _setStrings();
            _getOrders();
            _getBalances();
            _mapWithdraws();
            _setOrganizerBankingData();
            

        }

    }

})();
