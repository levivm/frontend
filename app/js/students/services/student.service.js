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

    Student.$inject = ['$http', '$q', 'UploadFile', 'StudentServerApi', 'Authentication'];

    function Student($http, $q, UploadFile, StudentServerApi, Authentication) {

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

            update_profile : function () {
                var scope = this;
                var profile_data = {
                    user: {
                        'first_name': scope.user.first_name,
                        'last_name': scope.user.last_name,
                        'city': scope.user.city
                    },
                    'birth_date': scope.birth_date,
                    'gender': scope.gender,
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
                var deferred = $q.defer();

                UploadFile.upload_file(photo_data, api.upload_photo())
                    .then(success,error);

                return deferred.promise;

                function success(response){
                    deferred.resolve(response.data);
                }
                function error(response) {
                    deferred.reject(response);
                }
            },

            getPicture: function(){
                return !!this.photo? this.photo : 'css/img/default_profile_pic.jpg';
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