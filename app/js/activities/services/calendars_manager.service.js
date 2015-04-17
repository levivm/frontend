(function () {
  'use strict';
  angular
    .module('trulii.activities.services')
    .factory('CalendarsManager', CalendarsManager);

  CalendarsManager.$inject = ['$http','$q','$filter','serverConf','Calendar'];

  function CalendarsManager($http,$q,$filter,serverConf,Calendar) {  
    

    
    var CalendarsManager = {
        _pool: {},
        calendars: [],
        // _retrieveInstance: function(calendarId, calendarData) {
        //     var instance = this._pool[calendarId];

        //     if (instance) {
        //         instance.setData(calendarData);
        //     } else {
        //         instance = new Book(calendarData);
        //         this._pool[calendarId] = instance;
        //     }

        //     return instance;
        // },
        _retrieveInstance: function(calendarId, calendarData) {
            var instance = this._search(calendarId);
            //console.log("INSTANCIA",calendarId)
            if (!(instance)){
                instance = new Calendar(calendarData);
                //instance.setData(calendarData);                
                instance.activity = this.activity_id;

            }

            return instance
        },
        _search: function(calendarId) {
            return this._pool[calendarId];
        },
        // _load: function(bookId, deferred) {
        //     var scope = this;

        //     $http.get('ourserver/books/' + bookId)
        //         .success(function(bookData) {
        //             var book = scope._retrieveInstance(bookData.id, bookData);
        //             deferred.resolve(book);
        //         })
        //         .error(function() {
        //             deferred.reject();
        //         });
        // },
        // /* Public Methods */
        // /* Use this function in order to get a book instance by it's id */
        _deleteInsntance:function(calendarId){

            var scope = this;
            var instance = scope._search(calendarId);
            var calendars = angular.copy(scope.calendars);
            if (instance){
                angular.forEach(calendars,function(calendar,index){

                    if (calendar.id == instance.id){
                        scope.calendars.splice(index,1);
                    }

                });
                delete scope._pool[calendarId];

            }

        },
        deleteCalendar: function(calendarId){

            var deferred = $q.defer();
            var calendar = this._search(calendarId);
            
            var scope = this;
            //if (!(calendar))
            //    return

            //var activity_id = calendar.activity;
           

            return $http.delete(serverConf.url+'/api/activities/'+this.activity_id+'/calendars/'+calendarId)
                .then(function(response){
                    scope._deleteInsntance(calendarId);

                    deferred.resolve(scope.calendars)
                    return deferred.promise
                },
                function(response){
                    return $q.reject(response.data)
                });

        },
        getCalendar: function(calendarId) {
            //var deferred = $q.defer();
            //var calendar = this._search(calendarId);
                //console.log("calendar before get",calendar);
            var calendar = new Calendar();
                angular.extend(calendar,this._retrieveInstance(calendarId));
                
            
            return calendar
            // if (calendar) {
            //     deferred.resolve(calendar);
            // } else {
            //     this._load(calendarId, deferred);
            // }
            // return deferred.promise;
        },
        // /* Use this function in order to get instances of all the books */
        loadCalendars: function(activity_id) {
            this.activity_id = activity_id;
            //var deferred = $q.defer();

            var scope = this;

            if (scope.calendars.length > 0){
                return scope.calendars
            }

            return $http.get(serverConf.url+'/api/activities/'+this.activity_id+'/calendars/')
                .then(function(response){

                    //scope.calendars = [];
                    scope._setCalendars(response.data);
                    //scope.calendars = $filter('orderBy')(scope.calendars,'initial_date');


                    return scope.calendars
                },
                function(response){
                    return response.data
                });

            //     .success(function(booksArray) {
            //         var books = [];
            //         booksArray.forEach(function(bookData) {
            //             var book = scope._retrieveInstance(bookData.id, bookData);
            //             books.push(book);
            //         });

            //         deferred.resolve(books);
            //     })
            //     .error(function() {
            //         deferred.reject();
            //     });
            // return deferred.promise;
        },
        _setCalendars: function (calendarsData){

                //scope.calendars = calendarsData;
            
            var scope = this;
            angular.forEach(calendarsData,function(calendarData){
                //this._retrieveInstance(calendarData);
                var calendar = new Calendar(calendarData);
                scope.calendars.push(calendar);
                scope._pool[calendar.id] = calendar;
                //var calendar = scope.setCalendar(calendarData);
                //    scope._addCalendar(calendar);

            })

            //return calendars


        },
        _addCalendar:function(calendar){
            this._pool[calendar.id] = calendar;
            this.calendars.push(calendar);
            //$filter('orderBy')(this.calendars,'initial_date');

        },
        // setCalendar: function(calendarData) {
        //     var scope = this;
        //     var calendar = this._search(calendarData.id);

        //     if (calendar)
        //         book.setData(calendarData);

        //     return calendar;
        // },
        // /*  This function is useful when we got somehow the book data and we wish to store it or update the pool and get a book instance in return */
        setCalendar: function(calendarData) {
            var scope = this;
            var calendar = this._search(calendarData.id);

            if (calendar) {
                calendar.setData(calendarData);
            } else {
                calendar = scope._retrieveInstance(calendarData.id,calendarData);
                this._addCalendar(calendar);

            }
            return calendar;
        },

    };
    return CalendarsManager;
};

})();