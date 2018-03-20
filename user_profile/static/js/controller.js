var app = angular.module('myApp', []);

app.controller("myCtrl", function($scope) {
    $scope.Wishlist = [];
    $scope.job = {};
    $scope.tasks=[];
    $scope.AddJob = function() {
        $scope.job.do = "add";
        $scope.job.company = " ";
        $scope.job.role = " ";
    }
    $scope.sve = function(){
        if($scope.job.do == "add"){
            $scope.Wishlist.push($scope.job);
            $scope.job = {};
        }else{
            $scope.Wishlist[index]=$scope.job;
            $scope.job={};
        }
    }

    $scope.update = function(item){
        $scope.job.do = "edit";
        $scope.job.role = item.role;
        $scope.job.company = item.company;
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
            var btn = angular.element($('#'+element[i].id));
            btn.css({"background-color": "white"});
            btn.val('unslected');
        }

        emnt = angular.element($('#'+id));
        emnt.css({"background-color": "blue"});
        emnt.val('selected');
        $scope.selectedTimeLine = id;
    }

  
    $scope.task_id = 100;
    $scope.AddTasks = function(){
        $scope.task_id ++;
        var tasklist = angular.element($("#tasklist"));
        var addtask_html = "<div class='row' id ='"+$scope.task_id+"' ><input type='text' class='task-btn'> <span>"
         +"<button class='btn-xs' onClick = function {alert('test')} ng-click='RemoveTasks("+$scope.task_id+")'>Remove </button></span></input></div>"
        tasklist.append(addtask_html);

    }

    $scope.RemoveTasks = function(task_id){
        var tasklist = angular.element($("#tasklist"));
        var task = angular.element($("#task_id"));
        console.log(task_id,task,tasklist);
        tasklist.remove(task);

    }

    $scope.CustomStyle = {};
    $scope.BColor = "Blue";

    $scope.SetStyle = function () {
        $scope.CustomStyle = {
            'background-color': $scope.BColor,
        };
    }
});