describe('Controller: HomeController', function(){
    var HomeController,
        generalInfo,
        ActivitiesManager,
        rootScope,
        apiActivities,
        activities,
        httpBackend;

    beforeEach(function(){
        module('trulii');
        inject(function ($injector) {
            httpBackend = $injector.get('$httpBackend');
            ActivitiesManager = $injector.get('ActivitiesManager');
            apiActivities = $injector.get('ActivityServerApi');
         })

    });
    beforeEach(inject(function($controller, $rootScope, $http, $httpBackend) {
        scope = {};

        /*Calls to resolve route / 'Home'
            activities: getRecommendedActivities,
            generalInfo: getPresaveActivityInfo
        */
        httpBackend
             .when('GET', 'http://localhost:8000/api/activities/search/?city=1&o=score&page_size=8')
             .respond(readJSON('tests/mock/activities.json'));
        activities = readJSON('tests/mock/activities.json');

        httpBackend
             .when('GET', 'http://localhost:8000/api/activities/info')
             .respond(readJSON('tests/mock/generalinfo.json'));

        httpBackend
             .when('GET', 'http://localhost:8000/api/locations/cities/')
             .respond(readJSON('tests/mock/cities.json'));

        ActivitiesManager.loadGeneralInfo().then(function(data){
            generalInfo = data;
        }, function(response){
            console.log(response);
        });

        httpBackend.flush();

        //End calls


        HomeController =  $controller('HomeController', {'activities': activities,'generalInfo':generalInfo});
        rootScope = $rootScope;

    }));

    describe("Initializacion", function(){
        it('should have controller defined and strings is object defined', function() {
            expect(HomeController).toBeDefined();
            expect(HomeController.strings).toBeDefined()
         });
         it('should hasMoreActivities', function() {
            expect(HomeController.hasMoreActivities).toBe(true);

          });
    });


})
