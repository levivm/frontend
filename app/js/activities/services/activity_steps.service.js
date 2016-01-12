/**
 * @ngdoc service
 * @name trulii.activities.services.ActivitySteps
 * @description ActivitySteps Value Service.
 * Contains all of the Steps or sections of activity creation
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.services')
        .value('ActivitySteps', [
            {
                sref : '.general',
                title : 'General',
                name : 'general',
                icon : 'mdi-social-school'
            },
            {
                sref : '.detail',
                title : 'Detalles',
                name : 'detail',
                icon : 'mdi-av-my-library-books'
            },
            {
                sref : '.calendars',
                title : 'Calendarios',
                name : 'calendars',
                icon: 'mdi-action-today'
            },
            {
                sref : '.location',
                title : 'Ubicación',
                name : 'location',
                icon: 'mdi-maps-pin-drop'

            },
            {
                sref : '.instructors',
                title : 'Instructores',
                name : 'instructors',
                icon: 'mdi-social-group'
            },
            {
                sref : '.gallery',
                title : 'Galería',
                name : 'gallery',
                icon : 'mdi-image-photo-library'
            },
            {
                sref : '.return-policy',
                title : 'Política de Devolución',
                name : 'return_policy',
                icon : 'mdi-communication-call-missed'
            }
        ]);
        // .factory('activity', Activity);;

})();