xdescribe('Controller: ActivityCalendarsController', function(){
    var ActivityCalendarsController,
        ActivitiesManager,
        rootScope,
        activity='',
        organizer='',
        calendars,
        Organizer,
        $httpBackend,
        currentUser,
        presaveInfo,
        scope = {};

    beforeEach(function(){
        module('trulii');
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            ActivitiesManager = $injector.get('ActivitiesManager');
            CalendarsManager = $injector.get('CalendarsManager');
            Organizer = $injector.get('Organizer');
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
                activity = data;
                var organizerObj = new Organizer(activity.organizer);

            }, function(response){
                console.log(response);
            });

        CalendarsManager.loadCalendars(4)
            .then(function(data){
                calendars = data;

            }, function(response){
                console.log(response);
        });



       
        currentUser = readJSON('tests/mock/currentUser.json');
        //End calls
        $httpBackend.flush();

        ActivityCalendarsController =  $controller('ActivityCalendarsController', {
            'activity': activity,
            'organizer': organizer,
            'calendars': calendars,
            '$scope': $scope,
            'isOwner':true});



    }));

    describe("Initializacion", function(){
        it('should have controller defined and strings is object defined', function() {
            expect(ActivityCalendarsController).toBeDefined();
            expect(ActivityCalendarsController.strings).toBeDefined();
         });
         
         it('Length calendars should be 4', function() {
             expect(ActivityCalendarsController.calendars.length).toBe(4);
         });
    });

    




})