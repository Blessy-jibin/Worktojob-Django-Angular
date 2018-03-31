

var workToJob	 = angular.module('workToJob', ['ngCookies','ui.bootstrap','ngMaterial', 'ngMessages']);


workToJob.config(function($interpolateProvider) {
  // changing angular default template rendering to '{[{}]}'.
  //This will helpto avoid conflict with django template tag
  $interpolateProvider.startSymbol('{{');
  $interpolateProvider.endSymbol('}}');
});

set_default_token_value = function($rootScope){
	$rootScope.auth_token = null;
}

get_http_header = function($cookies){
  	headers = {
   		"Content-Type": "application/json",
 	}
    userToken = sessionStorage.getItem("c_token");
    if (userToken == undefined) {
        
        return(headers);
    }else{
        headers.Authorization = "Token " + userToken
    }
  	return(headers);
}

workToJob.controller('loginController',  function ($scope, $http, $rootScope, $cookies) {
    

    $scope.authenticate_app = function(){
		var data = {};
		$scope.login_error_status = false;
    	data.username = $scope.username;
    	data.password = $scope.password;

    	loginValidation(data, $cookies);
	};

    $scope.add_new_user = function(){
        var data = {};
        $scope.pwd_error_status = false;
        data.username = $scope.email;
        data.email = $scope.email;
        data.password = $scope.emailpassword;
        data.password1 = $scope.emailpassword1;
        console.log(data);

        if(data.username == undefined || data.password == undefined){

            $('#create_error').html('Enter Valid email and password')
            $scope.pwd_error_status = true;
            return(0)
        }

        userData = data
        var headers = get_http_header($cookies)
        $http({
          method: 'POST',
          url: '/create_user',
          headers: headers,
          data:userData,
        }).then(function (response) {
            console.log('create status', response.status);
            if(response.status == 200){
                $scope.pwd_error_status = false;
                $scope.new_user_status = true;
                console.log("temp", response);

                sessionStorage.setItem("c_token", response.data.token);
                window.location.replace("/myjobs");

            }
        }, function (error) {
            $scope.pwd_error_status = true;
            $('#create_error').html('Usernamer already exist!')
        });
     };

	function loginValidation (userData, $cookies) {
		var headers = get_http_header($cookies)
		console.log(headers);
		$http({
		  method: 'POST',
		  url: '/auth_login',
		  headers: headers,
		  data:userData,
		}).then(function (data) {
			if(data.status == 200){
				$scope.login_error_status = false;
				console.log(data);
                sessionStorage.setItem("c_token", data.data.token);
                
                window.location.replace("/myjobs");

				}
	    }, function (error) {
	    	$scope.login_error_status = true;
	    });
	 };



	function get_job_list_view()  {
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

});

workToJob.controller("Jobcontroller", function($scope,$http, $rootScope, $cookies,$mdDialog) {

    $scope.initialize_job_controller = function(){
        $scope.task_list = [];
        $scope.tasks = [];
        $scope.url_validation_error = false;
        $scope.changed_jobproperty = false;
        $scope.newtask = "";
        $scope.newtasklist = [];
        $scope.addmoretasks = false;
        userToken = sessionStorage.getItem("c_token");
        console.log('userToken', userToken)
        if (userToken == undefined) {
            window.location.replace("/");
        }
    };

    function is_url(str)
    {
        regexp = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.).*/;
        if (regexp.test(str))
        { return true; }
        else{ return false; }
    };

    $scope.toggle_collapse = function(index){
        console.log( $scope.stage_index,index,$scope.collapse);
        $scope.stage_index=index;
        $scope.collapse[index]=!$scope.collapse[index];
        $scope.collapse =  {0:$scope.collapse[0] , 1:$scope.collapse[1] , 2:$scope.collapse[2] };
        console.log($scope.stage_index,index,$scope.collapse);


    };

    // $scope.check_element_existing_element = function(item){

    //    if($scope.task_list.indexOf(item) !== -1) {
    //         return true;
    //     }else{
    //         return false;
    //     } 
    // }
    $scope.save_task_to_new_job = function(newtask){
        if( $("#newtask").val() ){
            $scope.newtasklist.push(newtask);
            $scope.change_task_list(newtask);
          }
    }

    $scope.save_newjob = function(){
        console.log('test save');
        $scope.job.tasks = $scope.tasks;
        $scope.addmoretasks = false;
        $scope.task_list = [];
        $scope.newtasklist = [];
        createNewJobInfo ($scope.job, $cookies);
    };
    function createNewJobInfo (jobData,$cookies) {
        var headers = get_http_header($cookies)
        console.log(jobData);
        $http({
          method: 'POST',
          url: '/jobs',
          headers: headers,
          data:jobData,
        }).then(function (data) {
            if(data.status == 201){
                $scope.get_job_list_view();
                var modal=angular.element($('#myJobModal'));
                modal.modal('hide');
                $scope.job = {};
                $scope.newtasks = [];
                $scope.tasks = [];
            }
        }, function (error) {
            console.log('error',error);
        });
     };


    $scope.deleteJobInfo = function(jobId) {
        var headers = get_http_header($cookies)
        console.log(jobId);
        $http({
          method: 'DELETE',
          url: '/job/'+jobId,
          headers: headers,
          data:{'jobId' : jobId}
        }).then(function (data) {
            if(data.status == 204){
                $('#thisJob').modal('hide');
                console.log(data);
                console.log('datatoken',data);
                $scope.get_job_list_view();
                }
        }, function (error) {
            console.log('error',error);
        });
     };

    $scope.saveThisJob = function(job) {
        $scope.changed_jobproperty = false;
        var headers = get_http_header($cookies)
        console.log(job);
        $('#thisJob').modal('hide');
        $http({
          method: 'PUT',
          url: '/job/'+job.id,
          headers: headers,
          data:job,
        }).then(function (data) {
            if(data.status == 204){
                console.log(data);
                console.log('datatoken',data);
                $scope.get_job_list_view();
                }
        }, function (error) {
            console.log('error',error);
        });
     };



    $scope.url_validation_popup = function(){        
        $scope.url_validation_error = false;
        job_url = $scope.job;
        console.log(job_url);
        if(job_url == undefined || job_url.job_url == ""){
            $scope.url_validation_error = true;
        }else{

            url_status  = is_url(job_url.job_url);
            if(url_status){
                $('#myJobModal').modal('show');
                $('#thisJob').modal('hide');  
            }else{
                $scope.url_validation_error = true;
            }
        }
    };
    
    
    function check_element_existing_element(item){
        if($scope.task_list.indexOf(item) !== -1) {
            return true;
        }else{
            return false;
        }
    }


    $scope.check_element_existing_element=function(item){
        if($scope.task_list.indexOf(item) !== -1) {
            return true;
        }else{
            return false;
        }
    }

    $scope.change_task_list = function(item,date){
        task_ele = check_element_existing_element(item);
        if(task_ele){
            index = $scope.task_list.indexOf(item);
            $scope.task_list.splice(index,1);
            console.log('scope_list',$scope.task_list);
            for(i in $scope.tasks) {
                    if ($scope.tasks[i].action == item){
                        task_index = i;
                    }
            }

            $scope.tasks.splice(index,1);
            console.log($scope.tasks);
           
        }else{
            $scope.task_list.push(item);
             console.log('scope_list',$scope.task_list);
             var obj = {};
             obj.action = item;
             obj.action_date = "23-12-2011";
             $scope.tasks.push(obj);
        }
        console.log('scopetasks',$scope.tasks);
    };
    
    $scope.save_tasks = function(item,date){
        not_found = true;
        for(i in $scope.tasks) {
            if ($scope.tasks[i].action == item){
                $scope.tasks[i].action_date = "23-12-2011";
                not_found = false;
            }
        }
       if(not_found == true) {
                var obj = {};
                obj.action = item;
                obj.action_date = date;
                $scope.tasks.push(obj);
        
       }
       console.log($scope.tasks);
    }

    $scope.change_selected_color = function(item){
        task_ele = check_element_existing_element(item);
        return task_ele;
    }


  $scope.get_job_list_view = function(){
      headers = get_http_header($rootScope)
      console.log('headers', headers)
      $http({
        method: 'GET',
        url: '/jobs',
        headers: headers,
      }).then(function (data) {
          if(data.status == 200){
            $scope.job_temp = data.data;
            console.log( $scope.collapse);

          }
      }, function (error) {
          console.log('ffffffffffff');
      });
     }

     $scope.get_job_list_view();





    $scope.Wishlist = [];
    $scope.job = {};
    // $scope.tasks=[];
    $scope.job_stage = ['To Apply','Follow-up','Selection'];
    $scope.do="";//There is no variable 'do' in scope,we initialised and using it 
                  //identify whether gonna add or edit the job
 // HEAD:user_profile/static/js/controller.js
    //$scope.job_temp=[{'role':'AST','company':'TCS','url':'www.tcs.com/dasrdca','deadline':'24/05/2011','stage':'To Apply','task':['Customize CV','Update Portfolio']},
    //               {'role':'NT','company':'Bosch','url':'www.bosch.com/dasrdca','deadline':'31/05/2018','stage':'Follow-up','task':['Customize CV','Update Coverletter']},
    //               {'role':'ST','company':'KPN','url':'www.KPN.com/dasrdca','deadline':'25/04/2013','stage':'Selection','task':['Customize CV','Attach Portfolio']}  ];
    // $scope.job_temp=[{'role':'AST','company':'TCS','url':'www.tcs.com/dasrdca','stage':'To Apply','task':['Customize CV','Update Portfolio']},
    //                {'role':'Softawre','company':'ING','url':'www.ing.com/dasrdca','stage':'To Apply','task':['Customize CV','Update Portfolio']},
    //                {'role':'NT','company':'Bosch','url':'www.bosch.com/dasrdca','stage':'Follow-up','task':['Customize CV','Update Coverletter']},
    //                {'role':'ST','company':'KPN','url':'www.KPN.com/dasrdca','stage':'Selection','task':['Customize CV','Attach Portfolio']}  ];
    
    $scope.job_temp2= {
                    "toapply" :   [ {'role':'Test5','company':'TCS','url':'www.tcs.com/dasrdca','stage':'To Apply','task':['Customize CV','Update Portfolio']},
                        {'role':'Test6','company':'ING','url':'www.ing.com/dasrdca','stage':'To Apply','task':['Customize CV','Update Portfolio']},
                        {'role':'Test7','company':'Bosch','url':'www.bosch.com/dasrdca','stage':'To Apply','task':['Customize CV','Update Coverletter']},
                        {'role':'Test8','company':'KPN','url':'www.KPN.com/dasrdca','stage':'To Apply','task':['Customize CV','Attach Portfolio']}  ],
                    "selection" :   [ 
                                {'role':'Test3','company':'Bosch','url':'www.bosch.com/dasrdca','stage':'Selection','task':['Customize CV','Update Coverletter']},
                                {'role':'Test4','company':'KPN','url':'www.KPN.com/dasrdca','stage':'Selection','task':['Customize CV','Attach Portfolio']}  ],
                    "followup" :   [ {'role':'Test9','company':'Bosch','url':'www.bosch.com/dasrdca','stage':'Follow-up','task':['Customize CV','Update Coverletter']},
                        {'role':'Test10','company':'KPN','url':'www.KPN.com/dasrdca','stage':'Follow-up','task':['Customize CV','Attach Portfolio']}  ]
                    

                    }    ;
    
    $scope.toggle = true;
    $scope.isCollapsed = true;
    $scope.selectedIndex = -1;
    $scope.clickedIndex = -1;

    $scope.isMore = true;
    $scope.ele_in_array = 0;
    $scope.number_of_repeat = [];
    $scope.jobIndex = -1;
    $scope.showjobmodal = false;
    $scope.jobmodal_topfixed = false;  
   
// Assigns a value to it
        
    // $scope.showjobmodal = true;
    
// >>>>>>> 4d50ce293fe56f8db47538de3bb279e0df237567:static/js/controller.js

// for(i in $scope.Wishlist){
//                 var job = $scope.Wishlist[i];
//                 var stage = job['stage'];
//                 console.log(job);
//                 var sec_id='stage'+stage;
//                 console.log(angular.element($('#job_view')));
//      }


 // $('#thisJob').on('show.bs.modal', function(e) {
 //            var job = e.relatedTarget.dataset.job;
 //            var job = JSON.parse(job);
 //            $scope.thisjob = job;
 //            console.log($scope.thisjob.company)
 //   });
// var x = $('#thisJob').relatedTarget.dataset.job;
// console.log(x);

    $scope.collapseInit = function () {

    }


    $scope.AddJob = function(url) {
        $scope.job.stage = "To Apply";
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
        mm='0'+mm;
        } 
        var today = mm+'/'+dd+'/'+yyyy;
        $scope.job.deadline = today;
        $scope.loadingData = true;
        console.log($scope.loadingData);

        $http({
          method: 'GET',
          url: '/meta',
          headers: headers,
          params: {'url' : url}
        }).then(function (response) {
            
            if(response.status == 200){
                $scope.job.job_title = response.data.title;
                $scope.loadingData = false;
            }   
        }, function (error) {
            $scope.loadingData = false;
            
        });
    }



    // $scope.sve = function(){
    //     if($scope.do == "add"){

    //     	for(i = 1;i<=$scope.newtasks.length;i++){
    //     		$scope.job.tasks.push($scope.newtasks[i]);
    //     	};
    //         $scope.job_temp.push($scope.job);
    //         $scope.job={};
            
    //     }else{
    //     	console.log($scope.newtasks);
        	
    //     	console.log()
        	
    //     	for(i = 1; i<=$scope.newtasks.length; i++){
    //     		console.log($scope.newtasks[i]);
    //     		$scope.thisjob.task.push($scope.newtasks[i]);
    //     	};
    //     	console.log($scope.thisjob);
    //         $scope.job_temp[index]=$scope.job;
    //         $scope.job={};
    //     }
        
    // }

    $scope.UpdateJob = function(thisjob){
        $scope.do = "edit";
        // $scope.add_more_task = true;
        // console.log($scope.add_more_task);
        // $scope.job = $scope.thisjob;
        // index = $scope.job_temp.indexOf(item);
        $scope.thisjob.stage = $scope.thisjobstage;
        $scope.thisjob.deadline = $scope.thisjobdeadline;
        console.log($scope.thisjob);
        console.log($scope.newtasks)
        
    }

     
    
    $scope.SelectTimeline =  function(id) {
        var element = angular.element($('.btn-time-line'));
        for ( var i in element) {
            var btn = angular.element($( '#'+element[i].id));
            btn.css({"background-color": "white"});
            btn.val('Custom');
        }
        emnt = angular.element($('#'+id));
        emnt.css({"background-color": "blue"});
        emnt.val('selected');
        $scope.selectedTimeLine = id;
        if (id =='btn-today'){
        	var date = new Date();
        	var dateinformat =   ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
        }
    }

  
    $scope.task_id = 100;
    $scope.AddmoreTasks = function(){
        $scope.addmoretasks=true;
        console.log('testaddmoreTasks',$scope.addmoretasks);
    	// $("#taskwrapper").css({'position':'relative','left':'-190px'});

    }

    $scope.RemoveTasks = function(task_id){
        console.log('test');
        var tasklist = angular.element($("#tasklist"));
        var task = angular.element($("#"+task_id));
        console.log(task_id,task,tasklist);
        tasklist.remove(task);
    }



    $scope.SelectTasks = function (task_id) {

        var emnt = angular.element($("#"+task_id));
        console.log( task_id, emnt, emnt.val());
        emnt.css({"background-color": "blue"});
        if (emnt.val() != null && emnt.val()=='selected'){
            emnt.val('not selected');
            emnt.css({"background-color": "white"});
        } else {
            emnt.val('selected');
            emnt.css({"background-color": "blue"});
        }
       
    }

    $scope.removeTask = function(index) { 
    	console.log(index);
    	console.log('before deletin',$scope.thisjob.tasks);
        $scope.changed_jobproperty=true;
    	// list.splice(index, 1);

    	$scope.thisjob.tasks.splice(index, 1);
        console.log('after deleteing',$scope.thisjob.tasks);
    };


    $scope.Show_this_Job=function(item,$index){
        // console.log(item);

        var modal=angular.element($('#thisJob')); 

        if($scope.changed_jobproperty == false){
            $scope.clickedIndex = $index;
            modal.modal('show');
            console.log('modal is again here and clickedindex',$scope.clickedIndex);
        };

        if($scope.changed_jobproperty == true){
            $scope.showConfirm($scope.thisjob);
            modal.modal('hide');
            console.log('modal is forecfully hided');
        };
        

        
        $scope.thisjob = item;
        $scope.changed_jobproperty = false;
        $scope.taskentered = false;
        $scope.thisjob_beforechange = angular.copy(item);

        console.log($scope.thisjob_beforechange);
        // $scope.tsk="";
        console.log($scope.showjobmodal);
        var modal=angular.element($('#thisJob')); 

        console.log();
        console.log($scope.thisjob);
    };

    $scope.addtaskbutton_clicked = function(){
     $scope.changed_jobproperty = true;
     $('#inputtask').blur();
     // // $scope.tsk = "";
     // $scope.taskinput_blurred();
     
     
    }
   
    $scope.taskinput_blurred=function(){
        $('#inputtask').attr("placeholder", "Add your task here");
        $('#inputtask').focus(function() {
            $('#inputtask').attr("placeholder", "");
        });
    }

	angular.element($('#thisJob')).on('shown.bs.modal', function() {
			console.log('hey modal is shown');
        	angular.element(document).off('focusin.modal');
            angular.element('body').removeClass('modal-open');
            console.log('document',angular.element(document));
        	$scope.showjobmodal = true;
        	console.log('hey jobmodal is opend');
        	console.log($scope.showjobmodal);

    });

    angular.element($('#thisJob')).on('hidden.bs.modal', function () {
  // do something…
     $scope.showjobmodal = false;
     console.log('hey jobmodal is closed');
	});

    angular.element(document).bind('scroll', function() {
     
     	if ($(window).scrollTop() > 40) {
    		angular.element('#thisJob').css({'position': 'fixed','top':'-10px','bottom':'20px'});
    	}

    	else if ($(window).scrollTop() < 40) {
    		console.log('scroll less than 70')
    		angular.element('#thisJob').css({'position': 'absolute','top':'50px','bottom':'20px'});
        }
    	// }else if ($(window).scrollTop() > 100) {
    	// 	angular.element('#thisJob').css({'position': 'fixed','top':'5px'});
   	 // 	} else {
     //  // $scope.jobmodal_topfixed = false;  
    	// }
   });
   

    $scope.moreItem=function(stage){
        //get more jobs from bacnend and addd.
        var data = [];
        if (stage == 'To Apply'){
            data = $scope.job_temp2.toapply
        }
        if (stage == 'Follow-up'){
            data = $scope.job_temp2.followup
        }
        if (stage == 'Selection'){
            data = $scope.job_temp2.selection
        }
        for (index in data){
            $scope.job_temp.push(data[index]);
        }
    }


    
    $scope.setselectedIndex = function (item,$index) {
        $scope.selectedIndex = $index;
    };

    $scope.closeJobModal=function(){
        // var body = angular.element($('body'));
        // body.removeClass('body_colour_change'); 
        // var jobs = angular.element($('#jobsview'));
        // jobs.removeClass('jobsview_change');
        // var add_link = angular.element($('#addlink'));
        // add_link.removeClass('addlink_change');
        // $scope.selectedIndex = -1;
        var modal=angular.element($('#thisJob'));
        modal.modal('hide');
        console.log(modal);
        $scope.showjobmodal = false;
        // console.log('hey close job modal is called'); 
        // $scope.showmodal = true;
        
        
    }



    $scope.showConfirm = function(ev,job) {
    // Appending dialog to document.body to cover sidenav in docs app
        console.log('testing dialog');
        console.log(job);
        var confirm = $mdDialog.confirm()
              .title('Your data is not saved')
              .textContent('Save your data')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Save')
              .cancel('Dismiss');

        $mdDialog.show(confirm).then(function() {
            $scope.saveThisJob(job);
            $scope.changed_jobproperty = false;
         }, function() {

          $scope.job_temp[$scope.clickedIndex] = $scope.thisjob_beforechange;
          console.log('jobtemp',$scope.job_temp[$scope.clickedIndex] );
          $scope.changed_jobproperty = false;
        });
    };

    $scope.addtask_editmode = function(){

    	$scope.number_of_repeat.push($scope.ele_in_array);
    	// $scope.ele_in_array=$scope.ele_in_array+1;
    	console.log($scope.number_of_repeat);
    	
    }

	$scope.showjobon_statechange = function(selectedIndex){
    var a = angular.element($('#jobdiv'+selectedIndex));
    console.log(a);
    console.log("show this shown job");
	};

    $scope.ngkeypress = function(tsk){
      console.log(tsk);
    };

  
});