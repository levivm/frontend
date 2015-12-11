
/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.ActivitiesManageListCtrl
 * @description Assistants Print List Controller
 * @requires activity The activity being accessed
 */
(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('ActivitiesManageListCtrl', ActivitiesManageListCtrl);

    ActivitiesManageListCtrl.$inject = ['$window', '$filter', 'activity', 'calendar', 'orders', 'ActivitiesManager'];

    function ActivitiesManageListCtrl($window, $filter, activity, calendar, orders, ActivitiesManager) {

        var vm = this;
        angular.extend(vm, {
            calendar : calendar,
            assistants : calendar.assistants,
            printList: printList,
            pages: []
        });

        _activate();



        function printList(){
            var book = angular.element.find('.book')[0];
            var link = $window.document.createElement("link");
            link.href = "/css/trulii.css";
            link.type = "text/css";
            link.rel = "stylesheet";
            book.appendChild(link);
            var table = book.innerHTML;
            var myWindow = window.open('', '', 'width=1200, height=600, scrollbars=yes');
            myWindow.document.write(table);
            setTimeout(function(){ myWindow.print(); }, 1000);
        }


        function _mapPages(){
          vm.pages = new Array( Math.floor(vm.assistants.length/7) );

          for(var i =0; i < vm.assistants.length/7; i++){
            vm.pages[i] = new Array();
          }

          for(var i = 0; i < vm.assistants.length; i++){
            vm.pages[ Math.floor(i/7) ].push(vm.assistants[i]);
          }

        }

        function _mapOrders(){
            console.log('orders:', orders);
            orders = $filter('orderBy')(orders.map(mapOrder), 'id', true);
            vm.orders = orders;
            console.log('orders:', orders);

            function mapOrder(order){
                var cost = order.amount / order.quantity;
                order.unit_price = cost;
                return order;
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
            if (!vm.strings) {
                vm.strings = {};
            }
        }
        angular.extend(vm.strings, {
            ACTION_PRINT: "Imprimir",
            COPY_SEAT: "Cupo",
            COPY_SEATS: "Cupos",
            COPY_SEARCH: "Buscar orden por número, fecha o monto",
            LABEL_ORDER_NUMBER: "Orden N°",
            LABEL_INITIAL_DATE: "Inicio",
            COPY_CLOSING_DATE: "Cierre",
            COPY_VIEW_DETAIL: "Ver detalle",
            SECTION_MANAGE: "Gestionar",
            TAB_ORDERS: "Ordenes de Compra",
            LABEL_ASSISTANTS_LIST: "Lista de Asistentes",
            PLURALIZE_ASSISTANT: "{} asistente",
            PLURALIZE_ASSISTANTS: "{} asistentes",
            HEADER_ASSISTANT: "Asistente",
            HEADER_EMAIL: "Correo",
            HEADER_PRICE: "Precio",
            HEADER_ORDER: "Orden",
            HEADER_FIRST_NAME: "Nombre",
            HEADER_LAST_NAME: "Apellido",
            HEADER_CODE: "Código",
            HEADER_MADE: "Realizado",
            HEADER_AMOUNT: "Monto",
            HEADER_SALE_DATA:"Fecha de Venta",
            HEADER_UNIT_PRICE:"Precio Unitario",
            HEADER_TOTAL:"Total",
            HEADER_STATUS:"Estatus",
        });

        function _activate() {
            _setStrings();
            vm.activity = _mapMainPicture(activity);
            _mapOrders(activity.id);
            _mapPages();
            console.log('activity:', activity);
            console.log('calendar:', calendar);
            console.log(vm.pages);

        }

    }

})();
