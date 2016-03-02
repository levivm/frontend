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

    truliiNavbar.$inject = ['$rootScope', '$timeout', '$state','UIComponentsTemplatesPath', 'Authentication', 'defaultPicture', 'SearchManager', 'LocationManager', 'Analytics'];

    function truliiNavbar($rootScope, $timeout, $state, UIComponentsTemplatesPath, Authentication, defaultPicture, SearchManager, LocationManager, Analytics) {
        return {
            restrict: 'AE',
            templateUrl: UIComponentsTemplatesPath + "trulii-navbar.html",
            link: function (scope, element, attrs) {

                var unsubscribeUserChanged = null;
                var unsubscribeUserLoggedOut = null;
                var unsubscribeStateChange = null;
                var transitionOptions = {location : true, inherit : false, reload : false};
                angular.extend(scope, {
                    state: null,
                    isSearchVisible : true,
                    showBurger : false,
                    showCities: false,
                    search_city : null,
                    toggleBurger: toggleBurger,
                    toogleCities:toogleCities,
                    explore: explore,
                    scroll: 0,
                    searchActivities: searchActivities,
                    clickItemSidebar:clickItemSidebar,
                    createActivity:createActivity,
                    clickLogo:clickLogo,
                    updateSearchCity:updateSearchCity
                });

                _activate();

                // --------- Exposed Functions ----------//

                function toggleBurger(){
                  if(scope.showCities) scope.showCities=false;
                  scope.showBurger = !scope.showBurger;
                }
                function toogleCities(){
                  scope.showCities = !scope.showCities;
                }


                function explore(){
                    $rootScope.$broadcast(SearchManager.EVENT_EXPLORE);
                }

                function searchActivities(){
                    SearchManager.setQuery(scope.newSearchQuery);
                    var searchData = SearchManager.getSearchData();
                    toggleBurger();
                    $state.go('search', searchData, transitionOptions);
                }
                function updateSearchCity(city) {
                    LocationManager.setSearchCity(city);
                    _setCurrentCity();
                    scope.showCities=false;
                }


                //---Exposed functions for send data to Google Analytics----//

                function clickItemSidebar(item){
                    Analytics.generalEvents.burguerMenuItemsClicks(item);
                }

                function createActivity(){
                    Analytics.organizerEvents.clickButtonCreateAcitvity();
                }

                function clickLogo(){
                    Analytics.generalEvents.logoNavbar();
                }

                //---End functions for send data to Google Analytics----//

                //--------- Internal Functions ---------//

            
                function _getUser() {
                    scope.user = true;
                    Authentication.getAuthenticatedAccount().then(success, error);

                    function success(user) {
                        if (!user) {
                            scope.user = null;
                            return;
                        }
                        scope.user = user;
                        Authentication.isOrganizer().then(function (result) {
                            scope.user.is_organizer = result;
                            scope.isSearchVisible = !result;
                        });
                        Authentication.isStudent().then(function (result) {
                            scope.user.is_student = result;
                        });
                        _mapDisplayName(scope.user);
                        _setUserChangedWatch();
                    }

                    function error() {
                        console.error("navbar.getUser. Couldn't get user");
                        scope.user = null;
                        _setUserChangedWatch();
                    }
                }

                function _mapDisplayName(data) {
                    var user = data.user;
                    var company = data.name;
                    if (company) {
                        user.full_name = company;
                    } else if (user.full_name) {
                        //console.log('Full Name already defined');
                    } else if (user.first_name && user.last_name) {
                        user.full_name = user.first_name;
                    } else {
                        user.full_name = 'User';
                    }

                    if (!data.photo) {
                        data.photo = defaultPicture;
                    }

                    $timeout(function () {
                        scope.$apply();
                    }, 0);
                }

                function _setStrings() {
                    if (!scope.strings) { scope.strings = {}; }

                    angular.extend(scope.strings, {
                        ACTION_LOGIN: 'Iniciar sesión',
                        ACTION_REGISTER: 'Registrarme',
                        ACTION_CREATE: 'Crear Actividad',
                        ACTION_CLOSE: "Cerrar",
                        ACTION_EXIT: "Salir",
                        ACTION_EXPLORE: "Explorar",
                        COPY_BECOME_ORGANIZER: '¿Quieres ser Organizador?',
                        COPY_INVITE_FRIEND: 'Invita a un amigo',
                        LABEL_BLOG: 'Blog',
                        LABEL_ABOUT_US: 'Conócenos',
                        LABEL_ABOUT_MISSION: 'Misión',
                        LABEL_ABOUT_CULTURE: 'Cultura',
                        LABEL_ABOUT_TEAM: 'Equipo',
                        LABEL_ABOUT_CONTACT_US: 'Contáctanos',
                        LABEL_ORGANIZER: 'Organizador',
                        LABEL_ORGANIZER_HOW: '¿Cómo funciona?',
                        LABEL_ORGANIZER_HELP: 'Ayuda',
                        LABEL_STUDENT: 'Asistentes',
                        LABEL_STUDENT_HOW: '¿Cómo funciona?',
                        LABEL_STUDENT_HELP: 'Ayuda',
                        LABEL_ORGANIZER_ACTIVITIES: 'Mis Actividades',
                        LABEL_ORGANIZER_SALES: 'Mis Ventas',
                        LABEL_ORGANIZER_PROFILE: 'Perfil',
                        LABEL_ORGANIZER_ACCOUNT: 'Cuenta',
                        LABEL_ORGANIZER_REVIEWS: 'Comentarios Recibidos',
                        LABEL_ORGANIZER_INSTRUCTORS: 'Mis Instructores',
                        LABEL_STUDENT_ACTIVITIES: 'Mis Actividades',
                        LABEL_STUDENT_INVITE: 'Invitar Amigos',
                        LABEL_STUDENT_PROFILE: 'Perfil',
                        LABEL_STUDENT_ACCOUNT: 'Cuenta',
                        LABEL_STUDENT_PURCHASES: 'Mis Compras',
                        PLACEHOLDER_WANT_TO_LEARN: '¿Qué quieres aprender hoy?',
                        LABEL_CITY_MENU:'Elige tu ciudad'
                    });
                }

                function _setUserChangedWatch(){
                    unsubscribeUserChanged = $rootScope.$on(Authentication.USER_CHANGED_EVENT, function (event) {
                        event.preventDefault();
                        console.log('navBar. on' + Authentication.USER_CHANGED_EVENT);
                        _getUser();
                        unsubscribeUserChanged();
                    });
                }

                function _cleanUp() {
                    unsubscribeUserChanged();
                    unsubscribeUserLoggedOut();
                }

                function _initScroll(){
                  scope.$on('scrolled',
                    function(scrolled, scroll){
                      scope.scroll = scroll;
                      scope.$apply();
                    }
                  );
                }

                function _activate() {
                    _setStrings();
                    _getUser();
                    _initScroll();
                    _setUserChangedWatch();

                    unsubscribeStateChange = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                        scope.state = toState.name;
                        scope.isExplore= !(toState.name == 'home');
                        Analytics.sendPageView();
                        scope.isSearchVisible = !(toState.name == 'home' || toState.name == 'not-found' || $state.includes('dash'));
                    });

                    unsubscribeUserLoggedOut = $rootScope.$on(Authentication.USER_LOGOUT_EVENT, function (event) {
                        console.log('navBar. on' + Authentication.USER_LOGOUT_EVENT);
                        _getUser();
                    });


                    scope.$on('$destroy', _cleanUp);
                }
            }
        }
    }
})();
