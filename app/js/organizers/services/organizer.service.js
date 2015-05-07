/**
 * @ngdoc service
 * @name trulii.organizers.services.Organizer
 * @description Organizer Model Service
 * @requires ng.$http
 * @requires ng.$q
 * @requires trulii.organizers.services.OrganizerServerApi
 * @requires trulii.authentication.services.Authentication
 * @requires trulii.organizers.services.OrganizerConstants
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.services')
        .factory('Organizer', Organizer);

    Organizer.$inject = ['$http', '$q', 'OrganizerServerApi', 'Authentication', 'OrganizerConstants',
        'LocationManager'];

    function Organizer($http, $q, OrganizerServerApi, Authentication, OrganizerConstants, LocationManager) {

        var api = OrganizerServerApi;

        function Organizer(organizerData) {
            if (organizerData) {
                this.setData(organizerData);
                this.max_allowed_instructors = OrganizerConstants.max_allowed_instructors;
            }
        }

        Organizer.prototype = {

            setData : function (organizerData) {
                angular.extend(this, organizerData);
                this._setCity();
            },

            _setCity : function () {
                var city_id;
                var city;
                var organizer_city;

                this.location = (!!this.locations) && (this.locations.length > 0) ? this.locations.pop() : {};

                city_id = this.location ? this.location.city : null;

                if (!(city_id))
                    city = LocationManager.getCurrentCity();
                else
                    city = LocationManager.getCityById(city_id);

                this.location.city = city;
            },

            load : function (id) {
                var scope = this;
                // serverConf.url+'/api/organizers/' + id
                $http.get(api.organizer(id)).success(function (organizerData) {
                    console.log('response');
                    console.log(organizerData);
                    scope.setData(organizerData);
                });
            },

            update_video : function () {
                var scope = this;
                var video_data = {
                    'youtube_video_url' : scope.youtube_video_url
                };
                return scope.update(video_data)
            },

            update_profile : function () {
                var scope = this;
                var profile_data = {
                    'name' : scope.name,
                    'bio' : scope.bio
                };
                return scope.update(profile_data)
            },

            update : function (data) {
                var scope = this;
                // serverConf.url + '/api/organizers/' + this.id
                return $http.put(api.organizer(this.id),data)
                    .then(success, error);

                function success(response) {
                    Authentication.setAuthenticatedAccount(response.data);
                    scope.setData(response.data);
                    return response.data;
                }

                function error(response) {
                    return $q.reject(response);
                }
            },

            reload : function () {
                var scope = this;
                return Authentication.updateAuthenticatedAccount().then(function (response) {
                    scope.setData(response.data);
                });
            },

            change_email : function () {
                var scope = this;
                return Authentication.change_email(this.user.email)
                    .then(success, error);

                function success(response) {
                    Authentication.updateAuthenticatedAccount().then(function (response) {
                        scope.setData(response.data);
                    });
                    return response.data;
                }
                function error(response) {
                    return $q.reject(response);
                }
            },

            change_password : function (password_data) {
                return Authentication.change_password(password_data);
            },

            update_location : function (location_data_param) {
                console.log("location data", location_data_param);
                var location_data = angular.copy(location_data_param);
                location_data.city = location_data.city ? location_data.city.id : undefined;
                console.log("copying", location_data);
                // 'http://localhost:8000/api/organizers/' + this.id + '/locations/'
                return $http.post(api.locations(this.id), location_data);

            },

            getActivities : function () {
                return $http.get(api.activities(this.id))
                    .then(function (response) {
                        return response.data
                    });
            },

            deleteInstructor : function (instructorID) {
                // serverConf.url + '/api/organizers/' + this.id + '/instructors/' + instructorID
                return $http.delete(api.instructor(this.id, instructorID));
            }
        };

        return Organizer;
    }

})();