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
        var defaultPage = 1;
        var defaultPageSize = 10;

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
                    'telephone' : scope.telephone,
                };
                return scope.update(profile_data);
            },
            upload_photo : function (image) {
                var scope = this;

                return UploadFile.upload_user_photo(image,api.student(scope.id));
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
                    scope._setDates();
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

            getOrders : function (page, pageSize) {
              if(!page){
                page = defaultPage;
              }
              if(!pageSize){
                pageSize = defaultPageSize
              }
              return $http.get(api.orders(this.id),
                  {params: {
                    page: page,
                    page_size: pageSize
                  }})
                  .then(function (response) {
                      console.log(response.data.results[0].activity);
                      return response.data;
                  });
            },

            getOrder : function (orderId) {
                return $http.get(api.order(this.id, orderId))
                    .then(function (response) {
                        return response.data;
                    });
            },

            getReviews: getReviews,

            /**
             * @ngdoc function
             * @name .#requestRefund
             * @description Request a refund over an assistant if assistantId is not NULL, otherwhise 
             * a refund is requested over an order, given by orderId
             * @methodOf trulii.students.services.Student
             */
            requestRefund:requestRefund,

            /**
             * @ngdoc function
             * @name .#getRefunds
             * @description Retrieves all refunds requested by the Student
             * @methodOf trulii.students.services.Student
             */
            getRefunds: getRefunds,


        };

        return Student;


        function requestRefund(orderId,assistantId){

            //if assistantId is null, the refund is requested 
            //over whole order instead of an assitant
            return $http.post(api.refund(),{order:orderId,assistant:assistantId})
                .then(success,error);


            function success(response){

                console.log('requesting order refund success', response);
                return response.data;
            }

            function error(response){
                console.log('requesting order refund error', response);
                return $q.reject(response.data);

            }

        }

        function getRefunds(page, pageSize){
          if(!page){
            page = defaultPage;
          }
          if(!pageSize){
            pageSize = defaultPageSize
          }
          return $http.get(api.refunds(this.id),
            {params: {
              page: page,
              page_size: pageSize
            }})
            .then(function (response) {
                return response.data;
            });
            // var deferred = $q.defer();
            // var refunds = [];

            // collectRefunds(api.refunds());

            // return deferred.promise;

            // function collectRefunds(nextUrl){
            //     return $http.get(nextUrl)
            //         .then(success, error);

            //     function success(response) {
            //         refunds = refunds.concat(response.data.results);
            //         if(response.data.next){
            //             return collectRefunds(response.data.next);
            //         } else {
            //             deferred.resolve(refunds);
            //         }
            //     }

            //     function error(response) {
            //         console.log("Error getting organizer refunds: ", response.data);
            //         deferred.reject(refunds);
            //     }
            // }

        }


        function getReviews(){

            var deferred = $q.defer();
            var reviews = [];

            collectReviews(api.reviews(this.id));

            return deferred.promise;

            function collectReviews(nextUrl){
                return $http.get(nextUrl)
                    .then(success, error);

                function success(response) {
                    reviews = reviews.concat(response.data.results);
                    if(response.data.next){
                        return collectReviews(response.data.next);
                    } else {
                        deferred.resolve(reviews);
                    }
                }

                function error(response) {
                    console.log("Error getting student reviews: ", response.data);
                    deferred.reject(reviews);
                }
            }
        }
    }

})();
