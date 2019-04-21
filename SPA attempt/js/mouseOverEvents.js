var value;

function mouseOver(element) {
	var value = document.getElementById(element).innerHTML;
	var index = "" + element;
	index = index.charAt(index.length - 1);
	document.getElementById(element).innerHTML = "Index: " + index;
	document.getElementById(element).style.transition = "none";
	document.getElementById(element).style.backgroundColor = "rgb(195, 195, 195)";
	document.getElementById(element).style.color = "black";
	document.getElementById(element).style.fontSize = "16px";
	this.value = value;
}

function mouseOut(element) {
	document.getElementById(element).innerHTML = this.value;
	document.getElementById(element).style.backgroundColor = "#f2f2f2";
	document.getElementById(element).style.fontSize = "20px";
	if (this.value == "") {
		document.getElementById(element).style.color = "#f2f2f2";
	} else {
		document.getElementById(element).style.color = "black";
	}
}