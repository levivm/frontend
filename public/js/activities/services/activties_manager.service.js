(function () {
  'use strict';
  angular
    .module('trulii.activities.services')
    .factory('ActivitiesManager', ActivitiesManager);

  ActivitiesManager.$inject = ['$http','$q','Activity'];

  function ActivitiesManager($http,$q,Activity) {  
    

    
    var ActivitiesManager = {
        _pool: {},
        // _retrieveInstance: function(bookId, bookData) {
        //     var instance = this._pool[bookId];

        //     if (instance) {
        //         instance.setData(bookData);
        //     } else {
        //         instance = new Book(bookData);
        //         this._pool[bookId] = instance;
        //     }

        //     return instance;
        // },
        // _search: function(bookId) {
        //     return this._pool[bookId];
        // },
        // _load: function(bookId, deferred) {
        //     var scope = this;

        //     $http.get('ourserver/books/' + bookId)
        //         .success(function(bookData) {
        //             var book = scope._retrieveInstance(bookData.id, bookData);
        //             deferred.resolve(book);
        //         })
        //         .error(function() {
        //             deferred.reject();
        //         });
        // },
        // /* Public Methods */
        // /* Use this function in order to get a book instance by it's id */
        // getBook: function(bookId) {
        //     var deferred = $q.defer();
        //     var book = this._search(bookId);
        //     if (book) {
        //         deferred.resolve(book);
        //     } else {
        //         this._load(bookId, deferred);
        //     }
        //     return deferred.promise;
        // },
        // /* Use this function in order to get instances of all the books */
        // loadAllBooks: function() {
        //     var deferred = $q.defer();
        //     var scope = this;
        //     $http.get('ourserver/books')
        //         .success(function(booksArray) {
        //             var books = [];
        //             booksArray.forEach(function(bookData) {
        //                 var book = scope._retrieveInstance(bookData.id, bookData);
        //                 books.push(book);
        //             });

        //             deferred.resolve(books);
        //         })
        //         .error(function() {
        //             deferred.reject();
        //         });
        //     return deferred.promise;
        // },
        // /*  This function is useful when we got somehow the book data and we wish to store it or update the pool and get a book instance in return */
        // setBook: function(bookData) {
        //     var scope = this;
        //     var book = this._search(bookData.id);
        //     if (book) {
        //         book.setData(bookData);
        //     } else {
        //         book = scope._retrieveInstance(bookData);
        //     }
        //     return book;
        // },

    };
    return ActivitiesManager;
}]);

})();