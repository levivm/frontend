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

    truliiActivityReview.$inject = ['ActivitiesTemplatesPath', 'Authentication', 'ActivitiesManager', 'Toast', 'defaultPicture'];

    function truliiActivityReview(ActivitiesTemplatesPath, Authentication, ActivitiesManager, Toast, defaultPicture){
        return {
            restrict: 'E',
            templateUrl: ActivitiesTemplatesPath + "activity_review.html",
            scope: {
                'review': '=',
                'activity': '=',
                'onDashboard': '=',
                'changeReviewStatus': '&'
            },
            link: function(scope){

                angular.extend(scope, {
                    hasReview: false,
                    hasReply: false,
                    show:{
                        reportWarning:false
                    },
                    showReportWarning: false,
                    user: null,
                    isOrganizer: false,
                    postReview: postReview,
                    confirmReport: confirmReport,
                    cancelReport: cancelReport,
                    markAsRead: markAsRead,
                    reply: reply
                });

                var activityInstance = null;
                var organizer = null;

                var EMPTY_REVIEW = {
                    rating: 0,
                    comment : ""
                };

                _activate();
                _getLoggedUser();
                _setStrings();

                //--------- Exposed Functions ---------//

                function postReview(){
                    activityInstance.postReview(scope.review).then(success);

                    function success(review){
                        scope.review = review;
                        scope.hasReview = true;
                    }
                }

                function cancelReport(){
                    scope.show.reportWarning = false;
                }

                function confirmReport(){
                    activityInstance.reportReview(scope.review).then(success);

                    function success(){
                        scope.show.reportWarning = false;
                        Toast.info(scope.strings.COPY_REVIEW_REPORTED);
                    }
                }

                function reply(){
                    if(!scope.review.reply){
                        Toast.warning(scope.strings.COPY_EMPTY_REPLY);
                        return;
                    }
                    activityInstance.replyReview(scope.review).then(success);

                    function success(){
                        scope.hasReply = true;
                        if (scope.onDashboard) scope.changeReviewStatus();

                    }
                }

                function markAsRead(){
                    scope.review.read = true;
                    activityInstance.markReviewAsRead(scope.review).then(success);

                    function success(){
                        if (scope.onDashboard) scope.changeReviewStatus();
                    }
                }

                //--------- Internal Functions ---------//

                function _getActivityInstance(){
                    ActivitiesManager.getActivity(scope.review.activity).then(function(activityInstanceResponse){
                        activityInstance = activityInstanceResponse;
                    });
                }

                function _getUser(){
                    if(!scope.review.author){
                        return;
                    }
                    var author = scope.review.author;
                    var user = author.user;
                    if (user.full_name) {
                        //console.log('Full Name already defined');
                    } else if (user.first_name && user.last_name) {
                        user.full_name = [user.first_name, user.last_name].join(' ');
                    } else if(user.first_name) {
                        user.full_name = user.first_name;
                    } else {
                        user.full_name = 'User';
                    }

                    if(!author.photo){
                        author.photo = defaultPicture;
                    }
                    scope.user = author;
                }

                function _getLoggedUser(){
                    Authentication.getAuthenticatedAccount().then(function(user){
                        scope.isOrganizer = user.user_type.toUpperCase() == "O";
                    });
                }

                function _setStrings(){
                    if(!scope.strings){ scope.strings = {}; }
                    angular.extend(scope.strings, {
                        ACTION_DONE: "Listo",
                        ACTION_MARK_AS_READ: "Marcar como Leído",
                        COPY_EMPTY_REPLY: "Por favor escriba una respuesta",
                        COPY_REVIEW_REPORTED: "El comentario será revisado por Trulii",
                        COPY_REPORTED: "Comentario siendo revisado por trulii",
                        COPY_COMMENT_PLACEHOLDER: "Escribe aquí tu respuesta al comentario",
                        COPY_REPORT_DISCLAIMER: "Al reportar un comentario como inapropiado este será revisado por "
                            + "el equipo de Trulii para ser retirado público. Próximamente la enviaremos un correo "
                            + " con el resultado de nuestra evaluación",
                        LABEL_RATE_EXPERIENCE: "¿Cómo calificarías la experiencia?",
                        LABEL_REPORT_BUTTON: "Reportar",
                        LABEL_REPLY_BUTTON: "Responder",
                        LABEL_CANCEL_BUTTON: "Cancelar",
                        LABEL_CONTINUE_BUTTON: "Continuar",
                        PLACEHOLDER_REVIEW_COMMENT: "Deja tu comentario. Esto lo verá el organizador y demás usuarios"

                    });
                }

                function _activate(){
                    _getUser();
                    scope.hasReply = !!scope.review.reply;
                    if(scope.review.id){
                        scope.hasReview = true;
                    } else {
                        scope.hasReview = false;
                        angular.extend(scope.review, EMPTY_REVIEW);
                        if(scope.activity){
                            //noinspection JSPrimitiveTypeWrapperUsage
                            scope.review.activity = scope.activity.id;
                        }
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

                scope.$watch('activity', function(){
                    //console.log('review directive activity:', scope.activity);
                    _activate();
                });
                scope.$watch('review', function(){
                    console.log('review directive review:', scope.review);
                    _activate();
                });
            }
        };
    }

})();
