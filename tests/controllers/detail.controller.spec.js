xdescribe('Controller: ActivityDetailController', function(){
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
            .when('GET', 'http://localhost:8000/api/organizers/1/reviews')
            .respond(readJSON('tests/mock/reviews.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/activities/4/calendars')
            .respond(readJSON('tests/mock/calendars.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/organizers/1/activities')
            .respond(readJSON('tests/mock/activities-related.json'));

        ActivitiesManager.getActivity(4)
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

        CalendarsManager.loadCalendars(4)
            .then(function(data){
                calendars = data;

            }, function(response){
                console.log(response);
            });

        ActivitiesManager.loadOrganizerActivities(1)
            .then(function(data){
                relatedActivities = data;

            }, function(response){
                console.log(response);
            });

        currentUser = readJSON('tests/mock/currentUser.json');
        console.log(currentUser);
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

    describe("Calendars", function(){
        it('should selectedActivity equal 0', function() {
            expect(ActivityDetailController.selectedActivity).toEqual(0);
         });
         it('Should showSessions Truthy', function() {
             ActivityDetailController.toggleSessions();
             expect(ActivityDetailController.showSessions).toBeTruthy();

          });
    });
    describe("Reviews", function(){
         it('Should dont hasMoreReviews reviews length < 3', function() {
            expect(ActivityDetailController.hasMoreReviews).toBe(false);
          });
    });
    xdescribe("Enroll", function(){
         it('signUp function dont currentUser go to register', function() {
             ActivityDetailController.signUp(4, 13);
             expect(currentUser).toBe(undefined);
          });
    });

    describe("Enroll", function(){
         it('signUp function currentUser is student', inject(function($state) {
             $httpBackend
                 .when('GET', 'http://localhost:8000/api/activities/4/calendars/13')
                 .respond(200, {});
             ActivityDetailController.signUp(4, 13);
             var enrollParams = {
                 activity_id: 9,
                 calendar_id: 13
             };
             switch(currentUser.user_type){
                 case 'S':
                    spyOn($state, 'go');
                     $state.go('activities-enroll', enrollParams);
                     rootScope.$apply();

                     break;
                 case 'O':
                     //Toast.error(vm.strings.TITLE_INVALID_USER, vm.strings.MSG_INVALID_USER);
                     break;
             }

             expect($state.go).toHaveBeenCalled();
             expect($state.go).toHaveBeenCalledWith('activities-enroll', enrollParams);
         }));
    });



})
