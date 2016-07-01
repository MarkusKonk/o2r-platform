    var app = angular.module('starter', ["treeControl", "ui.router", "hljs"]);
    app.config(function($stateProvider, $urlRouterProvider, hljsServiceProvider){
      
      hljsServiceProvider.setOptions({
        tabReplace: '    '
      });
      // For any unmatched url, send to /route1
      $urlRouterProvider.otherwise("/home");
      
      $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "templates/home.html",
            controller: 'HomeCtrl'
        })
          
        .state('erc', {
            url: "/erc/:ercid",
            templateUrl: "templates/erc.html",
            controller: 'ErcCtrl'
        })

        .state('author', {
            url: "/author/:authorid",
            templateUrl: "templates/author.html",
            controller: 'AuthorCtrl',
        })

        .state('search', {
            url: "/search?term",
            templateUrl: "templates/search.html",
            controller: 'SearchCtrl'
        });
    });
    
app.controller('ErcCtrl', ['$scope', 'publications', '$stateParams', '$http', function($scope, publications, $stateParams, $http){
        // retrieves all metadata of publication
        $scope.publications = publications.getPublications();
        // options for folderTree
        $scope.treeOptions = {
            nodeChildren: 'children',
            dirSelectable: false
        };

        // id of file in publication
        $scope.fileId;

        // set fileId
        $scope.setId = function(number){
            $scope.fileId = number;
        };

        // finds a publication and returns it
        $scope.getOne = function(number){
            var p = publications.getContentById(number);
            return p;
        };

        // checks for filesize and mimetype for displaying content of files
        // returns true, if file is not too big and not of type of pdf, image, audio, video
        $scope.displaySource = function(string){
            if(typeof string == 'undefined'){ return; }
            var result = true;
            var _mime = string.split('/')[0];
            if( (string == 'application/pdf') || (_mime == 'image') || (_mime == 'audio') || (_mime == 'video')){
                        result = false;
            }
            return result;
        };
}]);

app.controller('AuthorCtrl', ['$scope', '$stateParams', '$location', 'pubListMeta', function($scope, $stateParams, $location, pubListMeta){
    
    // get all PublicationsMetadata
    $scope.allPubs = pubListMeta.getPubMeta(); 
    
    // checks if a publication was already selected. 
    var _checkPubId = function(){
        if(typeof $scope.pubId == 'undefined') return false;
        return true;
    };

    // checks if a publication was already selected, if not the latest publication will be displayed
    $scope.getOne = function(id){
        if(_checkPubId()){
            var pub = pubListMeta.getPubById(id);
        } else {
            var pub = pubListMeta.getPubMeta()[0];
        }
        return pub;
    };

    $scope.pubId;

    // setter function for pubId
    $scope.setId = function(number){
        $scope.pubId = number;
    };
    
    // Changes first letter of word into capital letter
    $scope.caps = function(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // helper for sorting
    $scope.sortType = 'date';
    $scope.sortReverse = true;

    // helper for contentfilter
    $scope.filterContent = 'content';

    // triggered on GoTo Button. Gets the id of last clicked publication and calls url /erc/:ercid
    $scope.submit = function(){
        var _url = '/erc/' + $scope.getOne($scope.pubId).id;
        $location.path(_url);

    };

    
}]);

app.controller('SearchCtrl', ['$scope', '$stateParams',function($scope, $stateParams){
	// reads term query from url
    $scope.searchTerm = $stateParams.term;
    // id of clicked publication
    $scope.pubId;
    // sets pubId to id of clicked publication
    $scope.setId = function(id){
        $scope.pubId = id;
    };
    // checks if a publication has been clicked
    // returns true if a publication has been clicked
    $scope.checkPubId = function(){
        if(typeof $scope.pubId == 'undefined') return false;
        return true;  
    };
    // triggered on GoTo Button. Gets the id of last clicked publication and calls url /erc/:ercid
    $scope.submit = function(){
        //implement here!!
    };
}]);

app.controller('HomeCtrl', ['$scope', '$location', function($scope, $location){
    
    $scope.submit = function(){
        var _query = $scope.searchModel.replace(/ /g, "+");
       // $location.path('/search').search('term=' + _query);
        $location.path('/search');
    };	
}]);