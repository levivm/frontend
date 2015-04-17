/**
* Organizers
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

  // angular
  //   .module('trulii.organizers.services')
  //   .factory('OrganizerService', OrganizerService);

  // OrganizerService.$inject = ['$cookies', '$http','Authentication'];

  // /**
  // * @namespace OrganizerService
  // * @returns {Factory}
  // */
  // function OrganizerService($cookies, $http,Authentication) {



  //   var OrganizerService = {
  //     update: update,
  //   };



  //   return OrganizerService;


  //   function update(organizer) {

  //     var request = $http({
  //       method: 'put',
  //       url:'/api/organizers/'+organizer.id+'/',
  //       data: organizer,
  //       headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
  //     });

  //     return request
  //   }


  // }

  angular
    .module('trulii.organizers.services')
    .factory('Organizer', Organizer);

  Organizer.$inject = ['$http','$q','serverConf','Authentication'];

  function Organizer($http,$q,serverConf,Authentication) {  
      
      function Organizer(organizerData) {
          if (organizerData) {
              this.setData(organizerData);
          }
          // Some other initializations related to book
      };

      Organizer.prototype = {
          setData: function(organizerData) {
              angular.extend(this, organizerData);
          },
          load: function(id) {
              var scope = this;

              $http.get(serverConf.url+'/api/organizers/' + id).success(function(organizerData) {
                  console.log('response');
                  console.log(organizerData);
                  scope.setData(organizerData);
              });
          },
          update_video: function(){

            var scope = this;
            var video_data = {'youtube_video_url':scope.youtube_video_url};
            return scope.update(video_data)

          },
          update_profile: function(){

            var scope = this;
            var profile_data = {'name':scope.name,'bio':scope.bio};
            return scope.update(profile_data)

          },
          update: function(data) {
            var scope = this;
            return $http({
              method: 'put',
              url:serverConf.url+'/api/organizers/' + this.id,
              data: data,
              //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            }).then(function(response){

              Authentication.setAuthenticatedAccount(response.data);
              scope.setData(response.data);
              return response.data;

            },function(response){


              return $q.reject(response);

            });

            //$http.put(serverConf.url+'/api/organizers/' + this.id, this);
          },
          change_email: function() {

            var scope = this;

            return Authentication.change_email(this.user.email)
            .then(function(response){
              Authentication.updateAuthenticatedAccount().then(function(response){
                scope.setData(response.data);
                console.log("ORGANIZER",scope);

              });

              return response.data;

            },function(response){


              return $q.reject(response);

            });
            

            //$http.put(serverConf.url+'/api/organizers/' + this.id, this);
          },
          change_password: function(password_data) {

            return Authentication.change_password(password_data)
            //$http.put('/api/organizers/' + this.id, this);
          },
      };
      return Organizer;
  };



})();