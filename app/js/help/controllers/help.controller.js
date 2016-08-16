
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
        
        var truliiQ1= '¿Como cobrar una comisión?';
        var truliiA1 = 'Trulii es el primer marketplace local de actividades educativas que realmente conecta a personas que quieren enseñar con las que quieren aprender. Suena fácil, pero es un reto. Y muy bonito, por cierto. Trabajamos fuerte para brindarte una plataforma amigable e intuitiva que te permita encontrar todo lo que quieras aprender en tu ciudad y pagar la inscripción de forma fácil, rápida y segura.'
        
        angular.extend(vm,{
          getAmazonUrl: getAmazonUrl,
          itemQuestions: [{name: 'Trulii', questions: [{question: truliiQ1, answer: truliiA1, show:true}, {question: truliiQ1,answer: truliiA1, show:false}, {question: truliiQ1, answer: truliiA1, show:false}], showSubs: true},
                      {name: 'Asistentes', questions: [{question: truliiQ1, answer: truliiA1, show:false}, {question: truliiQ1,answer: truliiA1, show:false}, {question: truliiQ1, answer: truliiA1, show:false}], showSubs: false},
                      {name: 'Organizadores', questions: [{question: truliiQ1, answer: truliiA1, show:false}, {question: truliiQ1,answer: truliiA1, show:false}, {question: truliiQ1, answer: truliiA1, show:false}], showSubs: false} ],
          showSubItems: showSubItems,
          showQuestion:showQuestion,
          questionSelected: truliiQ1,
          answerSelected: truliiA1,
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
