function calculateTip() {
	var billAmt = Number(document.getElementById("billAmt").value);
	var service = Number(document.getElementById("service").value);
	var people = Number(document.getElementById("people").value);

	if (billAmt == 0) {
		alert("Please enter a valid bill amount.");
		return;
	}
	if (service == 0) {
		alert("Please select service quality.");
		return;
	}
	if (people == 0 || people == 1) {
		people = 1;
		document.getElementById("amtEach").style.display = "none";
	} else {
		document.getElementById("amtEach").style.display = "block";
	}


	var totalTip = (billAmt / 1.08875) * service;
	totalTip = Math.round(totalTip * 100) / 100;
	totalTip = parseFloat(totalTip.toFixed(2));

	var totalBill = billAmt + totalTip;
	totalBill = parseFloat(totalBill.toFixed(2));

	var amtEach = totalBill / people;
	amtEach = Math.round(amtEach * 100) / 100;
	amtEach = parseFloat(amtEach.toFixed(2));

	document.getElementById("results").style.display = "block";
	document.getElementById("calculator").style.borderRadius = "10% 10% 0% 0%";
	// document.getElementById("totalTip").style.display = "block";
	document.getElementById("tip").innerHTML = totalTip;
	// document.getElementById("totalBill").style.display = "block";
	document.getElementById("bill").innerHTML = totalBill;

	if (people > 1) {
		document.getElementById("each").innerHTML = amtEach;
	}
}

window.onload = function () {
document.getElementById("results").style.display = "none";

document.getElementById("calculatebtn").onClick = function() {
  calculateTip();
};
}
