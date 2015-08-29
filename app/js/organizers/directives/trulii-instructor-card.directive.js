/**
 * @ngdoc directive
 * @name trulii.organizers.directives.truliiInstructorCard
 * @restrict E
 * @description Trulii Instructor Card Directive.
 * @param {object} instructor Instructor instance to represent
 * @param {object} activity Activity instance
 * @param {object} organizer Organizer instance
 * @param {boolean} onDashboard Indicates wheter the card is on the organizer dashboard or elsewhere
 */

(function (){
    'use strict';

    angular.module('trulii.organizers.directives')

        .directive('truliiInstructorCard', truliiInstructorCard);

    truliiInstructorCard.$inject = ['$modal', 'Toast', 'OrganizersTemplatesPath'];

    function truliiInstructorCard($modal, Toast, OrganizersTemplatesPath){
        return {
            restrict: 'E',
            templateUrl: OrganizersTemplatesPath + "instructor_card.html",
            scope: {
                'instructor': '=',
                'activity': '=',
                'organizer': '=',
                'onDashboard': '@?'
            },
            link: function(scope, element, attrs){

                angular.extend(scope, {
                    editMode : false,
                    onDashboard : !!attrs.onDashboard,
                    addInstructor: addInstructor,
                    deleteInstructor: deleteInstructor,
                    cancelEdition: cancelEdition,
                    toggleEditMode : toggleEditMode,
                    saveInstructor: saveInstructor,
                    emptyInstructor: true,
                    cardHeight: '32em'
                });

                _activate();

                //--------- Exposed Functions ---------//

                function addInstructor(){
                    toggleEditMode();
                    scope.emptyInstructor = false;
                }

                function cancelEdition(){
                    toggleEditMode();
                    scope.emptyInstructor = !_isValid();
                }

                function toggleEditMode(){
                    scope.editMode = !scope.editMode;
                }

                function saveInstructor(){
                    var instructor = scope.instructor;
                    if(instructor.full_name && instructor.bio){
                        toggleEditMode();
                        // TODO guardar en activity
                    } else {
                        Toast.setPosition("toast-top-center");
                        Toast.error(scope.strings.MSG_MISSING_REQUIRED_FIELDS);
                    }
                }

                 function deleteInstructor() {
                     var modalInstance = $modal.open({
                         templateUrl : OrganizersTemplatesPath + 'messages/confirm_delete_instructor.html',
                         controller : 'ModalInstanceCtrl',
                         size : 'lg'
                     });
                     modalInstance.result.then(function () {
                         scope.organizer.deleteInstructor(scope.instructor.id)
                             .then(success, error);
                     });

                     function success(response) {
                         _.remove(scope.activity.instructors, 'id', scope.instructor.id);
                         _onSectionUpdated();
                         Toast.generics.info("El instructor se ha eliminado.");
                     }

                     function error(response) {
                         Toast.error(scope.strings.MSG_DELETE_ERROR);
                     }
                 }

                //--------- Internal Functions ---------//

                function _isValid(){
                    return scope.instructor.full_name && scope.instructor.bio;
                }

                function _onSectionUpdated() {
                    scope.activity.updateSection('instructors');
                }

                function _setStrings(){
                    if(!scope.strings){ scope.strings = {}; }
                    angular.extend(scope.strings, {
                        ACTION_SAVE: "Guardar",
                        ACTION_CANCEL: "Cancelar",
                        ACTION_EDIT: "Editar Instructor",
                        ACTION_DELETE: "Eliminar Instructor",
                        LABEL_FULL_NAME: "Nombre Completo",
                        PLACEHOLDER_FULL_NAME: "Ingrese nombre de instructor",
                        LABEL_WEBSITE: "Website",
                        LABEL_OPTIONAL: " (Opcional)",
                        PLACEHOLDER_WEBSITE: "Ingrese URL de website",
                        LABEL_BIO: "Bio",
                        PLACEHOLDER_BIO: "Escriba una biografía corta del de instructor",
                        MSG_MISSING_REQUIRED_FIELDS : "Por favor asegurese de verificar todos los campos obligatorios" +
                            " para la creación del instructor",
                        MSG_DELETE_SUCCESS: "Instructor eliminado exitosamente.",
                        MSG_DELETE_ERROR: "Error eliminando el instructor. Por favor intente de nuevo."
                    });
                }

                function _activate(){
                    _setStrings();
                    if(_isValid()){
                        scope.emptyInstructor = false;
                    }
                    console.group('trulii-instructor-card:', scope.instructor.full_name);
                    console.log('instructor:', scope.instructor);
                    console.log('activity:', scope.activity);
                    console.log('organizer:', scope.organizer);
                    console.log('onDashboard:', scope.onDashboard);
                    console.groupEnd();
                }
            }
        }
    }

})();