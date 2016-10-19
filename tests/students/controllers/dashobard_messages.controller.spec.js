describe('Controller: StudentMessagesCtrl', function(){
    var StudentMessagesCtrl,
        $scope = {};

    beforeEach(function(){
        module('templates', 'trulii');
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            Authentication = $injector.get('Authentication');
            $compile = $injector.get('$compile');
            Student = $injector.get('Student');
         })
    });
    beforeEach(inject(function($controller, _$rootScope_, $http, $httpBackend) {
        var stateParams = {
            'toState' : {
                'state' : 'home',
                'params' : {}
            }
        }
        var template, element, regForm, student, cities, messages, orders, activityList;


        $httpBackend
            .when('GET', 'http://localhost:8000/api/activities/featured')
            .respond(readJSON('tests/mock/activities.json'));
            
        $httpBackend
             .when('GET', 'http://localhost:8000/api/organizers/featured')
             .respond(readJSON('tests/mock/organizersFeatured.json'));
        
        $httpBackend
            .when('GET', 'http://localhost:8000/api/locations/cities/')
            .respond(readJSON('tests/mock/cities.json'));

        $httpBackend
            .when('GET', 'http://localhost:8000/api/activities/info')
            .respond(readJSON('tests/mock/generalinfo.json'));
        $httpBackend
            .when('JSONP', 'https://freegeoip.net/json/?callback=JSON_CALLBACK')
            .respond(readJSON('tests/mock/ipinfo.json'));
        $httpBackend
            .when('GET', 'http://localhost:8000/api/students/4/orders/?page=1&pageSize=10')
            .respond(readJSON('tests/mock/orders.json'));
        $httpBackend
            .when('GET', 'http://localhost:8000/api/users/current/')
            .respond(readJSON('tests/mock/currentUser.json'));
            
        $httpBackend
            .when('GET', 'http://localhost:8000/api/messages/?page=1&page_size=10')
            .respond(readJSON('tests/mock/messages.json'));
        $scope =  _$rootScope_;
        

        student = new Student(readJSON('tests/mock/currentUser.json'));
        cities = readJSON('tests/mock/cities.json');
        messages = [];
       
        student.getMessages().then(function (data) {
            console.log(data);
            messages = data;
        }, function (err) {
            console.log(err);
        })
        
         $httpBackend.flush();
        
        orders = readJSON('tests/mock/orders.json');
        StudentMessagesCtrl =  $controller('StudentMessagesCtrl', { 
                                            'student': student, 
                                            'cities': cities, 
                                            'messages': messages, 
                                            'orders': orders, 
                                             '$stateParams':stateParams});
    }));

    describe("Initializacion ", function(){
        it('should have controller defined and strings is object defined', function() {
           
            console.log(StudentMessagesCtrl);
            expect(StudentMessagesCtrl).toBeDefined();
            expect(StudentMessagesCtrl.strings).toBeDefined();
         });
          it('should have be array messages length to equal 1', function() {
            expect(StudentMessagesCtrl.messages.length).toEqual(1);
         });
    });
    
})
