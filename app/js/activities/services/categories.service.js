/**
* categories
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';


  angular
    .module('trulii.activities.services')
    .factory('Categories', Categories);

  Categories.$inject = ['$http','serverConf'];

  function Categories($http,serverConf) {  
      
      function Categories(categoriesData) {
          if (categoriesData) {
              this.setData(categoriesData);
          }
          
          // Some other initializations related to book
      };



      Categories.prototype = {
          setData: function(categoriesData) {
              angular.extend(this, categoriesData);
          },
          load: function() {

              var scope = this;
              return $http.get(serverConf.url+'/api/activities/categories/').success(function(categoriesData) {
                  console.log('response');
                  console.log(categoriesData);
                  scope.setData(categoriesData);
              });

          },
          // update: function() {
          //   return $http({
          //     method: 'put',
          //     url:'/api/categories/' + this.id,
          //     data: this,
          //     headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
          //   });

          //   //$http.put('/api/categories/' + this.id, this);
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

          //   //$http.put('/api/categories/' + this.id, this);
          // },
          // change_password: function(password_data) {
          //   console.log(password_data);
          //   console.log('--------');
          //   return $http({
          //     method: 'post',
          //     url:'/users/password/change/',
          //     data: password_data,
          //   });

          //   //$http.put('/api/categories/' + this.id, this);
          // },
      };
      return Categories;
  };



})();