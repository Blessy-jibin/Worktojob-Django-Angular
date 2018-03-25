var workToJob	 = angular.module('workToJob', ['ngRoute', 'ngCookies']);


workToJob.config(function($interpolateProvider) {
  // changing angular default template rendering to '{[{}]}'.
  //This will helpto avoid conflict with django template tag
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

set_default_token_value = function($rootScope){
	$rootScope.auth_token = null;
}

get_http_header = function($cookies){
  	headers = {
   		"Content-Type": "application/json",
 	}
 	console.log('3333333333----------', $cookies);
 	auth_token = $cookies.auth_token;
 	console.log('3333333333----------', auth_token);
 	headers.Authorization = "Token " + "068f5e0a39ace8fdaa07028d17e24fb5ccbc82ad";
  	if(auth_token != null){
  		headers.Authorization = "Token " + "068f5e0a39ace8fdaa07028d17e24fb5ccbc82ad"
  	}
  	return(headers);
}

workToJob.controller('loginController', function ($scope, $http, $rootScope, $cookies) {

    $scope.authenticate_app = function(){
		var data = {};
		$scope.login_error_status = false;
    	data.username = $scope.username;
    	data.password = $scope.password;

    	loginValidation(data, $cookies);
	};

	function loginValidation (userData, $cookies) {
		headers = get_http_header($cookies)
		$http({
		  method: 'POST',
		  url: '/auth_login',
		  headers: headers,
		  data:userData,
		}).then(function (data) {
			if(data.status == 200){
				$scope.login_error_status = false;
				console.log(data);
				$cookies.put('auth_token', data.token);
				
			}
	    }, function (error) {
	    	$scope.login_error_status = true;
	    });
	 };

});


workToJob.controller('jobDetailController', function ($scope, $http, $rootScope, $cookies, $cookies) {

	$scope.initialize_job_controller = function(){
		$scope.task_list = [];
		$scope.url_validation_error = false;
	};

	function is_url(str)
	{
  		regexp = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.).*/;
        if (regexp.test(str))
        { return false; }
        else{ return true; }
	};

	function check_element_existing_element(item){
		if($scope.task_list.indexOf(item) !== -1) {
  			return true;
		}else{
			return false;
		}
	}

    $scope.save_newjob = function(){
    	lis = [];
    	d = {};
    	console.log($scope.task_list.length);

    	for(i=0; i < $scope.task_list.length; i++)
    	{
    		if($scope.task_list[i] != undefined){
    			console.log(".................", $scope.task_list)
    			d['action'] = $scope.task_list[i];
    			d['action_date'] = "2018-03-20T17:24:13Z";
    			lis.push(d);
    		}
    	}
    	$scope.job['tasks'] = lis;
		console.log($scope.job);
		loginValidation ($scope.job, $rootScope);
	};

	$scope.url_validation_popup = function(){
		
		$scope.url_validation_error = false;
		job_url = $scope.job;
		if(job_url == undefined || job_url.job_url == ""){
			$scope.url_validation_error = true;
		}else{
			url_status  = is_url(job_url.job_url);
			if(url_status){
				$scope.url_validation_error = true;
			}else{
				$('#myJobModal').modal('show');
			}
		}
	};

	$scope.change_task_list = function(item){
		task_ele = check_element_existing_element(item);
		if(task_ele){
			index = $scope.task_list.indexOf(item);
			delete $scope.task_list[index];
		}else{
			$scope.task_list.push(item);
		}
	};

	$scope.change_selected_color = function(item){
		task_ele = check_element_existing_element(item);
		return task_ele;
	}

	$scope.task_id = 100;
    $scope.AddTasks = function(){
    	$scope.taskidx ++;
    	console.log($scope.taskidx);
        $scope.task_id ++;
        var id = 'btn-'+ $scope.task_id
        var tasklist = angular.element($("#tasklist"));
        var addtask_html = "<div class='row' id ='"+id+"' ><input type='text' class='task-btn' id='input"+id+"'> <span>"
          +"<button class='btn-xs' id='btn"+id+"' >Remove</button>"
         +"</span></input></div>"
        tasklist.append(addtask_html);
        var new_element = angular.element($("#"+id));
        var remove_button = angular.element($('#btn'+id));
        remove_button.on('click',   function(){
            var task = angular.element($("#"+id));
            task.remove();
     	});
        var input_area = angular.element($("#input"+id));
        input_area.on('blur',   function(){
            var task = input_area.val();
            $scope.task_list.push(task);
     	});

    }

    $scope.RemoveTasks = function(task_id){
        var tasklist = angular.element($("#tasklist"));
        var task = angular.element($("#"+task_id));
        tasklist.remove(task);
        var item = input_area.val();
		index = $scope.task_list.indexOf(item);
		delete $scope.task_list[index];

    }

    function loginValidation (jobData, $rootScope) {
		headers = get_http_header($rootScope)
		console.log('headers', headers)
		$http({
		  method: 'POST',
		  url: '/jobs',
		  headers: headers,
		  data:jobData,
		}).then(function (data) {
			if(data.status == 200){
				$rootScope.auth_token = data.token;
				window.location = 'addjob';
			}
	    }, function (error) {
	    	console.log('ffffffffffff');
	    });
	 };

	$scope.get_job_list_view = function(){
		headers = get_http_header($rootScope)
		console.log('headers', headers)
		$http({
		  method: 'GET',
		  url: '/jobs',
		  headers: headers,
		}).then(function (data) {
			if(data.status == 200){
				$scope.jib_list_data = data;
				console.log('ffffffffffff', data);
			}
	    }, function (error) {
	    	console.log('ffffffffffff');
	    });
    }
    $scope.get_job_list_view();


});

