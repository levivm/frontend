/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.ActivitiesManageCtrl
 * @description ActivitiesManageCtrl
 * @requires activity The activity being accessed
 */
(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('ActivitiesManageCtrl', ActivitiesManageCtrl);

    ActivitiesManageCtrl.$inject = ['$scope', '$filter', '$state', 'activity', 'ActivitiesManager', 'Analytics', 'serverConf'];
    function ActivitiesManageCtrl($scope, $filter, $state, activity, ActivitiesManager, Analytics, serverConf) {

        var vm = this;
        angular.extend(vm, {
            orders : [],
            assistants : [],
            calendars : [],
            activeCalendar : null,
            queries : {
                orderQuery : null,
                assistantQuery : null
            },
            orderPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 10,
                pageNumber: 1,
                maxPagesSize:5
            },
            calendarPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 4,
                pageNumber: 1,
                maxPagesSize:5
            },
            expandCalendar : expandCalendar,
            updateByQuery: updateByQuery,
            pageChange: pageChange,
            TYPE_ORDER: 'order',
            TYPE_ASSISTANT: 'assistant',
            TYPE_CALENDAR: 'calendar',
            scroll: 0,
            toggleSidebar: toggleSidebar,
            sidebar: false,
            isActive: isActive,
            dashboardItem:dashboardItem,
            actionNavbarSecondary:actionNavbarSecondary,
            getAmazonUrl: getAmazonUrl
        });

        var orders = [];
        var calendars = [];
        var assistants = [];

        _activate();

        
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }


        function isActive(stateStr){
            return $state.includes(stateStr);
        }

        function updateByQuery(type){
            switch(type){
                case vm.TYPE_ORDER:
                    vm.orders = $filter('filter')(orders, vm.queries.orderQuery);
                    break;
                case vm.TYPE_ASSISTANT:
                    vm.assistants = $filter('filter')(assistants, vm.queries.assistantQuery);
                    break;
            }
        }

        function toggleSidebar(){
            vm.showSidebar = !vm.showSidebar;
        }

        function pageChange(type){
            var offset = null;
            var start = null;
            var end = null;
            switch(type){
                case vm.TYPE_ORDER:
                    offset = vm.orderPaginationOpts.itemsPerPage;
                    start = (vm.orderPaginationOpts.pageNumber -1) * offset;
                    end = vm.orderPaginationOpts.pageNumber * offset;
                    vm.orders = orders.slice(start, end);
                    //console.log('orders:', vm.orders);
                    break;
                case vm.TYPE_CALENDAR:
                    offset = vm.calendarPaginationOpts.itemsPerPage;
                    start = (vm.calendarPaginationOpts.pageNumber -1) * offset;
                    end = vm.calendarPaginationOpts.pageNumber * offset;
                    console.log(vm.calendarPaginationOpts.pageNumber, 'slice(' + start + ',' + end + ')');
                    vm.calendars = calendars.slice(start, end);
                    //console.log('calendars:', vm.calendars);
                    break;
            }
        }

        function expandCalendar(calendar,type){
            if(vm.activeCalendar && vm.activeCalendar.id === calendar.id){
                vm.activeCalendar = null;
                return;
            }

            switch(type){
                case vm.TYPE_ASSISTANT:
                    vm.activeCalendar = calendar;
                    //console.log('assistants',angular.copy(calendar.assistants));
                    assistants = calendar.assistants;
                    vm.assistants = assistants;
                    break;
                case vm.TYPE_ORDER:
                    vm.orders =  _.filter(orders,orderBelongsToCalendar);
                    vm.total  = _.sum(vm.orders,getTotal);
                    vm.totalWithFee = _.sum(vm.orders,getTotalWithFee);
                    vm.netTotal = vm.total - vm.totalWithFee;
                    vm.activeCalendar = calendar;
                    break;
            }

            function orderBelongsToCalendar(order){
                return order.calendar === calendar.id;
            }

            function getTotal(order){
                return order.is_free ? 0 : order.amount;
            }

            function getTotalWithFee(order){
                return order.is_free ? 0 : order.amount * order.fee;
            }
        }

        //Functions Analytics data

        function dashboardItem(item){
            Analytics.organizerEvents.dashboardManageItem(item);
        }
        function actionNavbarSecondary(item){
            Analytics.organizerEvents.navbarActionSecondary(item);
        }
        //End Functions Analytics data

        function _getOrders(activityId){
            ActivitiesManager.getOrders(activityId).then(success, error);

            function success(ordersResponse){
                orders = $filter('orderBy')(ordersResponse.map(mapOrder), 'id', true);
                vm.orderPaginationOpts.totalItems = orders.length;
                vm.orders = orders;
            }
            function error(response){
                console.error('_getOrders. Error in orders response:', response);
            }

            function mapOrder(order){
                var cost = order.amount / order.quantity;
                order.unit_price = cost;
                return order;
            }
        }

        function _getCalendars(activity){
          if(activity.calendars){
            calendars = $filter('orderBy')(activity.calendars.map(_mapDateMsg), '-initial_date');
            vm.calendars = calendars.slice(0, vm.calendarPaginationOpts.itemsPerPage);
            vm.calendarPaginationOpts.totalItems = calendars.length;
            return calendars;
          }
        }

        function _mapMainPicture(activity){
            angular.forEach(activity.pictures, function(picture, index, array){
                if(picture.main_photo){ activity.main_photo = picture.photo; }

                if( index === (array.length - 1) && !activity.main_photo){ activity.main_photo = array[0].photo; }
            });

            return activity;
        }

        function _mapDateMsg(calendar){
            calendar.fromDate = $filter('date')(calendar.initial_date, 'dd MMM yy');
            calendar.toDate = $filter('date')(calendar.closing_sale, 'dd MMM yy');
            return calendar;
        }
        

        function _setStrings() {
            if (!vm.strings) { vm.strings = {}; }
            angular.extend(vm.strings, {
                ACTION_REIMBURSE_ORDER: "Reembolsar Orden",
                ACTION_REIMBURSE_ASSISTANT: "Reembolsar Asistente",
                ACTION_VIEW_DETAIL: "Ver detalle",
                ACTION_VIEW: "Ver",
                ACTION_PRINT: "Imprimir",
                COPY_ORDERS: "Revisa tus órdenes de compra asociadas a esta actividad agrupadas por calendario",
                COPY_ASSISTANTS: "Consulta los datos de las personas que han inscrito a las diferentes fechas de inicio de esta actividad",
                COPY_MANAGE: "Gestionar",
                COPY_SEAT: "Cupo",
                COPY_SEATS: "Cupos",
                COPY_SOLD_SEATS: "Cupos vendidos",
                COPY_SEARCH: "Buscar por número, fecha o monto",
                COPY_FREE: "Gratis",
                COPY_SEARCH_ASSISTANTS: "Buscar nombre, apellido, correo, orden o código",
                LABEL_MANAGE: "Gestionar",
                LABEL_ORDER_NUMBER: "Orden N°",
                LABEL_CALENDAR: "Inicio",
                LABEL_SEARCH: "Buscar Ordenes",
                LABEL_EMPTY_ORDERS: "No hay órdenes de compra",
                COPY_EMPTY_ORDERS: "Aún no tienes órdenes de compra para esta actividad  ¿No atrae lo suficiente"
                    + " la atención de los usuarios? Podrías agregar más fotos, extender la descripción o agregar "
                    + "un vídeo. ¡Ánimo!",
                LABEL_EMPTY_CALENDARS: "No hay calendarios",
                COPY_EMPTY_CALENDARS: "Aún no tienes calendarios creados para esta actividad. Ve a la sección de "
                + "Editar Actividad para comenzar a crear calendarios para que tus estudiantes se inscriban. ¡Anímate!",
                LABEL_EMPTY_ASSISTANTS: "No hay asistentes",
                COPY_EMPTY_ASSISTANTS: "Aún no tienes asistentes registrados en esta actividad¿No atrae lo suficiente"
                + " la atención de los usuarios? Podrías agregar más fotos, extender la descripción o agregar "
                + "un vídeo. ¡Ánimo!",
                COPY_ASSISTANT_CODE_TOOLTIP: "Este código es único y ayuda a identificar a un asistente",
                COPY_FINAL_TOTAL_SALES_TOOLTIP: "Este es el monto de ventas total restando la comisión de Trulii",
                COPY_TOTAL_SALES_TOOLTIP: "Este es el monto total de las ventas sin contar la comisión de Trulii",
                COPY_TOTAL_FEE_TOOLTIP: "Este es el monto total de la comisión de Trulii",
                COPY_CLOSING_DATE: "Cierre",
                COPY_VIEW_DETAIL: "Ver detalle",
                COPY_EDIT_ACTIVITY: "Editar actividad",
                SECTION_MANAGE: "Gestionar",
                TAB_ORDERS: "Ordenes de Compra",
                TAB_ASSISTANTS: "Lista de Asistentes",
                TAB_MESSAGES: "Mensajes",
                TAB_SUMMARY: "Resumen",
                PLURALIZE_ASSISTANT: "{} asistente",
                PLURALIZE_ASSISTANTS: "{} asistentes",
                HEADER_ASSISTANT: "Asistente",
                HEADER_EMAIL: "Correo",
                HEADER_PRICE: "Precio",
                HEADER_ORDER: "Orden",
                HEADER_FIRST_NAME: "Nombre",
                HEADER_LAST_NAME: "Apellido",
                HEADER_FULL_NAME: "Nombre",
                HEADER_CODE: "Código",
                HEADER_MADE: "Realizada",
                HEADER_AMOUNT: "Monto",
                HEADER_SALE_DATA:"Fecha de Venta",
                HEADER_UNIT_PRICE:"Precio Unitario",
                HEADER_TOTAL:"Total",
                HEADER_STATUS:"Estatus",
                LABEL_FINAL_TOTAL: "Ventas netas:", 
                LABEL_TOTAL: "Ventas brutas:",
                LABEL_FEE: "Comisión Trulii:",
                COPY_VIEW_MY_ACTIVITIES: "Ver mis actividades"
            });
        }
        function _initScroll(){
            $scope.$on('scrolled',
              function(scrolled, scroll){
                vm.scroll = scroll;
                $scope.$apply();
              }
            ); 
        }

        function _activate() {
            _setStrings();
            _initScroll();
           // _initWidget();
            vm.activity = _mapMainPicture(activity);
            _getOrders(activity.id);
            _getCalendars(activity);
            //console.log("reloadin",assistants);
        }
    }
})();
