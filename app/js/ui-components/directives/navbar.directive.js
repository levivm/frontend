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

    truliiNavbar.$inject = ['$rootScope', '$timeout', 'UIComponentsTemplatesPath', 'LocationManager', 'Authentication',
        'defaultPicture'];

    function truliiNavbar($rootScope, $timeout, UIComponentsTemplatesPath, LocationManager, Authentication, defaultPicture) {
        return {
            restrict : 'AE',
            templateUrl: UIComponentsTemplatesPath + "navbar.html",
            link : function (scope, element, attrs) {

                scope.cities = [];
                scope.isStudent = Authentication.isStudent;
                scope.isOrganizer = Authentication.isOrganizer;

                var unsubscribeUserChanged = null;

                initialize();

                function setStrings() {
                    if (!scope.strings) {
                        scope.strings = {};
                    }

                    angular.extend(scope.strings, {
                        PLACEHOLDER_WANT_TO_LEARN : '¿Qué quieres aprender hoy?',
                        CITY_LABEL: 'Ciudad',
                        CITY_DEFAULT_LABEL: 'Ciudad..',
                        PROFILE_LABEL: 'Mi Perfil',
                        LOGIN_LABEL: 'Iniciar Sesión',
                        REGISTER_LABEL: 'Registrarse',
                        ORGANIZER_LABEL: 'Organizador',
                        STUDENT_LABEL: 'Estudiante',
                        LOGOUT_LABEL: 'Logout'
                    });
                }

                function getUser(user){
                    scope.user = !!user? user : Authentication.getAuthenticatedAccount();

                    if(scope.user && scope.user.user_type) {
                        var userType = scope.user.user_type.toUpperCase();
                        mapDisplayName(scope.user);
                        switch(userType){
                            case 'O':
                                console.log('Organizer user type: ' + userType);
                                scope.user.is_organizer = true;
                                break;
                            case 'S':
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
                    console.log('mapDisplayName. data:', data);
                    var user = data.user;
                    var company = data.name;
                    if(user.full_name){
                        console.log('Full Name already defined');
                    } else if(user.first_name && user.last_name){
                        user.full_name = [user.first_name, user.last_name].join(' ');
                    } else if (company){
                        user.full_name = company;
                    } else {
                        user.full_name = 'User';
                    }

                    console.log('data.photo:', !data.photo, data.photo);
                    if(!data.photo) { data.photo = defaultPicture; }
                    console.log('data.photo:', !data.photo, data.photo);

                    $timeout(function(){
                        scope.$apply();
                    }, 0);
                }

                function getCities(){
                    LocationManager.getAvailableCities().then(success, error);

                    function success(cities) { scope.cities = cities; }
                    function error(response) { console.log("truliiNavbar. Couldn't get cities"); }
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

                }
            }
        }
    }

})();