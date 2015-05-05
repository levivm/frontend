(function(){
		angular
			.module('trulii.styleguide', ['trulii.ui-components', 'ngAnimate', 'ui.router'])			

			.config(config)

			.controller('CSSTests', CSSTests)
			.controller('DirectivesTests', DirectivesTests);

			function CSSTests($scope, $timeout){

				$scope.lateralFadein = true;
				$scope.lateralFadeout = true;
				$scope.lateralFade = true;

				$scope.delayToggle = function(model){

					$scope[model] = !$scope[model];

					$timeout(function(){
						$scope[model] = !$scope[model];

					}, 1000);					

				}
			}

			function DirectivesTests($scope, $timeout){

				$scope.toggle = false;

				$scope.items = [];

				$scope.addItem = function(){

					$scope.items.push($scope.items.length + 1) ;
				}

				$scope.removeItem = function(i){
					$scope.items.splice(i, 1);
				}


				//// trulii-submit-controls

				$scope.saving = false;

				$scope.save = function(){

					$scope.saving = true;

					$timeout(function(){
						$scope.saving = false;

						$scope.errors = {};
						$scope.errors.response = "Por más que hagas, este campo siempre estará mal";

						$scope.submitTest.response = {};
						$scope.submitTest.response.$invalid = true;
						$scope.submitTest.response.$dirty = false;

					}, 2000)					


				}

				///// trulii-preloader

				$scope.preloader = true;
			}

			config.$inject = ['$stateProvider', '$urlRouterProvider'];

			function config($stateProvider, $urlRouterProvider){

				$stateProvider
					.state('css', {
						url: '/',
						controller: 'CSSTests',
						templateUrl: 'trulii-css.html'

					})
					.state('directives', {
						url: '/directives',
						controller: 'DirectivesTests',
						templateUrl: 'trulii-directives.html'

					})

				$urlRouterProvider.otherwise('/');

			}
	})()