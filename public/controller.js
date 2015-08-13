var myApp = angular.module('MyApp',[]);
var loginApp = angular.module('LoginApp',[]);
var taskApp = angular.module('TaskApp',[]);
var signApp = angular.module('SignApp',[]);

myApp.controller('AppCtrl',['$window','$scope','$http',function ($window,$scope,$http){
	$scope.styles = "display:none";
	var refresh = function(){
		$http.get('/users').success(function (response){
			console.log("I got the data i request");
			$scope.users = response;
			$scope.user = "";
			
		});
	};

	refresh();

	$scope.addUser = function(){
		console.log($scope.user);
		$http.post('/users',$scope.user).success(function (response){
			console.log(response);
			refresh();
		});
	}

	$scope.remove = function(id) {
		console.log(id);
		$http.delete('/users/' + id).success(function (response){
			refresh();
		});
	};

	$scope.edit = function(id) {
		$http.get('/users/' + id).success(function (response){
			console.log(response);
			$scope.user = response[0];
		});
	};

	$scope.update = function() {
		console.log($scope.user.id);
		$http.put('/users', $scope.user).success(function (response){
			refresh();
		});
	};

	$scope.deselect = function() {
		$scope.user = "";
	};

}]);

loginApp.controller('LoginCtrl',['$sce','$window','$scope','$http',function ($sce,$window,$scope,$http){
	sessionStorage.clear();
	$scope.login = "";
	$scope.login = function() {
		var params = {
			email : $scope.login.email,
			password : $scope.login.password
		};
		console.log(params);
		if(params.email != undefined && params.password != null){
			$http.post('/users/login',params).success(function (response){
				sessionStorage.setItem('id',response[0].id);
				$window.location = "task.html";
			});
		}else{
			$scope.message = $sce.trustAsHtml('<div class="alert alert-danger"><strong>¡Error!</strong> logging data, please try again.</div>');
		}
	};

	$scope.signup = function() {
		$window.location = "signup.html";
	};

	$scope.email = function() {
		var params = {
			email : $scope.login.email,
			password : $scope.login.password
		};
		console.log(params);
		if(params.email != undefined){
			$http.get('/email',params).success(function (response){
				console.log("hell yeah");
			});
			$scope.message = $sce.trustAsHtml('<div class="alert alert-success"><strong>¡Send Email!</strong></div>');
		}else{
			$scope.message = $sce.trustAsHtml('<div class="alert alert-warning"><strong>If you want to recover your password please enter your email and then give the button</strong></div>');
		}
	};

}]);

signApp.controller('SignCtrl',['$sce','$window','$scope','$http',function ($sce,$window,$scope,$http){
	sessionStorage.clear();
	$scope.sign = "";
	$scope.signup = function() {
		var params = {
			name : $scope.sign.name,
			lastname : $scope.sign.lastname,
			email : $scope.sign.email,
			password : $scope.sign.password
		};
		console.log(params);
		if(params.email != undefined && params.name != null && params.lastname != null && params.password != null){
			$http.post('/users',params).success(function (response){
				$scope.message = $sce.trustAsHtml('<div class="alert alert-success"><strong>¡Successful registration!</strong></div>');
				$scope.sign = "";
			});
		}else{
			$scope.message = $sce.trustAsHtml('<div class="alert alert-danger"><strong>¡Error!</strong> logging data, please try again.</div>');
		}
	};

	$scope.login = function() {
		$window.location = "login.html";
	};

}]);

