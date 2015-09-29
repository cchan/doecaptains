
//I wonder if this actually works https://www.firebase.com/docs/android/guide/offline-capabilities.html
//Firebase.getDefaultConfig().setPersistenceEnabled(true); //FIREBASE IN-BROWSER PERSISTENCE DOES NOT EXIST YET.
var baseFirebaseURL = "https://doecaptains.firebaseio.com";
var currFirebaseURL = baseFirebaseURL + "/lexnsb_2015-2016";
//var currFirebaseURLRef=new Firebase(currFirebaseURL);
//currFirebaseURLRef.keepSynced(true);

$("input, textarea").on("keydown",function(e){if(!e)e=window.event;e.stopPropagation();})

//http://papermashup.com/read-url-get-variables-withjavascript/
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	vars[key] = value;
  });
  return vars;
}

//https://www.firebase.com/docs/web/libraries/angular/quickstart.html
var app = angular.module("DOECaptainsApp", ["firebase","ngCookies","ngAutocomplete"]);

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

app.controller("RoundView", function($scope){
	
});

app.controller("DOECaptainsController", ["$scope", "Round", "$firebaseArray", "$firebaseObject",
  function($scope, Round, $firebaseArray, $firebaseObject) {
	var date = new Date();
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	$scope.date = date.getDate()+"-"+monthNames[date.getMonth()]+"-"+date.getFullYear();
	
	$scope.baseFirebaseURL = baseFirebaseURL;
	$scope.currFirebaseURL = currFirebaseURL;
	
	var rounds = new Firebase(currFirebaseURL+"/rounds");
	$scope.availableRounds = $firebaseArray(rounds);
	
	$scope.unbindRound = function(){};
	
	$scope.members = $firebaseArray(new Firebase(currFirebaseURL+"/members"));
	
	if(getUrlVars().hasOwnProperty("roundID"))
	  $scope.loadRound(getUrlVars()["roundID"]);
	
	var connectedRef = new Firebase(baseFirebaseURL+"/.info/connected");
	connectedRef.on("value", function(snap) {
	  console.log("Connection state changed: "+(snap.val()?"connected":"disconnected"))
	  $scope.connected = !!snap.val();
	  
		//https://stackoverflow.com/questions/1119289/how-to-show-the-are-you-sure-you-want-to-navigate-away-from-this-page-when-ch
		if(!snap.val())
			window.onbeforeunload = function(e){
				e = e || window.event;
				if(e)e.returnValue = "You have unsynced changes! If you navigate away now, those changes will be lost.";
				return window.unloadMessage;
			};
		else
			setTimeout(function(){window.onbeforeunload = null;},200);
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
	  questions:[$scope.blankquestion()],
	}};
	
	$scope.reset = function(){
	  if(confirm("Are you sure you want to clear everything about this round?")){
		$scope.round.teams = [];
		$scope.round.questions = [$scope.blankquestion()];
		return true;
	  }
	  else return false;
	};
	
	$scope.regularroundteams = [ //Should never edit indices... change this.
	  {
		name: "Team 1",
		color: "red",
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
		color: "white",
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
		players:[{pos:"Player",name:"Someone",bind:"a"}],
	  },
	  {
		name: "Team 2",
		players:[{pos:"Player",name:"Someone",bind:"s"}],
	  },
	  {
		name: "Team 3",
		players:[{pos:"Player",name:"Someone",bind:"d"}],
	  },
	  {
		name: "Team 4",
		players:[{pos:"Player",name:"Someone",bind:"f"}],
	  },
	  {
		name: "Team 5",
		players:[{pos:"Player",name:"Someone",bind:"g"}],
	  },
	  {
		name: "Team 6",
		players:[{pos:"Player",name:"Someone",bind:"h"}],
	  },
	  {
		name: "Team 7",
		players:[{pos:"Player",name:"Someone",bind:"j"}],
	  },
	  {
		name: "Team 8",
		players:[{pos:"Player",name:"Someone",bind:"k"}],
	  },
	  {
		name: "Team 9",
		players:[{pos:"Player",name:"Someone",bind:"l"}],
	  },
	  {
		name: "Team 10",
		players:[{pos:"Player",name:"Someone",bind:";"}],
	  },
	];
	
	$scope.shiftPressed = false;
	$scope.keys=[];
	$scope.processKeydown = function(e){
		var kc = (typeof e.which == "number") ? e.which : e.keyCode;
		if(kc==16)$scope.shiftPressed=true;
		$scope.keys[kc] = true;
	}
	$scope.processKeyup = function(e){
		var kc = (typeof e.which == "number") ? e.which : e.keyCode;
		if(kc==16)$scope.shiftPressed=false;
		$scope.keys[kc] = false;
	}
	$scope.processKeypress = function(e){
		if(typeof e === "string")
			ch = e;
		else{
			var kc = (typeof e.which == "number") ? e.which : e.keyCode;
			var ch = String.fromCharCode(kc);
			console.log(ch);
		}
		
		if(kc == 13){
			if(!$scope.round.questions)$scope.round.questions=[$scope.blankquestion()];
			$scope.round.questions.push($scope.blankquestion());
		}else if(ch == " "){
			for(var i = 0; i < $scope.round.teams.length; i++){
				$scope.round.teams[i].lockedOut = false;
				$scope.round.teams[i].onBonus = false;
				for(var j = 0; j < $scope.round.teams[i].players.length; j++)
					$scope.round.teams[i].players[j].statusColor = "black";
			}
			$scope.round.statusMsg = "Buzzers cleared";
			$scope.round.buzzersLocked = false;
			$scope.round.doneQuestion = false;
			return false;
		}
		else if($scope.round.doneQuestion){
			return;
		}
		else if(!$scope.round.buzzersLocked){
			for(var i = 0; i < $scope.round.teams.length && !$scope.round.buzzersLocked; i++)
				for(var j = 0; j < $scope.round.teams[i].players.length && !$scope.round.buzzersLocked && !$scope.round.teams[i].lockedOut; j++)
					if($scope.round.teams[i].players[j].bind == ch){
						$scope.round.teams[i].players[j].statusColor = "#990";
						$scope.round.buzzersLocked = true;
						$scope.round.buzzerTeam = i;
						$scope.round.buzzerPlayer = j;
						$scope.round.statusMsg = "Buzzing: "+$scope.round.teams[i].name+" "+$scope.round.teams[i].players[j].pos+", "+$scope.round.teams[i].players[j].name+". Press 1 for correct or 2 for incorrect.";
					}
		}else if($scope.round.teams[$scope.round.buzzerTeam].onBonus){
			switch(ch){
				case "1":
					$scope.round.statusMsg = "Bonus correct! Go to next question with enter key.";
					$scope.round.doneQuestion = true;
					break;
				case "2":
					$scope.round.statusMsg = "Bonus incorrect. Go to next question with enter key.";
					$scope.round.doneQuestion = true;
					break;
			}
		}else{
			switch(ch){
				case "1":
					$scope.round.teams[$scope.round.buzzerTeam].players[$scope.round.buzzerPlayer].statusColor = "green";
					$scope.round.buzzersLocked = true;
					$scope.round.teams[$scope.round.buzzerTeam].onBonus = true;
					$scope.round.statusMsg = "Toss-up correct! On bonus now. Press 1 for correct or 2 for incorrect.";
					break;
				case "2":
					$scope.round.teams[$scope.round.buzzerTeam].players[$scope.round.buzzerPlayer].statusColor = "red";
					$scope.round.teams[$scope.round.buzzerTeam].lockedOut = true;
					$scope.round.buzzersLocked = false;
					$scope.round.statusMsg = "Incorrect! Buzzers locked for one team.";
					break;
				case "3":
					$scope.round.teams[$scope.round.buzzerTeam].players[$scope.round.buzzerPlayer].statusColor = "red";
					$scope.round.teams[$scope.round.buzzerTeam].lockedOut = true;
					$scope.round.buzzersLocked = false;
					$scope.round.statusMsg = "Blurt! Buzzers locked for one team.";
					break;
				case "4":
					$scope.round.teams[$scope.round.buzzerTeam].players[$scope.round.buzzerPlayer].statusColor = "red";
					$scope.round.teams[$scope.round.buzzerTeam].lockedOut = true;
					$scope.round.buzzersLocked = false;
					$scope.round.statusMsg = "Stall! Buzzers locked for one team.";
					break;
			}
		}
	}
  }
]);
