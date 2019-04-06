var itemArray = {};
var peopleOrders = [];
var index = 0;
var tabindex = 2;

function onloadListItem() {
	var item = document.getElementById("item");
	var price = document.getElementById("itemAmt");
	var dollarSign = document.getElementById("text");
	for (var i = 0; i < 2; i++) {
		var itemclone = item.cloneNode(true);
		itemclone.tabIndex = tabindex++;
		var priceclone = price.cloneNode(true);
		priceclone.tabIndex = tabindex++;
		var dollarSignClone = dollarSign.cloneNode(true);
		document.getElementById("left").appendChild(itemclone);
		document.getElementById("right").appendChild(dollarSignClone);
		document.getElementById("right").appendChild(priceclone);
	}
}

function addListItem() {
	var item = document.getElementById("item");
	var price = document.getElementById("itemAmt");
	var dollarSign = document.getElementById("text");
	var itemclone = item.cloneNode(true);
	itemclone.value = "";
	itemclone.tabIndex = tabindex++;
	var priceclone = price.cloneNode(true);
	priceclone.value = "";
	priceclone.tabIndex = tabindex++;
	var dollarSignClone = dollarSign.cloneNode(true);
	document.getElementById("left").appendChild(itemclone);
	document.getElementById("right").appendChild(dollarSignClone);
	document.getElementById("right").appendChild(priceclone);
}

function enterReceipt() {
	var preAmt = Number(document.getElementById("preAmt").value);
	var postAmt = Number(document.getElementById("postAmt").value);
	if (preAmt == 0) {
		alert("Please enter the bill before tax and tip.");
		return;
	}
	if (postAmt == 0) {
		alert("Please enter the total bill after tax and tip.");
		return;
	}

	document.getElementById("mycalculator").style.display = "inline-block";
	var prices = document.getElementsByClassName('itemAmount');
	var items = document.getElementsByClassName('itemname');
	document.getElementById("foodname").innerHTML = items[0].value; //set first item
	document.getElementById("foodprice").value = prices[0].value;

	var checkbox = document.getElementById("fooditem");
	for (var i = 1; i < items.length; i++) {
		if (items[i].value != "") {
			var checkboxclone = checkbox.cloneNode(true);

			document.getElementById("finalitems").appendChild(checkboxclone);
			checkboxclone.lastElementChild.innerHTML = items[i].value;
			checkboxclone.firstElementChild.value = prices[i].value;
		}
	}

	// enter all items into array
	var checkedItems = document.getElementsByClassName('container');
	var itemObject = {};
	// add all food items to dict with value of 0
	for (var i = 0; i < checkedItems.length; i++) {
			var numPeople = checkedItems[i].lastElementChild.innerHTML;
			itemArray[numPeople] = 0;
	}
}

function calculatePP() {
	document.getElementById("splitAmtHead").style.display = "inline-block";
	document.getElementById("splitAmt").style.display = "inline-block";
	var personclone = document.getElementById("person").cloneNode(true);

	var preAmt = Number(document.getElementById("preAmt").value);
	var postAmt = Number(document.getElementById("postAmt").value);
	document.getElementById("totalPP").innerHTML = "$" + postAmt;
	var name = document.getElementById("name").value;
	var percentAdded = (postAmt / preAmt); 

	document.getElementById("splitAmt").prepend(personclone);
	personclone.lastElementChild.innerHTML = 0;
	

	if (preAmt == 0) {
		alert("Please enter the bill before tax and tip.");
		return;
	}
	if (postAmt == 0) {
		alert("Please enter the total bill after tax and tip.");
		return;
	}
	if (name === "") {
		alert("Please enter a name.");
		return;
	}

	// create new person object with orders and add to array, also update values
	// in itemArray
	var checkedItems = document.getElementsByClassName('container');
	var personOrder = {};
	for (var i = 0; i < checkedItems.length; i++) {
		var key = checkedItems[i].lastElementChild.innerHTML + "";
		personOrder[key] = checkedItems[i].firstElementChild.checked;
		peopleOrders[index] = personOrder;

		if (checkedItems[i].firstElementChild.checked == true) {
			// if checkbox is checked, update value in itemArray
			console.log(itemArray);
			// var itemObject = itemArray[i];
			var numPeople = checkedItems[i].lastElementChild.innerHTML;
			var newValue = itemArray[numPeople] + 1;	
			itemArray[numPeople] = newValue;
			console.log(itemArray);
		}
	}
	index++;

	// created array of person order objects that saves each person's
	// orders
	// next step: iterate through cloned person and update values in itemArray
	//iterate through every 'person', iterate through array (from back to front)
	// calculate totalPP per person depending on items checked and newValue


	var addedPeople = document.getElementsByClassName('person');
	var peopleIndex = peopleOrders.length - 1;

	for (var i = 0; i < addedPeople.length - 1; i++) {
		var totalPP = 0;
		for (var j = 0; j < checkedItems.length; j++) {
			var newKey = checkedItems[j].lastElementChild.innerHTML + "";

			var personObject = peopleOrders[peopleIndex];
			var peopleValue = personObject[newKey];
			if (peopleValue == true) {
				var numPeople = checkedItems[j].lastElementChild.innerHTML;
				var newValue = itemArray[numPeople];
				totalPP += ((checkedItems[j].firstElementChild.value) / newValue);
			}
		}
		totalPP *= percentAdded;
		totalPP = Math.round(totalPP * 100) / 100;
		totalPP = parseFloat(totalPP.toFixed(2));
		personclone.firstElementChild.innerHTML = name;
		addedPeople[i].lastElementChild.innerHTML = "$" + totalPP;

		peopleIndex--;
	}
}

// function changePP() {
// 	var addedPeople = document.getElementsByClassName('person');
// 	for (var i = 0; i < addedPeople.length - 1; i++) {
// 		addedPeople[i].lastElementChild.innerHTML = 
// 	}
// }

// iterate through each person, and the things they ordered. check if checkbox is checked,
// if checked, then check if the innerHTML == the same food that the current person
// ordered. 

// create an array, every time the item is checked, ++ to the associated index
// in the array
// totalPP += the total for the item divided by the number in the array
// at its associated index



window.onload = function () {
	onloadListItem();
	document.getElementById("splitAmtHead").style.display = "none";
	document.getElementById("splitAmt").style.display = "none";
	document.getElementById("mycalculator").style.display = "none";
}
