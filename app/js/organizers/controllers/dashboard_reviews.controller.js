/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerReviewsCtrl
 * @description Handles Organizer Review Dashboard
 * @requires organizer
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerReviewsCtrl', OrganizerReviewsCtrl);

    OrganizerReviewsCtrl.$inject = ['$q', 'unreadReviewObjects', 'readReviewObjects', 'Toast', 'unreadReviewsCount', 'organizer', 'ActivitiesManager'];
    function OrganizerReviewsCtrl($q, unreadReviewObjects, readReviewObjects, Toast, unreadReviewsCount, organizer, ActivitiesManager) {

        var vm = this;
        angular.extend(vm, {
            unread_reviews: unreadReviewObjects,
            read_reviews: readReviewObjects,
            searchUnreadQuery: "",
            searchReadQuery: "",
            changeReviewStatus: changeReviewStatus,
            readPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 6,
                pageNumber: 1
            },
            unreadPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 6,
                pageNumber: 1
            },
            changePage: changePage,
            TYPE_READ: 'read',
            TYPE_UNREAD: 'unread'
        });

        _activate();

        //--------- Exposed Functions ---------//
        
        function mapActivityToReview(review){
                
            ActivitiesManager.getActivity(review.activity)
            .then(
              function(response){
                review.activity = response;
              }
            );
            
            return review;

          }
              
        function changePage(type){
          switch(type){
            case vm.TYPE_READ:
              organizer.getReviews(vm.readPaginationOpts.pageNumber, vm.readPaginationOpts.itemsPerPage, vm.TYPE_READ)
              .then(function(response){
                 vm.read_reviews = response.results.map(mapActivityToReview);
                 vm.readPaginationOpts.totalItems = response.count;
              });
              
            break;
            case vm.TYPE_UNREAD:
              organizer.getReviews(vm.unreadPaginationOpts.pageNumber, vm.unreadPaginationOpts.itemsPerPage, vm.TYPE_UNREAD)
              .then(function(response){
                 vm.unread_reviews = response.results.map(mapActivityToReview);
                 vm.unreadPaginationOpts.totalItems = response.count;
              });
            break;
          }
        }
        
        function changeReviewStatus(){
          
          organizer.getReviews(vm.readPaginationOpts.pageNumber, vm.readPaginationOpts.itemsPerPage, vm.TYPE_READ)
          .then(function(response){
              vm.read_reviews = response.results.map(mapActivityToReview);
              vm.readPaginationOpts.totalItems = response.count;
          });
          
          organizer.getReviews(vm.unreadPaginationOpts.pageNumber, vm.unreadPaginationOpts.itemsPerPage, vm.TYPE_UNREAD)
          .then(function(response){
              vm.unread_reviews = response.results.map(mapActivityToReview);
              vm.unreadPaginationOpts.totalItems = response.count;
              unreadReviewsCount.count = response.count;
          });
            
          Toast.success(vm.strings.COPY_REVIEW_READ);
          
        }


        //--------- Internal Functions ---------//

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                TAB_REVIEWS_PENDING: "Comentarios > Sin revisar",
                TAB_REVIEWS_DONE: "Comentarios > Revisados",
                COPY_REVIEWS_DONE: "Revisa los comentarios que han hecho a tus actividades",
                COPY_REVIEWS_PENDING: "Encuentra todos los comentarios que le han hecho a tus actividades. Respóndeles dando las gracias a o tu poinión. Esto aparece en tu publicación y en tu perfil",
                LABEL_SEARCH_ORDERS: "Buscar",
                COPY_EMPTY_UNREAD: "No tienes comentarios por leer",
                COPY_EMPTY_READ: "Aún no has respondido ni leído ningún comentario",
                COPY_REVIEW_READ: "Su comentario fue movido a revisados."
            });
        }

        function _activate() {
          _setStrings();
        }

    }

})();
