describe('Controller: StudentHistoryCtrl', function(){
    var StudentHistoryCtrl,
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
        $scope =  _$rootScope_;
        

        student = new Student(readJSON('tests/mock/currentUser.json'));
        cities = readJSON('tests/mock/cities.json');
        messages = [];
        $httpBackend.flush();
        student.getOrders().then(function (data) {
            orders = data;
        }, function (err) {
            console.log(err);
        })
        orders = readJSON('tests/mock/orders.json');
        StudentHistoryCtrl =  $controller('StudentHistoryCtrl', { 
                                          'student': student, 
                                          'cities': cities, 
                                          'messages': messages, 
                                          'orders': orders, 
                                          'activityList': activityList, 
                                          $stateParams:stateParams});
    }));

    describe("Initializacion ", function(){
        it('should have controller defined and strings is object defined', function() {
           
            console.log(StudentHistoryCtrl);
            expect(StudentHistoryCtrl).toBeDefined();
            expect(StudentHistoryCtrl.strings).toBeDefined();
         });
    });
    
    describe("Filter ", function(){
        it('should filter by query, is successfully', function() {
            StudentHistoryCtrl.ordersFilter.activity = 9;
            StudentHistoryCtrl.updateByQuery('order');
            console.log(StudentHistoryCtrl);
            $httpBackend
                .when('GET', 'http://localhost:8000/api/students/4/orders/?activity=9&page=1&pageSize=10')
                .respond(readJSON('tests/mock/orders.json'));
            $httpBackend.flush();
            expect(StudentHistoryCtrl.search).toBe(true);
         });
    });

})
