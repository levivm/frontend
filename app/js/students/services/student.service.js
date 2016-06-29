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
        var defaultPageWlSize = 12;

        function Student(studentData) {
            if (studentData) {
                this.setData(studentData);
            }
        }

        Student.prototype = {

            setData : function (studentData) {

                var scope = this;

                angular.extend(scope, studentData);
                /*if(!scope.photo) {
                    scope.photo = defaultPicture;
                }*/
                scope._setDates();

            },
            _setDates: function(){
               
                this.birth_date = this.birth_date ? new Date(this.birth_date): this.birth_date;

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
                    'telephone' : scope.telephone ? scope.telephone : '',
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
                return Authentication.change_email(this.user.email)
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

             /**
             * @ngdoc function
             * @name .#getActivityList
             * @description Retrieves the list of activities a student has signed up for
             * @methodOf trulii.students.services.Student
             */
            getActivityList: function() {
              return $http.get(api.autocomplete(this.id))
                    .then(function (response) {
                        return response.data;
                    });
            },

            getOrders : function (params) {
                if(!params){
                    params = {}
                }
                if(!params.page){
                    params.page = defaultPage;
                }
                if(!params.pageSize){
                    params.pageSize = defaultPageSize
                }

              return $http.get(api.orders(this.id),
                  {params: params})
                  .then(function (response) {
                      return angular.copy(response.data);
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
             * @name .#getMessages
             * @description Retrieves all messages directed to the Student
             * @methodOf trulii.students.services.Student
             */
            getMessages: getMessages,
            
            /**
             * @ngdoc function
             * @name .#getMessage
             * @description Retrieves a specific messages directed to the Student
             * @methodOf trulii.students.services.Student
             */
            getMessage: getMessage,
            
            /**
             * @ngdoc function
             * @name .#deleteMessage
             * @description Deletes a message
             * @methodOf trulii.students.services.Student
             */
            deleteMessage: deleteMessage,
               
            /**
             * @ngdoc function
             * @name .#readMessage
             * @description Reads a message
             * @methodOf trulii.students.services.Student
             */
            readMessage: readMessage,
            
            /**
             * @ngdoc function
             * @name .#getWishList
             * @description Retrieves all Wishlist requested by the Student
             * @methodOf trulii.students.services.Student
             */
            getWishList: getWishList



        };

        return Student;


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

        function getWishList(page, page_size){
            var params = {};
            if(!page){
              params.page = defaultPage;
            }
            else{
              params.page = page;
            }
            if(!page_size){
              params.page_size = defaultPageWlSize;
            }
            else{
              params.page_size = page_size;
            }

            return $http.get(api.wishList(this.id), {params: params}).then(success, error);

            function success(response){
                return response.data;
            }
            function error(response){
                $q.reject(response.data);
            }
        }
        
        function getMessages(page, pageSize){
            if(!page)
              page = defaultPage;
            if(!pageSize)
              pageSize = defaultPageSize;

            return $http.get(api.messages(this.id),
                {params: {
                  page: page,
                  page_size: pageSize
                }})
                .then(function (response) {
                    return response.data;
                });
        }
        
        function getMessage(messageId){
            return $http.get(api.message(messageId))
                .then(function (response) {
                    return response.data;
                });
        }
        
        function readMessage(messageId){
            // return $http.put(api.readMessage(messageId),
            //     {
            //       params: {
            //         organizer_message: messageId,
            //         student: this.id
            //       }
            //     })
            //     .then(function (response) {
            //         return response.data;
            //     });
            
            return $http({
                url: api.readMessage(messageId),
                data:_parseParam({'organizer_message': messageId, 'student': this.id}),
                method: 'put',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            });
                
                
        }
        
        function deleteMessage(messageId){
            return $http.delete(api.message(messageId))
                .then(function (response) {
                    return response.data;
                });
        }
        
         function _parseParam(obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj) {
                value = obj[name];

                if(value instanceof Array) {
                    for(i=0; i<value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[]';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value instanceof Object) {
                    for(subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        }

    }

})();
