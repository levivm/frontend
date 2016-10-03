xdescribe('Controller: StudentProfileCtrl', function(){
    var StudentProfileCtrl,
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
        var template, element, regForm, student, cities, messages;


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
        

        student = new Student(readJSON('tests/mock/currentUser.json'));
        cities = readJSON('tests/mock/cities.json');
        messages = [];
        $httpBackend.flush();

         console.log(student);

        StudentProfileCtrl =  $controller('StudentProfileCtrl', { 'student': student, 'cities': cities, 'messages': messages, $stateParams:stateParams});
    }));

    describe("Initializacion ", function(){
        it('should have controller defined and strings is object defined', function() {
           
            console.log(StudentProfileCtrl);
            expect(StudentProfileCtrl).toBeDefined();
            expect(StudentProfileCtrl.strings).toBeDefined();
         });
    });
    
     describe("Update", function(){
        var template, element, regForm;
        beforeEach(inject(function ($templateCache, $compile) {
           template = '<form class="form-classic"name="profile.profile_form" ng-submit="profile.updateProfile()"></form>'
           element = angular.element(template);
           $compile(element)($scope);

       }));
        it('should successfully update', function() {
            StudentProfileCtrl.is_saving= true;
            
            StudentProfileCtrl.profile_form = $scope.profile.profile_form;
            StudentProfileCtrl.updateProfile();
            $httpBackend
                 .when('PUT', 'http://localhost:8000/api/students/4')
                 .respond(readJSON('tests/mock/activity.json'));

            $httpBackend.flush();
            expect(StudentProfileCtrl.isSaving).toBe(false);
         });
    });




})
