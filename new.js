var baseFirebaseURL = "https://doecaptains.firebaseio.com";
var currFirebaseURL = baseFirebaseURL + "/lexnsb_2015-2016";

var app = angular.module("DOECaptainsApp", ["firebase", "ngCookies"]);

function copyFbRecord(oldRef, newRef) {    
	oldRef.once('value', function(snap)  {
	console.log(snap);
		newRef.set( snap.val(), function(error) {
			if( error && typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
		});
	});
}
//var oldRef = new Firebase(baseFirebaseURL+"/"+CryptoJS.SHA3(PASSWORD).toString()+"/lexnsb_2015-2016");var newRef =new Firebase(baseFirebaseURL+"/X"+CryptoJS.SHA3(PASSWORD).toString()+"/lexnsb_2015-2016"); copyFbRecord(oldRef,newRef);

app.controller("IndexLogin", function($scope,$cookies){
	var fb = new Firebase(baseFirebaseURL);
	$scope.pwd = "";
	$scope.authed = null;
	
	$scope.login = function(authpath){
		if(!authpath)
			var authpath = "X"+CryptoJS.SHA3($scope.pwd);
		
		fb.child(authpath).once("value",function(snapshot){
			$scope.pwd = "";
			if(snapshot.exists()){
				$cookies.put("authpath",authpath);
				$scope.authed = true;
			}else{
				$scope.logout();
				alert("failed login");
			}
			$scope.$digest();
		});
	};
	$scope.logout = function(){
		$cookies.remove("authpath");
		$scope.authed = false;
	};
	$scope.processLoginKeypress = function(e){
		if(e.keyCode == 13)
			$scope.login();
	};
	
	if($cookies.get("authpath"))
		$scope.login($cookies.get("authpath"));
	else
		$scope.logout();
});

app.controller("List", function($scope, $firebaseArray, $cookies){
	var currFirebaseURL = baseFirebaseURL + "/" + $cookies.get("authpath") + "/lexnsb_2015-2016";
	
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
app.controller("Members", function($scope, $firebaseArray){
	//IMPORT
	/*var str = "Vivek Bhupatiraju <triforce314@gmail.com>, Will Sherwood <whsherwood@gmail.com>, Afareen Jaleel <afareenj@gmail.com>, Aiyappa Kodendera <pandikary@gmail.com>, Andrew Wang <andrewwang86@gmail.com>, Bharat Srirangam <bharatsrirangam@gmail.com>, Cathwin <cricketgottachirp@gmail.com>, Clive Chan <doobahead@gmail.com>, Derik Kauffman <derikk@me.com>, DOE Captains <doecaptains@gmail.com>, Eric Xia <ericzxia@gmail.com>, Evan Fang <fangevan85@gmail.com>, Jason DiMasi <notjasonderulo99@gmail.com>, John Guo <johnguolex@gmail.com>, Karen Zhou <karenz12321@gmail.com>, Nicholas Gould <ngould@sch.ci.lexington.ma.us>, Ravi Raghavan <ravi1998@gmail.com>, Robert Pohlman <rpohlman@sch.ci.lexington.ma.us>, Shivi Maheswaran <shivimaheswaran@gmail.com>, Snigdha Allaparthi <snigy2000@gmail.com>, Sophia Zhang <szhanghdp@gmail.com>, Vishnu Amrit <vishnuamritpydah@gmail.com>";
	var spl = str.split(", ");
	var arr = new Array();
	for(var i = 0; i < spl.length; i++){
		arr[i]={};
		arr[i].name=spl[i].split(" <")[0];
		arr[i].email=spl[i].split(" <")[1].slice(0,-1);
		$scope.$parent.data.$add(arr[i]);
	}
	console.log(arr);*/
	
	$scope.$parent.init("/members", [
		{name:"name",width:"15em",display:"Name"},
		{name:"email",width:"8em",display:"Email"},
		{name:"grade",width:"2em",display:"Grade"},
		{name:"subj1",width:"10em",display:"Subject 1"},
		{name:"subj2",width:"10em",display:"Subject 2"}
	], "name");
});
app.controller("Rounds", function($scope, $firebaseArray){
	$scope.$parent.init("/rounds", [
		{name:"name",width:"15em",display:"Name"},
		{name:"date",width:"8em",display:"Date YY-MM-DD"}
	], "date");
});
