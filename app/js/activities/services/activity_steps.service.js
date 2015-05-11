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
                name : 'general'
            },
            {
                sref : '.detail',
                title : 'Detalle',
                name : 'detail'
            },
            {
                sref : '.calendars',
                title : 'Calendario',
                name : 'calendars'
            },
            {
                sref : '.location',
                title : 'Ubicación',
                name : 'location'
            },
            {
                sref : '.instructors',
                title : 'Instructores',
                name : 'instructors'
            },
            {
                sref : '.gallery',
                title : 'Galeria',
                name : 'gallery'
            },
            {
                sref : '.return-policy',
                title : 'Política de Devolución',
                name : 'return-policy'
            }
        ]);

})();