async function apiPOST(url,data){
	return fetch(url,{
		method:'post',
		body:JSON.stringify(data),
		headers:{
			'Content-Type':'application/json'
		}
	}).then((d)=>{
		return d.json();
	});
}

async function apiGET(url){
	return fetch(url).then((d)=>{
		return d.json();
	});
}