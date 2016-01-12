/**
 * @ngdoc service
 * @name trulii.utils.services.UploadFile
 * @description UploadFile Factory
 * @requires ngCookies.$cookies
 * @requires ng.$http
 * @requires angularFileUpload.$upload
 * @requires ng.$window
 */

(function () {
  'use strict';

  angular
    .module('trulii.utils.services')
    .factory('UploadFile', UploadFile);

  UploadFile.$inject = ['$cookies', '$http','$upload','$window'];

  function UploadFile($cookies, $http, $upload,$window) {

    //noinspection UnnecessaryLocalVariableJS
      var UploadFile = {
      upload_user_photo:upload_user_photo,
      upload_activity_photo:upload_activity_photo,
    };
    
    return UploadFile;

    function upload_user_photo(file,url,extra_data){

      var method = "PUT";
      return _upload_file(file,url,extra_data,method)


    }

    function upload_activity_photo(file,url,extra_data){

      var method = "POST";
      return _upload_file(file,url,extra_data,method)

    }


    function _upload_file(file,url,extra_data,method) {

      return $upload.upload({
        url: url,
        method:method,
        // formData:{'main_photo':true},
        //method: 'POST' or 'PUT',
        //headers: {'Authorization': 'xxx'}, // only for html5
        //withCredentials: true,
        fields:extra_data,
        fileFormDataName:'photo',
        file: file, // single file or a list of files. list is only for html5
        //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
        //fileFormDataName: myFile, // file formData name ('Content-Disposition'), server side request form name
                                    // could be a list of names for multiple files (html5). Default is 'file'
        //formDataAppender: function(formData, key, val){}  // customize how data is added to the formData. 
                                                            // See #40#issuecomment-28612000 for sample code
      })
    }
  }

})();