/**
* activities
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

 
  angular
    .module('trulii.activities.services')
    .factory('Activity', Activity);

  Activity.$inject = ['$http','$q','$log','serverConf','UploadFile'];

  function Activity($http,$q,$log,serverConf,UploadFile) {  
      
      function Activity(activitieData) {
          if (activitieData) {
              this.setData(activitieData);
          }
          this.tags = [];
          this.base_url = serverConf.url+'/api/activities/';

          // Some other initializations related to book
      };

      Activity.prototype = {
          setData: function(activitieData) {
              angular.extend(this, activitieData);
          },
          create: function(){
            return $http.post(this.base_url,this);
          },
          generalInfo: function() {
              var scope = this;
              
              var deferred = $q.defer();

              if (scope.presave_info){ 
               
                deferred.resolve(scope.presave_info);                
                return deferred.promise
              }
              else{

                var url = this.base_url + "info/";
                return $http.get(url).then(function(response){
                  scope.presave_info = response.data;
                  deferred.resolve(scope.presave_info);
                  return deferred.promise
                });

              }

              //return deferred.promise;

          },
          load: function(id){
            var scope = this;

            if (!(id))
              id = scope.id

            var url = this.base_url + id;
            return $http.get(url)
              .then(function(response) {
                scope.setData(response.data);
                return scope
              });
          },
          update: function() {
            var url = this.base_url + this.id;
            var scope = this;
            return $http({
              method: 'put',
              url:url,
              data: this,
              //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            });
          },
          addPhoto:function(image){
            var url = this.base_url + this.id + '/gallery';
            return UploadFile.upload_file(image,url);


          },
          deletePhoto:function(image){
            var url = this.base_url + this.id + '/gallery';
            return $http({
              method: 'put',
              url:url,
              data: {'photo_id':image.id},
            });
          },
          publish:function(){

            var scope = this;
            var url = this.base_url + this.id + '/publish';
            return $http({
              method: 'put',
              url:url,
            }).then(function(response){

              scope.published = true;

            });

          }

          //   //$http.put('/api/activities/' + this.id, this);
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

          //   //$http.put('/api/activities/' + this.id, this);
          // },
          // change_password: function(password_data) {
          //   console.log(password_data);
          //   console.log('--------');
          //   return $http({
          //     method: 'post',
          //     url:'/users/password/change/',
          //     data: password_data,
          //   });

          //   //$http.put('/api/activities/' + this.id, this);
          // },
      };
      return Activity;
  };



})();