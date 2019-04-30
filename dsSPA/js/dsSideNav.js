function openNav(element) {
  document.getElementById(element).style.height = "300px";
  document.getElementById(element).style.paddingLeft = "20px"; 
  document.getElementById(element).style.paddingTop = "20px";
}

function closeNav(element) {
  document.getElementById(element).style.height = "0";
  document.getElementById(element).style.paddingLeft = "0px";  
  document.getElementById(element).style.paddingTop = "0px";
}