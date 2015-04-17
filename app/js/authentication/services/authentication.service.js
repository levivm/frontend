/**
* Authentication
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

  angular
    .module('trulii.authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = [ '$http','$q','serverConf','localStorageService'];

  /**
  * @namespace Authentication
  * @returns {Factory}
  */
  function Authentication($http, $q,serverConf, localStorageService) {
    /**
    * @name Authentication
    * @desc The Factory to be returned
    */


    var Authentication = {
      register: register,
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      login: login,
      logout:logout,
      reset_password:reset_password,
      forgot_password:forgot_password,
      change_password: change_password,
      change_email: change_email,
      updateAuthenticatedAccount: updateAuthenticatedAccount,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate: unauthenticate,
      getCurrentUser:getCurrentUser,
      isAnonymous:isAnonymous

    };



    return Authentication;


    /** Helper function */
    function _parseParam(obj) {
      var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        
      for(name in obj) {
        value = obj[name];
          
        if(value instanceof Array) {
          for(i=0; i<value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[]';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value instanceof Object) {
          for(subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value !== undefined && value !== null)
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }
        
      return query.length ? query.substr(0, query.length - 1) : query;
    };


    function register(email, password,first_name,last_name,user_type) {

      var request = $http({
        method: 'post',
        url: serverConf.url+'/users/signup/',
        data:_parseParam({
          password1: password,
          email: email,
          first_name: first_name,
          last_name: last_name,
          user_type: user_type
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},

      });




      return request

    }


    function login(email, password) {
      var request = $http({
        method: 'post',
        url: serverConf.url+'/users/login/',
        data:_parseParam({
          login:email,
          password:password
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        //headers: { 'Content-Type': 'application/json'},
      })
      .then(function(login_response){
        var login_data = {'email':email,'password':password};
        return getToken(login_data).then(function(response_token){

          localStorageService.set('token',response_token.data.token);

          return login_response
        })

      },authenticationError);

      return request

    }

    function logout() {

      var request = $http({
        method: 'post',
        url: serverConf.url+'/api/users/logout/',
      }).then(unauthenticate,logoutError);

      return request
    }




    function forgot_password(email) { 


      var request = $http({
        url: serverConf.url+'/users/password/reset/',
        method: 'post',
        data:_parseParam({'email':email}),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      });

      return request



    }


    function reset_password(key,password1,password2) { 

      var request = $http({
        url: serverConf.url+'/users/password/reset/key/'+key+'/',
        data:_parseParam({'password1':password1,'password2':password2}),
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      });

      return request

    }


    function change_password(password_data){
      var request = $http({
        method: 'post',
        url:serverConf.url+'/users/password/change/',
        data:_parseParam(password_data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      });


      return request




    }


    function change_email(email){

      var request = $http({
        method: 'post',
        url:serverConf.url+'/users/email/',
        data: _parseParam({
          'email':email,
          'action_add':true,
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      });


      return request




    }


    function getCurrentUser(){

      return $http.get(serverConf.url+'/api/users/current/');
      

    }

    function getToken(login_data){

      var request = $http({
        method: 'post',
        url:serverConf.url+'/api/users/token/',
        data: login_data,
      });

      return request;


    }



    /** AUTH HELPER / CALLBACKS METHODS */


    function logoutError(response){

      redirect();
    }

    function authenticationError(response){

      console.log("response BAD login",response);
      return $q.reject(response);

    }


    function isAnonymous(){

      is_anonymous = getAuthenticatedAccount() ? false:true;
      return is_anonymous
    }

    function getAuthenticatedAccount() {
      if (!isAuthenticated()) {
        return;
      }

      return localStorageService.get('user')
    }


    function isAuthenticated() {
      return !!localStorageService.get('user');
    }


    // function loginSuccess(response){
      
    //   return response
    // }

    function setAuthenticatedAccount(data){

      localStorageService.set('user',data);
      return data
    }

    function updateAuthenticatedAccount(response) {

      return getCurrentUser().then(function(response){
        localStorageService.set('user',response.data);
        return response.data

      });
      
    }


    function unauthenticate() {
      localStorageService.remove('user');
      localStorageService.remove('token');
    }





    function redirect(){

      $state.go("home");
    }


  }



})();