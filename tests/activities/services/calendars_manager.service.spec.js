describe('Factory: CalendarsManager', function(){
    var service, httpBackend, topics;
    var rootScope;
    beforeEach(function(){
        module('trulii');
        inject(function ($injector) {
            httpBackend = $injector.get('$httpBackend');
            CalendarsManager = $injector.get('CalendarsManager');
        });
    });
    beforeEach(inject(function($rootScope) {
        rootScope = $rootScope.$new();
        
        httpBackend
            .when('GET', 'http://localhost:8000/api/activities/featured')
            .respond(readJSON('tests/mock/activities.json'));
            
        httpBackend
             .when('GET', 'http://localhost:8000/api/organizers/featured')
             .respond(readJSON('tests/mock/organizersFeatured.json'));
             
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
           expect(CalendarsManager).toBeDefined();
         });
    });
    
    describe("GET Calendar", function(){ 
        it('successfull getCalendar', inject(function($rootScope) {
           var calendar; 
           CalendarsManager.getCalendar(13, 4).then(function(data){
              calendar = data;
           });
           $rootScope.$apply();
           expect(calendar.activity).toEqual(4);
         }));
    });
    
    describe("SET AND DELETE", function(){ 
        it('successfull setData and deleteCalendar', inject(function($rootScope, Calendar, $httpBackend) {
            var calendar, calendars, calendarsData;
            
            calendar = readJSON('tests/mock/calendar_close.json');
            CalendarsManager.calendars['4'] = readJSON('tests/mock/calendars_close.json'); 
            calendar = new Calendar(calendar);
            calendar = CalendarsManager.setCalendar(calendar);
            
            $httpBackend
                .when('DELETE', 'http://localhost:8000/api/activities/4/calendars/67')
                .respond(200, {});
                
                    
            CalendarsManager.deleteCalendar(calendar).then(function(data){
                calendarsData = data;
            });
            
            $httpBackend.flush();
            expect(calendarsData.length).toEqual(3);
         }));
    });
    
    describe("LOAD CALENDARS", function(){ 
        it('successfull load calendas is 4', function() {
            var calendars;
            httpBackend
                .when('GET', 'http://localhost:8000/api/activities/4/calendars')
                .respond(readJSON('tests/mock/calendars_close.json'));
            CalendarsManager.loadCalendars(4).then(function(data){
                calendars = data;
            });   
            
            httpBackend.flush(); 
            
            expect(calendars.length).toEqual(4);
        });
    });
    
  
    
})
