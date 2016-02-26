describe('Controller: ActivityDetailController', function(){
    var ActivityDetailController,
        generalInfo,
        ActivitiesManager,
        rootScope,
        activity='',
        calendars='',
        organizer='',
        relatedActivities='',
        reviews='',
        Authentication,
        CalendarsManager,
        Organizer,
        $httpBackend,
        currentUser,
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

        /*Calls to resolve route / 'Home'
            currentUser: getAuthenticatedUser,
            activity: getActivity,
            reviews: getReviews,
            calendars: getCalendars,
            organizer: getActivityOrganizer,
            relatedActivities: getOrganizerActivities
            Organizer

            http://localhost:8000/api/activities/9
            ActivitiesManager.getActivity($stateParams.activity_id);

            Authentication.getAuthenticatedAccount();


            http://localhost:8000/api/organizers/2/reviews

            organizer = acitvity.organizer

            ActivitiesManager.loadOrganizerActivities(organizer.id);

             CalendarsManager.loadCalendars(activity.id);

             http://localhost:8000/api/activities/9/calendars
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
             .when('GET', 'http://localhost:8000/api/activities/9')
             .respond(readJSON('tests/mock/activity.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/organizers/2/reviews')
            .respond(readJSON('tests/mock/reviews.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/activities/9/calendars')
            .respond(readJSON('tests/mock/calendars.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/organizers/2/activities')
            .respond(readJSON('tests/mock/activities-related.json'));

        ActivitiesManager.getActivity(9)
            .then(function(data){
                activity = data;
                var organizerObj = new Organizer(activity.organizer);
                organizerObj.getReviews().then(successReviews, errorReviews);

            }, function(response){
                console.log(response);
            });

        function successReviews(reviews){
            reviews = reviews;
        }
        function errorReviews(error){
            console.log(error);
        }

        CalendarsManager.loadCalendars(9)
            .then(function(data){
                calendars = data;

            }, function(response){
                console.log(response);
            });

        ActivitiesManager.loadOrganizerActivities(2)
            .then(function(data){
                relatedActivities = data;

            }, function(response){
                console.log(response);
            });
        //End calls
        $httpBackend.flush();

        ActivityDetailController =  $controller('ActivityDetailController', {
            'activity': activity,
            'calendars': calendars,
            'organizer': organizer,
            'relatedActivities': relatedActivities,
            'reviews':reviews,
            'currentUser':currentUser,
            $scope: scope});


        rootScope = $rootScope;

    }));

    describe("Initializacion", function(){
        it('should have controller defined and strings is object defined', function() {
            expect(ActivityDetailController).toBeDefined();
            expect(ActivityDetailController.strings).toBeDefined();
         });
    });


})
