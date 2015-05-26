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

    Student.$inject = ['$http', '$q', 'StudentServerApi', 'Authentication'];

    function Student($http, $q, StudentServerApi, Authentication) {

        var api = StudentServerApi;

        function Student(studentData) {
            if (studentData) {
                this.setData(studentData);
            }
        }

        Student.prototype = {

            setData : function (studentData) {
                angular.extend(this, studentData);
            },

            load : function (id) {
                var scope = this;
                $http.get(api.student(id)).success(function (studentData) {
                    console.log('response');
                    console.log(studentData);
                    scope.setData(studentData);
                });
            },

            //TODO
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
                return $http.put(api.student(this.id),data)
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
                return Authentication.change_email(this.email)
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

            upload_photo : function (photo_data) {
                return $http.post(api.upload_photo(), photo_data)
                    .then(success, error);

                function success(response){
                    return response.data;
                }
                function error(response) {
                    return $q.reject(response);
                }
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