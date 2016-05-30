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

    truliiInstructorCard.$inject = ['$modal', 'Toast', 'OrganizersTemplatesPath','ActivitiesTemplatesPath'];

    function truliiInstructorCard($modal, Toast, OrganizersTemplatesPath,ActivitiesTemplatesPath){
        return {
            restrict: 'E',
            templateUrl: OrganizersTemplatesPath + "instructor_card.html",
            scope: {
                'instructor': '=',
                'activity': '=',
                'organizer': '=',
                'availableInstructors':'=',
                'onDashboard': '@?',
                'onChange': '&',
            },
            link: function(scope, element, attrs){

                angular.extend(scope, {
                    editMode : false,
                    onDashboard : !!attrs.onDashboard,
                    selectInstructor: selectInstructor,
                    addInstructor: addInstructor,
                    deleteInstructor: deleteInstructor,
                    cancelEdition: cancelEdition,
                    toggleEditMode : toggleEditMode,
                    toggleMobile:toggleMobile,
                    showBio:false,
                    saveInstructor: saveInstructor,
                    selectedInstructor: null,
                    instructorEditable:null,
                    emptyInstructor: true,
                    showActions: showActions,
                    hideActions: hideActions,
                    actions: false,
                    cardHeight: '25em'
                });

                var EMPTY_INSTRUCTOR = {
                    'full_name': null,
                    'website': null,
                    'bio': null
                };

                var resource = scope.onDashboard? scope.organizer: scope.activity;
                console.log(resource)
                _activate();

                //--------- Exposed Functions ---------//

                function selectInstructor($item, $model, $label){
                    _.remove(scope.availableInstructors, { 'id': $item.id});
                    angular.extend(scope.instructorEditable, $item);
                    console.log('instructorEditable',scope.instructorEditable);
                }

                function addInstructor(){
                    toggleEditMode();
                    scope.emptyInstructor = false;
                }

                function cancelEdition(){
                    console.log('limpiar');
                    scope.instructorEditable.full_name = '';
                    scope.instructorEditable .bio = '';
                }

                function toggleEditMode(){
                    scope.editMode = !scope.editMode;
                    scope.instructorEditable = angular.copy(scope.instructor);
                }
                 function toggleMobile(){
                    scope.showBio = !scope.showBio;
                }
                
                
                function showActions(){
                    scope.actions = true;
                }
                function hideActions(){
                    scope.actions = false;
                }

                function saveInstructor(){
                    var instructor = scope.instructorEditable;
                    console.log(instructor);
                    if(instructor.full_name && instructor.bio){
                        toggleEditMode();
                        if(instructor.id){
                            // Update Instructor
                            // var instructor_data = angular.copy(instructor);
                            resource.updateInstructor(instructor).then(successUpdate, errorUpdate);
                        } else{
                            // Create Instructor
                            resource.createInstructor(instructor).then(successCreate, errorCreate);
                        }

                    } else {
                        Toast.setPosition("toast-top-center");
                        Toast.error(scope.strings.MSG_MISSING_REQUIRED_FIELDS);
                    }

                    function successCreate(instructor){
                        angular.extend(scope.instructor,instructor);
                        resource.load().then(_onChange, updateError);
                        console.log('saveInstructor. Instructor created.', instructor);
                    }

                    function errorCreate(response){
                        console.log('saveInstructor. Error creating Instructor.', response);
                    }

                    function successUpdate(instructor){
                        angular.extend(scope.instructor,instructor);
                        resource.load().then(_onChange, updateError);
                        console.log('saveInstructor. Instructor updated.', instructor);
                    }

                    function errorUpdate(response){
                        console.log('saveInstructor. Error updating Instructor.', response);
                    }
                }

                 function deleteInstructor() {


                    var templateUrl = scope.onDashboard ? OrganizersTemplatesPath + 'messages/confirm_delete_instructor.html':
                                                          ActivitiesTemplatesPath + 'messages/remove_activity_instructor.html';

                    var modalInstance = $modal.open({
                         templateUrl : templateUrl,
                         controller : 'ModalInstanceCtrl',
                         controllerAs:"modal",
                         size : 'lg'
                     });
                     modalInstance.result.then(function () {
                         if(scope.instructor.id){
                             resource.deleteInstructor(scope.instructor).then(success, error);
                         } else {
                             _removeInstructor();
                             _onChange();
                         }
                     });

                    function success(response) {
                         _.remove(resource.instructors, 'id', scope.instructor.id);
                         if (!scope.onDashboard)
                            _pushAutocompleteInstructor(scope.instructor.id);
                         _removeInstructor();
                         resource.load().then(updateSuccess, updateError);
                         Toast.info(scope.strings.MSG_DELETE_SUCCESS);
                     }

                     function error(response) {
                         Toast.error(scope.strings.MSG_DELETE_ERROR);
                     }
                 }

                //--------- Internal Functions ---------//

                function _pushAutocompleteInstructor(instructor_id){
                    scope.availableInstructors.
                        push(_.find(scope.organizer.instructors,{'id':instructor_id}));
                }

                function _removeInstructor(){
                    scope.instructor= EMPTY_INSTRUCTOR;
                    scope.emptyInstructor = true;
                }

                function _setAvailableInstructors(){

                    if(scope.onDashboard)
                        return;

                    scope.availableInstructors = _.filter(scope.availableInstructors,
                                function(instructor){ return !_.findWhere(resource.instructors,
                                    instructor); });
                }

                function _isValid(){
                    return scope.instructor.full_name && scope.instructor.bio;
                }

                function updateSuccess(){
                    _onChange();
                }
                function updateError(){
                    _onChange();
                }

                function _onChange(){
                    if(scope.onChange) scope.onChange();

                    if(!scope.onDashboard){
                        scope.activity.updateSection('instructors');
                    }
                }

                function _setStrings(){
                    if(!scope.strings){ scope.strings = {}; }
                    angular.extend(scope.strings, {
                        ACTION_SAVE: "Guardar",
                        ACTION_CANCEL: "Limpiar",
                        ACTION_EDIT: "Editar Instructor",
                        ACTION_DELETE: "Eliminar Instructor",
                        LABEL_FULL_NAME: "Nombre Completo",
                        PLACEHOLDER_FULL_NAME: "Ingrese nombre de instructor",
                        LABEL_HEADER: "Instructor:",
                        LABEL_WEBSITE: "Website",
                        LABEL_OPTIONAL: " (Opcional)",
                        PLACEHOLDER_WEBSITE: "Ingrese URL de website",
                        LABEL_BIO: "Bio",
                        PLACEHOLDER_BIO: "Escriba una biografía corta del de instructor",
                        MSG_MISSING_REQUIRED_FIELDS : "Por favor asegurese de verificar todos los campos obligatorios" +
                            " para la creación del instructor",
                        MSG_DELETE_SUCCESS: "Instructor eliminado exitosamente.",
                        MSG_DELETE_ERROR: "Error eliminando el instructor. Por favor intente de nuevo.",
                        VALUE_UNSPECIFIED: "No Especificado"
                    });
                }

                function _activate(){
                    _setStrings();
                    _setAvailableInstructors();
                    scope.instructorEditable = angular.copy(scope.instructor);
                    if(_isValid()){ 
                        scope.editMode = false;
                    }else{
                        scope.editMode = true;
                    }
                    console.group('trulii-instructor-card:', scope.instructor.full_name? scope.instructor.full_name : '');
                    console.log('instructor:', scope.instructor);
                    console.log('activity:', scope.activity);
                    console.log('organizer:', scope.organizer);
                    console.log('onDashboard:', scope.onDashboard);
                    console.log('emptyInstructor:', scope.emptyInstructor);
                    console.groupEnd();
                }
            }
        }
    }

})();
