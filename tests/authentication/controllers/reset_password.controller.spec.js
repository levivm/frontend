xdescribe('Controller: ResetPasswordCtrl', function(){
    var ResetPasswordCtrl,
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
            reset_key:'token'
        };
        
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
            .when('JSONP', 'https://freegeoip.net/json/?callback=JSON_CALLBACK')
            .respond(readJSON('tests/mock/ipinfo.json'));
        
        $httpBackend.flush();
        
        $scope =  _$rootScope_;
        ResetPasswordCtrl =  $controller('ResetPasswordCtrl', { $stateParams:stateParams, '$scope': $scope});
    }));

    describe("Initializacion", function(){
        it('should have controller defined and strings is object defined', function() {
            console.log(ResetPasswordCtrl)
            expect(ResetPasswordCtrl).toBeDefined();
            expect(ResetPasswordCtrl.strings).toBeDefined();
         });
    });
    
    describe("Reset", function(){
        var template, element, regForm;
        beforeEach(inject(function ($templateCache, $compile) {
           template = '<form name="vm.reset_password_form" ng-submit="vm.resetPassword()""></form>';
           element = angular.element(template);
           $compile(element)($scope);

       })); 
        it('should reset success', inject(function($state) {
            ResetPasswordCtrl.reset_password_form= $scope.vm.reset_password_form;
            ResetPasswordCtrl.password1 = "12345678";
            ResetPasswordCtrl.password2 = "12345678";
            ResetPasswordCtrl.resetPassword();
            spyOn($state, 'go');
            $state.go('general-message',{'module_name':'authentication',
                                       'template_name':'change_password_success',
                                       'redirect_state':'login'});
            
            $httpBackend
                .when('POST', 'http://localhost:8000/api/auth/password/reset')
                .respond(200, {});

            $httpBackend.flush();
            expect($state.go).toHaveBeenCalled();

         }));
         
         
    });


})
