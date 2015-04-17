/**
* activities
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

 
  angular
    .module('trulii.activities.services')
    .factory('Calendar', Calendar);

  Calendar.$inject = ['$http','$q','$filter','serverConf'];

  function Calendar($http,$q,$filter,serverConf) {  
      
      function Calendar(calendarData) {
          if (calendarData) {
              this.setData(calendarData);

          }else{


            var today = new Date();
            var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
            this.initial_date = today;
            this.minStartDate = today;
            this.closing_sale = tomorrow;
            this.capacity = 1;

            this.sessions = [];
            this.number_of_sessions = 0;
            this.last_sn = 0;


            //this.toggleMode = function() {
            //  this.ismeridian = ! $scope.ismeridian;
            //};


          }




          //this.tags = [];

          // Some other initializations related to book
      };

      Calendar.prototype = {
          setData: function(calendarData) {

              var that = this;
              angular.extend(this, calendarData);
              this.sessions = $filter('orderBy')(this.sessions,'date');

              this.initial_date = new Date(this.initial_date);
              this.closing_sale = new Date(this.closing_sale);
              angular.forEach(this.sessions,function(session,index){

                session.date = new Date(session.date);
                that.changeSessionDate(index,session);
                
                session.end_time   = new Date(session.end_time);
                session.start_time = new Date(session.start_time);

              });
              this.last_sn = this.number_of_sessions;
              
              //$scope.images = $filter('orderBy')($scope.images, 'orgName');
              //this.sessions.reverse();    


          },
          load: function(activity_id){

            var that = this;
                that.activity = activity_id;

            console.log("activity_id",activity_id);
            return $http.get(serverConf.url+'/api/activities/'+activity_id+'/calendar/')
                        .then(function(response){
                          
                          that.setData(response.data);
                          return that

                        },function(response){

                          return that
                        });


          },
          create: function(){
            var activity_id = this.activity;


            var _initial_date = this.initial_date;

            var _closing_sale = this.closing_sale;

            this.initial_date = this.initial_date.valueOf();
            this.closing_sale = this.closing_sale.valueOf();
            angular.forEach(this.sessions,function(session){

              session.date = session.date.valueOf();
              session.end_time = session.end_time.valueOf();
              session.start_time = session.start_time.valueOf();

            });
            console.log(this);
            var that = this;
            return $http.post(serverConf.url+'/api/activities/'+activity_id+'/calendars/',this)
                        .then(function(response){
                          console.log("response.data",response.data);
                          that.setData(response.data);
                          return that

                        },function(response){
                          return $q.reject(response.data);
                        });

          },
          update : function(){

            var activity_id = this.activity;
            console.log("updating",this);
            this.setToSave();
            var that = this;
            return $http.put(serverConf.url+'/api/activities/'+activity_id+'/calendars/'+this.id,this)
                        .then(function(response){
                          that.setData(response.data);
                          return response.data
                        },
                        function(response){
                          return $q.reject(response.data);
                        });

          },
          setToSave: function(){

            var _initial_date = this.initial_date;

            var _closing_sale = this.closing_sale;

            this.initial_date = this.initial_date.valueOf();
            this.closing_sale = this.closing_sale.valueOf();
            angular.forEach(this.sessions,function(session){

              session.date = session.date.valueOf();
              session.end_time = session.end_time.valueOf();
              session.start_time = session.start_time.valueOf();

            });


          },
          changeStartDate: function(){

            var initial_date  = this.initial_date;
                //this.initial_date = initial_date.valueOf ? initial_date.valueOf() : initial_date;
                //this.initial_date = this.initial_date;

            if(this.initial_date>this.closing_sale)
              this.closing_sale = this.initial_date;



          },
          changeCloseDate: function(){

            var closing_sale = this.closing_sale;
                //this.closing_sale = closing_sale.valueOf ? closing_sale.valueOf() : closing_sale;

            if(this.initial_date>this.closing_sale)
              this.closing_sale = this.initial_date;
          },
          openCloseDate: function($event){
            $event.preventDefault();
            $event.stopPropagation();
            this.endOpened = true;
          },
          openStartDate: function($event){
            $event.preventDefault();
            $event.stopPropagation();
            this.startOpened = true;

          },
          openSessionDate: function($event,session){
            $event.preventDefault();
            $event.stopPropagation();
            session.openDate= true;             
          },
          changeSessionsN: function(){

            
            if (this.number_of_sessions>10)
              return;


            var difference = this.number_of_sessions - this.last_sn;
            var abs_difference = Math.abs(difference);

            for (var i=0; i<abs_difference; i++){

                if (difference>0){

                  var index = this.number_of_sessions - 1
                  
                  var previous_s  = index ? this.sessions[index-1]:null


                  var date = index ? new Date(previous_s.date.getTime()):this.initial_date;

                  //var minDate =index ? new Date(previous_s.date.getTime()+24*60*60*1000):date;


                  //var _start_time = previous_s && previous_s.date  
                  var hours = index ? previous_s.end_time.getHours():10
                  console.log(hours,"horas");

                  var start_time = new Date();
                      start_time.setHours( hours + 1 );
                      start_time.setMinutes( 0 );

                  var end_time = new Date();
                      end_time.setHours( hours + 4 );
                      end_time.setMinutes( 0 );

                  var session = {
                    openDate:false,
                    date:date,
                    minDate:date,
                    start_time:start_time,
                    end_time:end_time,
                  };
                  this.sessions.push(session);
                }
                else{
                  this.sessions.pop();
                }
            }

            this.last_sn = this.number_of_sessions;
            //return this.number_of_sessions

          },
          changeSessionDate: function($index,session){

            var size = this.sessions.length;
            var rest_sessions     = this.sessions.slice($index+1, $index+size);
            var previous_sessions = this.sessions.slice(0,$index);
            rest_sessions.map(function(value){

              value.date    = value.date<=session.date ? session.date : value.date;
              value.minDate  = session.date;


            });


            previous_sessions.map(function(value){


              value.maxDate = session.date;

            });

          },
          changeStartTime: function(session){



            var start_time = session.start_time.getHours();
            var end_time   = session.end_time.getHours();


            if(start_time > end_time){
              var new_end_time = new Date();
                  new_end_time.setHours(start_time+1);
              session.end_time = new_end_time;
            }

          },
          changeEndTime: function(session){

            var start_time = session.start_time.getHours();
            var end_time   = session.end_time.getHours();

            if(start_time > end_time){
              var new_start_time = new Date();
                  new_start_time.setHours(end_time-1);
              session.start_time = new_start_time;
            }

          },
          addAssistants: function (assistants) {
              this.assistants = this.assistants.concat(assistants);
          }


          // create: function(){
          //   return $http.post(serverConf.url+'/api/activities/',this);
          // },
          // generalInfo: function() {
          //     var scope = this;
              
          //     var deferred = $q.defer();

          //     if (scope.presave_info){ 
               
          //       deferred.resolve(scope.presave_info);                
          //       return deferred.promise
          //     }
          //     else{

          //       return $http.get(serverConf.url+'/api/activities/info/').then(function(response){
          //         scope.presave_info = response.data;
          //         deferred.resolve(scope.presave_info);
          //         return deferred.promise
          //       });

          //     }

          //     //return deferred.promise;

          // },
          // load: function(id){
          //   var scope = this;

          //   return $http.get(serverConf.url+'/api/activities/'+id)
          //     .then(function(response) {
          //       scope.setData(response.data);
          //       return scope
          //     });
          // },
          // update: function() {
          //   return $http({
          //     method: 'put',
          //     url:serverConf.url+'/api/activities/' + this.id,
          //     data: this,
          //     headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
          //   });
          // }
          //   //$http.put(serverConf.url+'/api/activities/' + this.id, this);
          // },
          // change_email: function() {
          //   return $http({
          //     method: 'post',
          //     url:'users/email/',
          //     data: {
          //       'email':this.user.email,
          //       'action_add':true,
          //     },
          //   });

          //   //$http.put(serverConf.url+'/api/activities/' + this.id, this);
          // },
          // change_password: function(password_data) {
          //   console.log(password_data);
          //   console.log('--------');
          //   return $http({
          //     method: 'post',
          //     url:'/users/password/change/',
          //     data: password_data,
          //   });

          //   //$http.put(serverConf.url+'/api/activities/' + this.id, this);
          // },
      };
      return Calendar;
  };



})();