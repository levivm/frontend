describe('Controller: HomeController', function(){
    var HomeController,
        generalInfo,
        ActivitiesManager,
        rootScope,
        apiActivities,
        activities,
        featuredOrganizers,
        httpBackend;

    beforeEach(function(){
        module('trulii');
        inject(function ($injector) {
            httpBackend = $injector.get('$httpBackend');
            ActivitiesManager = $injector.get('ActivitiesManager');
            OrganizersManager =$injector.get('OrganizersManager')
            apiActivities = $injector.get('ActivityServerApi');
            
         })

    });
    beforeEach(inject(function($controller, $rootScope, $http, $httpBackend) {
        scope = {};
        scope = $rootScope.$new();
        /*Calls to resolve route / 'Home'
            activities: getRecommendedActivities,
            generalInfo: getPresaveActivityInfo




        httpBackend
             .when('GET', 'http://localhost:8000/api/locations/cities/')
             .respond(readJSON('tests/mock/cities.json'));*/

        httpBackend
             .when('GET', 'http://localhost:8000/api/activities/info')
             .respond(readJSON('tests/mock/generalinfo.json'));
             
        httpBackend
             .when('GET', 'http://localhost:8000/api/organizers/featured')
             .respond(readJSON('tests/mock/organizersFeatured.json'));
        

         httpBackend
              .when('GET', 'http://localhost:8000/api/locations/cities/')
              .respond(readJSON('tests/mock/cities.json'));

          httpBackend
             .when('GET', 'http://localhost:8000/api/activities/featured')
             .respond(readJSON('tests/mock/activities.json'));
             activities = readJSON('tests/mock/activities.json');

          httpBackend
             .when('JSONP', 'https://freegeoip.net/json/?callback=JSON_CALLBACK')
             .respond(readJSON('tests/mock/ipinfo.json'));





        ActivitiesManager.loadGeneralInfo().then(function(data){
            generalInfo = data;
        }, function(response){
            console.log(response);
        });
        
        OrganizersManager.getFeaturedOrganizers().then(function(data){
            featuredOrganizers = data;
        }, function(response){
            console.log(response);
        });

        httpBackend.flush();

        //End calls


        HomeController =  $controller('HomeController', {'activities': activities,'generalInfo':generalInfo, 'featuredOrganizers':featuredOrganizers, $scope: scope});
        rootScope = $rootScope;

    }));

    describe("Initializacion", function(){
        it('should have controller defined and strings is object defined', function() {
            expect(HomeController).toBeDefined();
            expect(HomeController.strings).toBeDefined()
         });
         it('should hasMoreActivities', function() {
            expect(HomeController.hasMoreActivities).toBe(false);

          });
    });


})
