var app = angular.module('myApp', ['ui.bootstrap']);

app.controller("myCtrl", function($scope) {
    $scope.Wishlist = [];
    $scope.job = {};
    $scope.tasks=[];
    $scope.job_stage = ['To Apply','Follow-up','Selection'];
    $scope.do="";//There is no variable 'do' in scope,we initialised and using it 
                  //identify whether gonna add or edit the job

    $scope.job_temp=[{'role':'AST','company':'TCS','url':'www.tcs.com/dasrdca','stage':'To Apply','task':['Customize CV','Update Portfolio']},
                   {'role':'Softawre','company':'ING','url':'www.ing.com/dasrdca','stage':'To Apply','task':['Customize CV','Update Portfolio']},
                   {'role':'NT','company':'Bosch','url':'www.bosch.com/dasrdca','stage':'Follow-up','task':['Customize CV','Update Coverletter']},
                   {'role':'ST','company':'KPN','url':'www.KPN.com/dasrdca','stage':'Selection','task':['Customize CV','Attach Portfolio']}  ];
    $scope.toggle = true;
    $scope.isCollapsed = true;
    $scope.selectedIndex = -1;
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
            $scope.job_temp.push($scope.job);
            $scope.job={};
            
        }else{
            $scope.Wishlist[index]=$scope.job;
            $scope.job={};
        }
        
    }

    $scope.update = function(item){
        $scope.do = "edit";
        $scope.job.role = item.role;
        $scope.job.company = item.company;
        $scope.job.stage = item.stage;
        index = $scope.Wishlist.indexOf(item);
    }

     $scope.update = function(item){
        $scope.job.do = "edit";
        $scope.job.role = item.role;
        $scope.job.company = item.company;
        index = $scope.Wishlist.indexOf(item);
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
        $scope.task_id ++;
        var id = 'btn-'+ $scope.task_id
        var tasklist = angular.element($("#tasklist"));
        var addtask_html = "<div class='row' id ='"+id+"' ><input type='text' class='task-btn'> <span>"
          +"<button class='btn-xs' ng-click='RemoveTasks("+$scope.task_id+")'>Remove </button>"
         +"</span></input></div>"
        tasklist.append(addtask_html);
        var new_element = angular.element($('#'+id));
        new_element.on('click',   function(){
                var task = angular.element($("#"+id));
                task.remove();
            } );
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

    $scope.Show_this_Job=function(item){
        // console.log(item);
        $scope.thisjob=item;
        var modal=angular.element($('#thisJob'));  
        modal.modal('show');
        var body = angular.element($('body'));
        // // body.css('background-color','#F8F8FF');
        // body.addClass('body_colour_change');
        var jobs = angular.element($('#jobsview'));
        // // jobs.css({'width':'45%','background-color':'white'});
        // jobs.addClass('jobsview_change');
        var add_link = angular.element($('#addlink'));
        // add_link.css('width','50%');
        add_link.addClass('addlink_change');
        
        
        
        
       
        // var job = angular.element($('#job'+$scope.job_temp.indexOf(item)));
        // console.log($scope.job_temp.indexOf(item));
        // console.log(jobelement)
        // jobtitle.toggleClass('jobtitle_change');
    };
    
    $scope.itemClicked = function ($index) {
        $scope.selectedIndex = $index;
    };

    $scope.closeJobModal=function(){
        var body = angular.element($('body'));
        body.removeClass('body_colour_change'); 
        var jobs = angular.element($('#jobsview'));
        jobs.removeClass('jobsview_change');
        var add_link = angular.element($('#addlink'));
        add_link.removeClass('addlink_change');
        $scope.selectedIndex = -1;
        
    }

    $scope.gyphcolorchange = function(){

    }
  
});





//adding dropdown directive



 app.directive("dropdown",function(){
    return function(scope,element){
      element.bind("click",function(){
        if(element.find('.drop_down').hasClass('display_none'))
        {
          element.find('.drop_down').removeClass('display_none');
          element.find("#elementWrap").stop(true,true).delay(100).slideDown(350);
        }
        else
        {
          element.find("#elementWrap").stop(true,true).delay(100).slideUp(350,function(){
            element.find('.drop_down').addClass('display_none');
          });
        }
      });
    };
  });