(function () {
  'use strict';
  angular
    .module('trulii.activities.services')
    .factory('ActivitiesManager', ActivitiesManager);

  ActivitiesManager.$inject = ['$http','$q','serverConf','Activity', 'CalendarsManager'];

  function ActivitiesManager($http,$q,serverConf,Activity, CalendarsManager) {
    


    var ActivitiesManager = {
        _base_url : serverConf.url+'/api/activities/',
        _pool: {},
        _activities:[],
        _retrieveInstance: function(activityID, activityData) {
            var instance = this._pool[activityID];

            if (instance) {

                instance.setData(activityData);
            } else {
                instance = new Activity(activityData);
                this._pool[activityID] = instance;
            }

            return instance;
        },
        _search: function(activityID) {
            return this._pool[activityID];
        },
        _load: function(activityID, deferred) {
            var scope = this;
                
            if (activityID) {
                $http.get(this._base_url + activityID)
                    .then(function(response) {
                        var activityData = response.data
                        var activity = scope._retrieveInstance(activityData.id, activityData);
                        deferred.resolve(activity);
                    },function() {
                        deferred.reject();
                    });
            }
            else{
                var activity = scope._retrieveInstance(null, {});
                    deferred.resolve(activity);
            }

            return deferred.promise
        },
        getActivity: function(activityId,create) {

            var deferred = $q.defer();
            var activity = this._search(activityId);
            if (activity) {
                deferred.resolve(activity);
            } else {
                this._load(activityId, deferred);
            }

            
            return deferred.promise;
        },
        loadOrganizerActivities: function(organizer_id) {


            var scope = this;

            if (!(_.isEmpty(scope._activities)))
                return scope._activities


            return $http({
              method: 'get',
              url:serverConf.url+'/api/organizers/'+organizer_id+'/activities/'
            }).then(function(response){

                _.each(response.data,function(activityData){

                    var activity = scope._retrieveInstance(activityData.id,activityData)
                    
                    scope._activities.push(activity)

                })
                return scope._activities
            });


        },
        loadGeneralInfo: function() {
          var scope = this;
          
          var deferred = $q.defer();

          if (scope.presave_info){ 
           
            deferred.resolve(scope.presave_info);                
          }
          else{

            var url = this._base_url + "info/";
            $http.get(url).then(function(response){
              scope.presave_info = response.data;
              deferred.resolve(scope.presave_info);
              
            });

          }
          return deferred.promise


        },
        enroll: function (activity_id, data) {
            return $http.post(serverConf.url+'/api/activities/'+activity_id+'/orders', data);
        }

    };
    return ActivitiesManager;
  };

})();