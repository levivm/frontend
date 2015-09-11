(function () {
  'use strict';

  angular
  .module('trulii.authentication.controllers')
  .directive('formModal',formModal);

  formModal.$inject  = ['$http','$compile','$modal'];

  function formModal($http,$compile,$modal) { 

      return {
        scope: {
          formObject: '=',
          formErrors: '=',
          title: '@',
          template: '@',
          okButtonText: '@',
          formSubmit: '&formSubmit',
        },
        compile: function(element, cAtts){


          var template,
            $element,
            loader;


          loader = $http.get('/partials/utils/form_modal.html')
            .success(function(data) {

              template = data;


            });
            console.log("template",element);




          //return the Link function
          return function(scope, element, lAtts) {




            loader.then(function() {
              //compile templates/form_modal.html and wrap it in a jQuery object

              $element = $( $compile(template)(scope) );

              $element.bind('hide.bs.modal',function(res){
                scope.formErrors = {};
              });

            });

            //called by form_modal.html cancel button
            scope.close = function() {
              $element.modal('hide');
              console.log('estoy cerrando por cancel')
              //return;
            };

            //called by form_modal.html form ng-submit
            scope.submit = function() {

              var result = scope.formSubmit();
              
              console.log("123123123123123123213213",result);

              if (angular.isObject(result)) {
                result.then(function(res) {
                  console.log("TODOOOOO BIENNN",result);
                  $element.modal('hide');
                },function(){
                  angular.forEach(scope.formErrors, function(errors, field) {

                    if (field!='__all__')
                      scope.generic_form[field].$setValidity('server', false);


                  });
                  

                });
              } else if (result === false) {
                //noop
                console.log('show errors');
              } else {
                $element.modal('hide');
              }
            };

            element.bind('click', function(e) {

              e.preventDefault();
              $('.modal').modal('hide');
              $element.modal('show');

            });


          };
        }
      }
  }
})();

