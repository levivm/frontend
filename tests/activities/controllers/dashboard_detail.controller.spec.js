describe('Controller: ActivityDBDetailController', function(){
    var ActivityDBDetailController,
        ActivitiesManager,
        rootScope,
        activity='',
        organizer='',
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
             .when('GET', 'http://localhost:8000/api/activities/featured')
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
            .respond(readJSON('tests/mock/calendars_close.json'));

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




        ActivitiesManager.loadGeneralInfo()
              .then(function(data){
                  presaveInfo=data;
              }, function(response){
                  console.log(response);
              })
        currentUser = readJSON('tests/mock/currentUser.json');
        //End calls
        $httpBackend.flush();

        ActivityDBDetailController =  $controller('ActivityDBDetailController', {
            'activity': activity,
            'organizer': organizer,
            'presaveInfo': presaveInfo,
            'isOwner':true});



    }));

    describe("Initializacion", function(){
        it('should have controller defined and strings is object defined', function() {
            expect(ActivityDBDetailController).toBeDefined();
            expect(ActivityDBDetailController.strings).toBeDefined();
         });
    });

    describe("Update", function(){
        var template, element, regForm;
        beforeEach(inject(function ($templateCache, $compile) {
           template = '<form name="vm.activity_detail_form" ng-submit="vm.save_activity()"></form>'
           element = angular.element(template);
           $compile(element)($scope);

       }));
        it('should successfully update', function() {
            ActivityDBDetailController.isSaving  = true;
            ActivityDBDetailController.activity_detail_form = $scope.vm.activity_detail_form;
            ActivityDBDetailController.save_activity();
            $httpBackend
                 .when('PUT', 'http://localhost:8000/api/activities/4')
                 .respond(readJSON('tests/mock/activity.json'));

            $httpBackend.flush();
            expect(ActivityDBDetailController.isSaving).toBe(false);
         });
         
         it('_onSectionUpdated detail is true', function() {
            expect(ActivityDBDetailController.activity.completed_steps['detail']).toBe(true);
         });
    });





})
