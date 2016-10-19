describe('Controller: OrganizerReviewsCtrl', function(){
    var OrganizerReviewsCtrl,
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
        var template, element, regForm, organizer, cities, messages, unreadReviewObjects, readReviewObjects;


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
            .when('GET', 'http://localhost:8000/api/organizers/4/reviews?page=1&page_size=6&status=unread')
            .respond(readJSON('tests/mock/reviews.json'));    
        $httpBackend
            .when('GET', 'http://localhost:8000/api/organizers/4/reviews?page=1&page_size=6&status=read')
            .respond(readJSON('tests/mock/reviews.json'));    
        $scope =  _$rootScope_;
       
        
        organizer = new Organizer(readJSON('tests/mock/currentOrgUser.json'));
        cities = readJSON('tests/mock/cities.json');
         organizer.getReviews(1, 6, 'unread').then(function (data) {
             unreadReviewObjects = data;
         });
        
        organizer.getReviews(1, 6, 'unread').then(function (data) {
             readReviewObjects = data;
         });
        $httpBackend.flush();

         console.log(organizer);

        OrganizerReviewsCtrl =  $controller('OrganizerReviewsCtrl', { 
                                               'organizer': organizer, 
                                               'unreadReviewObjects': unreadReviewObjects,  
                                               'readReviewObjects': readReviewObjects,
                                                'cities': cities, '$scope': $scope});
    }));

    describe("Initializacion ", function(){
        it('should have controller defined and strings is object defined', function() {
           
            console.log(OrganizerReviewsCtrl);
            expect(OrganizerReviewsCtrl).toBeDefined();
            expect(OrganizerReviewsCtrl.strings).toBeDefined();
         });
    });
   



})
