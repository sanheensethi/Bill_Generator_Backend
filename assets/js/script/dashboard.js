function getId(id){
	return document.getElementById(id);
}

function logout(){
	localStorage.removeItem("LoginStatus");
	window.location.href = "http://localhost:3000/index.html";
}

getId("alert").style.display = 'none';

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


function required(){
	let billBody = getId("billBody");

	data = localStorage.getItem("itemList");
	data = JSON.parse(data);
let template = ``;
	for(let obj of data.list){
		let sno = obj.sno;
		template += `
		<tr id="itemdetail${sno}">
      <th scope="row" class="sno" id="sno${sno}">#</th>
      <td class="item">
        <input type="text" id="item${sno}" class="form-control">
      </td>
      <td class="quantity">
        <input type="text" id="quantity${sno}" class="form-control">
      </td>
      <td class="price">
        <input type="text" id="price${sno}" onkeyup="calculateAmount(${sno})" class="form-control">
      </td>
      <td class="amount" id="amount${sno}">{amount}</td>
      <td><input type="submit" class="btn btn-success" onclick=saveTemp(${sno}) id="itemsave${sno}" value="SAVE">
      <input type="submit" style="display:none" class="btn btn-danger" onclick="removeMe(${sno})" id="itemdelete${sno}" value="DELETE"></td>
    </tr>
	`;
	}
 
	billBody.innerHTML += template;
	
	data = localStorage.getItem("itemList");
	data = JSON.parse(data);
	console.log(data)
	for(let obj of data.list){
		getId(`item${obj.sno}`).value = obj.item;
		getId(`quantity${obj.sno}`).value = obj.quantity;
		getId(`price${obj.sno}`).value = obj.price;
		getId(`amount${obj.sno}`).innerHTML = obj.amount;
	}

	totalCalc();

}

required();

function addChild(){
	let data = localStorage.getItem("sno");
	data = JSON.parse(data);
	let sno = data.total;
	sno = sno+1;
	localStorage.setItem("sno",JSON.stringify({total:sno}));
	let billBody = getId("billBody");

	let template = `
		<tr id="itemdetail${sno}">
      <th scope="row" class="sno" id="sno${sno}">#</th>
      <td class="item">
        <input type="text" id="item${sno}" class="form-control">
      </td>
      <td class="quantity">
        <input type="text" id="quantity${sno}" class="form-control">
      </td>
      <td class="price">
        <input type="text" id="price${sno}" onkeyup="calculateAmount(${sno})" class="form-control">
      </td>
      <td class="amount" id="amount${sno}">{amount}</td>
      <td><input type="submit" class="btn btn-success" onclick=saveTemp(${sno}) id="itemsave${sno}" value="SAVE">
      <input type="submit" style="display:none" class="btn btn-danger" onclick="removeMe(${sno})" id="itemdelete${sno}" value="DELETE"></td>
    </tr>
	`;
	billBody.innerHTML += template;
	
	data = localStorage.getItem("itemList");
	data = JSON.parse(data);
	console.log(data)
	for(let obj of data.list){
		getId(`item${obj.sno}`).value = obj.item;
		getId(`quantity${obj.sno}`).value = obj.quantity;
		getId(`price${obj.sno}`).value = obj.price;
		getId(`amount${obj.sno}`).innerHTML = obj.amount;

		let deleteBtn = getId(`itemdelete${obj.sno}`);
		let saveBtn = getId(`itemsave${obj.sno}`);
		deleteBtn.style.display = 'block';
		saveBtn.style.display = 'none';
	}

}

function removeMe(id){

	let deleteBtn = getId(`itemdelete${id}`);
	let saveBtn = getId(`itemsave${id}`);
	deleteBtn.style.display = 'none';
	saveBtn.style.display = 'block';

	let data = localStorage.getItem("itemList");
	data = JSON.parse(data);
	data.total = data.total - 1;

	var removeIndex = data.list.map(function(item) { return item.sno; }).indexOf(id);
	data.list.splice(removeIndex, 1);
	
	localStorage.setItem("itemList",JSON.stringify(data));

	const element = getId("itemdetail"+id);
	element.remove();

	totalCalc();
}

function saveTemp(id){
	let sno = id;
	let item = getId(`item${id}`).value;
	let quantity = getId(`quantity${id}`).value;
	let price = getId(`price${id}`).value;
	let amount = getId(`amount${id}`).innerHTML;

	let deleteBtn = getId(`itemdelete${id}`);
	let saveBtn = getId(`itemsave${id}`);
	deleteBtn.style.display = 'block';
	saveBtn.style.display = 'none';

	let toSave = {
		sno:sno,
		item:item,
		quantity:quantity,
		price:price,
		amount:amount
	};

	
	let data = localStorage.getItem("itemList");
	data = JSON.parse(data);

	// check already exists or not
	found = false;
	for(obj of data.list){
		if(obj.sno == id){
			found = true;
			break;
		}
	}

	if(found === false){
		data.total = data.total + 1;
		data.list.push(toSave)
		localStorage.setItem("itemList",JSON.stringify(data));
	}else{
		let deleteBtn = getId(`itemdelete${id}`);
		let saveBtn = getId(`itemsave${id}`);
		deleteBtn.style.display = 'block';
		saveBtn.style.display = 'none';
	}

	totalCalc();
}

function calculateAmount(id){
	let quantity = getId(`quantity${id}`).value;
	let price = getId(`price${id}`).value;
	getId(`amount${id}`).innerHTML = parseFloat(quantity)*parseFloat(price);
	totalCalc();
}

function totalCalc(){
	let amount = 0;
	data = localStorage.getItem("itemList");
	data = JSON.parse(data);
	// console.log(data)
	for(let obj of data.list){
		amount += parseInt(obj.amount);
	}
	getId("cgst").value = ((9/100)*amount).toFixed(2);
	getId("sgst").value = ((9/100)*amount).toFixed(2);
	getId("total").value = (amount + (9/100)*amount + (9/100)*amount).toFixed(2);
}

function bill(){
	let amount = 0;
	data = localStorage.getItem("itemList");
	data = JSON.parse(data);
	// console.log(data)
	for(let obj of data.list){
		amount += parseInt(obj.amount);
	}
	return (amount + (9/100)*amount + (9/100)*amount).toFixed(2);
}