describe('Controller: ActivityDetailEnrollController', function(){
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
        deviceSessionId,
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
            Resolves for detail.enroll.controller
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
            .when('GET', 'http://localhost:8000/api/organizers/1/reviews?page=1&page_size=5&status=')
            .respond(readJSON('tests/mock/reviews.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/activities/4/calendars')
            .respond(readJSON('tests/mock/calendars.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/organizers/1/activities?page=1&page_size=12&status=open')
            .respond(readJSON('tests/mock/activities-related.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/activities/4/calendars/13')
            .respond(readJSON('tests/mock/calendar.json'));


        ActivitiesManager.getActivity(4)
            .then(function(data){
                activity = data;
                var organizerObj = new Organizer(activity.organizer);
                organizerObj.getReviews().then(function(reviews){
                    console.log(reviews);
                }, function(err){
                    console.log(err);
                });

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
        deviceSessionId = '5b2254392d68048b4ae0e54a12b1c44b';
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
            'isActive': isActive,
            'deviceSessionId':deviceSessionId,
            $scope: scope
            });


        rootScope = $rootScope;

    }));

    describe("Initializacion", function(){
        it('should have controller defined and strings is object defined', function() {
            expect(ActivityDetailEnrollController).toBeDefined();
            expect(ActivityDetailEnrollController.strings).toBeDefined();
         });
    });

    describe("Cupon Apply", function(){
        it('cupon empty', function() {
            ActivityDetailEnrollController.applyCoupon();
            expect(ActivityDetailEnrollController.coupon.code).toBeUndefined();
         });

         it('wrong cupon', function() {
             ActivityDetailEnrollController.coupon.code = '2233233223'
             ActivityDetailEnrollController.applyCoupon();
             $httpBackend
                 .when('GET', 'http://localhost:8000/api/referrals/coupons/'+ActivityDetailEnrollController.coupon.code+'/')
                 .respond(404, '');
            $httpBackend.flush();
            expect(ActivityDetailEnrollController.invalidCoupon).toBe(true);

          });
    });



})
