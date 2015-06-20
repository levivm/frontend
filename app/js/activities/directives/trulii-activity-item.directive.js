/**
 * @ngdoc directive
 * @name trulii.activities.directives.truliiActivityItem
 * @restrict E
 * @description Trulii Activity Item Directive.
 * @param {object} activity Activity instance to represent
 * @param {array} actions Action buttons to display
 */

(function (){
    'use strict';

    angular.module('trulii.activities.directives')

        .directive('truliiActivityItem', truliiActivityItem);

    truliiActivityItem.$inject = ['ActivitiesTemplatesPath', 'defaultPicture', 'defaultCover'];

    function truliiActivityItem(ActivitiesTemplatesPath, defaultPicture, defaultCover){

        return {
            restrict: 'E',
            templateUrl: ActivitiesTemplatesPath + "activity_item.html",
            scope: {
                'activity': '=',
                'options': '@?'
            },
            link: function(scope, element, attrs){

                var options;

                scope.getStarStyle = getStarStyle;
                scope.hasAction = hasAction;

                initialize();

                /////////////////////////////////////


                function getStarStyle(star){
                    if(star <= 4){
                        return {
                            'color': 'yellow'
                        };
                    } else {
                        return {
                            'color': 'white'
                        }
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

                function setStrings(){
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
                        LABEL_REPUBLISH: "Republicar"
                    });
                }

                function initialize(){
                    setStrings();
                    console.log('directive activity:', scope.activity);
                    if(attrs.options){
                        options = JSON.parse(attrs.options);
                        if(options.actions){
                            scope.actions = mapActions(options.actions);
                        } else {
                            scope.actions = null;
                        }
                        console.log('directive actions:', scope.actions);
                    }

                    scope.activity = mapMainPicture(scope.activity);
                    scope.activity.rating = [1, 2, 3, 4, 5];
                    var organizer = scope.activity.organizer;
                    if(!organizer.photo){
                        organizer.photo = defaultPicture;
                    }

                    function mapMainPicture(activity){
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

                    function mapActions(actions){
                        if(!actions) return null;
                        return actions.map(function(action){
                            if(typeof action === 'string'){
                                return action.toLowerCase();
                            } else {
                                return null;
                            }
                        });
                    }
                }
            }
        }
    }

})();