/**
* Register controller
* @namespace thinkster.organizers.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.activities.controllers')
    .controller('ActivityCalendarController', ActivityCalendarController);

  ActivityCalendarController.$inject = ['$scope','$timeout','activity','datepickerPopupConfig','calendar'];
  /**
  * @namespace ActivityCalendarController
  */
  function ActivityCalendarController($scope,$timeout,activity,datepickerPopupConfig,calendar) {



  //$scope.startOpened = false;
  var vm = this;
  //vm.start_date = "asdasd";
  activate();
  initialize();
  //this.openStartDate = 
  //console.log(,"SCOPE");

  vm.calendar  = calendar;
  
  if (vm.calendar.id)
    vm.save_calendar = _updateCalendar;
  else
    vm.save_calendar = _createCalendar;



  function activate(){


    vm.isCollapsed = true;
    datepickerPopupConfig.showButtonBar = false;
  }

  function initialize(){

    vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];

    vm.hstep = 1;
    vm.mstep = 15;

    vm.minStartDate = new Date();

    vm.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    vm.errors  = {};

    vm.ismeridian = true;

  }


  function _createCalendar(){

    _clearErrors();
    console.log(vm.calendar,"dd");
    vm.calendar.create()
               .then(_successCreated,_errored);

  }

  function _updateCalendar(){

    _clearErrors();
    console.log(vm.calendar,"dd");
    vm.calendar.update()
               .then(_successUpdate,_errored);

  }



    function _clearErrors(){
        vm.activity_calendar_form.$setPristine();
        vm.errors = null;
        vm.errors = {};
    }



    function _addError(field, message) {
      console.log("field error",field,message);
      vm.errors[field] = message;

      var is_session_error = field.split("_")[0] == 'sessions' ? true:false;

      vm.errors.session_error = is_session_error ? message:null;

      if (field == "non_field_errors")
        return;
      

      var valid_form_field = vm.activity_calendar_form[field] ? vm.activity_calendar_form[field]:false;
      if (valid_form_field)
         valid_form_field.$setValidity(message, false);


    };



    function _errored(errors) {
        
        //console.log("EROOOOOR",errors);
        //console.log("EROOOOOR",errors);
        angular.forEach(errors, function(message,field) {


          _addError(field,message[0]);   

        });

        

    }

    function _successCreated(calendar){

      
      vm.save_calendar = _updateCalendar;
      vm.isCollapsed = false;
      console.log("ccccccccccccccc",$scope);
      $scope.$parent.vm.setCalendar(calendar);

    }

    function _successUpdate(calendar){
      vm.isCollapsed = false;
      $scope.$parent.vm.setCalendar(calendar);
      

    }



  // vm.openStartDate   = _openStartDate;
  // vm.openCloseDate   = _openCloseDate;
  // //vm.changeStartDate = calendar.changeStartDate;
  // vm.changeCloseDate = _changeCloseDate;

  // //session
  // vm.changeSessionsN = _changeSessionsN;
  // vm.changeSessionDate = _changeSessionDate;
  // vm.openSessionDate = _openSessionDate;





  // // function _changeStartDate(){

  // //   if(vm.start_date>vm.close_date)
  // //     vm.close_date = vm.start_date;
  // // }
  
  // // function _changeCloseDate(){

  // //   if(vm.start_date>vm.close_date)
  // //     vm.close_date = vm.start_date;
  // // }


  // // function _openStartDate($event){

  // //   $event.preventDefault();
  // //   $event.stopPropagation();
  // //   vm.startOpened = true;      
  // // }

  // // function _openCloseDate($event){

  // //   $event.preventDefault();
  // //   $event.stopPropagation();
  // //   vm.endOpened = true;

  // // }


  // // function _changeSessionsN(){


  // //   if (vm.session_number>10)
  // //     return;


  // //   var difference = vm.session_number - vm.last_sn;
  // //   var abs_difference = Math.abs(difference);

  // //   for (var i=0; i<abs_difference; i++){

  // //       if (difference>0){

  // //         var index = vm.session_number - 1
  // //         var date = index ? vm.sessions[index-1].date : vm.start_date;
  // //         console.log("date",index);
  // //         var session = {
  // //           openDate:false,
  // //           date:date,
  // //           minDate:date,
  // //         };
  // //         vm.sessions.push(session);
  // //       }
  // //       else{
  // //         vm.sessions.pop();
  // //       }
  // //   }

  // //   vm.last_sn = vm.session_number;
    

  // // }

  // //SESSION METHODS

  // function _changeSessionDate($index,session){

  //   var size = vm.sessions.length;
  //   var rest_sessions     = vm.sessions.slice($index+1, $index+size);
  //   var previous_sessions = vm.sessions.slice(0,$index);
  //   rest_sessions.map(function(value){

  //     value.date    = value.date<=session.date ? session.date : value.date;
  //     value.minDate  = session.date;


  //   });


  //   previous_sessions.map(function(value){


  //     value.maxDate = session.date;

  //   })

  // }

  // // function _openSessionDate($event,session){
    
  // //   $event.preventDefault();
  // //   $event.stopPropagation();
  // //   session.openDate= true; 
  // // }

  // function initialize(){

  //   var today = new Date();
  //   vm.start_date = today;
  //   vm.close_date = today.setDate(today.getDate() + 1);
  //   vm.dateOptions = {
  //     formatYear: 'yy',
  //     startingDay: 1
  //   };

  //   vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  //   vm.format = vm.formats[0];

  //   vm.sessions = [];
  //   vm.session_number = 0;
  //   vm.last_sn = 0;

  // }



  //   vm.numb_objects = 0;
  //   vm.objects = [];
  //   vm.input_price = 0;

  //   vm.alerts = [];
  //   vm.dates_alerts = [];

  //   vm.closeAlert = function(key, index) {
  //     vm.objects[key].alerts.splice(index, 1);
  //   };
  //   vm.today = function() {
  //     vm.dt = new Date();
  //   };
  //   $scope.today();

  //   $scope.clear = function () {
  //     $scope.dt = null;
  //   };

  // $scope.test = {};
  // $scope.middleOpened = false;
  //   $scope.toggleMin = function() {
  //     $scope.minDate = $scope.minDate ? null : new Date();
  //   };
  //   $scope.toggleMin();

  //   $scope.dateOptions = {
  //     formatYear: 'yy',
  //     startingDay: 1
  //   };

  //   $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  //   $scope.format = $scope.formats[0];



  //    $scope.checkValue = function () {
  //         if ($scope.value > 100) {
  //             $scope.value = 100;
  //         }
  //         valueProgress($scope.value);
  //     }
      
  //     $scope.$watch('startdt', function(newval, oldval){
  //         if($scope.enddt < $scope.startdt) {
  //             $scope.enddt = '';
  //         };
  //     });
      
  //     $scope.$watch('enddt', function(newval, oldval){
  //         if($scope.enddt < $scope.startdt) {
  //             $scope.enddt = '';
  //         };
  //     });

  //   var date = new Date();
  //   $scope.start = new Date();
  //   $scope.middle = new Date();
  //   //$scope.end = new Date(date.getFullYear(), date.getMonth() + 1, 0); Last day of the month
  //   $scope.end = new Date(new Date().getFullYear(), 11, 31); //last day of the year

  //   $scope.minStartDate = 0; //fixed date
  //   $scope.maxStartDate = new Date(); //init value
  //   $scope.minEndDate = $scope.end; //init value
  //   $scope.maxEndDate = $scope.end; //fixed date same as $scope.maxStartDate init value
  //   $scope.middleEndDate = $scope.end;
  //   //$scope.minMiddleDate = 112;
  //   $scope.minMiddleDate = $scope.end; //fixed date

  //   $scope.$watch('start', function(v,c){

  //     //alert("inside");
  //     if($scope.start > $scope.end){
  //       $scope.dates_alerts = [];
  //       $scope.dates_alerts.push({msg: 'Tu fecha inicial debe ser menor a tu fecha de cierre, introduzca una fecha de cierre mayor o acorde.'});
  //       //alert("Tu fecha inicial debe ser menor a tu fecha de cierre, introduzca una fecha de cierre mayor o acorde.");
  //       $scope.start = $scope.end;
  //       $scope.middle = $scope.start;

  //     };
  //     for(var index in $scope.objects){
  //       //alert("inside objects");
  //       //alert();
  //       if($scope.objects[index].date < $scope.start){
  //         $scope.objects[index].date = $scope.start;
  //         $scope.objects[index].alerts = [];
  //         $scope.objects[index].alerts.push({msg: 'Tu fecha de sesión debe ser mayor a tu fecha de inicio, tu fecha de sesión fue modificada.'});
        
  //         //alert("Tu fecha de sesión debe ser mayor a tu fecha de inicio, tu fecha de sesión fue modificada.");
  //       };
          
        
  //     };
  //     //if($scope.start > $scope.middle){
  //     //  alert("Tu fecha inicial debe ser menor a tu fecha de sesión, tu fecha de sesión fue modificada.");
  //       //$scope.start = $scope.end;
  //      // $scope.middle = $scope.start;
  //     //}

  //     $scope.minEndDate = $scope.start;
  //     $scope.minMiddleDate = v;
  //     $scope.test = v;
  //     //console.log("v: "+ v );
  //     //console.log("c: "+ c );
  //   });

  //   $scope.$watch('test', function(v){

  //       //console.log("watch test: "+v);
  //   });


  //   $scope.$watch('end', function(v){
  //     //console.log("2: "+ $scope.minMiddleDate);
  //     $scope.maxStartDate = v;
  //     $scope.middle = $scope.start;


  //   });

  //   $scope.checkPrice = function(v){
  //     alert(v);

  //   }

  //   $scope.add_object = function() {
          
  //         var date_new_object = new Date();
      

  //          if($scope.numb_objects == 0){
              
  //             $scope.objects.push({
  //               date: $scope.start,
  //               start: new Date($scope.start.getFullYear(), 
  //                             $scope.start.getMonth(), 
  //                             $scope.start.getDate(),
  //                             8,
  //                             0,
  //                             0),
  //               end: new Date($scope.start.getFullYear(), 
  //                             $scope.start.getMonth(), 
  //                             $scope.start.getDate(),
  //                             18,
  //                             0,
  //                             0),
  //               innit: false,
  //               alerts: $scope.alerts,
  //             }); 
  //             $scope.numb_objects = $scope.numb_objects + 1;
  //          }
  //          else{

  //               var today = new Date();
  //               var new_date = new Date($scope.start.getFullYear(), $scope.start.getMonth(), $scope.start.getDate());
  //               var new_start = new Date($scope.start.getFullYear(), 
  //                                 $scope.start.getMonth(), 
  //                                 $scope.start.getDate(),
  //                                 8,
  //                                 0,
  //                                 0);

  //               var new_end = new Date($scope.start.getFullYear(), 
  //                                 $scope.start.getMonth(), 
  //                                 $scope.start.getDate(),
  //                                 18,
  //                                 0,
  //                                 0);

  //               if(today.getDate() == new_start.getDate()){
  //                  //console.log("s the same day");
  //                   $scope.objects.push({
  //                     date:today,
  //                     start: new_start,
  //                     end: new_end,
  //                     innit: false,
  //                     alerts: $scope.alerts,
  //                   }); 
  //                   $scope.numb_objects = $scope.numb_objects + 1;

  //               }else{
  //                  //console.log("another day, so midnight has passed");
  //                  //console.log(today); 
  //                  new_start = new Date(
  //                     today.getFullYear(),
  //                     today.getMonth(), 
  //                     today.getDate()+1
  //                   );
  //                  today = new_start;

  //                     $scope.objects.push({
  //                     date:today,
  //                     start: new_start,
  //                     end: new_end,
  //                     innit: false,
  //                     alerts: $scope.alerts,
  //                   }); 
  //                   $scope.numb_objects = $scope.numb_objects + 1;
  //               }
  //          }
            
  //       };

  //   $scope.checkSessionDate = function(key){

  //     for (var i in $scope.objects){
  //       if(i!=key){        
  //         if($scope.objects[key].date.getFullYear() ===  $scope.objects[i].date.getFullYear()
  //           && $scope.objects[key].date.getMonth() === $scope.objects[i].date.getMonth()
  //           && $scope.objects[key].date.getDay() === $scope.objects[i].date.getDay()){
   
  //           $scope.objects[key].date = new Date(
  //             $scope.start.getFullYear(),
  //             $scope.start.getMonth(),
  //             $scope.start.getDate()
  //             );
  //           if($scope.objects[key].date.getFullYear() ===  $scope.start.getFullYear()
  //               && $scope.objects[key].date.getMonth() === $scope.start.getMonth()
  //               && $scope.objects[key].date.getDay() === $scope.start.getDay()){
  //               $scope.objects[key].alerts = [];
  //               $scope.objects[key].alerts.push({msg: 'La fecha de sesión es erronea, su fecha de sesión fue modificada a la fecha de inicio.'});

  //             //alert("Hay dos fechas de sesión empezando el mismo día que la fecha de inicio.");
  //               $scope.objects[key].date = $scope.start;
  //         }
  //       }

  //       };
  //     };
  //   };

  //   $scope.delete_object = function() {
  //     $scope.numb_objects = $scope.numb_objects - 1;
  //     $scope.objects.pop();  
  //   };
  //   $scope.delete_all = function(){
  //     $scope.numb_objects = 0;
  //     $scope.objects = [];
  //   };

  //  $scope.openStart = function() {
  //     //alert();
  //     //$scope.minMiddleDate = $scope.minEndDate;
  //     $timeout(function() {
  //       $scope.startOpened = true;
  //     });
  //   };

  //   $scope.openEnd = function() {

  //     $timeout(function() {
  //       $scope.endOpened = true;
  //     });
  //   };

  //   $scope.openMiddle = function(key) {

  //     //alert(key);
  //     //$scope.objects[key].innit = false;
  //     //alert($scope.objects[key].innit);
  //     //$scope.middleOpened = false;
  //           $timeout(function() {
  //       //      $scope.middleOpened = true;
  //             $scope.objects[key].innit = true;
  //           });

  //       };

  //   $scope.dateOptions = {
  //     'year-format': "'yy'",
  //     'starting-day': 1
  //   };




  //   // time picker controller
  //       $scope.mytime = new Date();  

  //       $scope.mytime2 = new Date();
        
  //       $scope.hstep = 1;
  //       $scope.mstep = 1;

  //       $scope.options = {
  //         hstep: [1, 2, 3],
  //         mstep: [1, 5, 10, 15, 25, 30]
  //       };

  //       $scope.ismeridian = true;
  //       $scope.toggleMode = function() {
  //         $scope.ismeridian = ! $scope.ismeridian;
  //       };

  //       $scope.update = function() {
  //         var d = new Date();
  //         d.setHours( 14 );
  //         d.setMinutes( 0 );
  //         $scope.mytime = d;
  //       };

  //       $scope.changed = function (key) {

  //         for (var i in $scope.objects){
  //           /*console.log("key: "+key);
  //           console.log($scope.objects[key] === $scope.objects[i]);
  //           console.log($scope.objects[key].start.getHours());
  //           console.log($scope.objects[key].start.getMinutes());
  //           console.log($scope.objects[key].start.getSeconds());
  //           console.log(" ");
  //           console.log($scope.objects[i].start.getHours());
  //           console.log($scope.objects[i].start.getMinutes());
  //           console.log($scope.objects[i].start.getSeconds());*/
  //           //console.log($scope.objects[key]);
  //           //console.log($scope.objects[key]);

  //           //console.log($scope.objects[i]);
  //           //console.log($scope.objects[i]);
  //            if(i!=key){  // we are not checking the object with itself       
  //               //console.log("inside");
  //               //console.log($scope.objects[key].start.getFullYear());
  //               /*console.log($scope.objects[key].date.getFullYear());
  //               console.log($scope.objects[i].date.getFullYear());
  //               console.log($scope.objects[key].date.getMonth());
  //               console.log($scope.objects[i].date.getMonth());
  //               console.log($scope.objects[key].date.getDate());
  //               console.log($scope.objects[i].date.getDate());
  //               */
  //             if($scope.objects[key].date.getFullYear() == $scope.objects[i].date.getFullYear()
  //                && $scope.objects[key].date.getMonth() == $scope.objects[i].date.getMonth()
  //                && $scope.objects[key].date.getDate() == $scope.objects[i].date.getDate()
  //                ){
  //                 if($scope.objects[key].start.getHours() === $scope.objects[i].start.getHours()
  //                   && $scope.objects[key].start.getMinutes() === $scope.objects[i].start.getMinutes()){
  //                   //console.log("Hay dos fechas de sesión a la misma hora y el mismo día");
  //                   $scope.objects.pop(key);
  //                   $scope.objects[key].alerts = [];
  //                   $scope.objects[key].alerts.push({msg: 'Hay dos fechas de sesión a la misma hora y el mismo día'});

  //                   //alert("Hay dos fechas de sesión a la misma hora y el mismo día");

  //                 }
  //               }
  //             };
  //         };
          
  //         if($scope.objects[key].start > $scope.objects[key].end){
  //             $scope.objects[key].start  = $scope.objects[key].end;
  //             $scope.objects[key].alerts = [];
  //             $scope.objects[key].alerts.push({msg: 'Tu hora de inicio de sesión debe ser menor a tu hora de fin de sesión.'});

  //             //alert('Tu hora de inicio de sesión debe ser menor a tu hora de fin de sesión.');
  //         };

  //       };


  //       $scope.changed2 = function(key){
  //         if($scope.objects[key].start > $scope.objects[key].end){
  //           $scope.objects[key].start  = $scope.objects[key].end;
  //           $scope.objects[key].alerts = [];
  //           $scope.objects[key].alerts.push({msg: 'Tu hora de inicio de sesión debe ser menor a tu hora de fin de sesión.'});

  //           //alert('Tu hora de inicio de sesión debe ser menor a tu hora de fin de sesión.');
  //         };
  //       };
  //       $scope.clear = function() {
  //         $scope.mytime = null;
  //       };

       
  //       /*$scope.$watch('mytime', function(value){
  //         if($scope.mytime > $scope.mytime2) 
  //           alert("!");
  //       });*/
  //       $scope.$watch('mytime', function(value){
  //       //  if($scope.mytime > $scope.mytime2) 
  //           //alert("!");

  //       });

  };

  })();