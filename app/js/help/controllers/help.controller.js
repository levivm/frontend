
/**
 * @ngdoc controller
 * @name trulii.help.controllers
 * @description HelpController
 */

(function () {
    'use strict';

    angular
        .module('trulii.help.controllers')
        .controller('HelpController', HelpController);

    HelpController.$inject = ['$scope', 'serverConf'];

    function HelpController($scope, serverConf) {
        var vm = this;
        angular.extend(vm,{
          getAmazonUrl: getAmazonUrl,
          itemQuestions: [{name: 'Trulii', questions: [{question: 'Pregunta 1', answer: 'Respuesta1', show:true}, {question: 'Pregunta 2',answer: 'Respuesta2', show:false}, {question: 'Pregunta 3', answer: 'Respuesta3', show:false}], showSubs: true},
                      {name: 'Asistentes', questions: [{question: 'Pregunta 1', answer: 'Respuesta1', show:false}, {question: 'Pregunta 2',answer: 'Respuesta2', show:false}, {question: 'Pregunta 3', answer: 'Respuesta3', show:false}], showSubs: false},
                      {name: 'Organizadores', questions: [{question: 'Pregunta 1', answer: 'Respuesta1', show:false}, {question: 'Pregunta 2',answer: 'Respuesta3', show:false}, {question: 'Pregunta 3', answer: 'Respuesta3', show:false}], showSubs: false} ],
          showSubItems: showSubItems,
          showQuestion:showQuestion,
          questionSelected: 'Pregunta 1',
          answerSelected: 'Respuesta1',
          hideSubItems:hideSubItems,
          showSidebar:false,
          toggleSidebar:toggleSidebar
          
        });

        _activate();
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }
        
        function showSubItems(item) {
            item.showSubs = !item.showSubs;
        }
        
        function toggleSidebar() {
            vm.showSidebar = !vm.showSidebar;
        }
        function showQuestion(questions, question) {
            _unactiveQuestion(questions);
            vm.questionSelected = question.question; 
            vm.answerSelected = question.answer;
            question.show=true;
        }
        
        function hideSubItems(name) {
            angular.forEach(vm.itemQuestions, function(item, index){
                if(item.name!==name){
                   item.showSubs = false;  
                   _unactiveQuestion(item.questions);
                }
            });    
        }
        //--------- Functions Implementation ---------//
        function _unactiveQuestion(questions) {
           angular.forEach(questions, function(question, index){
                question.show = false;
            });     
        }
        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                HELP_MORE: '¿Más ayudad?',
                CONTACT_ACTION: 'Contáctanos'
            });
        }
        
        

        function _activate(){
            _setStrings();
            //Function for angularSeo
            $scope.htmlReady();
        }

    }
})();
