var app = angular.module('myApp', ['ui.bootstrap']);

app.controller("myCtrl", function($scope) {
    $scope.Wishlist = [];
    $scope.job = {};
    $scope.tasks=[];
    $scope.job_stage = ['To Apply','Follow-up','Selection'];
    $scope.do="";//There is no variable 'do' in scope,we initialised and using it 
                  //identify whether gonna add or edit the job
 // HEAD:user_profile/static/js/controller.js
    $scope.job_temp=[{'role':'AST','company':'TCS','url':'www.tcs.com/dasrdca','deadline':'24/05/2011','stage':'To Apply','task':['Customize CV','Update Portfolio']},
                   {'role':'NT','company':'Bosch','url':'www.bosch.com/dasrdca','deadline':'31/05/2018','stage':'Follow-up','task':['Customize CV','Update Coverletter']},
                   {'role':'ST','company':'KPN','url':'www.KPN.com/dasrdca','deadline':'25/04/2013','stage':'Selection','task':['Customize CV','Attach Portfolio']}  ];
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
    $scope.isMore = true;
    $scope.hidemodal = true;
    // $scope.taskidx = 0;
    $scope.newtasks = [];
    $scope.add_more_task = false;
    $scope.ele_in_array = 0;
    $scope.number_of_repeat = [];
  
    
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


    $scope.AddJob = function() {
        $scope.do = "add";
        var addjobmodal = angular.element($('#myModal'));
        addjobmodal.modal('show');
        // $scope.job = {};
        var body = angular.element($('body'));
        body.removeClass('body_colour_change'); 
        var jobs = angular.element($('#jobsview'));
        jobs.removeClass('jobsview_change');
        var add_link = angular.element($('#addlink'));
        add_link.removeClass('addlink_change');
        var modal=angular.element($('#thisJob'));
        modal.modal('hide');    

    }



    $scope.sve = function(){
        if($scope.do == "add"){

        	for(i = 1;i<=$scope.newtasks.length;i++){
        		$scope.job.tasks.push($scope.newtasks[i]);
        	};
            $scope.job_temp.push($scope.job);
            $scope.job={};
            
        }else{
        	console.log($scope.newtasks);
        	
        	console.log()
        	
        	for(i = 1; i<=$scope.newtasks.length; i++){
        		console.log($scope.newtasks[i]);
        		$scope.thisjob.task.push($scope.newtasks[i]);
        	};
        	console.log($scope.thisjob);
            $scope.job_temp[index]=$scope.job;
            $scope.job={};
        }
        
    }

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
                 console.log(task);
                 $scope.newtasks.push(task);
                 console.log($scope.newtasks);
     	});

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
    	

    	// list.splice(index, 1);

    	$scope.thisjob.task.splice(index, 1);
    };


    $scope.Show_this_Job=function(item){
        // console.log(item);
        $scope.thisjob=item;
        console.log($scope.thisjob);
        // var d = $scope.thisjob.deadline;
        // console.log(d);
        // 
        // $scope.thisjobdate = d.toLocaleDateString();
        // $scope.thisjobdate = thisdate.format("YYYY-MM-DD");
        // console.log($scope.thisjobdate);

        var modal=angular.element($('#thisJob'));  
        modal.modal('show');
        var body = angular.element($('body'));
        // // body.css('background-color','#F8F8FF');
        body.addClass('body_colour_change');
        var jobs = angular.element($('#jobsview'));
        // // jobs.css({'width':'45%','background-color':'white'});
        jobs.addClass('jobsview_change');
        var add_link = angular.element($('#addlink'));
        // add_link.css('width','50%');
        add_link.addClass('addlink_change');
        

        // var job = angular.element($('#job'+$scope.job_temp.indexOf(item)));
        // console.log($scope.job_temp.indexOf(item));
        // console.log(jobelement)
        // jobtitle.toggleClass('jobtitle_change');
    };

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


    
    $scope.itemClicked = function ($index) {
        $scope.selectedIndex = $index;
        // console.log($scope.selectedIndex);
        // $scope.hidemodal = !$scope.hidemodal;
    };

    $scope.closeJobModal=function(){
        var body = angular.element($('body'));
        body.removeClass('body_colour_change'); 
        var jobs = angular.element($('#jobsview'));
        jobs.removeClass('jobsview_change');
        var add_link = angular.element($('#addlink'));
        add_link.removeClass('addlink_change');
        $scope.selectedIndex = -1;
        var modal=angular.element($('#thisJob'));  
        modal.modal('hide');
        
    }

    $scope.addtask_editmode = function(){

    	$scope.number_of_repeat.push($scope.ele_in_array);
    	// $scope.ele_in_array=$scope.ele_in_array+1;
    	console.log($scope.number_of_repeat);
    	
    }

    $scope.gyphcolorchange = function(){

    }
  
});








 