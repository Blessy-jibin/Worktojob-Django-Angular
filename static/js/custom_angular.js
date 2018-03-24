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

get_http_header = function($rootScope){
  	headers = {
   		"Content-Type": "application/json",
 	}

  	if($rootScope.auth_token != null){
  		headers.Authorization = "Token "+ $rootScope.auth_token
  	}
  	return(headers);
}

workToJob.controller('loginController', function ($scope, $http, $rootScope) {

    $scope.authenticate_app = function(){
		var data = {};
		$scope.login_error_status = false;
    	data.username = $scope.username;
    	data.password = $scope.password;

    	loginValidation(data, $rootScope);
	};

	function loginValidation (userData, $rootScope) {
		headers = get_http_header($rootScope)
		$http({
		  method: 'POST',
		  url: '/login',
		  headers: headers,
		  data:userData,
		}).then(function (data) {
			if(data.status == 200){
				$scope.login_error_status = false;
				$rootScope.auth_token = data.token;
				window.location = 'addjob';
			}
	    }, function (error) {
	    	$scope.login_error_status = true;
	    });
	 };

});


workToJob.controller('jobDetailController', function ($scope, $http, $rootScope) {


    $scope.save_newjob = function(){
		console.log($scope.job);
	};



});

