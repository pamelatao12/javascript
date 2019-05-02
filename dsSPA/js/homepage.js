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

function showQueue() {
	this.reset();
	document.getElementById("queueContainer").style.display = "initial";
}

function showBST() {
	this.reset();
	document.getElementById("treeContainer").style.display = "initial";
}

function showHeap() {
	this.reset();
	document.getElementById("heapContainer").style.display = "initial";
}

function showHashMap() {
	this.reset();
	document.getElementById("hashMapContainer").style.display = "initial";	
}

function reset() {
	document.getElementById("arrayContainer").style.display = "none";
	document.getElementById("arrayListContainer").style.display = "none";
	document.getElementById("LLContainer").style.display = "none";
	document.getElementById("stackContainer").style.display = "none";
	document.getElementById("queueContainer").style.display = "none";
	document.getElementById("treeContainer").style.display = "none";
	document.getElementById("heapContainer").style.display = "none";
	document.getElementById("hashMapContainer").style.display = "none";
}

