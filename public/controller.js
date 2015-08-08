var myApp = angular.module('MyApp',[]);

myApp.controller('AppCtrl',['$scope','$http',function ($scope,$http){
	
	$scope.style_1 = "display:none";
	$scope.style_2 = "";
	

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

	$scope.login = function(email) {
		console.log(email);
	};

}]);
