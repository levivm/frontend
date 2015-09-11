/**
 * @ngdoc service
 * @name trulii.activities.services.Categories
 * @description Categories Service
 * @requires ng.$http
 * @requires trulii.activities.services.ActivityServerApi
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.services')
        .factory('Categories', Categories);

    Categories.$inject = ['$http', 'ActivityServerApi'];

    function Categories($http, ActivityServerApi) {

        var api = ActivityServerApi;

        function Categories(categoriesData) {
            if (categoriesData) {
                this.setData(categoriesData);
            }
        }

        Categories.prototype = {

            setData : function (categoriesData) {
                angular.extend(this, categoriesData);
            },

            load : function () {
                var scope = this;
                return $http.get(api.categories())
                    .success(function (categoriesData) {
                        console.log('response');
                        console.log(categoriesData);
                        scope.setData(categoriesData);
                    });
            }
            // update: function() {
            //   return $http({
            //     method: 'put',
            //     url:'/api/categories/' + this.id,
            //     data: this,
            //     headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            //   });
            //   //$http.put('/api/categories/' + this.id, this);
            // },
        };

        return Categories;

    }

})();