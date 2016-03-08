xdescribe('Directive: truliiSearchBar', function(){
    var $rootScope,
        $scope,
        $compile,
        el,
        $el,
        $httpBackend,
        simpleHtml='<trulii-search-bar></trulii-search-bar>';

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
    describe("Initializacion", function(){
        it('render search bar ', function(){
            expect(el.length).toBe(1);
        })
    });

    describe("If Search succesfully", function(){
        it('it should search with params', function(){
            $scope.search_city = {
                id: 1,
                name: "Bogotá",
                point:  [
                  4.5980478,
                  -74.0760867
                ]
            }
            $scope.q='chef';
            $scope.search();
        })
    });

});
