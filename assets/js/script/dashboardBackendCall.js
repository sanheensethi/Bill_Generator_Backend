const url = "http://localhost:5000/invoice";
const result = apiGET(url);
console.log(result);
result.then((data)=>{
	getId("invoiceID").value = data.invoice_id;
});

function generateBill(){

	invoice_id = getId("invoiceID").value;
	console.log(invoice_id)
	customerName = getId('customername').value;
	mobilenumber = getId('mobileNumber').value;
	date = getId('date').value;

	if(customerName == ""){
		getId("alertmessage").innerHTML = "Please write Customer Name";
		getId("alert").style.display = "block";
		setTimeout(()=>{
			getId("alert").style.display = "none";
		},5000);
		getId("customername").focus();
	}else if(mobilenumber == ""){
		getId("alertmessage").innerHTML = "Please write Customer Mobile Number";
		getId("alert").style.display = "block";
		setTimeout(()=>{
			getId("alert").style.display = "none";
		},5000);
		getId("mobileNumber").focus();
	}else if(date == ""){
		getId("alertmessage").innerHTML = "Please select the Date";
		getId("alert").style.display = "block";
		setTimeout(()=>{
			getId("alert").style.display = "none";
		},5000);
		getId("date").focus();
	}else{
		data = localStorage.getItem("itemList");
		data = JSON.parse(data);
		let totalAmount = bill();
		datasend = {status:200,invoiceId:invoice_id,customer:customerName,mobile:mobilenumber,date:date,items:data.list,totalAmount:totalAmount};
		let url2 = 'http://127.0.0.1:5000/generate';
		let result = apiPOST(url2,datasend);
		result.then((data)=>{
			console.log(data);
		})
	}

	localStorage.removeItem("sno");
	localStorage.removeItem("itemList");

	tempSave = {
	total:0,
	list:[
		// {
		// sno:0,
		// item:"",
		// quantity:0,
		// price:0,
		// amount:0
		// }
		]
	}

	if("itemList" in localStorage){

	}else{
		localStorage.setItem("itemList",JSON.stringify(tempSave));
	}

	if("sno" in localStorage){

	}else{
		localStorage.setItem("sno",JSON.stringify({total:0}));
	}

}