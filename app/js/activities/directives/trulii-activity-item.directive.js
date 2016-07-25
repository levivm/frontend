/**
 * @ngdoc directive
 * @name trulii.activities.directives.truliiActivityItem
 * @restrict E
 * @description Trulii Activity Item Directive.
 * @param {object} activity Activity instance to represent
 * @param {object} options Options object
 * @param {boolean} current If current Activity in student
 * @param {array} options.actions Action buttons to display
 * @param {boolean} options.disabled Defines if the activity should have an opacity overlay
 */

(function (){
    'use strict';

    angular.module('trulii.activities.directives')

        .directive('truliiActivityItem', truliiActivityItem);

    truliiActivityItem.$inject = ['$state', '$stateParams', '$filter', 'moment', 'ActivitiesTemplatesPath'
        , 'defaultPicture', 'defaultCover', 'titleTruncateSize','Analytics', 'Authentication',
        'StudentsManager', 'ActivitiesManager', 'Toast', '$modal', '$rootScope'];

    function truliiActivityItem($state, $stateParams, $filter, moment, ActivitiesTemplatesPath
        , defaultPicture, defaultCover, titleTruncateSize, Analytics, Authentication, StudentsManager, ActivitiesManager, Toast, $modal, $rootScope){
        return {
            restrict: 'E',
            templateUrl: ActivitiesTemplatesPath + "activity_item.html",
            scope: {
                'activity': '=',
                'current': '=?',
                'organizer': '=?',
                'options': '@?'
            },
            link: function(scope, element, attrs){

                var options;

                angular.extend(scope, {
                    actions : [],
                    dimmed : false,
                    inactive : false,
                    isMenuVisible : false,
                    titleSize: titleTruncateSize,
                    hasAction : hasAction,
                    showMenu : showMenu,
                    hideMenu : hideMenu,
                    viewActivity:viewActivity,
                    goToOrganizer: goToOrganizer,
                    goToAction:goToAction,
                    goToCategory: goToCategory,
                    clickAction: clickAction,
                    isStudent: false,
                    like:like,
                    MAX_DAYS: 5
                });

                _activate();

                //--------- Exposed Functions ---------//

                function showMenu(){
                    scope.isMenuVisible = true;
                }

                function hideMenu(){
                    scope.isMenuVisible = false;
                }

                function hasAction(actionQuery){
                    if(scope.actions){
                        return scope.actions.some(hasCurrentAction);
                    } else {
                        return false;
                    }

                    function hasCurrentAction(currentAction, index, actions){
                        return currentAction === actionQuery;
                    }
                }

                function like(activityId){
                    StudentsManager.postWishList(activityId).then(function(data){
                        scope.activity.wish_list=!scope.activity.wish_list;
                        ActivitiesManager.like(scope.activity.id, scope.activity.wish_list);
                    })
                }

               
                //Functions Analytics data
                function viewActivity(title){
                    Analytics.generalEvents.viewActivityDetail(title);
                }

                function goToOrganizer($event){
                    $event.preventDefault();
                    $event.stopPropagation();
                    $state.go('organizer-profile', {organizer_id: scope.activity.organizer.id});
                }
                
                function goToCategory($event){
                    $event.preventDefault();
                    $event.stopPropagation();
                    $state.go('category', {category_name: scope.activity.category.slug});
                }

                 function goToAction(name, $event){
                   
                    $event.preventDefault();
                    $event.stopPropagation();
                     switch(name){
                        case scope.strings.LABEL_EDIT:
                            $state.go('dash.activities-edit.general', {activity_id: scope.activity.id});
                            break;
                        case scope.strings.LABEL_MANAGE:
                            $state.go('dash.activities-manage.summary', {activity_id: scope.activity.id});
                            break;
                        case scope.strings.LABEL_CONTACT:
                            $state.go('contact-us',JSON.stringify(scope.current_state));
                            break;
                        case scope.strings.LABEL_REPUBLISH:
                            $state.go('dash.activities-edit.calendars', {activity_id: scope.activity.id});
                            break;
                        case scope.strings.LABEL_DELETE:
                            __deleteActivity();
                            break;
                        default:
                            return null;
                      }
                }


                function clickAction(action){
                    Analytics.generalEvents.actionCard(action);
                }

                //--------- Internal Functions ---------//
               function __deleteActivity(){
                  
                    if(scope.activity.total_assistants > 0){
                        Toast.error(scope.strings.DELETE_ACTIVITY_ERROR);
                        return;
                    }
                    var modalInstance = $modal.open({
                        templateUrl : 'partials/activities/messages/confirm_delete_activity.html',
                        controller : 'ModalInstanceCtrl',
                        controllerAs:'modal',
                        size : 'lg'
                    });

                    modalInstance.result.then(function () {
                        ActivitiesManager.deleteActivity(scope.activity.id).then(success, error);
                    });

                    function success() {
                        $rootScope.$broadcast(ActivitiesManager.EVENT_DELETE_ACTIVITY, $state.current.url);
                    }
                    function error(response) {
                        console.log(response);
                    }
                }

                function _mapMainPicture(activity){
                    if(activity.pictures.length > 0){
                        angular.forEach(activity.pictures, function(picture, index, array){
                            if(picture.main_photo){
                                activity.main_photo = picture.photo;
                            }

                            if( index === (array.length - 1) && !activity.main_photo){
                                activity.main_photo = array[0].photo;
                            }
                        });
                    } else {
                        activity.main_photo = defaultCover;
                    }
                    return activity;
                }

                function _mapActions(actions){
                    if(!actions) return null;
                    actions = actions.filter(filterActions);

                    actions = actions.map(function(action){
                        if(typeof action === 'string'){
                            return action.toLowerCase();
                        } else {
                            return null;
                        }
                    });
                    return actions.map(createActionObject);

                    function createActionObject(action){
                        switch(action){
                            case scope.strings.ACTION_EDIT:
                                return {
                                    'name': scope.strings.LABEL_EDIT,
                                    'icon': 'mdi-content-create',
                                    'state': "dash.activities-edit.general({activity_id:" + scope.activity.id + "})"
                                };
                                break;
                            case scope.strings.ACTION_MANAGE:
                                return {
                                    'name': scope.strings.LABEL_MANAGE,
                                    'icon': 'mdi-action-settings',
                                    'state': "dash.activities-manage.summary({activity_id: " + scope.activity.id + "})"
                                };
                                break;
                            case scope.strings.ACTION_CONTACT:
                                return {
                                    'name': scope.strings.LABEL_CONTACT,
                                    'icon': 'mdi-communication-email',
                                    'state': "contact-us(" + JSON.stringify(scope.current_state) + ")"
                                };
                                break;
                            case scope.strings.ACTION_REPUBLISH:
                                return {
                                    'name': scope.strings.LABEL_REPUBLISH,
                                    'icon': 'mdi-content-redo',
                                    'state': "dash.activities-edit.calendars({activity_id: " + scope.activity.id
                                        + ", republish: true})"
                                };
                                break;
                            case scope.strings.ACTION_DELETE:
                                return {
                                    'name': scope.strings.LABEL_DELETE,
                                    'icon': 'mdi-action-delete',
                                    'state': $state.current.name
                                };
                                break;
                            default:
                                return null;
                        }
                    }

                    function filterActions(action){
                        return (typeof action === 'string' && isValidAction(action));

                        function isValidAction(action){
                            return action == scope.strings.ACTION_EDIT || action == scope.strings.ACTION_MANAGE
                                || action == scope.strings.ACTION_CONTACT || action == scope.strings.ACTION_REPUBLISH
                                || action == scope.strings.ACTION_DELETE;
                        }
                    }
                }

                function _mapDateMsg(activity){
                    var today = new Date();
                    //console.log(activity);
                    if(!!activity.closest_calendar){
                        var now = moment(today);
                        var end = moment(activity.closest_calendar.initial_date);
                        var duration = moment.duration(end.diff(now));
                        activity.days_to_closest = Math.ceil(duration.asDays());
                    } else {
                        activity.days_to_closest = -1;
                    }

                    if(activity.days_to_closest < 0){
                        activity.date_msg = scope.strings.COPY_WAIT_NEW_DATES;
                    } else if(activity.days_to_closest === 0){
                        activity.date_msg = scope.strings.COPY_TODAY;
                    } else if(activity.days_to_closest === 1){
                        activity.date_msg = scope.strings.COPY_IN + " "
                            + activity.days_to_closest + " " + scope.strings.COPY_DAY;
                    } else if(activity.days_to_closest <= scope.MAX_DAYS){
                        activity.date_msg = scope.strings.COPY_IN + " "
                            + activity.days_to_closest + " " + scope.strings.COPY_DAYS;
                    } else {
                        activity.date_msg = $filter('date')(activity.closest_calendar.initial_date, "MMM dd");
                    }
                    return activity;
                }

                function _setCurrentState(){
                    scope.current_state = {
                        toState: {
                            state: $state.current.name,
                            params: $stateParams
                        }
                    };
                }

                function _setStrings(){
                    if(!scope.strings){ scope.strings = {}; }
                    angular.extend(scope.strings, {
                        ACTION_EDIT: "edit",
                        LABEL_EDIT: "Editar",
                        ACTION_MANAGE: "manage",
                        LABEL_MANAGE: "Gestionar",
                        ACTION_CONTACT: "contact",
                        LABEL_CONTACT: "Contactar",
                        ACTION_REPUBLISH: "republish",
                        LABEL_REPUBLISH: "Republicar",
                        ACTION_DELETE: "delete",
                        LABEL_DELETE: "Eliminar",
                        LABEL_INACTIVE: "Borrador",
                        COPY_WAIT_NEW_DATES: "Espere nuevas fechas",
                        COPY_NA: "N/A",
                        COPY_FREE: "Gratis",
                        COPY_TODAY: "Hoy",
                        COPY_DAY: "día ",
                        COPY_DAYS: "días ",
                        COPY_IN: "En ",
                        COPY_THE: "El ",
                        COPY_CURRENT: "En curso",
                        COPY_ATTENDES: "Ver asistentes ",
                        ADD_TO_WISHLIST: "Agregar a favoritos",
                        CURRENCY: "COP",
                        DELETE_ACTIVITY_ERROR: "No puede eliminar esta actividad, tiene estudiantes inscritos, contactanos",
                    });
                }

                function _isStudent(){
                    Authentication.isStudent().then(function(data){
                        scope.isStudent = data;
                    }, function(err){
                        console.log(err);
                    })

                }

                function _checkAssistants(){
                  var assistants=0;
                  angular.forEach(scope.activity.calendars, function(calendar, idx){
                    assistants = assistants + calendar.assistants.length;
                    scope.activity.total_assistants=assistants;
                  });
                }

                function _activate(){
                    _setStrings();
                    _setCurrentState();
                    _isStudent();
                    _checkAssistants();

                    if(attrs.options){
                        options = JSON.parse(attrs.options);
                        if(options.actions){
                            scope.actions = _mapActions(options.actions);
                        } else {
                            scope.actions = null;
                        }
                        if(options.disabled){
                            scope.dimmed = true;
                        }
                        if(options.isInactive){
                            scope.inactive = true;
                        }
                    }
                    var organizer = scope.activity.organizer;
                    if(!organizer.photo){
                        organizer.photo = defaultPicture;
                    }
                    _mapMainPicture(scope.activity);
                    _mapDateMsg(scope.activity);
                }
            }
        }
    }

})();
