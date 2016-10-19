describe('Controller: OrganizerProfileCtrl', function(){
    var OrganizerProfileCtrl,
        $scope = {};

    beforeEach(function(){
        module('templates', 'trulii');
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            Authentication = $injector.get('Authentication');
            $compile = $injector.get('$compile');
            Organizer = $injector.get('Organizer');
         })
    });
    beforeEach(inject(function($controller, _$rootScope_, $http, $httpBackend) {
        var stateParams = {
            'toState' : {
                'state' : 'home',
                'params' : {}
            }
        }
        var template, element, regForm, organizer, cities, messages;


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
        $httpBackend
            .when('GET', 'http://localhost:8000/api/students/4/orders/?page=1&pageSize=10')
            .respond(200, {});
        $httpBackend
            .when('GET', 'http://localhost:8000/api/users/current/')
            .respond(readJSON('tests/mock/currentOrgUser.json'));
        $scope =  _$rootScope_;
        

        organizer = new Organizer(readJSON('tests/mock/currentOrgUser.json'));
        cities = readJSON('tests/mock/cities.json');
        messages = [];
        $httpBackend.flush();

         console.log(organizer);

        OrganizerProfileCtrl =  $controller('OrganizerProfileCtrl', { 'organizer': organizer, 'cities': cities});
    }));

    describe("Initializacion ", function(){
        it('should have controller defined and strings is object defined', function() {
           
            console.log(OrganizerProfileCtrl);
            expect(OrganizerProfileCtrl).toBeDefined();
            expect(OrganizerProfileCtrl.strings).toBeDefined();
         });
    });
    
    describe("Update", function(){
        var template, element, regForm;
        beforeEach(inject(function ($templateCache, $compile) {
           template = '<form class="separate-above col-xs-12 col-md-12" name="profile.profile_form_info" ng-submit="profile.submitInfo()"></form>'
           element = angular.element(template);
           $compile(element)($scope);

       }));
        it('should successfully update form info', function() {
            OrganizerProfileCtrl.is_saving= true;
            
            OrganizerProfileCtrl.profile_form_info = $scope.profile.profile_form_info;
            OrganizerProfileCtrl.submitInfo();
            $httpBackend
                 .when('PUT', 'http://localhost:8000/api/organizers/4')
                 .respond(200, {});

            $httpBackend.flush();
            expect(OrganizerProfileCtrl.isSaving).toBe(false);
         });
    });



})
