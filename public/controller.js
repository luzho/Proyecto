var myApp = angular.module('MyApp',[]);
var loginApp = angular.module('LoginApp',[]);
var taskApp = angular.module('TaskApp',[]);
var signApp = angular.module('SignApp',[]);

myApp.controller('AppCtrl',['$window','$scope','$http',function ($window,$scope,$http){
	
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
	localStorage.clear();
	$scope.login = "";
	$scope.login = function() {
		var params = {
			email : $scope.login.email,
			password : $scope.login.password
		};
		console.log(params);
		if(params.email != undefined && params.password != null){
			$http.post('/users/login',params).success(function (response){
				localStorage.setItem('id',response[0].id);
				$window.location = "task.html";
			});
		}else{
			//alert('Error logging data, please try again.');
			$scope.message = $sce.trustAsHtml('<div class="alert alert-danger"><strong>¡Error!</strong> logging data, please try again.</div>');
		}
	};

	$scope.signup = function() {
		$window.location = "signup.html";
	};

}]);

signApp.controller('SignCtrl',['$sce','$window','$scope','$http',function ($sce,$window,$scope,$http){
	localStorage.clear();
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
	userid = parseInt(localStorage.getItem('id'),10); 
	$scope.types = [{id: 1,type: 'En la manana'},{id: 2,type: 'En la Tarde'},
		{id: 3, type: 'En la noche'},{id: 4,type: 'Manana'},{id: 5,type: 'Pasado Manana'},
		{id: 6, type: 'El proximo fin de Semana'},{id: 7,type: 'La semana que viene'},
		{id: 8, type: 'Sin fecha'}];

	var refresh = function(){
		$http.get('/tasks/users/' + userid).success(function (response){
			console.log("I got the data i request");
			$scope.tasks = response;
			$scope.task = "";
		});
	};

	refresh();

	$scope.addTask = function(){
		console.log($scope.task);
		if($scope.task.type != undefined){
			$scope.task.type = $scope.task.type.id;
			console.log($scope.task);
			$http.post('/tasks/' + userid,$scope.task).success(function (response){
			console.log(response);
			refresh();
			if($scope.task.description != null && ($scope.task.date_create == undefined || $scope.task.date_planned == undefined) )
				$scope.message = $sce.trustAsHtml('<div class="alert alert-warning">Remember edit the task and put a valid date.</div>');
			});
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
		$scope.task.type = $scope.task.type.id;
		if($scope.task.date_planned != undefined && $scope.task.date_create != undefined){
			$http.put('/tasks', $scope.task).success(function (response){
				refresh();
			});
		}else{
			$scope.message = $sce.trustAsHtml('<div class="alert alert-danger"><strong>¡Error!</strong> Please, select a Type for the task.</div>');
		}
	};

	$scope.deselect = function() {
		$scope.task = "";
		$scope.task.date_create = "";
		$scope.message = "";
	};

}]);