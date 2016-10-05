describe('Controller: OrganizerProfileController', function(){
    var OrganizerProfileController,
        $scope = {};

    beforeEach(function(){
        module('templates', 'trulii');
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            Authentication = $injector.get('Authentication');
            $compile = $injector.get('$compile');
            OrganizersManager = $injector.get('OrganizersManager');
         })
    });
    beforeEach(inject(function($controller, _$rootScope_, $http, $httpBackend) {
        var stateParams = {
            'toState' : {
                'state' : 'home',
                'params' : {}
            }
        }
        var template, element, regForm, organizer, cities, orders, reviews, activities;


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
            .when('GET', 'http://localhost:8000/api/organizers/3')
            .respond(readJSON('tests/mock/organizer.json'));
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
        OrganizersManager.getOrganizer(3).then(function (data) {
            organizer = data;
        });
        activities = readJSON('tests/mock/activities.json');
        reviews = readJSON('tests/mock/reviews.json');
        $httpBackend.flush();


        OrganizerProfileController =  $controller('OrganizerProfileController', { 
                                                 'organizer': organizer, 
                                                 'reviews': reviews,
                                                 'activities': activities,
                                                 '$scope': $scope});
    }));

    describe("Initializacion ", function(){
        it('should have controller defined and strings is object defined', function() {
            expect(OrganizerProfileController).toBeDefined();
            expect(OrganizerProfileController.strings).toBeDefined();
         });
    });


})
