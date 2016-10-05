describe('Factory: ActivitiesManager', function(){
    var service, httpBackend, topics;
    var rootScope;
    beforeEach(function(){
        module('trulii');
        inject(function ($injector) {
            httpBackend = $injector.get('$httpBackend');
            ActivitiesManager = $injector.get('ActivitiesManager');
        });
    });
    beforeEach(inject(function($rootScope) {
        rootScope = $rootScope.$new();
        
        httpBackend
            .when('GET', 'http://localhost:8000/api/activities/featured')
            .respond(readJSON('tests/mock/activities.json'));

        httpBackend
            .when('GET', 'http://localhost:8000/api/activities/info')
            .respond(readJSON('tests/mock/generalinfo.json'));

        httpBackend
            .when('GET', 'http://localhost:8000/api/locations/cities/')
            .respond(readJSON('tests/mock/cities.json'));
        httpBackend
            .when('JSONP', 'https://freegeoip.net/json/?callback=JSON_CALLBACK')
            .respond(readJSON('tests/mock/ipinfo.json'));
        httpBackend.flush();
    }));

    describe("Initializacion", function(){
        it('service defined', function() {
           expect(ActivitiesManager).toBeDefined();
         });
    });
    
    describe("GET", function(){
        it('successfull getActivities', function() {
            var activities;
            httpBackend
                  .when('GET', 'http://localhost:8000/api/activities/')
                  .respond(readJSON('tests/mock/activities.json'));

            ActivitiesManager.getActivities().then(function(data){
                activities = data;
            });
            httpBackend.flush();
            expect(activities.results.length).toEqual(8);
         });
         
         it('successfull getRecommendedActivities', function() {
            var activities;
             httpBackend
                .when('GET', 'http://localhost:8000/api/activities/search/?city=1&o=score&page_size=8')
                .respond(readJSON('tests/mock/activities.json'));
            ActivitiesManager.getRecommendedActivities().then(function(data){
                activities = data;
            });
            httpBackend.flush();
            expect(activities.results.length).toEqual(8);
         });
         it('successfull getCategoryActivities', function() {
            var activities;
             httpBackend
                .when('GET', 'http://localhost:8000/api/activities/search/?category=2')
                .respond(readJSON('tests/mock/activities.json'));
            ActivitiesManager.getCategoryActivities(2).then(function(data){
                activities = data;
            });
            httpBackend.flush();
            expect(activities.results.length).toEqual(8);
         });
         
         it('successfull getStudentActivities', function() {
            var activities;
             httpBackend
                .when('GET', 'http://localhost:8000/api/students/4/activities/?page=1&page_size=8&status=current')
                .respond(readJSON('tests/mock/activities.json'));
            ActivitiesManager.getStudentActivities(4, 'current').then(function(data){
                activities = data;
            });
            httpBackend.flush();
            expect(activities.results.length).toEqual(8);
         });
         
         it('successfull getActivity', function() {
            var activity;
             httpBackend
                .when('GET', 'http://localhost:8000/api/activities/4')
                .respond(readJSON('tests/mock/activity.json'));
            ActivitiesManager.getActivity(4).then(function(data){
                activity = data;
            });
            httpBackend.flush();
            expect(activity.title).toEqual('Curso de Italiana');
         });
         
         it('successfull getOrders', function() {
            var orders;
             httpBackend
                .when('GET', 'http://localhost:8000/api/activities/4/orders')
                .respond(readJSON('tests/mock/orders.json'));
            ActivitiesManager.getOrders(4).then(function(data){
                orders = data;
            });
            httpBackend.flush();
            expect(orders.count).toEqual(128);
         });
         
         it('successfull loadOrganizerActivities', function() {
            var activities;
             httpBackend
                .when('GET', 'http://localhost:8000/api/organizers/4/activities?page=1&page_size=8&status=open')
                .respond(readJSON('tests/mock/activities.json'));
            ActivitiesManager.loadOrganizerActivities(4, 'open').then(function(data){
                activities = data;
            });
            httpBackend.flush();
            expect(activities.results.length).toEqual(8);
         });
    });
    
    describe("POST", function(){
        it('successfull enroll', function() {
            var enroll;
            var dataEnroll = {
                activity: '4',
                calendar: '111',
                amount: '2929392323',
                quantity: '4',
                assistants: '2',
                buyer: 'buyer',
                buyer_pse_data:'buyer_pse_data',
                payment_method: 'Payments.KEY_PSE_PAYMENT_METHOD',

            };
            
            httpBackend
                .when('POST', 'http://localhost:8000/api/activities/4/orders')
                .respond(readJSON('tests/mock/order.json'));
                
            ActivitiesManager.enroll('4', dataEnroll).then(function(data){
                enroll = data;
            });
            httpBackend.flush();
            expect(enroll.id).toEqual(719);
         });
    });
    
    describe("DELETE", function(){
        it('successfull delete activity', function() {
            var deleteData;
            
            httpBackend
                .when('DELETE', 'http://localhost:8000/api/activities/4')
                .respond(200, {});
                
            ActivitiesManager.deleteActivity('4').then(function(data){
                deleteData = data;
            });
            httpBackend.flush();
            expect(deleteData).toEqual({});
         });
    });
    
})
