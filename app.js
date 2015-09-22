
//I wonder if this actually works https://www.firebase.com/docs/android/guide/offline-capabilities.html
//Firebase.getDefaultConfig().setPersistenceEnabled(true); //FIREBASE IN-BROWSER PERSISTENCE DOES NOT EXIST YET.
var baseFirebaseURL = "https://doecaptains.firebaseio.com";
var currFirebaseURL = baseFirebaseURL + "/lexnsb_2015-2016";
//var currFirebaseURLRef=new Firebase(currFirebaseURL);
//currFirebaseURLRef.keepSynced(true);

window.unloadMessage = "";
window.onbeforeunload = function(e){
	e = e || window.event;
	if(e)e.returnValue = unloadMessage;
	return window.unloadMessage;
};


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
	
	$scope.baseFirebaseURL = baseFirebaseURL;
	$scope.currFirebaseURL = currFirebaseURL;
	
	var rounds = new Firebase(currFirebaseURL+"/rounds");
	$scope.availableRounds = $firebaseArray(rounds);
	
	$scope.unbindRound = function(){};
	
	if(getUrlVars().hasOwnProperty("roundID"))
	  $scope.loadRound(getUrlVars()["roundID"]);
	
	var connectedRef = new Firebase(baseFirebaseURL+"/.info/connected");
	connectedRef.on("value", function(snap) {
	  console.log("Connection state changed: "+(snap.val()?"connected":"disconnected"))
	  $scope.connected = !!snap.val();
	  
		//https://stackoverflow.com/questions/1119289/how-to-show-the-are-you-sure-you-want-to-navigate-away-from-this-page-when-ch
		window.unloadMessage = snap.val() ? "Changes have been successfully synced, so it's ok to navigate away now."
			: "You have unsynced changes! If you navigate away now, those changes will be lost.";
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
		  {pos:"Player 4",name:"Someone",bind:"a"},
		  {pos:"Player 3",name:"Someone",bind:"s"},
		  {pos:"Player 2",name:"Someone",bind:"d"},
		  {pos:"Captain",name:"Someone",bind:"f"},
		  {pos:"Player 1",name:"Someone",bind:"g"},
		],
	  },
	  {
		name: "Team 2",
		players:[
		  {pos:"Player 1",name:"Someone",bind:"h"},
		  {pos:"Captain",name:"Someone",bind:"j"},
		  {pos:"Player 2",name:"Someone",bind:"k"},
		  {pos:"Player 3",name:"Someone",bind:"l"},
		  {pos:"Player 4",name:"Someone",bind:";"},
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
	
	$scope.processKeypress = function(e){
		var charCode = (typeof e.which == "number") ? e.which : e.keyCode
		console.log(String.fromCharCode(charCode));
	}
  }
]);
