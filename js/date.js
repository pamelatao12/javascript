function getDate() {
	console.log("GetDate");
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();

	switch (mm) {
		case 1 : 
			mm = "January";
			break;
		case 2: 
			mm = "February";
			break;
		case 3:
			mm = "March";
			break;
		case 4:
			mm = "April";
			break;
		case 5:
			mm = "May";
			break;
		case 6:
			mm = "June";
			break;
		case 7:
			mm = "July";
			break;
		case 8:
			mm = "August";
			break;
		case 9:
			mm = "September";
			break;
		case 10:
			mm = "October";
			break;
		case 11:
			mm = "November";
			break;
		case 12:
			mm = "December";
			break;
	}

	today = mm + " " + dd + ", " + yyyy;
	document.write(today);
}


