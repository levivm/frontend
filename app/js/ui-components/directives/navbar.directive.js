/**
 * @ngdoc directive
 * @name trulii.ui-components.directives.truliiNavbar
 * @description truliiNavbar
 * @requires trulii.locations.services.LocationManager
 * @requires trulii.activities.services.Activity
 */

(function () {
    'use strict';

    angular.module('trulii.ui-components.directives')
        .directive('truliiNavbar', truliiNavbar);

    truliiNavbar.$inject = ['$rootScope', '$timeout', 'UIComponentsTemplatesPath', 'LocationManager', 'Authentication'];

    function truliiNavbar($rootScope, $timeout, UIComponentsTemplatesPath, LocationManager, Authentication) {
        return {
            restrict : 'AE',
            templateUrl: UIComponentsTemplatesPath + "navbar.html",
            link : function (scope, element, attrs) {

                scope.cities = [];
                scope.isStudent = isStudent;

                var unsubscribeUserChanged = null;

                initialize();

                function isStudent(){
                    //TODO for debugging purposes only
                    return true;
                    //return scope.user.is_student;
                }

                function setStrings() {
                    if (!scope.strings) {
                        scope.strings = {};
                    }

                    angular.extend(scope.strings, {
                        PLACEHOLDER_WANT_TO_LEARN : '¿Qué quieres aprender hoy?',
                        CITY_LABEL: 'Ciudad',
                        CITY_DEFAULT_LABEL: 'Ciudad..'
                    });
                }

                function getUser(user){
                    scope.user = !!user? user : Authentication.getAuthenticatedAccount();

                    if(scope.user && scope.user.user_type) {
                        var userType = scope.user.user_type.toLowerCase();
                        mapDisplayName(scope.user);
                        switch(userType){
                            case 'o':
                                console.log('Organizer user type: ' + userType);
                                scope.user.is_organizer = true;
                                break;
                            case 's':
                                console.log('Student user type: ' + userType);
                                scope.user.is_student = true;
                                break;
                            default:
                                console.log('Unknown user type: ' + userType);
                        }
                        console.log('navbar. getUser:', scope.user);
                    }
                }

                function mapDisplayName(data){
                    console.log('mapDisplayName', data);
                    var user = data.user;
                    var company = data.name;
                    if(user.first_name && user.last_name){
                        user.full_name = [user.first_name, user.last_name].join(' ');
                    } else if (company){
                        user.full_name = company;
                    } else {
                        user.full_name = 'User';
                    }

                    $timeout(function(){
                        scope.$apply();
                    }, 0);
                }

                function getCities(){
                    LocationManager.getAvailableCities().then(success, error);

                    function success(cities) {
                        scope.cities = cities;
                    }

                    function error(response) {
                        console.log("truliiNavbar. initialize. Couldn't get ");
                    }
                }

                function cleanUp(){
                    unsubscribeUserChanged();
                }

                function initialize() {
                    setStrings();
                    getUser();
                    getCities();

                    unsubscribeUserChanged = $rootScope.$on('userChanged', function(event, user){
                        console.log('navBar. onUserChanged');
                        getUser(user);
                    });

                    scope.$on('$destroy', cleanUp);

                    //for testing
                    //$timeout(function(){
                    //    $rootScope.$emit('userChanged', {
                    //        "id":1,"user":{"first_name":"Fernando","last_name":"De Freitas","email":"fdefreitas@outlook.com","full_name":"Trulii"},"name":"Trulii","bio":"","website":"","youtube_video_url":"","telephone":"","photo":null,"user_type":"O","created_at":1430325657000,"instructors":[{"full_name":"Fernando De Freitas","id":2,"bio":"Here","organizer":1,"photo":null,"website":"http://localhost"}],"locations":[],"is_organizer":true
                    //    });
                    //}, 3000);

                }
            }
        }
    }

})();