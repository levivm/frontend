xdescribe('Controller: ActivityDBLocationController', function(){
    var ActivityDBLocationController,
        ActivitiesManager,
        rootScope,
        activity='',
        organizer='',
        cities,
        Organizer,
        $httpBackend,
        currentUser,
        presaveInfo,
        scope = {};

    beforeEach(function(){
        module('trulii');
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            ActivitiesManager = $injector.get('ActivitiesManager'),
            LocationManager = $injector.get('LocationManager');
            Organizer = $injector.get('Organizer');
            Activity = $injector.get('Activity');
         })

    });
    beforeEach(inject(function($controller,  _$rootScope_, $http, $httpBackend) {

        /*
            Resolves for detail.controller
        */
        $scope =  _$rootScope_;
        $httpBackend
             .when('GET', 'http://localhost:8000/api/activities/search/?city=1&o=score&page_size=8')
             .respond(readJSON('tests/mock/activities.json'));

        $httpBackend
             .when('GET', 'http://localhost:8000/api/activities/info')
             .respond(readJSON('tests/mock/generalinfo.json'));

        $httpBackend
             .when('GET', 'http://localhost:8000/api/locations/cities/')
             .respond(readJSON('tests/mock/cities.json'));
        $httpBackend
             .when('GET', 'http://localhost:8000/api/activities/4')
             .respond(readJSON('tests/mock/activity.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/organizers/1/reviews?page=1&page_size=5&status=')
            .respond(readJSON('tests/mock/reviews.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/activities/4/calendars')
            .respond(readJSON('tests/mock/calendars.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/organizers/1/activities?page=1&page_size=12&status=open')
            .respond(readJSON('tests/mock/activities-related.json'));
        $httpBackend
           .when('JSONP', '//ipinfo.io/?callback=JSON_CALLBACK')
           .respond(readJSON('tests/mock/ipinfo.json'));

        ActivitiesManager.getActivity(4)
            .then(function(data){
                activity = new Activity(data);
                var organizerObj = new Organizer(activity.organizer);

            }, function(response){
                console.log(response);
            });
       LocationManager.getAvailableCities()
            .then(function (data) {
                console.log(data);
                cities = data;
            }, function(response){
                console.log(response);
            });



        ActivitiesManager.loadGeneralInfo()
              .then(function(data){
                  presaveInfo=data;
              }, function(response){
                  console.log(response);
              })
        currentUser = readJSON('tests/mock/currentUser.json');
        //End calls
        $httpBackend.flush();

        ActivityDBLocationController =  $controller('ActivityDBLocationController', {
            'activity': activity,
            'organizer': organizer,
            'cities': cities});



    }));

    describe("Initializacion", function(){
        it('should have controller defined and strings is object defined', function() {
            expect(ActivityDBLocationController).toBeDefined();
            expect(ActivityDBLocationController.strings).toBeDefined();
         });
    });

    describe("Update", function(){
        var template, element, regForm;
        beforeEach(inject(function ($templateCache, $compile) {
           template = '<form  name="location.activity_location_form" class="col-lg-9" ng-submit="location.save_activity()"></form>'
           element = angular.element(template);
           $compile(element)($scope);

       }));
        it('should successfully update', function() {
            ActivityDBLocationController.isSaving = true;
            ActivityDBLocationController.activity_location_form = $scope.location.activity_location_form;
            ActivityDBLocationController.save_activity();
            $httpBackend
                 .when('PUT', 'http://localhost:8000/api/activities/4/locations')
                 .respond(readJSON('tests/mock/location_response.json'));

            $httpBackend.flush();
            expect(ActivityDBLocationController.isSaving).toBe(false);
         });
    });





})