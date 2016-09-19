(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityEnrollSuccessController', ActivityEnrollSuccessController);

    ActivityEnrollSuccessController.$inject = ['$state','$scope', '$stateParams', 'LocationManager', 'Toast', 'activity', 'calendar', 'organizerActivities',
                                                'serverConf', 'uiGmapIsReady'];

    function ActivityEnrollSuccessController($state, $scope, $stateParams, LocationManager, Toast, activity, calendar, organizerActivities, serverConf, uiGmapIsReady) {

        var vm = this;
        angular.extend(vm, {
            activity : null,
            cards: [],
            calendar : calendar,
            organizer : activity.organizer,
            organizerActivities : [],
            orderId: $stateParams.order_id,
            packageQuantity: $stateParams.package_quantity,
            packageType: $stateParams.package_type,
            showEmail: false,
            toggleEmailShow: toggleEmailShow,
            shareEmailForm: shareEmailForm,
            getAmazonUrl: getAmazonUrl
        });

        _activate();

        //--------- Exposed Functions ---------//
        
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }

        function shareEmailForm(){
            if(!vm.formData.emails){
                Toast.warning(vm.strings.COPY_EMPTY_EMAIL);
                return;
            }

            if(!vm.formData.message){
                Toast.warning(vm.strings.COPY_EMPTY_MESSAGE);
                return;
            }

            activity.share(vm.formData).then(success, error);

            function success(response){
                Toast.success(vm.strings.COPY_SHARE_SUCCESS);
                vm.formData = {};
            }
            function error(error){
                Toast.error(vm.strings.COPY_SHARE_ERROR);
                console.log('Error sharing activity', error);
            }
        }

        function toggleEmailShow(){
          vm.showEmail = !vm.showEmail;
        }

        //--------- Internal Functions ---------//

        function _getOrganizerActivities() {
            console.log('organizerActivities:', organizerActivities);
            console.log('organizerActivities:', _.without(organizerActivities, activity));
            return _.without(organizerActivities.results, activity);
        }

        function _setCurrentState(){
            vm.current_state = {
                toState: {
                    state: $state.current.name,
                    params: $stateParams
                }
            };
            console.log('vm.current_state:', vm.current_state);
        }

        function _setCity(activity){
            if(activity.location && activity.location.city){
                activity.location.city = LocationManager.getCityById(activity.location.city);
            }

            vm.map = LocationManager.getMap(activity.location, false);

            vm.marker = LocationManager.getMarker(activity.location);
            vm.marker.options = {icon: getAmazonUrl('static/img/map.png')};

            return activity;
        }


        function _setSocialShare(){
            var current_url = $state.href($state.current.name, $state.params, {absolute: true});
            vm.social = {};

            angular.extend(vm.social, {
                FACEBOOK_SOCIAL_PROVIDER: 'facebook',
                FACEBOOK_API_KEY: serverConf.FACEBOOK_APP_KEY,
                FACEBOOK_SHARE_TYPE: "feed",
                FACEBOOK_SHARE_CAPTION: "Trulii.com | ¡Aprende lo que quieras en tu ciudad!",
                FACEBOOK_SHARE_TEXT: 'Invita a tus amigos a que se inscriban a esta misma actividad. Menciónalos con @ "' + vm.activity.title + ' - ' + vm.activity.short_description + '"',
                FACEBOOK_SHARE_MEDIA: vm.activity.main_photo,
                FACEBOOK_SHARE_DESCRIPTION: vm.activity.short_description,
                FACEBOOK_REDIRECT_URI: current_url,
                FACEBOOK_SHARE_URL: current_url,
                TWITTER_SOCIAL_PROVIDER: 'twitter',
                TWITTER_SHARE_ACCOUNT: 'Trulii_',
                TWITTER_SHARE_TEXT: 'Acabo de inscribirme en @Trulii_  ' + vm.activity.title + ' ¿Qué esperas para unirte? #Únete',
                TWITTER_SHARE_URL:current_url,
                LINKEDIN_SOCIAL_PROVIDER: 'linkedin',
                LINKEDIN_SHARE_TEXT: 'Invita a tus amigos a que se inscriban a esta misma actividad' + vm.activity.title + ' - ' + vm.activity.short_description,
                LINKEDIN_SHARE_DESCRIPTION: vm.activity.short_description,
                LINKEDIN_SHARE_URL: current_url,
                WHATSAPP_SOCIAL_PROVIDER: 'whatsapp',
                WHATSAPP_SHARE_TEXT: '¡Hey!, acabo de inscribirme a esta actividad en Trulii. ¿Te anotas para acompañarme? Estoy seguro que te encantará. ¡Vamos, anímate!',
                WHATSAPP_SHARE_URL: current_url,
                MESSENGER_SOCIAL_PROVIDER: 'facebook-messenger',
                MESSENGER_SHARE_URL: current_url,
                EMAIL_SHARE_TEXT: '¡Hey!, acabo de inscribirme a esta actividad en Trulii. ¿Te anotas para acompañarme? Estoy seguro que te encantará. ¡Vamos, anímate! '
            });
        }

        function _setStrings() {
            if (!vm.strings) { vm.strings = {}; }
            angular.extend(vm.strings, {
                COPY_HEADER_TITLE: "¡Excelente! Te acabas de inscribir en",
                COPY_HEADER_DESCRIPTION: "Te hemos enviado un correo electrónico con toda la "
                    + "información referente a la inscripción y el pago.",
                LABEL_REMEMBER: "Recuerda que",
                LABEL_START_DATE: "Inicio",
                LABEL_LOCATION: "Ubicación",
                LABEL_QUESTIONS: "¿Dudas?",
                LABEL_IMPORTANT: "Importante",
                LABEL_ANY_DOUBT: "Cualquier pregunta",
                LABEL_SCHEDULES: "Horarios",
                LABEL_ADDRESS: "Dirección",
                LABEL_CLASES: "Clases",
                LABEL_PACKAGE: "Paquete",
                COPY_IMPORTANT: "Cada asistente tendrá un código que el organizador les solicitará al comenzar la actividad para poder identificarlos. Revisa en tu factura tu código y el de los asistentes que te acompañarán.",
                COPY_VIEW_YOUR_ORDER: "Ver mi factura",
                COPY_VIEW_YOUR_ORDER_2: "orden de compra",
                LABEL_ATTENDEES: "Asistentes",
                COPY_ASSISTANTS: "Estos son algunos de los asistentes a esta actividad. ¡Falta poco para conocerlos!",
                LABEL_SHARE: "¡En compañía se la pasa mejor!",
                COPY_SHARE: "Cuéntale a tus amigos sobre esta actividad.",
                LABEL_SIMILAR: "Actividades similares",
                ACTION_GO_TO_ACTIVITIES: "Ir a Mis Actividades",
                ACTION_GO_BACK: "Regresar",
                ACTION_CONTACT_US: "Contáctanos",
                EMAIL_MODAL_HEADER: "Compartir la actividad correo electrónico",
                EMAIL_MODAL_SEND_TO_LABEL: "Enviar a:",
                EMAIL_MODAL_SEND_TO_PLACEHOLDER: "Ingresa correos electronicos. Sepáralos entre sí con comas",
                EMAIL_MODAL_MESSAGE_LABEL: "Escribe un mensaje:",
                EMAIL_MODAL_MESSAGE_PLACEHOLDER: "Hey, échale un vistazo a esta actividad en Trulii. ¡Sé que te encantará!",
                EMAIL_MODAL_SEND: "Enviar",
                EMAIL_MODAL_DISMISS: "Cancelar",
                COPY_SHARE_SUCCESS: "La Actividad fue compartida exitosamente",
                COPY_SHARE_ERROR: "Error compartiendo la actividad, por favor intenta de nuevo",
                COPY_EMPTY_EMAIL: "Por favor agrega al menos un email",
                COPY_EMPTY_MESSAGE: "Por favor agrega un mensaje",
                COPY_VACANCY_SINGULAR: " vacante",
                COPY_VACANCY: " vacantes",
                COPY_NO_VACANCY: "Sin vacantes",
                COPY_MORE_SIMILAR_ACTIVITIES: "Ver más actividades similares",
                COPY_TELL_YOUR_FRIENDS: "Cúentale a tus amigos"
            });
        }
        
        function _mapTemplates(){
            for(var i = 0; i < vm.organizerActivities.length; i++){
                vm.organizerActivities[i].template = "partials/activities/dynamic_layout_item.html";
            }
            vm.cards = vm.organizerActivities;
            
        }

        function _setConfetti(){
            var canvas = document.getElementById("confetti");
            var ctx = canvas.getContext("2d");

            //canvas dimensions
            var W = window.innerWidth;
            var H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;

            //snowflake particles
            var mp = 200; //max particles
            var particles = [];
            for (var i = 0; i < mp; i++) {
                particles.push({
                    x: Math.random() * W, //x-coordinate
                    y: Math.random() * H, //y-coordinate
                    r: Math.random() * 15 + 1, //radius
                    d: Math.random() * mp, //density
                    color: "rgba(" + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", 0.8)",
                    tilt: Math.floor(Math.random() * 5) - 5
                });
            }

            //Lets draw the flakes
            function draw() {
                ctx.clearRect(0, 0, W, H);



                for (var i = 0; i < mp; i++) {
                    var p = particles[i];
                    ctx.beginPath();
                    ctx.lineWidth = p.r;
                    ctx.strokeStyle = p.color; // Green path
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x + p.tilt + p.r / 2, p.y + p.tilt);
                    ctx.stroke(); // Draw it
                }

                update();
            }

            //Function to move the snowflakes
            //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
            var angle = 0;

            function update() {
                angle += 0.01;
                for (var i = 0; i < mp; i++) {
                    var p = particles[i];
                    //Updating X and Y coordinates
                    //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
                    //Every particle has its own density which can be used to make the downward movement different for each flake
                    //Lets make it more random by adding in the radius
                    p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
                    p.x += Math.sin(angle) * 2;

                    //Sending flakes back from the top when it exits
                    //Lets make it a bit more organic and let flakes enter from the left and right also.
                    if (p.x > W + 5 || p.x < -5 || p.y > H) {
                        if (i % 3 > 0) //66.67% of the flakes
                        {
                            particles[i] = {
                                x: Math.random() * W,
                                y: -10,
                                r: p.r,
                                d: p.d,
                                color: p.color,
                                tilt: p.tilt
                            };
                        } else {
                            //If the flake is exitting from the right
                            if (Math.sin(angle) > 0) {
                                //Enter from the left
                                particles[i] = {
                                    x: -5,
                                    y: Math.random() * H,
                                    r: p.r,
                                    d: p.d,
                                    color: p.color,
                                    tilt: p.tilt
                                };
                            } else {
                                //Enter from the right
                                particles[i] = {
                                    x: W + 5,
                                    y: Math.random() * H,
                                    r: p.r,
                                    d: p.d,
                                    color: p.color,
                                    tilt: p.tilt
                                };
                            }
                        }
                    }
                }
            }

            //animation loop
            setInterval(draw, 20);
        }

        function _activate() {
            _setStrings();
            _setCurrentState();
            activity = _setCity(activity);
            vm.activity = activity;
            vm.organizerActivities = _getOrganizerActivities();
            vm.organizerActivities = vm.organizerActivities.slice(0, 4);
            console.log('activity:', activity);
            _setSocialShare();
            _setConfetti();
            _mapTemplates();
            //Function for angularSeo
            $scope.htmlReady();
        }
    }
})();
