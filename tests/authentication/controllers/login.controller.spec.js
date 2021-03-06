describe('Controller: LoginController', function(){
    var LoginController,
        $scope = {};

    beforeEach(function(){
        module('templates', 'trulii');
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            Authentication = $injector.get('Authentication');
            $compile = $injector.get('$compile');
         })

    });
    beforeEach(inject(function($controller, _$rootScope_, $http, $httpBackend) {

        var stateParams = {
            toState:{
                state:'home'
            }
        }
        
        $httpBackend
                .when('GET', 'http://localhost:8000/api/activities/featured')
                .respond(readJSON('tests/mock/activities.json'));
        
        $httpBackend
             .when('GET', 'http://localhost:8000/api/organizers/featured')
             .respond(readJSON('tests/mock/organizersFeatured.json'));
        
        $httpBackend
            .when('GET', 'http://localhost:8000/api/locations/cities/')
            .respond(readJSON('tests/mock/cities.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/activities/info')
            .respond(readJSON('tests/mock/generalinfo.json'));
        $httpBackend
            .when('JSONP', 'https://freegeoip.net/json/?callback=JSON_CALLBACK')
            .respond(readJSON('tests/mock/ipinfo.json'));
        
        $httpBackend.flush();
        
        $scope =  _$rootScope_;
        LoginController =  $controller('LoginController', { $stateParams:stateParams, $scope: $scope});
    }));

    describe("Initializacion", function(){
        it('should have controller defined and strings is object defined', function() {
            expect(LoginController).toBeDefined();
            expect(LoginController.strings).toBeDefined();
         });
    });
    describe("Login", function(){
        var template, element, regForm;
        beforeEach(inject(function ($templateCache, $compile) {
           template = '<form class="form-classic" name="vm.login_form" ng-submit="vm.login()"></form>'
           element = angular.element(template);
           $compile(element)($scope);

       })); 
        it('should login correct with email Login', function() {
            LoginController.login_form = $scope.vm.login_form;
            LoginController.auth = {
                email: "henry.bravo89@gmail.com",
                password: "12345678"
            };

            LoginController.login();
            
            $httpBackend
                .when('POST', 'http://localhost:8000/api/auth/login/')
                .respond(readJSON('tests/mock/userResponse.json'));

            $httpBackend.flush();

            expect(LoginController.userData.data.user.user.email).toEqual(LoginController.auth.email);
            expect(LoginController.userData.data.token).toEqual("507186fad9dbd951b95c956d5158c83e7f50182e");

         });
         
         
         it('should login incorrect with email Login', function() {
            LoginController.login_form = $scope.vm.login_form;
            LoginController.auth = {
                email: "henry.bravo89@gmail.com",
                password: "12345678"
            };

            LoginController.login();
           
            $httpBackend
                .when('POST', 'http://localhost:8000/api/auth/login/')
                .respond(400, {"non_field_errors":["No puede iniciar sesión con las credenciales proporcionadas."]});

            $httpBackend.flush();
            //expect(LoginController.errors.__all__.length).toEqual(1);

         });
    });



})
