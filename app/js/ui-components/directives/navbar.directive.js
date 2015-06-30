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

    function truliiNavbar($rootScope, $timeout, UIComponentsTemplatesPath, LocationManager, Authentication,
                          defaultPicture) {
        return {
            restrict : 'AE',
            templateUrl: UIComponentsTemplatesPath + "navbar.html",
            link : function (scope, element, attrs) {

                var unsubscribeUserChanged = null;
                var unsubscribeUserLoggedOut = null;

                scope.search_city = null;
                scope.cities = [];
                scope.isSearchVisible = true;

                activate();

                function setStrings() {
                    if (!scope.strings) {
                        scope.strings = {};
                    }

                    angular.extend(scope.strings, {
                        PLACEHOLDER_WANT_TO_LEARN : '¿Qué quieres aprender hoy?',
                        COPY_BECOME_ORGANIZER : '¿Quieres ser Organizador?',
                        ACTION_LOGIN: 'Inicia Sesión',
                        ACTION_REGISTER: 'Registrate',
                        LABEL_CITY: 'Ciudad',
                        LABEL_CITY_DEFAULT: 'Ciudad..',
                        LABEL_PROFILE: 'Mi Perfil',
                        LABEL_ORGANIZER: 'Organizador',
                        LABEL_STUDENT: 'Estudiante',
                        LABEL_LOGOUT: 'Logout'
                    });
                }

                function getUser(){
                    Authentication.getAuthenticatedAccount().then(success, error);

                    function success(user){
                        if(!user){
                            scope.user = null;
                            return;
                        }
                        scope.user = user;
                        Authentication.isOrganizer().then(function(result){
                            scope.user.is_organizer = result;
                        });
                        Authentication.isStudent().then(function(result){
                            scope.user.is_student = result;
                        });
                        mapDisplayName(scope.user);
                        console.log('user:', user, '!!user:', !!user);
                    }

                    function error(){
                        console.log('navbar response reject');
                        scope.user = null;
                    }
                }

                function mapDisplayName(data){
                    //console.log('mapDisplayName. data:', data);
                    var user = data.user;
                    var company = data.name;
                    if (company){
                        user.full_name = company;
                    } else if(user.full_name){
                        console.log('Full Name already defined');
                    } else if(user.first_name && user.last_name){
                        user.full_name = [user.first_name, user.last_name].join(' ');
                    } else {
                        user.full_name = 'User';
                    }

                    if(!data.photo) {
                        data.photo = defaultPicture;
                    }

                    $timeout(function(){
                        scope.$apply();
                    }, 0);
                }

                function getCities(){
                    LocationManager.getAvailableCities().then(success, error);

                    function success(cities) { scope.cities = cities; }
                    function error() { console.log("truliiNavbar. Couldn't get cities"); }
                }

                function cleanUp(){
                    unsubscribeUserChanged();
                    unsubscribeUserLoggedOut();
                }

                function activate() {
                    setStrings();
                    getUser();
                    getCities();

                    unsubscribeUserChanged = $rootScope.$on(Authentication.USER_CHANGED_EVENT, function(event){
                        console.log('navBar. on' + Authentication.USER_CHANGED_EVENT);
                        getUser();
                    });

                    unsubscribeUserLoggedOut = $rootScope.$on(Authentication.USER_LOGOUT_EVENT, function(event){
                        console.log('navBar. on' + Authentication.USER_LOGOUT_EVENT);
                        getUser();
                    });

                    scope.$on('$destroy', cleanUp);

                }
            }
        }
    }

})();