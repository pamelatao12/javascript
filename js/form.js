function fadeOutEffect(form) {
  var fadeEffect = setInterval(function() {
    if (!form.style.opacity) {
      form.style.opacity = 1;
    }
    if (form.style.opacity > 0) {
      form.style.opacity -= 0.1;
    } else {
      clearInterval(fadeEffect);
    }
  }, 100);
}

var form = document.getElementById("gform");
var formDiv = document.getElementsByClassName("contactform")[0];
var formConfirmation = document.getElementById("formConfirmationDialog");

form.addEventListener("submit", function(e) {
  fadeOutEffect(form);
  setTimeout(function() {
    form.style.display = "none";
    formConfirmationDialog.style.display = "block";
  }, 1000);
});
