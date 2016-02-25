describe('Factory: Contact', function(){
    var service, httpBackend, topics;
    var rootScope;
    beforeEach(function(){
        module('trulii');
        inject(function ($injector) {
            httpBackend = $injector.get('$httpBackend');
            service = $injector.get('Contact');
        });
    });
    beforeEach(inject(function($rootScope) {
        rootScope = $rootScope.$new();
    }));

    describe("Initializacion", function(){
        it('service defined', function() {
           expect(service).toBeDefined();
         });

         it('Should getTopics lenght 4', function() {
            var topicData = readJSON('tests/mock/topics.json');
            httpBackend
               .when('GET', 'http://localhost:8000/api/contact-us/')
               .respond(topicData);

            service.getTopics().then(function(data){
                 topics = data;
             }, function(response){
                 console.log(response);
             });

             httpBackend
                  .when('GET', 'http://localhost:8000/api/activities/search/?city=1&o=score&page_size=8')
                  .respond(readJSON('tests/mock/activities.json'));

             httpBackend
                  .when('GET', 'http://localhost:8000/api/activities/info')
                  .respond(readJSON('tests/mock/generalinfo.json'));

             httpBackend
                  .when('GET', 'http://localhost:8000/api/locations/cities/')
                  .respond(readJSON('tests/mock/cities.json'));

             httpBackend.flush();

             expect(topics.length).toBe(4);
        });
    });
})
