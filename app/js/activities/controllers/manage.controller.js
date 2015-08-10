
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

    ActivitiesManageCtrl.$inject = ['$rootScope', '$filter', 'activity', 'ActivitiesManager'];

    function ActivitiesManageCtrl($rootScope, $filter, activity, ActivitiesManager) {

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
                itemsPerPage: 4,
                pageNumber: 1
            },
            calendarPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 4,
                pageNumber: 1
            },
            assistantPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 6,
                pageNumber: 1
            },
            expandCalendar : expandCalendar,
            updateByQuery: updateByQuery,
            pageChange: pageChange,
            TYPE_ORDER: 'order',
            TYPE_ASSISTANT: 'assistant',
            TYPE_CALENDAR: 'calendar'
        });

        var orders = [];
        var calendars = [];
        var assistants = [];

        _activate();

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
                    console.log('orders:', vm.orders);
                    break;
                case vm.TYPE_CALENDAR:
                    offset = vm.calendarPaginationOpts.itemsPerPage;
                    start = (vm.calendarPaginationOpts.pageNumber -1) * offset;
                    end = vm.calendarPaginationOpts.pageNumber * offset;
                    console.log(vm.calendarPaginationOpts.pageNumber, 'slice(' + start + ',' + end + ')');
                    vm.calendars = calendars.slice(start, end);
                    console.log('calendars:', vm.calendars);
                    break;
                case vm.TYPE_ASSISTANT:
                    offset = vm.assistantPaginationOpts.itemsPerPage;
                    start = (vm.assistantPaginationOpts.pageNumber -1) * offset;
                    end = vm.assistantPaginationOpts.pageNumber * offset;
                    console.log(vm.assistantPaginationOpts.pageNumber, 'slice(' + start + ',' + end + ')');
                    vm.assistants = assistants.slice(start, end);
                    console.log('assistants:', vm.assistants);
                    break;
            }
        }

        function expandCalendar(calendar){
            vm.activeCalendar = calendar;
            assistants = calendar.assistants;
            vm.assistantPaginationOpts.totalItems = assistants.length;
            vm.assistants = assistants.slice(0, vm.assistantPaginationOpts.itemsPerPage);
            console.log('assistants:', assistants, 'length:', assistants.length);
        }

        function _getOrders(activityId){
            ActivitiesManager.getOrders(activityId).then(success, error);

            function success(ordersResponse){
                orders = $filter('orderBy')(ordersResponse.map(mapOrder), 'id', true);
                vm.orderPaginationOpts.totalItems = orders.length;
                vm.orders = orders.slice(0, vm.orderPaginationOpts.itemsPerPage);
                console.log('orders:', orders);
            }
            function error(response){
                console.error('_getOrders. Error in orders response:', response);
            }

            function mapOrder(order){
                var cost = order.amount / order.quantity;
                // Bind is Awesome!!!
                order.assistants = order.assistants.map(mapAssistant.bind(this, cost));
                var user = order.student.user;
                order.payer = {
                    full_name: [user.first_name, user.last_name].join(' '),
                    email: user.email,
                    photo: order.student.photo
                };
                return order;
            }

            function mapAssistant(cost, assistant){
                assistant.full_name = [assistant.first_name, assistant.last_name].join(' ');
                assistant.cost = cost;
                return assistant;
            }
        }

        function _getCalendars(activity){
            calendars = activity.chronograms.map(_mapDateMsg);
            vm.calendars = calendars.slice(0, vm.calendarPaginationOpts.itemsPerPage);
            console.log('calendars:', calendars);
            return calendars;
        }

        function _mapMainPicture(activity){
            angular.forEach(activity.photos, function(photo, index, array){
                if(photo.main_photo){ activity.main_photo = photo.photo; }

                if( index === (array.length - 1) && !activity.main_photo){ activity.main_photo = array[0].photo; }
            });

            return activity;
        }

        function _mapDateMsg(calendar){
            calendar.fromMsg = [vm.strings.LABEL_CALENDAR, ' ', vm.strings.COPY_FROM, ' ',
                $filter('date')(calendar.initial_date, 'dd/MM/yy')].join('');

            calendar.toMsg = [vm.strings.COPY_CLOSING_DATE, ' ',
                $filter('date')(calendar.closing_sale, 'dd/MM/yy')].join('');
            return calendar;
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_REIMBURSE_ORDER: "Reembolsar Orden",
                ACTION_REIMBURSE_ASSISTANT: "Reembolsar Asistente",
                COPY_ORDERS: "Revisa tus órdenes de compra y los asistentes asociados a ellas",
                COPY_ASSISTANTS: "Consulta los datos de las personas que han inscrito esta actividad",
                COPY_SEAT: "Cupo",
                COPY_SEATS: "Cupos",
                COPY_SEARCH: "Buscar orden por número, nombre o correo electrónico",
                LABEL_ORDER_NUMBER: "Orden#",
                LABEL_CALENDAR: "Calendario",
                LABEL_SEARCH: "Buscar Ordenes",
                LABEL_EMPTY_ORDERS: "No hay órdenes de compra",
                COPY_EMPTY_ORDERS: "Aún no tienes órdenes de compra para esta actividad ¿No atrae lo suficiente"
                    + " la atención de los usuarios? Podrías agregar más fotos, extender la descripción o agregar "
                    + "un vídeo. ¡Ánimo!",
                LABEL_EMPTY_CALENDARS: "No hay calendarios",
                COPY_EMPTY_CALENDARS: "Aún no tienes calendarios creados para esta actividad. Ve a la sección de "
                + "Editar Actividad para comenzar a crear calendarios para que tus estudiantes se inscriban. ¡Anímate!",
                LABEL_EMPTY_ASSISTANTS: "No hay asistentes",
                COPY_EMPTY_ASSISTANTS: "Aún no tienes asistentes registrados en esta actividad¿No atrae lo suficiente"
                + " la atención de los usuarios? Podrías agregar más fotos, extender la descripción o agregar "
                + "un vídeo. ¡Ánimo!",
                COPY_FROM: "del",
                COPY_CLOSING_DATE: "Cierre:",
                SECTION_MANAGE: "Gestionar",
                TAB_ORDERS: "Ordenes de Compra",
                TAB_ASSISTANTS: "Lista de Asistentes",
                PLURALIZE_ASSISTANT: "{} asistente",
                PLURALIZE_ASSISTANTS: "{} asistentes",
                HEADER_ASSISTANT: "Asistente",
                HEADER_EMAIL: "Correo",
                HEADER_PRICE: "Precio",
                HEADER_ORDER: "Orden",
                HEADER_FIRST_NAME: "Nombre",
                HEADER_LAST_NAME: "Apellido"
            });
        }

        function _activate() {
            _setStrings();
            vm.activity = _mapMainPicture(activity);
            _getOrders(activity.id);
            _getCalendars(activity);
            
        }

    }

})();