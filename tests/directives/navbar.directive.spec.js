describe('Directive: truliiNavbar', function(){
    var $rootScope,
        $scope,
        $compile,
        el,
        $el,
        $httpBackend,
        simpleHtml='<trulii-navbar></trulii-navbar>';

    beforeEach(function(){
        module('templates', 'trulii');
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $scope = $rootScope.$new();
            el = $compile(angular.element(simpleHtml))($scope);
        });

        $httpBackend
             .when('GET', 'http://localhost:8000/api/activities/search/?city=1&o=score&page_size=8')
             .respond(readJSON('tests/mock/activities.json'));

        $httpBackend
             .when('GET', 'http://localhost:8000/api/activities/info')
             .respond(readJSON('tests/mock/generalinfo.json'));

        $httpBackend
             .when('GET', 'http://localhost:8000/api/locations/cities/')
             .respond(readJSON('tests/mock/cities.json'));
        $scope.$digest();
    });

    it('render navbar ', function(){
        expect(el.length).toBe(1);

    })
    it('should menu burguer is false ', function(){
        expect($scope.showBurger).toBe(false);

    })
});
