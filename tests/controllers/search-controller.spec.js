describe('Controller: SearchController', function(){
    var SearchController,
        generalInfo,
        ActivitiesManager,
        searchActivities,
        rootScope,
        apiActivities,
        activities,
        scope= {},
        SearchManager,
        httpBackend;

    beforeEach(function(){
        module('trulii');
        inject(function ($injector) {
            httpBackend = $injector.get('$httpBackend');
            ActivitiesManager = $injector.get('ActivitiesManager');
            SearchManager = $injector.get('SearchManager');
         })

    });
    beforeEach(inject(function($controller, $rootScope, $http, $httpBackend) {
        scope = $rootScope.$new();
        stateParams =  {
            activities: Array[0],
            category: undefined,
            certification: undefined,
            city: "1",
            cost_end: undefined,
            cost_start: undefined,
            date: undefined,
            level: undefined,
            o: undefined,
            page: "1",
            q: "sesiones de derecho",
            subcategory: undefined,
            weekends: undefined
        }
            //  Resolve GeneralInfo

        //Define params for search be successfully ;

         $httpBackend
              .when('GET', 'http://localhost:8000/api/activities/search/?city=1&o=score&page_size=8')
              .respond(readJSON('tests/mock/activities.json'));
         $httpBackend
              .when('GET', 'http://localhost:8000/api/activities/search/?city=1&page=1&q=sesiones+de+derecho')
              .respond(readJSON('tests/mock/searchActivities.json'));


        httpBackend
             .when('GET', 'http://localhost:8000/api/activities/info')
             .respond(readJSON('tests/mock/generalinfo.json'));

         httpBackend
              .when('GET', 'http://localhost:8000/api/locations/cities/')
              .respond(readJSON('tests/mock/cities.json'));

         httpBackend
            .when('JSONP', 'http://ipinfo.io/?callback=JSON_CALLBACK')
            .respond(readJSON('tests/mock/ipinfo.json'));




        ActivitiesManager.loadGeneralInfo().then(function(data){
            generalInfo = data;
        }, function(response){
            console.log(response);
        });
        SearchManager.searchActivities(stateParams).then(function(data){
            searchActivities = data;
        }, function(err){
            console.log(err);
        });

        httpBackend.flush();




        //End calls


        SearchController =  $controller('SearchController', {'generalInfo':generalInfo, $scope: scope, $stateParams:stateParams});
        rootScope = $rootScope;



    }));

    describe("Initializacion", function(){
        it('should have controller defined and strings is object defined', function() {
            expect(SearchController).toBeDefined();
            expect(SearchController.strings).toBeDefined();

         });
    });

    describe("Search init", function(){
        it('should the length activities to be greater than 0 ', function() {
            SearchController.activities = searchActivities.activities;
            expect(SearchController.activities.length).toBeGreaterThan(0);

         });
    });


})
