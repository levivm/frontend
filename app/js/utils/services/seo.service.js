/**
 * @ngdoc service
 * @name trulii.utils.services.TruliiSEO
 * @description TruliiSEO Handling Service
 */

(function () {
    'use strict';

    angular
        .module('trulii.utils.services')
        .factory('TruliiSEO', TruliiSEO);

    TruliiSEO.$inject = ['$rootScope'];

    function TruliiSEO($rootScope) {
        
        var PAGE_TITLE_DEFAULT= "Trulii: Cursos, Clases, Talleres y Actividades en Colombia";
        var PAGE_DESCRIPTION_DEFAULT="Trulii es la primera plataforma educativa en Colombia. Encuentra cursos, actividades o clases de tu interés. ¡Inscríbete o publica GRATIS tu curso aquí!";
                
        var service = {
            setPageContent: setPageContent
        };
        

        return service;


       function setPageContent(title, description) {
           if(!title)
             title=PAGE_TITLE_DEFAULT;
           
           if(!description)
             description= PAGE_DESCRIPTION_DEFAULT;
           
           $rootScope.page = {
                title: title,
                description: description
            }
       }   
    }

})();
