
//I wonder if this actually works https://www.firebase.com/docs/android/guide/offline-capabilities.html
//Firebase.getDefaultConfig().setPersistenceEnabled(true);
var baseFirebaseURL = "https://doecaptains.firebaseio.com";
var currFirebaseURL = "https://doecaptains.firebaseio.com/lexnsb_2015-2016";
//var currFirebaseURLRef=new Firebase(currFirebaseURL);
//currFirebaseURLRef.keepSynced(true);

//http://papermashup.com/read-url-get-variables-withjavascript/
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	vars[key] = value;
  });
  return vars;
}

//https://www.firebase.com/docs/web/libraries/angular/quickstart.html
var app = angular.module("DOECaptainsApp", ["firebase","ngCookies"]);

app.factory("Round", ["$firebaseObject",
  function($firebaseObject) {
	return function(id) {
	  // create a reference to the database where we will store our data
	  var rounds = new Firebase(currFirebaseURL+"/rounds");
	  var rounddata;
	  if(id !== undefined && id !== null)
		rounddata = rounds.child(id);
	  else
		rounddata = rounds.push();
	  
	  // return it as a synchronized object
	  return $firebaseObject(rounddata);
	}
  }
]);

app.controller("DOECaptainsController", ["$scope", "Round", "$firebaseArray",
  function($scope, Round, $firebaseArray) {
	var date = new Date();
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	$scope.date = date.getDate()+"-"+monthNames[date.getMonth()]+"-"+date.getFullYear();
	
	var rounds = new Firebase(currFirebaseURL+"/rounds");
	$scope.availableRounds = $firebaseArray(rounds);
	
	$scope.unbindRound = function(){};
	
	if(getUrlVars().hasOwnProperty("roundID"))
	  $scope.loadRound(getUrlVars()["roundID"]);
	
	var connectedRef = new Firebase(baseFirebaseURL+"/.info/connected");
	connectedRef.on("value", function(snap) {
	  console.log("Connection state changed:"+(snap.val()?"true":"false"))
	  $scope.connected = !!snap.val();
	});
	
	$scope.newRound = function(){
	  $scope.unbindRound();
	  Round().$bindTo($scope,"round").then(function(unbind){
		$scope.roundID = $scope.round.$id;
		$scope.round = $scope.blankround();
		$scope.unbindRound = unbind;
		
		var rounds = new Firebase(currFirebaseURL+"/rounds");
		$scope.availableRounds = $firebaseArray(rounds);
	  });
	}
	$scope.loadRound = function(roundID){
	  $scope.unbindRound();
	  if(roundID!==undefined && roundID!=="")
		$scope.roundID = roundID;
	  Round($scope.roundID).$bindTo($scope,"round").then(function(unbind){
		$scope.unbindRound = unbind;
	  });
	};
	
	$scope.blankplayer = function(){return {pos:"Player",name:"Someone"};};
	$scope.blankteam = function(){return {name:"Team X",players:[$scope.blankplayer()]};};
	$scope.blankquestion = function(){return {};};
	$scope.blankround = function(){return {
	  name:"Unnamed Round",
	  date:"[MM/DD/YY]",
	  round:"Some Round From Somewhere Of Some Year",
	  detail:"",
	  teams: [$scope.blankteam(),$scope.blankteam()],
	  questions:[],
	}};
	
	$scope.reset = function(){
	  if(confirm("Are you sure you want to clear everything about this round?")){
		$scope.round.teams = [];
		$scope.round.questions = [];
		return true;
	  }
	  else return false;
	};
	
	$scope.regularroundteams = [ //Should never edit indices... change this.
	  {
		name: "Team 1",
		players:[
		  {pos:"Player 1",name:"Someone"},
		  {pos:"Captain",name:"Someone"},
		  {pos:"Player 2",name:"Someone"},
		  {pos:"Player 3",name:"Someone"},
		  {pos:"Player 4",name:"Someone"},
		],
	  },
	  {
		name: "Team 2",
		players:[
		  {pos:"Player 1",name:"Someone"},
		  {pos:"Captain",name:"Someone"},
		  {pos:"Player 2",name:"Someone"},
		  {pos:"Player 3",name:"Someone"},
		  {pos:"Player 4",name:"Someone"},
		],
	  },
	];
	$scope.speedroundteams = [
	  {
		name: "Team 1",
		players:[{pos:"Player",name:"Someone"}],
	  },
	  {
		name: "Team 2",
		players:[{pos:"Player",name:"Someone"}],
	  },
	  {
		name: "Team 3",
		players:[{pos:"Player",name:"Someone"}],
	  },
	  {
		name: "Team 4",
		players:[{pos:"Player",name:"Someone"}],
	  },
	  {
		name: "Team 5",
		players:[{pos:"Player",name:"Someone"}],
	  },
	  {
		name: "Team 6",
		players:[{pos:"Player",name:"Someone"}],
	  },
	  {
		name: "Team 7",
		players:[{pos:"Player",name:"Someone"}],
	  },
	  {
		name: "Team 8",
		players:[{pos:"Player",name:"Someone"}],
	  },
	  {
		name: "Team 9",
		players:[{pos:"Player",name:"Someone"}],
	  },
	  {
		name: "Team 10",
		players:[{pos:"Player",name:"Someone"}],
	  },
	];
	$scope.members = $firebaseArray(new Firebase(currFirebaseURL+"/members"));
  }
]);
