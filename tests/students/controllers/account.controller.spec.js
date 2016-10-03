xdescribe('Controller: StudentAccountCtrl', function(){
    var StudentAccountCtrl,
        $scope = {};

    beforeEach(function(){
        module('templates', 'trulii');
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            Authentication = $injector.get('Authentication');
            $compile = $injector.get('$compile');
            Student = $injector.get('Student');
         })
    });
    beforeEach(inject(function($controller, _$rootScope_, $http, $httpBackend) {
        var stateParams = {
            'toState' : {
                'state' : 'home',
                'params' : {}
            }
        }
        var template, element, regForm, student;


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
        $httpBackend
            .when('GET', 'http://localhost:8000/api/students/4/orders/?page=1&pageSize=10')
            .respond(200, {});
        $httpBackend
            .when('GET', 'http://localhost:8000/api/users/current/')
            .respond(readJSON('tests/mock/currentUser.json'));
        $scope =  _$rootScope_;
        template = '<form class="form-classic" name="vm.name_form" ng-submit="vm.change()"></form>'
        element = angular.element(template);
        $compile(element)($scope);

        student = new Student(readJSON('tests/mock/currentUser.json'));
        $httpBackend.flush();



        StudentAccountCtrl =  $controller('StudentAccountCtrl', { 'student': student, $stateParams:stateParams});
    }));

    describe("Initializacion ", function(){
        it('should have controller defined and strings is object defined', function() {
            console.log(StudentAccountCtrl);
            expect(StudentAccountCtrl).toBeDefined();
            expect(StudentAccountCtrl.strings).toBeDefined();
         });
    });

    describe("Change Email ", function(){
        it('should success', function() {
            //StudentAccountCtrl.student = student;
            StudentAccountCtrl.account_form_email= $scope.vm.name_form;
            StudentAccountCtrl.changeEmail();
            $httpBackend
                .when('POST', 'http://localhost:8000/api/auth/email/change/')
                .respond(200, {});

            Authentication.change_email(StudentAccountCtrl.student.user.email).then(function(data){
                expect(data.status).toEqual(200);
            });
           $httpBackend.flush();
         });
    });

    describe("Change Password ", function(){
        it('should success', function() {
            //StudentAccountCtrl.student = student;
            StudentAccountCtrl.account_form_password= $scope.vm.name_form;
            StudentAccountCtrl.password_data.password='12345678';
            StudentAccountCtrl.password_data.password1='123456789';
            StudentAccountCtrl.password_data.password2='123456789';
            StudentAccountCtrl.changePassword();
            $httpBackend
                .when('POST', 'http://localhost:8000/api/auth/password/change/')
                .respond(200, {});

            Authentication.change_password(StudentAccountCtrl.student.user.email).then(function(data){
                expect(data.status).toEqual(200);
            });
           $httpBackend.flush();
         });
    });






})
