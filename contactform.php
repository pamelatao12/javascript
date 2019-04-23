<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Pamela</title>
    <link rel="stylesheet" type="text/css" href="styles/styles.css">
    <link href="https://fonts.googleapis.com/css?family=Pinyon+Script" rel="stylesheet">
    <script type="text/javascript"src="js/sidenav.js"></script>
    <script type="text/javascript" src="js/date.js"></script>
    <style>
       @import url('https://fonts.googleapis.com/css?family=Quicksand');

    </style>
</head>

<body>

	<div id="leftHalf">
		<div id="navbtn">
		<span style="font-size:30px;color:dimgray;cursor:pointer;padding-left: 20px;" onclick="openNav()">&#9776;</span>
	</div>

	<div id="mySidenav" class="sidenav">
	  <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
	  <a href="pamela.html">HOME</a>
	  <a href="about.html">ABOUT</a>
	  <a href="blog.html">BLOG</a>
	  <a href="projects.html">PROJECT</a>
	  <a href="contact.html">CONTACT</a>
	  <a href="https://www.facebook.com/downtownithaca" class="icon-side"><img src="images/linkedin.svg" alt="li"></a>
	  <a href="https://www.youtube.com/user/downtownithaca" class="icon-side"><img src="images/github.svg" alt="gh"></a>
	  <a href="https://twitter.com/downtownithaca" class="icon-side"><img src="images/mail.svg" alt="m"></a>

	</div>


		<div id="contact_nav_bar"> <!--navigation bar link to projects and posts -->
			<ul>
				<li class="nav">
					<a href="pamela.html">HOME</a>
				</li>
				<li class="nav">
					<a href="about.html">ABOUT</a>
				</li>
				<li class="nav">
					<a href="blog.html">BLOG</a>
				</li>
				<li class="nav">
					<a href="projects.html">PROJECTS</a>
				</li>
				<li class="nav">
					<a href="contact.html">CONTACT</a>
				</li>
			</ul>
		</div> <!-- closing nav_bar div -->
		<div class="logo">
			<img src="images/pamelalogo.svg" alt="text">
		</div> <!-- closing logo div -->

		<div class="heading">
			<h1 class="name">CONTACT ME</h1>
		</div>
		<div class="contactform">
			<?php
			// define variables and set to empty values
				function died($error) {
			        // your error code can go here
			        echo "We are very sorry, but there were error(s) found with the form you submitted. ";
			        echo "These errors appear below.<br /><br />";
			        echo $error."<br /><br />";
			        echo "Please go back and fix these errors.<br /><br />";
			        die();
			    }
 
 
			    // validation expected data exists
			    if(!isset($_POST['name']) ||
			        !isset($_POST['email']) ||
			        !isset($_POST['message'])) {
			        died('We are sorry, but there appears to be a problem with the form you submitted.');       
			    }
 
     
 
			    $first_name = $_POST['name']; // required
			    $last_name = $_POST['email']; // required
			    $email_from = $_POST['message']; // required
			    $company = $_POST['company']; // not required
			 
			    $error_message = "";
			    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
			 
				if(!preg_match($email_exp,$email)) {
				$error_message .= 'The Email Address you entered does not appear to be valid.<br />';
				}

				$string_exp = "/^[A-Za-z .'-]+$/";

				if(!preg_match($string_exp,$name)) {
				$error_message .= 'The Name you entered does not appear to be valid.<br />';
				}

				if(strlen($message) < 2) {
				$error_message .= 'The message you entered does not appear to be valid.<br />';
				}

				if(strlen($error_message) > 0) {
				died($error_message);
				}
 

     
			    function clean_string($string) {
			      $bad = array("content-type","bcc:","to:","cc:","href");
			      return str_replace($bad,"",$string);
			    }
			 
			 	$email_to = "pamelatao12@gmail.com";
				$email_subject = "Contacting you from your website";
			    
				$email_message = "Form details below.\n\n";
			 
			    $email_message .= "Name: ".clean_string($name)."\n";
			    $email_message .= "Email: ".clean_string($email)."\n";
			    $email_message .= "Company: ".clean_string($company)."\n";
			    $email_message .= "Message: ".clean_string($message)."\n";


				$headers = 'From: '.$email."\r\n".
				'Reply-To: '.$email."\r\n" .
				'X-Mailer: PHP/' . phpversion();
				@mail($email_to, $email_subject, $email_message, $headers);
			?>

			<p> Thanks for the message, <?php echo $name; ?>!<br>
			I will be in touch with you soon.
			</p>
		</div>
		
	</div>
	
</body>
</html>