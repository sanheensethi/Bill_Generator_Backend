status = localStorage.getItem("LoginStatus");
function move(){
	window.location.href='http://localhost:3000/public/dashboard.html';
}
if("LoginStatus" in localStorage){
	move();
}

