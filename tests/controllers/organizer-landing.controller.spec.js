describe('Controller: OrganizerLandingCtrl', function(){
    var OrganizerLandingCtrl,
        generalInfo,
        ActivitiesManager,
        rootScope,
        apiActivities,
        cities,
        $httpBackend,
        $scope = {};

    beforeEach(function(){
        module('trulii');
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            ActivitiesManager = $injector.get('ActivitiesManager');
            apiActivities = $injector.get('ActivityServerApi');
         })

    });
    beforeEach(inject(function($controller, _$rootScope_, $http, $httpBackend) {



        $httpBackend
             .when('GET', 'http://localhost:8000/api/activities/info')
             .respond(readJSON('tests/mock/generalinfo.json'));

         $httpBackend
              .when('GET', 'http://localhost:8000/api/locations/cities/')
              .respond(readJSON('tests/mock/cities.json'));
              cities = readJSON('tests/mock/cities.json');


          $httpBackend
             .when('GET', 'http://localhost:8000/api/activities/search/?city=1&o=score&page_size=8')
             .respond(readJSON('tests/mock/activities.json'));
         $httpBackend
            .when('JSONP', 'http://ipinfo.io/?callback=JSON_CALLBACK')
            .respond(readJSON('tests/mock/ipinfo.json'));






        $scope =  _$rootScope_;
        $httpBackend.flush();

        //End calls


        OrganizerLandingCtrl =  $controller('OrganizerLandingCtrl', {'cities': cities});

    }));

    describe("Initializacion", function(){
        it('should have controller defined and strings is object defined', function() {
            expect(OrganizerLandingCtrl).toBeDefined();
            expect(OrganizerLandingCtrl.strings).toBeDefined()
         });
    });
    describe("Organizer", function(){
        var template, element, regForm;
        beforeEach(inject(function ($templateCache, $compile) {
           template = '<form name="landing.pre_signup_form" id="organizer_signup_form" ng-submit="landing.requestSignup()"></form>'
           element = angular.element(template);
           $compile(element)($scope);

       }));
        it('form request signup sent', function() {
            OrganizerLandingCtrl.request = {
                city: 1,
                document: "1234",
                document_type: "nit",
                email: "jjj@jjj.com",
                name: "Jose",
                telephone: "12345678"
            }
            OrganizerLandingCtrl.pre_signup_form = $scope.landing.pre_signup_form;
            OrganizerLandingCtrl.requestSignup();

            $httpBackend
                .when('POST', 'http://localhost:8000/api/users/request/signup/')
                .respond(readJSON('tests/mock/requestOrg.json'));

            $httpBackend.flush();

            expect(OrganizerLandingCtrl.sent).toBe(true)
         });
    });


})
