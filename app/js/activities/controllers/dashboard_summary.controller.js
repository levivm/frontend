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

    ActivitySummaryCtrl.$inject = ['ActivitiesManager', 'activity', '$q', 'Error', 'Toast', 'stats', 'moment', 'serverConf', '$scope', '$timeout'];
    function ActivitySummaryCtrl(ActivitiesManager, activity, $q, Error, Toast, stats, moment, serverConf, $scope, $timeout) {

        var vm = this;
        
        var d3Col = d3.locale ({
          "decimal": ".",
          "thousands": ",",
          "grouping": [3],
          "currency": ["", " COP"],
          "dateTime": "%a %b %e %X %Y",
          "date": "%m/%d/%Y",
          "time": "%H:%M:%S",
          "periods": ["AM", "PM"],
          "days": ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
          "shortDays": ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
          "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
          "shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        })
        
        angular.extend(vm, {
          activity: activity,
          stats: stats,
          getAmazonUrl: getAmazonUrl,
          activeTab: 'monthly',
          TAB_MONTHLY: 'monthly',
          TAB_YEARLY: 'yearly',
          DATE_PREV: 'prev',
          DATE_NEXT: 'next',
          changeTab: changeTab,
          date: moment().valueOf(),
          changeDate: changeDate,
          hasData: hasData,
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
                x: function(d){ return d3.round(d.x, 4); },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'DIAS',
                    tickFormat: function(d) {
                        // return d3Col.timeFormat('%b')(new Date(d))
                        return d3Col.timeFormat('%d-%m')(new Date(d))
                    },
                    showMaxMin: true,
                    staggerLabels: false,
                    axisLabelDistance: 10
                },
                yAxis: {
                    axisLabel: 'GANANCIAS',
                    tickFormat: function(d){
                        return d3Col.numberFormat("$, .2f")(d);
                    },
                    axisLabelDistance: 55
                }
              }
          },

          data: [],
          days: []

        });


        _activate();

        //--------- Exposed Functions ---------//
        
        function hasData(){
          return Object.keys(vm.stats.total_points).length > 0;
        }
        
        function changeTab(tab){
          vm.activeTab = tab;
          console.log('tab changed');
          if(vm.activeTab === vm.TAB_YEARLY){
            vm.options.chart.xAxis = {
                axisLabel: 'MESES',
                tickFormat: function(d) {
                    return d3Col.timeFormat('%b')(new Date(d))
                    // return d3Col.timeFormat('%d-%m-%y')(new Date(d))
                },
                showMaxMin: true,
                staggerLabels: true,
                axisLabelDistance: 10
            };
            activity.getStats(moment(vm.date).year())
            .then(
              function(data){
                console.log(data);
                vm.stats = data;
                stats = vm.stats;
                parseData();
              }
            );
          }
          else if(vm.activeTab === vm.TAB_MONTHLY){
            vm.options.chart.xAxis = {
                axisLabel: 'DIAS',
                tickFormat: function(d) {
                    // return d3Col.timeFormat('%b')(new Date(d))
                    return d3Col.timeFormat('%d-%m')(new Date(d))
                },
                showMaxMin: true,
                staggerLabels: true,
                axisLabelDistance: 10
            };
            activity.getStats(moment(vm.date).year(), moment(vm.date).month()+1)
            .then(
              function(data){
                console.log(data);
                vm.stats = data;
                stats = vm.stats;
                parseData();
              }
            );
          }
        }
        
        function changeDate(type){
          if(type === vm.DATE_NEXT){
            if(vm.activeTab === vm.TAB_MONTHLY){
              vm.date = moment(vm.date).add(1, 'months').valueOf();
            }
            else if(vm.activeTab === vm.TAB_YEARLY){
              vm.date = moment(vm.date).add(1, 'years').valueOf();
            }
          }
          else if(type === vm.DATE_PREV){
            if(vm.activeTab === vm.TAB_MONTHLY){
            vm.date = moment(vm.date).subtract(1, 'months').valueOf();
            }
            else if(vm.activeTab === vm.TAB_YEARLY){
              vm.date = moment(vm.date).subtract(1, 'years').valueOf();
            }
          }
          if(vm.activeTab === vm.TAB_YEARLY){
            activity.getStats(moment(vm.date).year())
            .then(
              function(data){
                console.log(data);
                vm.stats = data;
                stats = vm.stats;
                parseData();
              }
            );
          }
          else if(vm.activeTab === vm.TAB_MONTHLY){
            activity.getStats(moment(vm.date).year(), moment(vm.date).month()+1)
            .then(
              function(data){
                console.log(data);
                vm.stats = data;
                stats = vm.stats;
                parseData();
              }
            );
          }
          
          
         
        }
        
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' + file;
        }


        //--------- Internal Functions ---------//

        function parseData() {
            var gross = [];
            var net = [];
            var fee = [];
            vm.days = [];
            
            var aux = true;
            
            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < stats.points.length; i++) {
              
                var key = Object.keys(stats.points[i])[0];
                var date = moment(Object.keys(stats.points[i])[0], 'YYYY-MM-DD').valueOf();
                // console.log(moment(date).format('YYYY-MM-DD'));
                // console.log(moment().format('YYYY-MM-DD'));
                // console.log(date <= moment().valueOf());
                if(stats.points[i][key].gross !== 0 && stats.points[i][key].net !== 0 && stats.points[i][key].fee !== 0 && date <= moment().valueOf()){
                  vm.days.push(d3.time.format('%y-%m-%d')(new Date(moment(date).format('YYYY-MM-DD'))));
                  aux = true;
                  gross.push({x: date, z: moment(date).format('YYYY-MM-DD'), y: d3.round(stats.points[i][key].gross, 4)});
                  net.push({x: date, z: moment(date).format('YYYY-MM-DD'), y: d3.round(stats.points[i][key].net, 4)});
                  fee.push({x:date, z: moment(date).format('YYYY-MM-DD'), y: d3.round(stats.points[i][key].fee, 4)});
                  
                }
                else if(stats.points[i][key].gross === 0 && stats.points[i][key].net === 0 && stats.points[i][key].fee === 0 && aux && date <= moment().valueOf()){
                  vm.days.push(d3.time.format('%y-%m-%d')(new Date(moment(date).format('YYYY-MM-DD'))));
                  gross.push({x: date, y: d3.round(stats.points[i][key].gross, 4)});
                  net.push({x: date, y: d3.round(stats.points[i][key].net, 4)});
                  fee.push({x:date, y: d3.round(stats.points[i][key].fee, 4)});
                }
                
            }
            console.log(gross);
            console.log(vm.days);
            //Line chart data should be sent as an array of series objects.
            vm.data = [
                {
                    values: gross,      //values - represents the array of {x,y} data points
                    key: 'Ventas Brutas', //key  - the name of the series.
                    color: '#03a9f4'  //color - optional: choose your own line color.
                },
                {
                    values: net,
                    key: 'Ventas Netas',
                    color: '#FCAB54'
                },
                {
                    values: fee,
                    key: 'Fee de Trulii',
                    color: '#38DBC8'
                }
            ];
             $timeout(function(){
              $scope.$apply(); 
             });
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
                COPY_SOLD_SEATS: "Cupos disponibles: ",
                COPY_SEATS: "cupos"
            });
        }

        function _activate() {
            _setStrings();
            parseData();
        }

    }

})();
