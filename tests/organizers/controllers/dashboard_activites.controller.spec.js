describe('Controller: OrganizerActivitiesCtrl', function(){
    var OrganizerActivitiesCtrl,
        $scope = {};

    beforeEach(function(){
        module('templates', 'trulii');
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            Authentication = $injector.get('Authentication');
            $compile = $injector.get('$compile');
            Organizer = $injector.get('Organizer');
            ActivitiesManager = $injector.get('ActivitiesManager');
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
            
        $httpBackend
            .when('GET', 'http://localhost:8000/api/organizers/4/activities?page=1&page_size=8&status=unpublished')
            .respond(readJSON('tests/mock/activities.json'));    
        $httpBackend
            .when('GET', 'http://localhost:8000/api/organizers/4/activities?page=1&page_size=8&status=opened')
            .respond(readJSON('tests/mock/activities.json'));    
        $httpBackend
            .when('GET', 'http://localhost:8000/api/organizers/4/activities?page=1&page_size=8&status=closed')
            .respond(readJSON('tests/mock/activities.json'));    
        $scope =  _$rootScope_;
        
        
        
        
        organizer = new Organizer(readJSON('tests/mock/currentOrgUser.json'));
        cities = readJSON('tests/mock/cities.json');
        ActivitiesManager.loadOrganizerActivities(organizer.id, 'opened').then(function (data) {
            openActivities= data;
        });
        
        ActivitiesManager.loadOrganizerActivities(organizer.id, 'unpublished').then(function (data) {
             inactiveActivities = data;
        });
        
        ActivitiesManager.loadOrganizerActivities(organizer.id, 'closed').then(function (data) {
            closedActivities = data;
        });
        
        $httpBackend.flush();

         console.log(organizer);

        OrganizerActivitiesCtrl =  $controller('OrganizerActivitiesCtrl', { 
                                               'organizer': organizer, 
                                               'openActivities': openActivities,  
                                               'inactiveActivities': inactiveActivities,
                                               'closedActivities': closedActivities,
                                                'cities': cities, '$scope': $scope});
    }));

    describe("Initializacion ", function(){
        it('should have controller defined and strings is object defined', function() {
           
            console.log(OrganizerActivitiesCtrl);
            expect(OrganizerActivitiesCtrl).toBeDefined();
            expect(OrganizerActivitiesCtrl.strings).toBeDefined();
         });
    });
   



})
