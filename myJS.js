
//view
var view = {
	//метод получает строковое сообщение и выводит его в области сообщений
	showMassages:function(massage){
		let messageArea = document.getElementById("messageArea");
		messageArea.innerHTML=massage;
	},
	//метод ,который присваевает класс с изображением при ложном выстреле(не попал)
	showMissmg:function(location){
		let getMissLoc = document.getElementById(location);
		getMissLoc.setAttribute("class", "miss");
	},
	//метод , который присваевает класс с изображением в случает точном выстреле
	showShip: function(location){
		let getHitLoc = document.getElementById(location);
		getHitLoc.setAttribute("class", "hit");
	}
};


//model
var model={
	quantityShip:3,
	shipLength:3,
	sizeArea:7,
	sunkShip:0,
	ships:[{location:[0,0,0], hits:['','','']},
		   {location:[0,0,0], hits:['','','']},
		   {location:[0,0,0], hits:['','','']}
	],
	fire:function(chose){
		for (var i = 0; i < this.quantityShip; i++) {
			var ship = this.ships[i];
			var index =ship.location.indexOf(chose);
			if(index>=0){
				ship.hits[index]="hit";
				view.showShip(chose);
				view.showMassages("HIT!!!");
				if (this.isSunk(ship)) {
					this.sunkShip++;
					view.showMassages("You hited my ship , I don't have " + this.sunkShip+" ship :(")
				}
				return true;
			} 
		}
		view.showMissmg(chose);
		view.showMassages("You MISSED!");
		return false;
	},
	isSunk:function(ship){
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i]!=="hit") {
				return false;
			}
		}
		return true;
	},
	generateNewLocationForShips:function(){
		var location;
		for (var i = 0; i < this.quantityShip; i++) {
			do {
				location=this.generateNewShips();}
				while(this.collision(location));
				this.ships[i].location=location;
			}
	},
	generateNewShips:function(){
		var direction= Math.floor(Math.random()*2);
		var row, col;
		if (direction===1) {
			row = Math.floor(Math.random()*this.sizeArea);
			col= Math.floor(Math.random()*(this.sizeArea-this.shipLength));}
		else{
			row= Math.floor(Math.random()*(this.sizeArea-this.shipLength));
			col = Math.floor(Math.random()*this.sizeArea);
		}
		var newShipLocations =[];
		for (var i = 0; i < this.shipLength; i++) {
			if(direction===1){
				newShipLocations.push(row+""+(col+i));
			}
			else{
				newShipLocations.push((row+i)+""+col);
			}
		}
		return newShipLocations;
	},
	 collision:function(locations){
	 	for (var i = 0; i <this.quantityShip; i++) {
	 		var ship = model.ships[i];
	 		for (var k = 0; k < locations.length; k++){
				if(ship.location.indexOf(locations[k])>=0){
	 				return true;
						}
	 				}
				}
	 	return false;
	 }
};
var controller ={
	guesses:0,
	parseChose:function(chose){
		var letters = ["A", "B", "C", "D", "E", "F"];
		if(chose.length!==2 || chose===null)
		{
			console.log(chose);
			alert("You made mistake! Try again");
		}
		else{
			firstSymbol=chose.charAt(0);
			var firstNumber=letters.indexOf(firstSymbol);
			var secondNumber = chose.charAt(1);
			if(isNaN(firstNumber) || isNaN(secondNumber) ){
				alert("Ops!");
			}
			else if (firstNumber<0 || firstNumber>=model.sizeArea || secondNumber<0 ||secondNumber>=model.sizeArea) {
				alert("You made mistake! Try again");
			}
			else{
				return firstNumber+secondNumber;
				}
			}
			return null;

		},
	receivedShots:function(chose){
		var location= this.parseChose(chose);
		if(location){
			this.guesses++;
			var hit = model.fire(location);
			if(hit&&model.sunkShip===model.quantityShip){
				
				view.showMassages("You sunked all my " + model.sunkShip+ " ships in "+this.guesses+ " guesses :( ");
			}
		}

	}
	
	};

window.onload=init;

function init(){
	var btn = document.getElementById("buttonForFire");
	btn.onclick=fireBtnOnclick;
	var choseInput = document.getElementById("userHit");
	choseInput.onkeypress=keyPress;

	model.generateNewLocationForShips();
}
function fireBtnOnclick(){
	var input =document.getElementById("userHit");
	var chose = input.value;
	controller.receivedShots(chose);
	input.value="";
}

function keyPress(e){
	var btn = document.getElementById("buttonForFire");
	if(e.keyCode===13){
		btn.click();
		return false;
	}

}