taskApp.controller('TaskCtrl',['$sce','$window','$scope','$http',function ($sce,$window,$scope,$http){
	userid = parseInt(sessionStorage.getItem('id'),10); 

	$scope.reminders = [{id: 1,reminder: 'Morning'},{id: 2,reminder: 'Afternoon'},
		{id: 3, reminder: 'Night'},{id: 4,reminder: 'Tomorrow'},{id: 5,reminder: 'After Tomorrow'},
		{id: 6, reminder: 'Next Weekend'},{id: 7,reminder: 'Next Week'},
		{id: 8, reminder: 'No Date'}];

	$scope.types = [{id: 1,type: 'Work'},{id: 2,type: 'Personal'},
		{id: 3, type: 'Extra'}];

	var refresh = function(){
		if(!isNaN(userid)){
			document.getElementById("body").style = "";
			$http.get('/tasks/users/' + userid).success(function (response){
				console.log("I got the data i request");
				$scope.tasks = response;
				$scope.task = "";
			});
		}
	};

	refresh();

	$scope.allow = function() {
		refresh();
	}

	$scope.addTask = function(){
		console.log($scope.task);
		if($scope.task.type != undefined){
			if($scope.task.reminder != undefined){
				$scope.task.type = $scope.task.type.id;
				$scope.task.reminder = $scope.task.reminder.id;
				console.log($scope.task);
				if($scope.task.date_create == undefined){
					$scope.task.date_create = null;
					if($scope.task.date_planned == undefined)
						$scope.task.date_planned = null;
				}else if($scope.task.date_planned == undefined){
					$scope.task.date_planned == null;
				}
					$scope.message = $sce.trustAsHtml('<div class="alert alert-warning">Remember edit the task and put a valid date.</div>');
					$http.post('/tasks/' + userid,$scope.task).success(function (response){
						console.log(response);
						refresh();			
					});
			}else{
				$scope.message = $sce.trustAsHtml('<div class="alert alert-danger"><strong>¡Error!</strong> Please, select a Reminder for the task.</div>');
			}
		}else{
			$scope.message = $sce.trustAsHtml('<div class="alert alert-danger"><strong>¡Error!</strong> Please, select a Type for the task.</div>');
		}
	}

	$scope.remove = function(id) {
		console.log(id);
		$http.delete('/tasks/' + id).success(function (response){
			refresh();
		});
	};

	$scope.edit = function(id) {
		$http.get('/tasks/' + id).success(function (response){
			console.log(response);
			$scope.task = response[0];
			if (response[0]['date_create'] != null)
				$scope.task.date_create = response[0]['date_create'].split('T')[0];
			if (response[0]['date_planned'] != null)
				$scope.task.date_planned = response[0]['date_planned'].split('T')[0];
		});
	};

	$scope.update = function() {
		console.log($scope.task);
		if($scope.task.type != undefined){
			if($scope.task.reminder != undefined){
				$scope.task.type = $scope.task.type.id;
				$scope.task.reminder = $scope.task.reminder.id;
				if($scope.task.date_create == undefined){
					$scope.task.date_create = null;
					if($scope.task.date_planned == undefined){
						$scope.task.date_planned = null;
						$scope.message = $sce.trustAsHtml('<div class="alert alert-danger"><strong>¡Error!</strong> Date Error. Not found or Incorrect</div>');
					}else{
						$scope.task.priority = 1;
					}
				}else if($scope.task.date_planned == undefined){
					$scope.task.date_planned == null;
					$scope.message = $sce.trustAsHtml('<div class="alert alert-danger"><strong>¡Error!</strong> Date Error. Not found or Incorrect</div>');
				}else{
					$scope.task.priority = 1;
				}
				
					$http.put('/tasks', $scope.task).success(function (response){
						refresh();
					});
			}else{
				$scope.message = $sce.trustAsHtml('<div class="alert alert-danger"><strong>¡Error!</strong> Please, select a Reminder for the task.</div>');
			}
		}else{
			$scope.message = $sce.trustAsHtml('<div class="alert alert-danger"><strong>¡Error!</strong> Please, select a Type for the task.</div>');
		}
	};

	$scope.deselect = function() {
		$scope.task = "";
		$scope.task.date_create = "";
		$scope.message = "";
	};

	$scope.logout = function(){
		sessionStorage.clear();
		window.location = '/';
	};

	$scope.filter = function(){
		var date = null;
		var type = 0;
		var reminder = 0;
		console.log($scope.filters);
		if($scope.filters != undefined){
				//$scope.message = $sce.trustAsHtml('<div class="alert alert-warning">Put a valid date to filter.</div>');
				if($scope.filters.date != undefined){
					date = $scope.filters.date;
				}
				if($scope.filters.type != undefined){
					type = $scope.filters.type.id;
				}
				if($scope.filters.reminder != undefined){
					reminder = $scope.filters.reminder.id;
				}
				console.log(date+' '+type+' '+reminder);
				var obj = [];
				var i;
				$http.get('/tasks/users/' + userid).success(function (response){
					
					if(date != null || type != 0 || reminder != 0){
							for (i=0; i<Object.keys(response).length; i++) {
								if(response[i].date_planned == null){
			  						if(date == null){
				  						if(type != 0){
				  							if(type == response[i].type){
				  								if(reminder != 0){
				  									if(reminder == response[i].reminder){
				  										obj.push(response[i]);
				  									}
				  								}else{
				  									obj.push(response[i]);
				  								}
				  							}else{
				  								obj.push(response[i]);
				  							}
				  						}else{
				  							if(reminder != 0){
				  									if(reminder == response[i].reminder){
				  										obj.push(response[i]);
				  									}
				  								}else{
				  									obj.push(response[i]);
				  								}
				  						}
				  					}
			  					}else if(date != null && date == response[i].date_planned.split('T')[0]){
			  						
				  						if(type != 0){
				  							if(type == response[i].type){
				  								if(reminder != 0){
				  									if(reminder == response[i].reminder){
				  										obj.push(response[i]);
				  									}
				  								}else{
				  									obj.push(response[i]);
				  								}
				  							}else{
				  								obj.push(response[i]);
				  							}
				  						}else{
				  							if(reminder != 0){
				  									if(reminder == response[i].reminder){
				  										obj.push(response[i]);
				  									}
				  								}else{
				  									obj.push(response[i]);
				  								}
				  						}
			  						
			  					}else{
			  						if(type != 0){
				  							if(type == response[i].type){
				  								if(reminder != 0){
				  									if(reminder == response[i].reminder){
				  										obj.push(response[i]);
				  									}
				  								}else{
				  									obj.push(response[i]);
				  								}
				  							}else{
				  								obj.push(response[i]);
				  							}
				  						}else{
				  							if(reminder != 0){
				  									if(reminder == response[i].reminder){
				  										obj.push(response[i]);
				  									}
				  								}else{
				  									obj.push(response[i]);
				  								}
				  						}
			  					}
							}
						console.log(obj);
						$scope.tasks = obj;
						$scope.task = "";
					}else{
						$scope.tasks = response;
						$scope.task = "";
					}
				});
		}else{
			$scope.message = $sce.trustAsHtml('<div class="alert alert-danger"><strong>¡Error!</strong> Nothing to filter.</div>');
		}	
	};

}]);