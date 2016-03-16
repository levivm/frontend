xdescribe('Controller: ForgotPasswordCtrl', function(){
    var ForgotPasswordCtrl,
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
            'toState' : {
                'state' : 'home',
                'params' : {}
            }
        }
        var template, element, regForm;


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

        $scope =  _$rootScope_;
        template = '<form class="form-classic" name="vm.forgot_password_form" ng-submit="vm.forgotPassword()"></form>'
        element = angular.element(template);
        $compile(element)($scope);
        $httpBackend.flush();



        ForgotPasswordCtrl =  $controller('ForgotPasswordCtrl', { $scope: $scope, $stateParams:stateParams});
    }));

    describe("Initializacion ", function(){
        it('should have controller defined ', function() {
            expect(ForgotPasswordCtrl).toBeDefined();
         });
         it('forgotPassword()', function() {
             ForgotPasswordCtrl.forgot_password_form = $scope.vm.forgot_password_form;
             console.log(ForgotPasswordCtrl);
             ForgotPasswordCtrl.email='henry.bravo@gmail.com';
             ForgotPasswordCtrl.forgotPassword();
             $httpBackend
                 .when('POST', 'http://localhost:8000/api/auth/password/forgot')
                 .respond(200, {});
            $httpBackend.flush();

          });
    });





})
