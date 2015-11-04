/**
 * @ngdoc directive
 * @name trulii.activities.directives.truliiActivityReview
 * @restrict E
 * @description Trulii Activity Review Directive.
 * @param {object} activity Activity instance to represent
 * @param {boolean} onDashboard Indicates if the review is being displayed on an administrative view
 * or Dashboard (Student's or Organizer's)
 */

(function (){
    'use strict';

    angular.module('trulii.activities.directives')

        .directive('truliiActivityReview', truliiActivityReview);

    truliiActivityReview.$inject = ['ActivitiesTemplatesPath', 'Authentication', 'ActivitiesManager', 'defaultPicture'];

    function truliiActivityReview(ActivitiesTemplatesPath, Authentication, ActivitiesManager, defaultPicture){
        return {
            restrict: 'E',
            templateUrl: ActivitiesTemplatesPath + "activity_review.html",
            scope: {
                'activity': '=',
                'onDashboard': '='
            },
            link: function(scope, element, attrs){

                angular.extend(scope, {
                    hasReview: false,
                    user: null,
                    isOrganizer: false,
                    review: null,
                    postReview: postReview
                });

                var EMPTY_REVIEW = {
                    rating: 0,
                    activity: scope.activity.id,
                    comment : ""
                };

                _activate();

                //--------- Exposed Functions ---------//

                function postReview(){
                    ActivitiesManager.getActivity(scope.activity.id).then(function(activityInstance){
                        activityInstance.postReview(scope.review).then(success, error);
                    });
                }

                //--------- Internal Functions ---------//

                function _getUser(){
                    Authentication.getAuthenticatedAccount(true).then(success, error);

                    function success(user){
                        scope.user = user;
                        scope.isOrganizer = user.user_type.toUpperCase === 'O';
                    }
                    function error(error){
                        console.log('_getUser error:', error);
                        scope.isOrganizer = false; // Failsafe
                    }
                }

                function _setStrings(){
                    if(!scope.strings){ scope.strings = {}; }
                    angular.extend(scope.strings, {
                        LABEL_RATE_EXPERIENCE: "¿Cómo calificarías la experiencia?",
                        PLACEHOLDER_REVIEW_COMMENT: "Deja tu comentario. Esto lo verá el organizador y demás usuarios",
                        ACTION_DONE: "Listo"

                    });
                }

                function _activate(){
                    _setStrings();
                    _getUser();
                    if(scope.activity.review){
                        scope.hasReview = true;
                        scope.review = scope.activity.review;
                    } else {
                        scope.hasReview = false;
                        scope.review = angular.copy(EMPTY_REVIEW);
                    }

                    // TODO Might be redundant
                    var organizer = scope.activity.organizer;
                    if(!organizer.photo){
                        organizer.photo = defaultPicture;
                    }

                    console.log('review directive activity:', scope.activity);
                    console.log('review directive review:', scope.activity.review);
                }
            }
        }
    }

})();
