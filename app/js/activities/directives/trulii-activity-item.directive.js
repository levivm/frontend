/**
 * @ngdoc directive
 * @name trulii.activities.directives.truliiActivityItem
 * @restrict E
 * @description Trulii Activity Item Directive.
 * @param {object} activity Activity instance to represent
 * @param {object} options Options object
 * @param {array} options.actions Action buttons to display
 * @param {boolean} options.disabled Defines if the activity should have an opacity overlay
 */

(function (){
    'use strict';

    angular.module('trulii.activities.directives')

        .directive('truliiActivityItem', truliiActivityItem);

    truliiActivityItem.$inject = ['$state', '$stateParams', '$filter', 'ActivitiesTemplatesPath', 'defaultPicture', 'defaultCover'];

    function truliiActivityItem($state, $stateParams, $filter, ActivitiesTemplatesPath, defaultPicture, defaultCover){
        return {
            restrict: 'E',
            templateUrl: ActivitiesTemplatesPath + "activity_item.html",
            scope: {
                'activity': '=',
                'options': '@?'
            },
            link: function(scope, element, attrs){

                var options;
                var MAX_DAYS = 30;

                scope.dimmed = false;
                scope.draft = false;
                scope.getStarStyle = getStarStyle;
                scope.hasAction = hasAction;

                _activate();

                //--------- Exposed Functions ---------//

                function getStarStyle(star){
                    if(star < 4){
                        return "rating-star mdi-action-grade";
                    } else {
                        return "rating-star-empty mdi-action-grade";
                    }
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

                //--------- Internal Functions ---------//

                function _mapMainPicture(activity){
                    if(activity.photos.length > 0){
                        angular.forEach(activity.photos, function(photo, index, array){
                            if(photo.main_photo){
                                activity.main_photo = photo.photo;
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
                            case scope.strings.ACTION_VIEW:
                                return {
                                    'name': scope.strings.LABEL_VIEW,
                                    'icon': 'mdi-action-visibility',
                                    'state': "activities-detail.info({activity_id: " + scope.activity.id + "})"
                                };
                                break;
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
                                    'state': "dash.activities-manage.orders({activity_id: " + scope.activity.id + "})"
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
                            default:
                                return null;
                        }
                    }
                }

                function _mapClosestCalendar(activity){
                    var today = Date.now();
                    activity.days_to_closest = null;
                    activity.closest_date = null;
                    activity.closest_calendar = null;

                    if(activity.calendars){
                        activity.calendars.forEach(function(calendar){
                            if(calendar.initial_date >= today
                                    && (calendar.initial_date < activity.closest_date || !activity.closest_date)){
                                activity.closest_date = calendar.initial_date;
                                activity.closest_calendar = calendar;
                            }
                        });
                    }

                    if(activity.closest_date){
                        activity.days_to_closest = Math.floor((activity.closest_date - today)/(1000*60*60*24));
                    } else {
                        activity.days_to_closest = -1;
                    }

                    _mapDateMsg(activity);

                    return activity;
                }

                function _mapDateMsg(activity){
                    if(activity.days_to_closest < 0){
                        activity.date_msg = scope.strings.COPY_WAIT_NEW_DATES;
                    } else if(activity.days_to_closest === 0){
                        activity.date_msg = scope.strings.COPY_TODAY;
                    } else if(activity.days_to_closest === 1){
                        activity.date_msg = scope.strings.COPY_IN + " "
                            + activity.days_to_closest + " " + scope.strings.COPY_DAY;
                    } else if(activity.days_to_closest <= MAX_DAYS){
                        activity.date_msg = scope.strings.COPY_IN + " "
                            + activity.days_to_closest + " " + scope.strings.COPY_DAYS;
                    } else {
                        activity.date_msg = $filter('date')(activity.closest_date, 'dd MMM');
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
                        ACTION_VIEW: "view",
                        LABEL_VIEW: "Ver",
                        ACTION_EDIT: "edit",
                        LABEL_EDIT: "Editar",
                        ACTION_MANAGE: "manage",
                        LABEL_MANAGE: "Gestionar",
                        ACTION_CONTACT: "contact",
                        LABEL_CONTACT: "Contactar",
                        ACTION_REPUBLISH: "republish",
                        LABEL_REPUBLISH: "Republicar",
                        LABEL_DRAFT: "Borrador",
                        COPY_WAIT_NEW_DATES: "Espere nuevas fechas",
                        COPY_NA: "N/A",
                        COPY_TODAY: "Hoy",
                        COPY_DAY: "día ",
                        COPY_DAYS: "días ",
                        COPY_IN: "En "
                    });
                }

                function _activate(){
                    _setStrings();
                    _setCurrentState();

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
                        if(options.isDraft){
                            scope.draft = true;
                        }
                    }
                    scope.activity.rating = [1, 2, 3, 4, 5];
                    var organizer = scope.activity.organizer;
                    if(!organizer.photo){
                        organizer.photo = defaultPicture;
                    }
                    _mapMainPicture(scope.activity);
                    _mapClosestCalendar(scope.activity);
                    console.log('directive activity:', scope.activity);

                    //TODO para tooltips
                    $('[data-toggle="tooltip"]').tooltip({'container': 'body'});
                }
            }
        }
    }

})();