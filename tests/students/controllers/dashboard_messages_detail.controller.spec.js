describe('Controller: StudentMessageDetailCtrl', function(){
    var StudentMessageDetailCtrl,
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
        var template, element, regForm, student, cities, message, orders, activityList;


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
            .when('GET', 'http://localhost:8000/api/messages/3')
            .respond(readJSON('tests/mock/message.json'));
        $scope =  _$rootScope_;
        

        student = new Student(readJSON('tests/mock/currentUser.json'));
        cities = readJSON('tests/mock/cities.json');
       
        student.getMessage(3).then(function (data) {
            console.log(data);
            message = data;
        }, function (err) {
            console.log(err);
        })
        
         $httpBackend.flush();
        
        orders = readJSON('tests/mock/orders.json');
        StudentMessageDetailCtrl =  $controller('StudentMessageDetailCtrl', { 
                                            'student': student, 
                                            'cities': cities, 
                                            'message': message, 
                                            'orders': orders, 
                                            '$stateParams':stateParams});
    }));

    describe("Initializacion ", function(){
        it('should have controller defined and strings is object defined', function() {
           
            console.log(StudentMessageDetailCtrl);
            expect(StudentMessageDetailCtrl).toBeDefined();
            expect(StudentMessageDetailCtrl.strings).toBeDefined();
         });
    });
     describe("Read Message", function(){
        it('should init message is read equal true', function() {
           $httpBackend
            .when('PUT', 'http://localhost:8000/api/messages/3/read/')
            .respond(readJSON('tests/mock/message.json'));
             $httpBackend.flush();
             expect(StudentMessageDetailCtrl.message.is_read).toBe(true);
         });
    });
})
