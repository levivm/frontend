xdescribe('Controller: ActivityCalendarController', function(){
    var ActivityCalendarController,
        ActivitiesManager,
        rootScope,
        activity='',
        organizer='',
        calendar,
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
           .when('JSONP', 'https://freegeoip.net/json/?callback=JSON_CALLBACK')
           .respond(readJSON('tests/mock/ipinfo.json'));

        ActivitiesManager.getActivity(4)
            .then(function(data){
                activity = new Activity(data);
                var organizerObj = new Organizer(activity.organizer);

            }, function(response){
                console.log(response);
            });
            
        CalendarsManager.getCalendar(null, 4)
            .then(function(data){
                  console.log(data)
                  calendar = data;

            }, function(response){
                console.log(response);
            });
                




       
        currentUser = readJSON('tests/mock/currentUser.json');
        //End calls
        $httpBackend.flush();

        ActivityCalendarController =  $controller('ActivityCalendarController', {
            'activity': activity,
            'organizer': organizer,
            'calendar': calendar,
            '$scope': $scope});



    }));

    describe("Initializacion", function(){
        it('should have controller defined and strings is object defined', function() {
            expect(ActivityCalendarController).toBeDefined();
            expect(ActivityCalendarController.strings).toBeDefined();
         });
         
        
    });
     describe("Create Calendar", function(){
        var template, element, regForm;
        beforeEach(inject(function ($templateCache, $compile) {
           template = '<form  id="activity_calendar_form" name="calendar.activity_calendar_form" ng-submit="calendar.save_calendar()" novalidate></form>';
           element = angular.element(template);
           $compile(element)($scope);

       }));
        it('should successfully create', function() {
            CalendarsManager.calendars['4'] = [];
            ActivityCalendarController.isSaving = true;
            ActivityCalendarController.activity_calendar_form = $scope.calendar.activity_calendar_form;
            ActivityCalendarController.calendar = calendar;
            ActivityCalendarController.save_calendar();
            $httpBackend
                 .when('POST', 'http://localhost:8000/api/activities/4/calendars')
                 .respond(readJSON('tests/mock/calendar_sessions.json'));
            $scope.calendar.calendar = readJSON('tests/mock/calendar_sessions.json');
            $httpBackend.flush();
            expect(ActivityCalendarController.isSaving).toBe(false);
         });
    });


    




})