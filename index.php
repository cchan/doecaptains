<?php
/*
name
email
subject1
subject2
money


schedule the whole year


tossup	bio		IntCorrect	IntCorrect
bonus	chem	IntWrong	IntWrong
		ess		RegCorrect	RegCorrect
		phys	RegWrong	RegWrong
		math	Blurt		Blurt
		energy

migrate to gdocs
attendance-taker
studying during practice is good - nsa style
*/
?>

<style>
//column shading css
</style>

<?php
//this needs to be javascripted
	//on click, the game mechanics move on. Can disable one side, highlight bonus, etc.
	//but also must give ctrl-z option
	//live backend/cookie event saving - in case browser crashes


/*
"event": either someone ANSWERED, or someone

*/

$teams = array("A","B"); //can have more
$roles = array("1","Cap","2","3","4"); //can have more
$buzzes = array("IC"=>4,"IW"=>-4,"C"=>4,"W"=>0,"Bl"=>-4,"St"=>-4); //blurts and stalls can also be interrupts

$subjs = array("B","Ch","P","Es","M","En"); //can have more

?>
<div>Round: <input type="text" /></div> <!--Use path-to-round?-->
<table border="1">
	<tr>
		<th colspan="2">Question</th>
	<?php foreach ($teams as $team){ ?>
		<th colspan="5">Team <?=$team?></th>
		<th colspan="3">Scoring</th>
	<?php }?>
	</tr>
	<tr>
		<!--https://stackoverflow.com/questions/15806925/how-to-rotate-text-left-90-degree-and-cell-size-is-adjusted-according-to-text-in-->
		<th>Question</th>
		<th>Subject</th>
		
	<?php foreach($teams as $team){ 
		foreach($roles as $role){
			echo "
		<th>{$team}{$role} - <span class='{$team}{$role} name'><?=</span></th>";
		}?>
		
		<th>Bonus</th>
		<th>Penalty</th>
		<th>Score</th>
	<?php }?>
	
	</tr>
	<tr>
		<td><span class="number"></span></td>
		<td><select class="subj"><option selected></option><?php foreach($subjs as $subj)echo "<option>{$subj}</option>";?></select></td>
		
	<?php foreach($teams as $team){
		foreach($roles as $role){
			echo "
		<td><select class='{$team}{$role} answer'><option selected></option>";
			foreach($buzzes as $buzz)
				echo "<option>{$buzz}</option>";
			echo "</select></td>";
		}?>
		
		<td><select class="<?=$team?>Bonus"><option selected>0</option><option>10</option></select></td>
		<td><span class="<?=$team?>PenaltyAward"></span></td>
		<td><span class="<?=$team?>Score"></span></td>
	<?php }?>
	</tr>
</table>

