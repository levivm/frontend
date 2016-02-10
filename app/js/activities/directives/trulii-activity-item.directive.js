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

    truliiActivityItem.$inject = ['$state', '$stateParams', '$filter', 'ActivitiesTemplatesPath'
        , 'defaultPicture', 'defaultCover', 'titleTruncateSize'];

    function truliiActivityItem($state, $stateParams, $filter, ActivitiesTemplatesPath
        , defaultPicture, defaultCover, titleTruncateSize){
        return {
            restrict: 'E',
            templateUrl: ActivitiesTemplatesPath + "activity_item.html",
            scope: {
                'activity': '=',
                'options': '@?'
            },
            link: function(scope, element, attrs){

                var options;
                var MAX_DAYS = 5;

                angular.extend(scope, {
                    actions : [],
                    dimmed : false,
                    inactive : false,
                    isMenuVisible : false,
                    titleSize: titleTruncateSize,
                    hasAction : hasAction,
                    showMenu : showMenu,
                    hideMenu : hideMenu
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

                //--------- Internal Functions ---------//

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

                    function filterActions(action){
                        return (typeof action === 'string' && isValidAction(action));

                        function isValidAction(action){
                            return action == scope.strings.ACTION_EDIT || action == scope.strings.ACTION_MANAGE
                                || action == scope.strings.ACTION_CONTACT || action == scope.strings.ACTION_REPUBLISH;
                        }
                    }
                }

                function _mapDateMsg(activity){
                    var today = Date.now();
                    if(!!activity.closest_calendar){
                        activity.days_to_closest = Math.floor((activity.closest_calendar.initial_date - today)/(1000*60*60*24));
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
                    } else if(activity.days_to_closest <= MAX_DAYS){
                        activity.date_msg = scope.strings.COPY_IN + " "
                            + activity.days_to_closest + " " + scope.strings.COPY_DAYS;
                    } else {
                        var dateClose = new Date(activity.closest_calendar.initial_date);
                        var day = dateClose.getDay();
                        var month = parseInt(dateClose.getMonth()+1);
                        activity.date_msg = scope.strings.COPY_THE + " "+day+" / "+month.toString();
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
                        LABEL_INACTIVE: "Borrador",
                        COPY_WAIT_NEW_DATES: "Espere nuevas fechas",
                        COPY_NA: "N/A",
                        COPY_FREE: "Gratis",
                        COPY_TODAY: "Hoy",
                        COPY_DAY: "día ",
                        COPY_DAYS: "días ",
                        COPY_IN: "Inicia en ",
                        COPY_THE: "Inicia el "
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
                    //console.log('directive activity:', scope.activity);
                }
            }
        }
    }

})();
