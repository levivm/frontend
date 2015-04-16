(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerProfileController', OrganizerProfileController)

    OrganizerProfileController.$inject = ['organizer', 'activities'];

    function OrganizerProfileController(organizer, activities) {
        var vm = this;

        vm.organizer = organizer;
        vm.activities = activities;
    }
})();