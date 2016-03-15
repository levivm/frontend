xdescribe('Controller: RegisterController', function(){
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
            RegisterController =  $controller('RegisterController', { 'validatedData': undefined, $stateParams:stateParams});
            template = '<form class="form-classic" name="vm.signup_form" ng-submit="vm.register()"></form>'
            element = angular.element(template);
            $compile(element)($scope);
        }));
        it('should have controller defined and strings is object defined', function() {
            expect(RegisterController).toBeDefined();
            expect(RegisterController.strings).toBeDefined();
         });
         it('should student Register success', function() {
             console.log($scope);
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
                  .when('GET', 'http://localhost:8000/api/activities/search/?city=1&o=score&page_size=8')
                  .respond(readJSON('tests/mock/activities.json'));
             $httpBackend
                 .when('GET', 'http://localhost:8000/api/locations/cities/')
                 .respond(readJSON('tests/mock/cities.json'));

             $httpBackend
                 .when('GET', 'http://localhost:8000/api/activities/info')
                 .respond(readJSON('tests/mock/generalinfo.json'));
             $httpBackend
                .when('JSONP', 'http://ipinfo.io/?callback=JSON_CALLBACK')
                .respond(readJSON('tests/mock/ipinfo.json'));
             $httpBackend
                 .when('POST', 'http://localhost:8000/api/auth/signup')
                 .respond(readJSON('tests/mock/userResponse.json'));

             $httpBackend.flush();

          });
    });





})
