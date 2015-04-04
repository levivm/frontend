(function () {
  'use strict';

  //  angular
  // .module('trulii.authentication.controllers')
  // .$controller('RegisterController')

  // .directive('formModal', ['$http','$compile','$modal',function($http,$compile,$modal) {
  //   return {
  //     scope: {
  //       formObject: '=',
  //       formErrors: '=',
  //       title: '@',
  //       template: '@',
  //       okButtonText: '@',
  //       formSubmit: '&formSubmit'
  //     },
  //     compile: function(element, cAtts){


  //       var template,
  //         $element,
  //         loader;


  //       loader = $http.get('/partials/form_modal.html')
  //         .success(function(data) {

  //           template = data;


  //         });

  //       //return the Link function
  //       return function(scope, element, lAtts) {

  //         loader.then(function() {
  //           //compile templates/form_modal.html and wrap it in a jQuery object
  //           $element = $( $compile(template)(scope) );
  //         });

  //         //called by form_modal.html cancel button
  //         scope.close = function() {
  //           $element.modal('hide');
  //         };

  //         //called by form_modal.html form ng-submit
  //         scope.submit = function() {
  //           var result = scope.formSubmit();

  //           if (angular.isObject(result)) {
  //             result.success(function() {
  //               $element.modal('hide');
  //             }).error(function(){

  //               angular.forEach(scope.formErrors, function(errors, field) {

  //                 scope.generic_form[field].$setValidity('server', false);


  //               });

  //             });
  //           } else if (result === false) {
  //             //noop
  //             console.log('show errors');
  //           } else {
  //             $element.modal('hide');
  //           }
  //         };

  //         element.on('click', function(e) {

  //           e.preventDefault();
  //           $element.modal('show');
  //         });
  //       };
  //     }
  //   }
  // }]);

})

