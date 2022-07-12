status = localStorage.getItem("LoginStatus");
function move(){
	window.location.href='http://localhost:3000/index.html';
}
if("LoginStatus" in localStorage){
	let loginAuth = JSON.parse(status);
	// console.log(loginAuth);
	user_id = loginAuth.id;
	user_name = loginAuth.username;
	data = {
		userid:user_id,
		username:user_name
	};

	url = 'http://127.0.0.1:5000/auth';
	let result = apiPOST(url,data);
	result.then((data)=>{
		// console.log(data);
		if(data.status == 404){
			console.log("Hello");
			localStorage.removeItem("LoginStatus");
			move();
		}
	})

}else{
	move();
}