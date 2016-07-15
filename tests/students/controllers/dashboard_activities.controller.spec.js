xdescribe('Controller: StudentActivitiesCtrl', function(){
    var StudentActivitiesCtrl,
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
        var template, element, regForm, student, cities, reviews, orders, activityList, currentActivities, nextActivities, pastActivities;


        $httpBackend
            .when('GET', 'http://localhost:8000/api/activities/search/?city=1&o=score&page_size=8')
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
        reviews = [];
        $httpBackend.flush();
        student.getOrders().then(function (data) {
            orders = data;
        }, function (err) {
            console.log(err);
        })
        currentActivities = readJSON('tests/mock/activities.json');
        nextActivities = readJSON('tests/mock/activities.json');
        pastActivities = readJSON('tests/mock/activities.json');
        
        
        orders = readJSON('tests/mock/orders.json');
        StudentActivitiesCtrl =  $controller('StudentActivitiesCtrl', { 
                                            'student': student, 
                                            'cities': cities, 
                                            'reviews': reviews, 
                                            'orders': orders, 
                                            'currentActivities':currentActivities,
                                            'nextActivities': nextActivities,
                                            'pastActivities': pastActivities,
                                             '$stateParams':stateParams});
    }));

    describe("Initializacion ", function(){
        it('should have controller defined and strings is object defined', function() {
           
            console.log(StudentActivitiesCtrl);
            expect(StudentActivitiesCtrl).toBeDefined();
            expect(StudentActivitiesCtrl.strings).toBeDefined();
         });
    });
    
})
