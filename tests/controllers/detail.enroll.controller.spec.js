xdescribe('Controller: ActivityDetailEnrollController', function(){
    var ActivityDetailEnrollController,
        generalInfo,
        ActivitiesManager,
        rootScope,
        activity='',
        calendar='',
        reviews='',
        Authentication,
        CalendarsManager,
        Organizer,
        $httpBackend,
        currentUser,
        isStudent=true,
        isActive=true,
        scope = {};

    beforeEach(function(){
        module('trulii');
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            ActivitiesManager = $injector.get('ActivitiesManager');
            Authentication = $injector.get('Authentication');
            CalendarsManager = $injector.get('CalendarsManager');
            Organizer = $injector.get('Organizer');
         })

    });
    beforeEach(inject(function($controller, $rootScope, $http, $httpBackend) {

        /*
            Resolves for detail.controller
        */
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
            .when('GET', ' http://localhost:8000/api/activities/4/calendars/13')
            .respond(readJSON('tests/mock/calendar.json'));

    /*    $httpBackend
            .when('GET', 'http://localhost:8000/api/organizers/1/activities')
            .respond(readJSON('tests/mock/activities-related.json'));*/

        ActivitiesManager.getActivity(4)
            .then(function(data){
                activity = data;
                var organizerObj = new Organizer(activity.organizer);
                organizerObj.getReviews().then(successReviews, errorReviews);

            }, function(response){
                console.log(response);
            });

        CalendarsManager.fetchCalendar(4, 13)
            .then(function(data){
                console.log(data);
                calendar = data;

            }, function(response){
                console.log(response);
            });



        currentUser = readJSON('tests/mock/currentUser.json');
        console.log(currentUser);
        //End calls
        $httpBackend.flush();
        /*
        activity: getActivity,
        calendar: fetchCalendar,
        currentUser: getAuthenticatedUser,
        isStudent: isStudent,
        isActive: isActive,
        deviceSessionId:getDeviceSessionId

        */
        ActivityDetailEnrollController =  $controller('ActivityDetailEnrollController', {
            'activity': activity,
            'calendar': calendar,
            'currentUser':currentUser,
            'isStudent': isStudent,
            'isActive': isActive
            });


        rootScope = $rootScope;

    }));

    describe("Initializacion", function(){
        it('should have controller defined and strings is object defined', function() {
            expect(ActivityDetailEnrollController).toBeDefined();
            expect(ActivityDetailEnrollController.strings).toBeDefined();
         });
    });




})
