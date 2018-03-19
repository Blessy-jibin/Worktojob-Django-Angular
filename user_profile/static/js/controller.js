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
        emnt = angular.element($('#'+element[i].id));
        emnt.css({"background-color": "blue"});
        emnt.val('selected');
        $scope.selectedTimeLine = id;
    }

    $scope.cvAction = {};
    $scope.SelectTimeline =  function(id) {
        var emnt = angular.element($('#'+ id));
        if ( $scope.cvAction.id == true) {
            emnt.css({"background-color": "blue"});
            $scope.cvAction.id = false;
        } else {
            emnt.css({"background-color": "blue"});
            $scope.cvAction.id = true;
        }
    }

    $scope.AddTasks = function(){
        var taskwrapper = angular.element(document.getElementById("taskwrapper"));
        var addtask_html = "<div class='row'><input type='text' class='task-btn'> <span>Add your task</span></input></div>"
        taskwrapper.append(addtask_html);

    }


    $scope.CustomStyle = {};
    $scope.BColor = "Blue";

    $scope.SetStyle = function () {
        $scope.CustomStyle = {
            'background-color': $scope.BColor,
        };
    }
});