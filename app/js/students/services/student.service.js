/**
 * @ngdoc service
 * @name trulii.students.services.Student
 * @description Student Model Service
 * @requires ng.$http
 * @requires ng.$q
 * @requires trulii.students.services.StudentServerApi
 * @requires trulii.authentication.services.Authentication
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.services')
        .factory('Student', Student);

    Student.$inject = ['$http', '$q', 'UploadFile', 'StudentServerApi', 'Authentication', 'defaultPicture'];

    function Student($http, $q, UploadFile, StudentServerApi, Authentication, defaultPicture) {

        var api = StudentServerApi;

        function Student(studentData) {
            if (studentData) {
                this.setData(studentData);
            }
        }

        Student.prototype = {

            setData : function (studentData) {

                var scope = this;

                angular.extend(scope, studentData);
                if(!scope.photo) {
                    scope.photo = defaultPicture;
                }
                scope._setDates();

            },
            _setDates: function(){

                this.birth_date = new Date(this.birth_date);

            },

            load : function (id) {
                var scope = this;
                return $http.get(api.student(id)).success(function (studentData) {
                    scope.setData(studentData);
                });
            },

            update_profile : function () {
                var scope = this;
                var profile_data = {
                    user: {
                        'first_name': scope.user.first_name,
                        'last_name': scope.user.last_name,
                    },
                    'birth_date': scope.birth_date.valueOf(),
                    'gender': scope.gender,
                    'bio' : scope.bio,
                    'city' : scope.city,
                };
                return scope.update(profile_data)
            },
            upload_photo : function (image) {
                var scope = this;

                return UploadFile.upload_user_photo(image,api.student(scope.id));
            },

            update : function (data) {
                var scope = this;
                console.log("updating STUDENT",scope);
                return $http.put(api.student(this.id),data)
                    .then(success, error);

                function success(response) {
                    Authentication.setAuthenticatedAccount(response.data);
                    scope.setData(response.data);
                    return response.data;
                }

                function error(response) {
                    _setDates();
                    return $q.reject(response);
                }
            },

            reload : function () {
                var scope = this;
                return Authentication.getAuthenticatedAccount(true).then(function (response) {
                    scope.setData(response.data);
                });
            },

            change_email : function () {
                var scope = this;
                return Authentication.change_email(this.email)
                    .then(success, error);

                function success(response) {
                    Authentication.getAuthenticatedAccount(true).then(function (response) {
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

            getOrders : function () {
                return $http.get(api.orders(this.id))
                    .then(function (response) {
                        return response.data;
                    });
            }
        };

        return Student;
    }

})();