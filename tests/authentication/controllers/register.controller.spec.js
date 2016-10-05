describe('Controller: RegisterController', function(){
    var RegisterController,
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



        $httpBackend
             .when('GET', 'http://localhost:8000/api/activities/featured')
             .respond(readJSON('tests/mock/activities.json'));
        $httpBackend
            .when('GET', 'http://localhost:8000/api/locations/cities/')
            .respond(readJSON('tests/mock/cities.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/activities/info')
            .respond(readJSON('tests/mock/generalinfo.json'));
        $httpBackend
           .when('JSONP', 'https://freegeoip.net/json/?callback=JSON_CALLBACK')
           .respond(readJSON('tests/mock/ipinfo.json'));

        $scope =  _$rootScope_;
        template = '<form class="form-classic" name="vm.signup_form" ng-submit="vm.register()"></form>'
        element = angular.element(template);
        $compile(element)($scope);
        $httpBackend.flush();
    }));

    describe("Initializacion Register Student", function(){
        beforeEach(inject(function($controller, _$rootScope_, $http, $httpBackend, $compile) {
            var stateParams = {
                'toState' : {
                    'state' : 'home',
                    'params' : {}
                }
            }
            var template, element, regForm;
            $scope =  _$rootScope_;
            RegisterController =  $controller('RegisterController', { 'validatedData': undefined, $stateParams:stateParams, $scope: $scope});

        }));
        it('should have controller defined and strings is object defined', function() {
            expect(RegisterController).toBeDefined();
            expect(RegisterController.strings).toBeDefined();
         });
         it('should student Register success', function() {
            RegisterController.acceptTerms =true;
            RegisterController.signup_form= $scope.vm.signup_form;

            RegisterController.auth = {
                 email: "henry.bravo89@gmail.com",
                 name: undefined,
                 first_name: "Henry",
                 last_name: "Bravo",
                 password1: "12345678",
                 user_type: "S"
             };

            RegisterController.register();

             $httpBackend
                 .when('POST', 'http://localhost:8000/api/auth/signup')
                 .respond(readJSON('tests/mock/userResponse.json'));

             $httpBackend.flush();

          });
    });
    describe("Register Organizer", function(){
        beforeEach(inject(function($controller, _$rootScope_, $http, $httpBackend, $compile) {
            var stateParams = {
                'token': 'hwwoeltvjxliuw5nk7pk3lqjstjfwiae5gudrhvxgzzargy3ailaklakqqa6ye18',
                'toState' : {
                    'state' : 'home',
                    'params' : {}
                }
            }
            var template, element, regForm, validatedData={};
            var token = 'hwwoeltvjxliuw5nk7pk3lqjstjfwiae5gudrhvxgzzargy3ailaklakqqa6ye18';
            $scope =  _$rootScope_;
            $httpBackend
                .when('GET', 'http://localhost:8000/api/auth/request/signup/token/'+token+'/')
                .respond(readJSON('tests/mock/requestOrg.json'));
            Authentication.requestSignupToken(token).then(function(data){
                validatedData = data;
            });
            $httpBackend.flush();
            RegisterController =  $controller('RegisterController', { 'validatedData': validatedData, $stateParams:stateParams,  $scope: $scope});

            RegisterController.auth = {
                 email: validatedData.email,
                 name: validatedData.name,
                 password1: "12345678",
                 user_type: "O"
             };
        }));
         it('should Organizer Register success', function() {
            RegisterController.acceptTerms =true;
            RegisterController.signup_form= $scope.vm.signup_form;
             var token = 'hwwoeltvjxliuw5nk7pk3lqjstjfwiae5gudrhvxgzzargy3ailaklakqqa6ye18';
             RegisterController.registerOrganizer();
             $httpBackend
                 .when('POST', 'http://localhost:8000/api/auth/signup/'+token+'/')
                 .respond(readJSON('tests/mock/requestOrg.json'));
            $httpBackend.flush();
          });
    });





})
