/**
 * @ngdoc directive
 * @name trulii.activities.directives.truliiActivityItem
 * @description Trulii Activity Item Directive
 */

(function (){
    'use strict';

    angular.module('trulii.activities.directives')

        .directive('truliiActivityItem', truliiActivityItem);

    truliiActivityItem.$inject = ['ActivitiesTemplatesPath'];

    function truliiActivityItem(ActivitiesTemplatesPath){

        return {
            restrict: 'E',
            templateUrl: ActivitiesTemplatesPath + "activity_item.html",
            scope: {
                'activity': '='
            },
            link: function(scope, element, attrs){
                console.log('directive activity:', scope.activity);

                scope.activity = mapMainPicture(scope.activity);
                scope.activity.rating = [1, 2, 3, 4, 5];

                scope.getStarStyle = getStarStyle;

                function mapMainPicture(activity){
                    angular.forEach(activity.photos, function(photo, index, array){
                        if(photo.main_photo){
                            activity.main_photo = photo.photo;
                        }

                        if( index === (array.length - 1) && !activity.main_photo){
                            activity.main_photo = array[0].photo;
                        }
                    });
                    return activity;
                }

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
            }
        }
    }

})();