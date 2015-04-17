/**
* Authentication
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

  angular
    .module('trulii.utils.services')
    .factory('UploadFile', UploadFile);

  UploadFile.$inject = ['$cookies', '$http','$upload','$window'];

  /**
  * @namespace 
  * @returns {Factory}
  */
  function UploadFile($cookies, $http,$upload,$window) {
    /**
    * @name UploadFile
    * @desc The Factory to be returned
    */


    var UploadFile = {
      upload_file: upload_file,
    };
    
    return UploadFile;




    function upload_file(file,url) {

      console.log("FILE",file);
      console.log("FILE",file);
      console.log("FILE",file);
      console.log("FILE",file);
      return $upload.upload({
        url: url, // upload.php script, node.js route, or servlet url
        //method: 'POST' or 'PUT',
        //headers: {'Authorization': 'xxx'}, // only for html5
        //withCredentials: true,
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