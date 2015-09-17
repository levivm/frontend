/**
 * @ngdoc service
 * @name trulii.organizers.services.OrganizerConstants
 * @description Organizer component related constants
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.services')
        .constant("OrganizerConstants", {
            /**
             * @ngdoc property
             * @name trulii.organizers.services.OrganizerConstants#max_allowed_instructors
             * @returns {number} Maximum number of instructors per activity
             * @propertyOf trulii.organizers.services.OrganizerConstants
             */
            'max_allowed_instructors' : 4
        });
})();