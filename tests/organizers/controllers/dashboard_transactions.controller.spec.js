describe('Controller: OrganizerTransactionsCtrl', function(){
    var OrganizerTransactionsCtrl,
        $scope = {};

    beforeEach(function(){
        module('templates', 'trulii');
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            Authentication = $injector.get('Authentication');
            $compile = $injector.get('$compile');
            Organizer = $injector.get('Organizer');
            Payments = $injector.get('Payments');
         })
    });
    beforeEach(inject(function($controller, _$rootScope_, $http, $httpBackend) {
        var stateParams = {
            'toState' : {
                'state' : 'home',
                'params' : {}
            }
        }
        var template, element, regForm, organizer, cities, orders, balances, withdraws, activities;


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
            .when('GET', 'http://localhost:8000/api/organizers/4/orders?page=1&pageSize=10')
            .respond(readJSON('tests/mock/orders.json'));
        $httpBackend
            .when('GET', 'http://localhost:8000/api/users/current/')
            .respond(readJSON('tests/mock/currentOrgUser.json'));
        $httpBackend
            .when('GET', 'http://localhost:8000/api/bankinfo/choices/')
            .respond(readJSON('tests/mock/banksInfo.json'));
        $httpBackend
            .when('GET', 'http://localhost:8000/api/organizers/bankinfo/')
            .respond(readJSON('tests/mock/bankingData.json'));
        $httpBackend
            .when('GET', 'http://localhost:8000/api/users/current/')
            .respond(readJSON('tests/mock/currentOrgUser.json'));
            
        $httpBackend
            .when('GET', 'http://localhost:8000/api/balances/withdraw/?page=1&page_size=5')
            .respond(readJSON('tests/mock/withdraws.json'));
        $httpBackend
            .when('GET', 'http://localhost:8000/api/balances/balance/')
            .respond(readJSON('tests/mock/balance.json'));
                
        $scope =  _$rootScope_;
        
        Payments.getBankingInfo().then(function (data) {
            bankingInfo = data;
            
        })
        organizer = new Organizer(readJSON('tests/mock/currentOrgUser.json'));
        cities = readJSON('tests/mock/cities.json');
        
        organizer.getBankingInfo().then(function (data) {
            bankingData = data;
        })
        
        organizer.getOrders().then(function (data) {
            orders = data;
        });
        organizer.getBalances().then(function (data) {
            balances = data;
        });
        
        organizer.getWithDraw().then(function (data) {
            withdraws = data;
        });
        $httpBackend.flush();


        OrganizerTransactionsCtrl =  $controller('OrganizerTransactionsCtrl', { 
                                                 'organizer': organizer, 
                                                 'bankingInfo': bankingInfo, 
                                                 'bankingData': bankingData, 
                                                 'orders': orders, 
                                                 'balances': balances, 
                                                 'withdraws': withdraws,
                                                 'activities': activities});
    }));

    describe("Initializacion ", function(){
        it('should have controller defined and strings is object defined', function() {
            console.log(OrganizerTransactionsCtrl);
            expect(OrganizerTransactionsCtrl).toBeDefined();
            expect(OrganizerTransactionsCtrl.strings).toBeDefined();
         });
         
         it('should orders length 10', function() {
            console.log(OrganizerTransactionsCtrl);
            expect(OrganizerTransactionsCtrl.sales.length).toEqual(10);
         });
         
         it('should withdrawals length equal to 1', function() {
            console.log(OrganizerTransactionsCtrl);
            expect(OrganizerTransactionsCtrl.withdrawals.length).toEqual(1);
         });
    });

    describe("Get WithDrawals ", function(){
        it('should succes WithDrawals', function() {
            //OrganizerTransactionsCtrl.withDraw();
             $httpBackend
                .when('POST', 'http://localhost:8000/api/balances/withdraw/')
                .respond(readJSON('tests/mock/responseWithDraw.json'));
            OrganizerTransactionsCtrl.organizer.postWithDraw().then(function (data) {
               expect(data.status).toEqual('pending');
            });
            $httpBackend.flush();

         });
         
    });


})
