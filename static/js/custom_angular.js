var workToJob	 = angular.module('workToJob', ['ngRoute']);


workToJob.config(function($interpolateProvider) {
  // changing angular default template rendering to '{[{}]}'.
  //This will helpto avoid conflict with django template tag
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

set_default_token_value = function($rootScope){
	$rootScope.auth_token = null;
}

make_backend_call = function($rootScope, $http, http_method, end_point, data={}){
  	headers = {
   		"Content-Type": "application/json",
 	}

  	if($rootScope.auth_token != null){
  		headers.Authorization = "Token "+ $rootScope.auth_token
  	}

  	response = null

	$http({
	  method: http_method,
	  url: end_point,
	  headers: headers,
	  data:data,
	}).then(function successCallback(response) {
	    // this callback will be called asynchronously
	    // when the response is available
	    response = response;
	  }, function errorCallback(response) {
	  	response = response;
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	  });

	console.log("-----------------------", response);
	return(response);
}

workToJob.controller('loginController', function ($scope, $http, $rootScope) {

    $scope.authenticate_app = function(){
		var data = {};
    	data.username = $scope.username;
    	data.password = $scope.password;
    	alert(data);
    	rep_data = make_backend_call($rootScope, $http, 'POST', '/login', data);
    	console.log("-----------------------", rep_data);

	}


});