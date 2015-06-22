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
                    return (star < 4? "rating-star": "rating-star-empty");
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
                    if(attrs.options){
                        options = JSON.parse(attrs.options);
                        if(options.actions){
                            scope.actions = mapActions(options.actions);
                        } else {
                            scope.actions = null;
                        }
                    }
                    scope.activity.rating = [1, 2, 3, 4, 5];
                    var organizer = scope.activity.organizer;
                    if(!organizer.photo){
                        organizer.photo = defaultPicture;
                    }
                    mapMainPicture(scope.activity);
                    mapClosestCalendar(scope.activity);
                    console.log('directive activity:', scope.activity);

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

                    function mapClosestCalendar(activity){
                        var today = Date.now();
                        activity.days_to_closest = null;

                        if(activity.chronograms){
                            activity.chronograms.forEach(function(chronogram){
                                //console.log('activity.closest_date:', activity.closest_date);
                                //console.log('chronogram.initial_date:', chronogram.initial_date);
                                //console.log('condition:', !activity.closest_date || chronogram.initial_date < activity.closest_date);
                                if(!activity.closest_date || chronogram.initial_date < activity.closest_date){
                                    activity.closest_date = chronogram.initial_date;
                                    activity.days_to_closest = Math.floor((activity.closest_date - today) / (1000*60*60*24));
                                    //console.log('today:', today, 'initial_date:', chronogram.initial_date,
                                    //    'diff ms:', activity.closest_date - today, 'days:', activity.days_to_closest);
                                }
                                activity.closest_chronogram = chronogram;
                            });
                        }

                        //console.log('activity.days_to_closest:', activity.days_to_closest, !activity.days_to_closest);
                        if(activity.days_to_closest === null){
                            activity.days_to_closest = -1;
                        }
                        return activity;
                    }
                }
            }
        }
    }

})();