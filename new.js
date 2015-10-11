var baseFirebaseURL = "https://doecaptains.firebaseio.com";
var currFirebaseURL = baseFirebaseURL + "/lexnsb_2015-2016";

var app = angular.module("DOECaptainsApp", ["firebase"]);

app.controller("List", function($scope, $firebaseArray){
	$scope.init = function(fbPath,fields,predicate){
		$scope.predicate = predicate;
		$scope.direction = true;
		$scope.data = $firebaseArray(new Firebase(currFirebaseURL+fbPath));
		$scope.fields = fields;
		$scope.blank = {};
		for(var i = 0; i < $scope.fields.length; i++)
			$scope.blank[$scope.fields[i].name]="";
		$scope.search = $scope.blank;
	};
	
	//https://docs.angularjs.org/api/ng/filter/orderBy
	$scope.order = function(predicate) {
		$scope.direction = ($scope.predicate === predicate) ? !$scope.direction : false; //Defaults to downward when switch to diff column. If same column, toggles.
		$scope.predicate = predicate;
	};
	
	$scope.addNew = function(fbArr,blank){
		fbArr.$add(blank).then(function(ref){
			document.getElementById(ref.key()+"_name").focus();
		});
	};
	$scope.memberInMember = function(srch, members){
		var finalreturn = true;
		for(var key in srch){
			if(srch.hasOwnProperty(key)){
				if(srch[key]!=""){
					if(strInStr(srch[key],members[key]))
						return true;
					else
						finalreturn = false;
				}
			}
		}
		return finalreturn;
	};
	var strInStr = function(srch, str){
		if(srch == undefined)srch = "";
		if(str == undefined)str = "";
		
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
		if(confirm("Are you sure you want to delete this row?"))
			fbArr.$remove(item);
	};
	$scope.anyFieldsEmpty = function(object, fields){
		console.log('a');
		for(var i = 0; i < fields.length; i++)
			if(object[fields[i]]===undefined)
				return true;
		return false;
	}
});
