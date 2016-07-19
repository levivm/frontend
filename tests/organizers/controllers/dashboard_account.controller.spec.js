xdescribe('Controller: OrganizerAccountCtrl', function(){
    var OrganizerAccountCtrl,
        $scope = {};

    beforeEach(function(){
        module('templates', 'trulii');
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            Authentication = $injector.get('Authentication');
            $compile = $injector.get('$compile');
            Organizer = $injector.get('Organizer');
            Payments = $injector.get('Payments');
         })
    });
    beforeEach(inject(function($controller, _$rootScope_, $http, $httpBackend) {
        var stateParams = {
            'toState' : {
                'state' : 'home',
                'params' : {}
            }
        }
        var template, element, regForm, organizer, cities;


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
        $httpBackend
            .when('GET', 'http://localhost:8000/api/students/4/orders/?page=1&pageSize=10')
            .respond(200, {});
        $httpBackend
            .when('GET', 'http://localhost:8000/api/users/current/')
            .respond(readJSON('tests/mock/currentOrgUser.json'));
        $httpBackend
            .when('GET', 'http://localhost:8000/api/bankinfo/choices/')
            .respond(readJSON('tests/mock/banksInfo.json'));
        $httpBackend
            .when('GET', 'http://localhost:8000/api/organizers/bankinfo/')
            .respond(readJSON('tests/mock/bankingData.json'));
        $httpBackend
            .when('GET', 'http://localhost:8000/api/users/current/')
            .respond(readJSON('tests/mock/currentOrgUser.json'));
        $scope =  _$rootScope_;
        
        Payments.getBankingInfo().then(function (data) {
            bankingInfo = data;
            
        })
        organizer = new Organizer(readJSON('tests/mock/currentOrgUser.json'));
        cities = readJSON('tests/mock/cities.json');
        
        organizer.getBankingInfo().then(function (data) {
            bankingData = data;
        })
        
        $httpBackend.flush();




        OrganizerAccountCtrl =  $controller('OrganizerAccountCtrl', { 'organizer': organizer, 'bankingInfo': bankingInfo, 'bankingData': bankingData});
    }));

    describe("Initializacion ", function(){
        it('should have controller defined and strings is object defined', function() {
            console.log(OrganizerAccountCtrl);
            expect(OrganizerAccountCtrl).toBeDefined();
            expect(OrganizerAccountCtrl.strings).toBeDefined();
         });
    });

   describe("Change Email ", function(){
        var template, element, regForm;
        beforeEach(inject(function ($templateCache, $compile) {
            template = '<form  class="col-xs-12 separate-above" name="account.account_form_email" ng-submit="account.changeEmail()"></form>'
            element = angular.element(template);
            $compile(element)($scope);
        }));
        it('should success', function() {
            //OrganizerAccountCtrl.student = student;
            OrganizerAccountCtrl.account_form_email= $scope.account.account_form_email;
            OrganizerAccountCtrl.changeEmail();
            $httpBackend
                .when('POST', 'http://localhost:8000/api/auth/email/change/')
                .respond(200, {});

            Authentication.change_email(OrganizerAccountCtrl.organizer.user.email).then(function(data){
                expect(data.status).toEqual(200);
            });
           $httpBackend.flush();
         });
    });

    describe("Change Password ", function(){
        beforeEach(inject(function ($templateCache, $compile) {
            template = '<form  class="col-xs-12" name="account.account_form_password" ng-submit="account.changePassword()"></form>'
            element = angular.element(template);
            $compile(element)($scope);
        }));
        it('should success', function() {
            //OrganizerAccountCtrl.student = student;
            OrganizerAccountCtrl.account_form_password= $scope.account.account_form_password;
            OrganizerAccountCtrl.password_data.password='12345678';
            OrganizerAccountCtrl.password_data.password1='123456789';
            OrganizerAccountCtrl.password_data.password2='123456789';
            OrganizerAccountCtrl.changePassword();
            $httpBackend
                .when('POST', 'http://localhost:8000/api/auth/password/change/')
                .respond(200, {});

            Authentication.change_password(OrganizerAccountCtrl.organizer.user.email).then(function(data){
                expect(data.status).toEqual(200);
            });
           $httpBackend.flush();
         });
    });
    
    describe("Update Banking data ", function(){
        beforeEach(inject(function ($templateCache, $compile) {
            template = '<form  name="account.account_form_banking_info" ng-submit="account.updateBankingInfo()"></form>'
            element = angular.element(template);
            $compile(element)($scope);
        }));
        it('should success', function() {
            //OrganizerAccountCtrl.student = student;
            delete OrganizerAccountCtrl.bankingData['id'];
            OrganizerAccountCtrl.is_saving= true;
            OrganizerAccountCtrl.account_form_banking_info= $scope.account.account_form_banking_info;
            OrganizerAccountCtrl.updateBankingInfo();
            $httpBackend
                .when('POST', 'http://localhost:8000/api/organizers/bankinfo/')
                .respond(readJSON('tests/mock/bankingData.json'));
           $httpBackend.flush();
           expect(OrganizerAccountCtrl.isSaving).toBe(false);
           
           
         });
    });






})
