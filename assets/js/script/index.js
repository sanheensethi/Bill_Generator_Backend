function getId(id){
	return document.getElementById(id);
}

loginForm = getId("loginform");
resetForm = getId("forgotpassword");
enterOtp = getId("enterOTP");
message = getId("message");

loginForm.style.display = 'block';
resetForm.style.display = 'none';
enterOTP.style.display = 'none';
message.style.display = 'none';

function reset(){
	loginForm.style.display = 'none';
	resetForm.style.display = 'block';
}

function resetAgain(){
	loginForm.style.display = 'block';
	resetForm.style.display = 'none';
}

// LOGIN BTN
loginBtn = getId("login");
loginBtn.addEventListener("click",function(event){
	event.preventDefault();
	user = getId("username").value;
	pwd = getId("password").value;

	url = 'http://127.0.0.1:5000/login';
	let result = apiPOST(url,{username:user,password:pwd});
	result.then((data)=>{
		if(data.status == 200){
			settingLocalData = {id:data.user_id,username:data.username};
			localStorage.setItem("LoginStatus",JSON.stringify(settingLocalData));
			window.location.href = "http://localhost:3000/public/dashboard.html";
		}else if(data.status == 404){
			message.innerHTML = "No User Found";
			message.style.display = 'block';
			setTimeout(()=>{
				message.innerHTML = "";
				message.style.display = 'none';
			},2000);
			console.log("No User Found");
		}
	})

});

// RESET PASSWORD BTN
resetBtn = getId("forgot");
resetBtn.addEventListener("click",(event)=>{
	event.preventDefault();
	user_email = getId("email").value;
	getId("email").value = "";

	url = 'http://127.0.0.1:5000/reset'
	data = {email:user_email};
	let result = apiPOST(url,data);
	result.then((data)=>{
		if(data.status == 200){
			getId("emailotp").value = data.id;
			resetForm.style.display = 'none';
			enterOTP.style.display = 'block';

			message.innerHTML = data.message;
			message.style.display = 'block';
			setTimeout(()=>{
				message.innerHTML = "";
				message.style.display = 'none';
			},10000);

		}else if(data.status == 404){
			message.innerHTML = "No User Found";
			message.style.display = 'block';
			setTimeout(()=>{
				message.innerHTML = "";
				message.style.display = 'none';
			},2000);
		}else if(data.status == 500){
			message.innerHTML = "INTERNAL SERVER ERROR";
			message.style.display = 'block';
			setTimeout(()=>{
				message.innerHTML = "";
				message.style.display = 'none';
			},5000);
			console.log("Internal Server Error")
		}
	})

})

// OTP VALIDATE BTN
otpBtn = getId("otpbtn");
otpBtn.addEventListener("click",function(event){
	event.preventDefault();
	
	const user_id = getId("emailotp").value;
	const otp = getId("otp").value;
	const newPwd = getId("newpwd").value;

	sendingData = {id:user_id,OTP:otp,newPassword:newPwd};

	url = 'http://127.0.0.1:5000/validate';
	let result = apiPOST(url,sendingData);
	result.then((data)=>{
		if(data.status == 200){
			console.log(data.message);
			message.innerHTML = data.message;
			message.style.display = 'block';
			setTimeout(()=>{
				message.innerHTML = "";
				message.style.display = 'none';
			},2000);

			loginForm.style.display = 'block';
			resetForm.style.display = 'none';
			enterOTP.style.display = 'none';

		}else if(data.status == 404){
			console.log("Wrong OTP");
			message.innerHTML = data.message;
			message.style.display = 'block';
			setTimeout(()=>{
				message.innerHTML = "";
				message.style.display = 'none';
			},2000);
			console.log("Internal Server Error")
			loginForm.style.display = 'none';
			resetForm.style.display = 'block';
			enterOTP.style.display = 'none';
		}
	})

});




