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

    ActivitySummaryCtrl.$inject = ['ActivitiesManager', 'activity', '$q', 'Error', 'Toast', 'stats'];
    function ActivitySummaryCtrl(ActivitiesManager, activity, $q, Error, Toast, stats) {

        var vm = this;
        angular.extend(vm, {
          stats: stats,
          nextDateOptions: {
            chart: {
                type: 'bulletChart',
                transitionDuration: 500
            }
          },

          nextDateData: {
              "ranges": [0, stats.next_data.capacity],
              "measures": [stats.next_data.sold],
              "markers": []
        
          },
          options: {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ms)'
                },
                yAxis: {
                    axisLabel: 'Voltage (v)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            }
        },

        data: sinAndCos()

        });


        _activate();

        //--------- Exposed Functions ---------//

        


        //--------- Internal Functions ---------//

        function sinAndCos() {
            var sin = [],sin2 = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 100; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
                cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
            }

            //Line chart data should be sent as an array of series objects.
            return [
                {
                    values: sin,      //values - represents the array of {x,y} data points
                    key: 'Sine Wave', //key  - the name of the series.
                    color: '#ff7f0e',  //color - optional: choose your own line color.
                    strokeWidth: 2,
                    classed: 'dashed'
                },
                {
                    values: cos,
                    key: 'Cosine Wave',
                    color: '#2ca02c'
                },
                {
                    values: sin2,
                    key: 'Another sine wave',
                    color: '#7777ff',
                    area: true      //area - set to true if you want this line to turn into a filled area chart.
                }
            ];
        };
        

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                LABEL_SALES: "Ventas",
                LABEL_VISITS_SEATS: "Visitas y cupos",
                LABEL_NEXT_START_DATE: "Próxima fecha de inicio",
                TAB_MONTH: "Mes",
                TAB_YEAR: "Año",
                COPY_NET_SALES: "Ventas netas",
                COPY_GROSS_SALES: "Ventas brutas",
                COPY_FEE: "Fee de Trulii",
                COPY_TOTAL_SALES: "Total de ventas",
                COPY_TOTAL_SEATS: "Total de cupos vendidos",
                COPY_TOTAL_VIEWS: "Total de visitas recibidas",
                COPY_SOLD_SEATS: "Cupos vendidos: "
            });
        }

        function _activate() {
            _setStrings();
            vm.stats.total_points.total = vm.stats.total_points.total_gross + vm.stats.total_points.total_net + vm.stats.total_points.total_fee;
        }

    }

})();
