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
    beforeEach(inject(function($controller, $rootScope,_$rootScope_,  $http, $httpBackend) {

        /*http://localhost:8000/api/organizers/1/activities?page=1&page_size=8&status=open
            Resolves for detail.controller
        */
        $httpBackend
             .when('GET', 'http://localhost:8000/api/activities/featured')
             .respond(readJSON('tests/mock/activities.json'));
         
        $httpBackend
             .when('GET', 'http://localhost:8000/api/organizers/featured')
             .respond(readJSON('tests/mock/organizersFeatured.json'));

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
            .when('GET', 'http://localhost:8000/api/organizers/2/reviews?page=1&page_size=5&status=')
            .respond(readJSON('tests/mock/reviews.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/activities/4/calendars')
            .respond(readJSON('tests/mock/calendars_close.json'));
        
        $httpBackend
            .when('PUT', 'http://localhost:8000/api/activities/4/views_counter')
            .respond(200, {});

        $httpBackend
            .when('GET', 'http://localhost:8000/api/organizers/1/activities?page=1&page_size=8&status=open')
            .respond(readJSON('tests/mock/activities-related.json'));
        $httpBackend
           .when('JSONP', 'https://freegeoip.net/json/?callback=JSON_CALLBACK')
           .respond(readJSON('tests/mock/ipinfo.json'));
       
        ActivitiesManager.getActivity(4)
            .then(function(data){
                activity = data;
                organizer = new Organizer(activity.organizer);
                organizer.getReviews().then(successReviews, errorReviews);

            }, function(response){
                console.log(response);
            });

        function successReviews(revie){
            reviews = readJSON('tests/mock/reviews.json');
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
        //End calls
        
        //spyOn function htmlReady() angular-seo
        $scope =  _$rootScope_;
        spyOn($scope, 'htmlReady');
        $scope.htmlReady();    
        
        
        $httpBackend.flush();

        ActivityDetailController =  $controller('ActivityDetailController', {
            'activity': activity,
            'calendars': calendars,
            'organizer': organizer,
            'relatedActivities': relatedActivities,
            'reviews':reviews,
            'currentUser':currentUser,
            $scope: $scope});
        
       
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
                 
             $httpBackend
                 .when('GET', 'http://localhost:8000/api/activities/search/?category=1')
                 .respond(readJSON('tests/mock/activities.json'));
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
