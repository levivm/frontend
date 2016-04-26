/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerActivitiesCtrl
 * @description Handles Organizer Activities Dashboard
 * @requires organizer
 * @requires activities
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerActivitiesCtrl', OrganizerActivitiesCtrl);

    OrganizerActivitiesCtrl.$inject = ['organizer', 'ActivitiesManager', 'openActivities', 'closedActivities', 'inactiveActivities', '$window', '$scope'];
    function OrganizerActivitiesCtrl(organizer, ActivitiesManager, openActivities, closedActivities, inactiveActivities, $window, $scope) {

        var vm = this;
        angular.extend(vm, {
            organizer : organizer,
            isCollapsed : true,
            open_activities : [],
            closed_activities : [],
            inactive_activities : [],
            TYPE_OPEN: "opened",
            TYPE_CLOSED: "closed",
            TYPE_INACTIVE: "unpublished",
            dashOrganizer: true,
            openOptions : {
                actions: ['edit', 'manage']
            },
            openPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 12,
                pageNumber: 1
            },
            closedPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 12,
                pageNumber: 1
            },
            inactivePaginationOpts: {
                totalItems: 0,
                itemsPerPage: 12,
                pageNumber: 1
            },
            closedOptions : {
                actions: ['edit', 'republish', 'manage'],
                isInactive: true
            },
            inactiveOptions : {
                actions: ['edit', 'manage']
            },
            pageChange: pageChange
        });
        var active_activities = [];

        _activate();

        //--------- Exposed Functions ---------//

        function pageChange(type){
          console.log(type);
            switch(type){
                case vm.TYPE_OPEN:
                  ActivitiesManager.loadOrganizerActivities(organizer.id, vm.TYPE_OPEN, vm.openPaginationOpts.pageNumber,  vm.openPaginationOpts.itemsPerPage)
                  .then(function (response) {
                    vm.open_activities = response.results;
                    vm.openPaginationOpts.totalItems = response.count;
                    vm.open_activities = vm.open_activities.slice(0, vm.openPaginationOpts.itemsPerPage);
                  });
                  break;
                case vm.TYPE_CLOSED:
                   ActivitiesManager.loadOrganizerActivities(organizer.id, vm.TYPE_CLOSED, vm.closedPaginationOpts.pageNumber,  vm.closedPaginationOpts.itemsPerPage)
                  .then(function (response) {
                    vm.closed_activities = response.results;
                    vm.closedPaginationOpts.totalItems = response.count;
                    vm.closed_activities = vm.closed_activities.slice(0, vm.closedPaginationOpts.itemsPerPage);
                  });
                  break;
                case vm.TYPE_INACTIVE:
                   ActivitiesManager.loadOrganizerActivities(organizer.id, vm.TYPE_INACTIVE, vm.inactivePaginationOpts.pageNumber,  vm.inactivePaginationOpts.itemsPerPage)
                  .then(function (response) {
                    vm.inactive_activities = response.results;
                    vm.inactivePaginationOpts.totalItems = response.count;
                    vm.inactive_activities = vm.inactive_activities.slice(0, vm.inactivePaginationOpts.itemsPerPage);
                  });
                  break;
            }
        }

        //--------- Internal Functions ---------//

        function _assignActivities(){

            vm.open_activities = openActivities.results;
            vm.openPaginationOpts.totalItems = openActivities.count;

            vm.closed_activities = closedActivities.results;
            vm.closedPaginationOpts.totalItems = closedActivities.count;

            vm.inactive_activities = inactiveActivities.results;
            vm.inactivePaginationOpts.totalItems = inactiveActivities.count;
        }

        function _mapMainPicture(activity){
            angular.forEach(activity.pictures, function(picture, index, array){
                if(picture.main_photo){
                    activity.main_photo = picture.photo;
                }

                if( index === (array.length - 1) && !activity.main_photo){
                    activity.main_photo = array[0].photo;
                }
            });

            return activity;
        }

        function _isMobile(){
          return $window.innerWidth < 992;
        }

        function _resize(){
          vm.dashOrganizer = _isMobile() ? false:true;
          $scope.$digest();
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_CREATE_ACTIVITY: "Crear Nueva Actividad",
                ACTION_PUBLISH_ACTIVITY: "Publicar Actividad Existente",
                ACTION_REPUBLISH_ACTIVITY: "Republicar Actividad",
                COPY_EMPTY_CLOSED: "Por ahora no tienes ninguna actividad cerrada. ¿Te animas a publicar " +
                "una actividad en este momento? Te prometemos que será fácil.",
                COPY_EMPTY_OPEN: "Por ahora no tienes ninguna actividad abierta. ¿Te animas a publicar una "
                + "actividad en este momento? Te prometemos que será fácil.",
                COPY_EMPTY_INACTIVE: "Parece ser el momento perfecto para crear y publicar una nueva actividad",
                LABEL_EMPTY_OPEN: "No tienes actividades abiertas",
                LABEL_EMPTY_INACTIVE: "Actualmente no tienes borradores de actividades.",
                SECTION_ACTIVITIES: "Mis Actividades",
                TAB_OPEN: "Abiertas",
                TAB_CLOSED: "Cerradas",
                TAB_INACTIVE: "Inactivas",
                COPY_INACTIVE: "Actividades inactivas son aquellas publicaciones cuyas inscripciones se encuentran en modo borrador",
                COPY_CLOSED: "Una actividad anterior es aquella que finalizó. Puedes editar su información para re-utilizarla. ¡Así de fácil!",
                COPY_OPEN: "Actividades abiertas son aquellas publicaciones cuyas inscripciones siguen abiertas"
            });
        }

        function _activate() {
            _setStrings();
            vm.open_activities.map(_mapMainPicture);
            vm.closed_activities.map(_mapMainPicture);
            vm.inactive_activities.map(_mapMainPicture);
            var window = angular.element($window);
            _assignActivities();
            vm.dashOrganizer = _isMobile() ? false:true;


            window.bind('resize', _resize);

        }

    }

})();
