
function showArray() {
	this.reset();
	document.getElementById("arrayContainer").style.display = "initial";
}

function showArrayList() {
	this.reset();
	document.getElementById("arrayListContainer").style.display = "initial";
}

function showLL() {
	this.reset();
	document.getElementById("LLContainer").style.display = "initial";
}

function showStack() {
	this.reset();
	document.getElementById("stackContainer").style.display = "initial";
}

function reset() {
	document.getElementById("arrayContainer").style.display = "none";
	document.getElementById("arrayListContainer").style.display = "none";
	document.getElementById("LLContainer").style.display = "none";
	document.getElementById("stackContainer").style.display = "none";
}

