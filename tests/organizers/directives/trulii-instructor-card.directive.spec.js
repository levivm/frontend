describe('Directive: truliiInstructorCard', function(){
    var $rootScope,
        $scope,
        $compile,
        el,
        $el,
        $httpBackend,
        simpleHtml='<trulii-instructor-card instructor="instructor" activity="activity"'+
                                                'organizer="organizer" on-change="updateActivity()"'+
                                                'available-instructors="availableInstructors"></trulii-instructor-card>';
        /**
         * Directive implementada en dashobard activity edit
         */
    beforeEach(function(){
        module('templates', 'trulii');
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            Organizer = $injector.get('Organizer');
            Activity = $injector.get('Activity');
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $scope = $rootScope.$new();
            $scope.instructor = {
                'full_name': null,
                'website': null,
                'bio': null
            }
            $scope.activity = new Activity(readJSON('tests/mock/activity.json'));
            $scope.onChange = jasmine.createSpy('onChange');
            $scope.organizer = new Organizer($scope.activity.organizer);
            el = $compile(angular.element(simpleHtml))($scope);
        });
       
        $httpBackend
            .when('GET', 'http://localhost:8000/api/locations/cities/')
            .respond(readJSON('tests/mock/cities.json'));


        
        $scope.$digest();
    });
    describe("Initializacion", function(){
        it('render card instructor ', function(){
            expect(el.length).toBe(1);
        })
    });
    
    describe("Create", function(){
        it('Should successfully create instructor ', function(){
            $scope.instructor = {
                'full_name': 'Henry Bravo',
                'bio': 'Web developer'
            }
            var isolatedScope = el.isolateScope();
            isolatedScope.instructorEditable =  $scope.instructor;
            isolatedScope.saveInstructor();
            $httpBackend
                .when('POST', 'http://localhost:8000/api/activities/4/instructors')
                .respond(readJSON('tests/mock/instructors_response.json'));
            $httpBackend
                .when('GET', 'http://localhost:8000/api/activities/info')
                .respond(readJSON('tests/mock/generalinfo.json'));
            $httpBackend
                .when('GET', 'http://localhost:8000/api/activities/4')
                .respond(readJSON('tests/mock/activity.json'));
            $httpBackend
                .when('GET', 'http://localhost:8000/api/locations/cities/')
                .respond(readJSON('tests/mock/cities.json'));
                
            $httpBackend
                .when('GET', 'http://localhost:8000/api/activities/featured')
                .respond(readJSON('tests/mock/activities.json'));

            $httpBackend
                .when('GET', 'http://localhost:8000/api/activities/info')
                .respond(readJSON('tests/mock/generalinfo.json'));

            $httpBackend.flush();
            
            expect(isolatedScope.instructor.id).toBe(10);
            
        })
    });

    

});
