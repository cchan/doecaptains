var baseFirebaseURL = "https://doecaptains.firebaseio.com";
var currFirebaseURL = baseFirebaseURL + "/lexnsb_2015-2016";

var app = angular.module("DOECaptainsApp", ["firebase"]);

app.controller("List", function($scope){
	//https://docs.angularjs.org/api/ng/filter/orderBy
	$scope.order = function(predicate) {
		$scope.direction = ($scope.predicate === predicate) ? !$scope.direction : false;
		$scope.predicate = predicate;
	};
	$scope.addNew = function(fbArr,blank){
		if(blank===undefined)
			blank = {name:""};
		fbArr.$add(blank).then(function(ref){
			document.getElementById(ref.key()+"_name").focus();
		});
	};
	$scope.searchTerm = "";
	$scope.strInStr = function(srch,str){
		console.log(srch,str);
		srch = srch.toLowerCase();
		str = str.toLowerCase();
		
		if(srch == "")return true;
		if(srch.length > str.length)return false;
		
		//Searching for wherever one of the words in the name matches.
		var ind = -1;
		while((ind=str.indexOf(srch,ind+1))!==-1)
			if(ind == 0 || str[ind-1]==' ')
				return true;
		return false;
	};
	$scope.remove = function(fbArr, item){
		if(confirm("Are you sure you want to delete this player?"))
			fbArr.$remove(item);
	};
});
