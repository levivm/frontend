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
        'LocationManager','UploadFile', 'defaultPicture'];

    function Organizer($http, $q, OrganizerServerApi, Authentication, OrganizerConstants,
                       LocationManager, UploadFile, defaultPicture) {

        var api = OrganizerServerApi;
        var defaultPageSize = 10;
        var defaultPageSizeWithd = 5;
        var reviewsDefaultPageSize = 5;
        var defaultPage = 1;

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
                if(!this.photo) {
                    this.photo = defaultPicture;
                }
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
            load : function () {
                var scope = this;
                return $http.get(api.organizer(scope.id)).success(function (organizerData) {
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
                return scope.update(video_data);
            },

            update_profile : function () {
                var scope = this;
                var profile_data = {
                    'name' : scope.name,
                    'bio' : scope.bio,
                    'headline' : scope.headline
                };
                return scope.update(profile_data);
            },
            upload_photo : function (image) {
                var scope = this;

                return UploadFile.upload_user_photo(image,api.organizer(scope.id));
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
                return Authentication.getAuthenticatedAccount(true).then(function (response) {
                    scope.setData(response.data);
                });
            },

            change_email : function () {
                var scope = this;
                return Authentication.change_email(this.user.email)
                    .then(success, error);

                function success(response) {
                    console.log("CHANGE EMAIL RESPONSE");
                    Authentication.getAuthenticatedAccount(true).then(function (response) {
                        scope.setData(response);
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
                var location_data = angular.copy(location_data_param);
                location_data.city = location_data.city ? location_data.city.id : undefined;
                return $http.post(api.locations(this.id), location_data);

            },

            getActivities : function () {
                return $http.get(api.activities(this.id))
                    .then(function (response) {
                        return response.data;
                    });
            },

            getActivityList: function() {
              return $http.get(api.autocomplete(this.id))
                    .then(function (response) {
                        return response.data;
                    });
            },

            getOrders : function (page, pageSize, paramsFilter) {

              if(!page)
                page = defaultPage;
              if(!pageSize)
                pageSize= defaultPageSize;

              var params= {
                page: page,
                page_size: pageSize
              };
              if(paramsFilter)
                angular.extend(params, paramsFilter);

              console.log(params);


              return $http.get(api.orders(this.id), {params: params})
                  .then(function (response) {
                      return response.data;
                  });

            },

            getBalances: function (page, pageSize){

              return $http.get(api.balance())
                          .then(success, error);

                  function success(response){
                    return response.data
                  }
                  function error(response){
                    console.log(response);
                  }

            },

            getWithDraw: function (page, pageSize){
              if(!page)
                page = defaultPage;
              if(!pageSize)
                pageSize= defaultPageSizeWithd;

              var params = {
                page: page,
                page_size: pageSize
              };
              return $http.get(api.withDraw(), {params: params})
                          .then(success, error);

                  function success(response){
                    return response.data
                  }
                  function error(response){
                    console.log(response);
                  }

            },

            postWithDraw: function (){
              return $http.post(api.withDraw(), {data: []})
                          .then(success, error);

                  function success(response){
                    console.log(response);
                    return response.data
                  }
                  function error(response){
                    console.log(response);
                  }

            },


            /**
             * @ngdoc function
             * @name .#getReviews
             * @description Retrieves all Reviews from an Organizer
             * @methodOf trulii.organizers.services.Organizer
             */
            getReviews: getReviews,

            /**
             * @ngdoc function
             * @name .#getInstructors
             * @description Retrieves all Instructors from an Organizer
             * @methodOf trulii.organizers.services.Organizer
             */
            getInstructors: getInstructors,

            /**
             * @ngdoc function
             * @name .#createInstructor
             * @description Creates a new Instructor for the Organizer
             * @methodOf trulii.organizers.services.Organizer
             */
            createInstructor: createInstructor,

            /**
             * @ngdoc function
             * @name .#updateInstructor
             * @description Updates an Instructor for the Organizer
             * @methodOf trulii.organizers.services.Organizer
             */
            updateInstructor: updateInstructor,

            /**
             * @ngdoc function
             * @name .#deleteInstructor
             * @description Deletes an Instructor for the Organizer
             * @methodOf trulii.organizers.services.Organizer
             */
            deleteInstructor: deleteInstructor,

            /**
             * @ngdoc function
             * @name .#getBankingInfo
             * @description Retrieves the Organizer Banking Info
             * @methodOf trulii.organizers.services.Organizer
             */
            getBankingInfo: getBankingInfo,

            /**
             * @ngdoc function
             * @name .#saveBankingInfo
             * @description Updates the Organizer Banking Info
             * @params data Organizer banking Info
             * @methodOf trulii.organizers.services.Organizer
             */
            saveBankingInfo: saveBankingInfo,

        };

        return Organizer;

        function getReviews(page, pageSize, status){

          if(!page)
            page = defaultPage;
          if(!pageSize)
            pageSize = reviewsDefaultPageSize;
          if(!status){
            status = '';
          }

          return $http.get(api.reviews(this.id),
                {params: {
                  page: page,
                  page_size: pageSize,
                  status: status
                }})
                .then(success, error);

                function success(response) {
                    return response.data;
                };

                function error(response){
                  console.log("Error getting organizer reviews: ", response.data);
                }
        }

        function getInstructors(){
            var that = this;
            return $http.get(api.instructors(that.id)).then(success, error);

            function success(response){
                return response.data;
            }
            function error(response){
                console.log('organizer.get instructors error:', response.data);
                return response.data;
            }
        }

        function createInstructor(instructor){
            var that = this;
            return $http.post(api.instructors(that.id), instructor).then(success, error);

            function success(response){
                console.log('organizer.create instructor success:', response);
                return response.data;
            }
            function error(response){
                console.log('organizer.create instructor error:', response);
                return response.data;
            }
        }

        function updateInstructor(instructor){
            return $http.put(api.instructor(instructor.id), instructor).then(success, error);

            function success(response){
                console.log('organizer.update instructor success:', response);
                return response.data;
            }
            function error(response){
                console.log('organizer.update instructor error:', response);
                return response.data;
            }
        }

        function deleteInstructor(instructor){
            return $http.delete(api.instructor(instructor.id)).then(success, error);

            function success(response){
                console.log('organizer.delete instructor success:', response);
                return response.data;
            }
            function error(response){
                console.log('organizer.delete instructor error:', response);
                return response.data;
            }
        }

        function getBankingInfo(){
            return $http.get(api.bankingInfo(this.id)).then(success, error);

            function success(response){
                return response.data;
            }
            function error(response){
                console.log("Error retrieving Organizer's Banking Info:", response.data);
            }
        }

        function saveBankingInfo(data){
            if (data.id)
                return $http.put(api.bankingInfo(), data).then(success, error);
            else
                return $http.post(api.bankingInfo(), data).then(success, error);


            function success(response){
                return response.data;
            }
            function error(response){
                console.log("Error updating Organizer's Banking Info:", response.data);
                return $q.reject(response.data);
            }
        }

    }

})();
