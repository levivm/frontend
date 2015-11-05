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
                'review': '=',
                'activity': '=',
                'onDashboard': '='
            },
            link: function(scope, element, attrs){

                angular.extend(scope, {
                    hasReview: false,
                    showReportWarning: false,
                    user: null,
                    isOrganizer: false,
                    postReview: postReview,
                    confirmReport: confirmReport,
                    cancelReport: cancelReport
                });

                var activityInstance = null;
                var organizer = null;

                var EMPTY_REVIEW = {
                    rating: 0,
                    comment : ""
                };

                _activate();
                _setStrings();

                //--------- Exposed Functions ---------//

                function postReview(){
                    activityInstance.postReview(scope.review).then(success, error);
                }

                function cancelReport(){
                    scope.showReportWarning = false;
                }

                function confirmReport(){
                    scope.showReportWarning = false;
                    activityInstance.reportReview(scope.review);
                }

                //--------- Internal Functions ---------//

                function _getActivityInstance(){
                    ActivitiesManager.getActivity(scope.activity.id).then(function(activityInstanceResponse){
                        activityInstance = activityInstanceResponse;
                    });
                }

                function _getUser(){
                    var author = scope.review.author;
                    var user = author.user;
                    if (user.full_name) {
                        console.log('Full Name already defined');
                    } else if (user.first_name && user.last_name) {
                        user.full_name = [user.first_name, user.last_name].join(' ');
                    } else if(user.first_name) {
                        user.full_name = user.first_name;
                    } else {
                        user.full_name = 'User';
                    }
                    scope.user = author;
                    scope.isOrganizer = author.user_type.toUpperCase === 'O';
                }

                function _setStrings(){
                    if(!scope.strings){ scope.strings = {}; }
                    angular.extend(scope.strings, {
                        ACTION_DONE: "Listo",
                        COPY_PENDING_APPROVAL: "Comentario siendo revisado por trulii",
                        COPY_COMMENT_PLACEHOLDER: "Escribe aqui tu respuesta al comentario",
                        COPY_REPORT_DISCLAIMER: "Al reportar un comentario como inapropiado este será revisado por "
                            + "el equipo de Trulii para ser retirado público. Próximamente la enviaremos un correo "
                            + " con el resultado de nuestra evaluación",
                        LABEL_RATE_EXPERIENCE: "¿Cómo calificarías la experiencia?",
                        LABEL_REPORT_BUTTON: "Reportar",
                        LABEL_REPLY_BUTTON: "Responder",
                        LABEL_CANCEL_BUTTON: "Cancelar",
                        LABEL_CONTINUE_BUTTON: "Continuar",
                        PLACEHOLDER_REVIEW_COMMENT: "Deja tu comentario. Esto lo verá el organizador y demás usuarios",

                    });
                }

                function _activate(){
                    _getUser();
                    if(scope.review.id){
                        scope.hasReview = true;
                    } else {
                        scope.hasReview = false;
                        angular.extend(scope.review, EMPTY_REVIEW);
                        if(scope.activity){ scope.review.activity = scope.activity.id; }
                    }

                    // TODO Might be redundant
                    if(scope.activity){
                        organizer = scope.activity.organizer;
                        if(!organizer.photo){
                            organizer.photo = defaultPicture;
                        }
                        _getActivityInstance();
                    }
                }

                scope.$watch('activity', function(newValue, oldValue){
                    //console.log('review directive activity:', scope.activity);
                    _activate();
                });
                scope.$watch('review', function(newValue, oldValue){
                    //console.log('review directive review:', scope.review);
                    _activate();
                });
            }
        }
    }

})();
