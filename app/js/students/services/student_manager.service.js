/**
 * @ngdoc service
 * @name trulii.students.services.StudentsManager
 * @description Student Manager Service
 * @requires ng.$http
 * @requires ng.$q
 * @requires trulii.students.services.StudentServerApi
 * @requires trulii.students.services.Student
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.services')
        .factory('StudentsManager', StudentsManager);

    StudentsManager.$inject = ['$http', '$q', 'StudentServerApi', 'Student', 'Authentication'];

    function StudentsManager($http, $q, StudentServerApi, Student, Authentication) {

        var api = StudentServerApi;
        var _pool = {};

        //noinspection UnnecessaryLocalVariableJS
        var service = {

            /**
             * @ngdoc function
             * @name trulii.students.services.StudentsManager#getStudent
             * @description Fetches a Student
             * @param {number} idStudent Student Id
             * @param {boolean} force_fetch Indicates whether to force fetch
             * from the server or not
             * @return {promise} Student Instance Promise
             * @methodOf trulii.students.services.StudentsManager
             */
            getStudent: getStudent,

            /**
             * @ngdoc function
             * @name trulii.students.services.StudentsManager#getCurrentStudent
             * @description Gets the current Student logged in in the app.
             * Returns ``null`` if there is no user logged in and
             * ``false`` if the user is not a student
             * @return {promise} Student Instance Promise
             * @methodOf trulii.students.services.StudentsManager
             */
            getCurrentStudent: getCurrentStudent
        };

        return service;

        function getStudent(idStudent, force_fetch) {
            var deferred = $q.defer();

            if(force_fetch){
                _load(idStudent, deferred);
                return deferred.promise;
            }

            var student = _search(idStudent);

            if (student) {
                deferred.resolve(student);
            } else {
                _load(idStudent, deferred);

            }

            return deferred.promise;
        }

        function getCurrentStudent(){
            var force_fetch = true;
            return Authentication.getAuthenticatedAccount().then(successAuthAccount, errorAuthAccount);

            function successAuthAccount(authenticatedUser){
                return Authentication.isStudent().then(function(isStudent){
                    if(authenticatedUser && isStudent){
                        return getStudent(authenticatedUser.id, force_fetch);
                    } else {
                        return $q.reject(false);
                    }
                });
            }

            function errorAuthAccount(){
                console.log("getCurrentStudent. Couldn't resolve authenticated user");
                return $q.reject(null);

            }
        }

        function _retrieveInstance(studentId, studentData) {
            var instance = _pool[studentId];

            if (instance) {
                instance.setData(studentData);
            } else {
                instance = new Student(studentData);
                _pool[studentId] = instance;
            }

            return instance;
        }

        function _search(studentId) {
            return _pool[studentId];
        }

        function _load(studentId, deferred) {
            $http.get(api.student(studentId))
                .then(success, error);

            function success(response) {
                var studentData = response.data;
                //console.log("from back",response.data);
                var student = _retrieveInstance(studentId, studentData);
                deferred.resolve(student);
            }
            function error() {
                deferred.reject();
            }
        }
    }
})();
