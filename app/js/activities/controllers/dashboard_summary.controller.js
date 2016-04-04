/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivitySummaryCtrl
 * @description Handles Activities Messages Dashboard
 * @requires activity
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivitySummaryCtrl', ActivitySummaryCtrl);

    ActivitySummaryCtrl.$inject = ['ActivitiesManager', 'activity', '$q', 'Error', 'Toast'];
    function ActivitySummaryCtrl(ActivitiesManager, activity, $q, Error, Toast) {

        var vm = this;
        angular.extend(vm, {
          
          options: {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        },

        data: [
            {
                key: "One",
                y: 5
            },
            {
                key: "Two",
                y: 2
            },
            {
                key: "Three",
                y: 9
            },
            {
                key: "Four",
                y: 7
            },
            {
                key: "Five",
                y: 4
            },
            {
                key: "Six",
                y: 3
            },
            {
                key: "Seven",
                y: .5
            }
        ]
        });


        _activate();

        //--------- Exposed Functions ---------//

        


        //--------- Internal Functions ---------//


        

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_NEW_MESSAGE: "Nuevo Mensaje",
                SEARCH_PLACEHOLDER: "Buscar",
                OPTION_ACTIVITY_DEFAULT: "Seleccione una actividad",
                OPTION_CALENDAR_DEFAULT: "Seleccione una fecha de inicio",
                LABEL_INITIAL_DATE: "Fecha de inicio: ",
                LABEL_SEND_MESSAGE: "Enviar",
                SUBJECT_MESSAGE_PLACEHOLDER:"Asunto",
                MODAL_MESSAGE_PLACEHOLDER:"Este mensaje llegará a todos los usuarios inscritos en esta actividad",
                COPY_NO_MESSAGES: "Aún no ha enviado ningún mensaje a sus asistentes",
                PREVIOUS_TEXT:"Previo",
                NEXT_TEXT:"Siguiente"
            });
        }

        function _activate() {
            _setStrings();
        }

    }

})();
