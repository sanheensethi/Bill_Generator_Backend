//backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config');
const nodemailer = require('nodemailer');
const md5 = require('md5');
const fs = require('fs');
var pdf = require("pdf-creator-node")

const app = express();

// parse req body into json
app.use(express.json());
app.use(cors());

function sendOTPMail(email,otp){
	var transporter = nodemailer.createTransport({
	  service: process.env.SERVICE,
	  auth: {
	    user: process.env.OTP_EMAIL,
	    pass: process.env.OTP_EMAIL_PWD
	  }
	});

	var mailOptions = {
	  from: process.env.OTP_EMAIL,
	  to: email,
	  subject: 'ADMIN PANEL OTP',
	  text: `Your OTP is : ${otp}`
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});

}

// login
app.post('/login',(req,res)=>{
	const username = req.body.username;
	const password = req.body.password;
	const HashPassword = md5(password);
	data = [username,HashPassword];
	db.query("SELECT * FROM admin WHERE username = ? AND password = ?",data,(error,result)=>{
		if(error) throw error;
		else{
			if(result.length != 0){
				res.send({status:200,user_id:result[0].id,username:result[0].username});
			}else{
				res.send({status:404,message:"No User Found."})
			}
		}
	})

});

// auth
app.post('/auth',(req,res)=>{
	const username = req.body.username;
	const userid = req.body.userid;
	data = [username,userid];
	db.query("SELECT * FROM admin WHERE username = ? AND id = ?",data,(error,result)=>{
		if(error) throw error;
		else{
			if(result.length != 0){
				res.send({status:200,user_id:result[0].id,username:result[0].username});
			}else{
				res.send({status:404,message:"No User Found."})
			}
		}
	})

});

// reset password
app.post('/reset',(req,res)=>{
	// console.log(req.body);
	const email = req.body.email;
	data = [email];
	db.query("SELECT * FROM admin WHERE email = ?",data,(error,result)=>{
		if(error) throw error;
		else{
			if(result.length != 0){
				// person exists.
				_otp = Math.ceil(Math.random()*100000);

				insertData = {id:result[0].id,otp:_otp};
				let otpmessage;
				db.query("INSERT INTO resetpassword SET ?",insertData,(err,result,field)=>{
					if(err) throw err;
					else{
						if(result.affectedRows == 1){
							sendOTPMail(email,_otp);
							res.send({status:200,id:insertData.id,message:"OTP has been sent to your mail."});
						}else{
							res.send({status:500,message:"INTERNAL SERVER ERROR"});
						}
					}
				});
			}else{
				res.send({status:404,message:"User Not Found"})
			}
		}
	})
})


app.post('/validate',(req,res)=>{
	const userId = req.body.id;
	const OTP = req.body.OTP;
	const newPassword = req.body.newPassword;
	const newHashPassword = md5(newPassword);
	data = [userId,OTP];
	db.query("Select * from resetpassword WHERE id = ? and otp = ?",data,(error,result)=>{
		if(error) throw error;
		if(result.length != 0 ){
			updateData = [newHashPassword,userId];
			db.query("Delete from resetpassword WHERE id = "+userId);
			db.query("UPDATE admin SET password = ? WHERE id = ?",updateData,(error,result)=>{
				if(error) throw error;
				else{
					res.send({status:200,message:"Password Changed."});
				}
			})
		}else{
			db.query("Delete from resetpassword WHERE id = "+userId);
			res.send({status:404,message:"Wrong OTP"});
		}
	})

});


app.get('/invoice',(_,res)=>{
	db.query("SELECT MAX(invoice_id) as last_id FROM invoice",(error,result)=>{
		newId = result[0].last_id + 1;
		res.send({status:200,invoice_id:newId});
	})
});


function pdfCreate(data){
	let options = { format: "A4", orientation: "portrait", border: "10mm" };
	let html = fs.readFileSync('billTemplate.html', 'utf8')
	var doc = {
		    html: html,
		    data: data,
		    path: `./bills/output_${data.bill_id}.pdf`
		};
	pdf.create(doc, options)
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.error(error)
    });
}

app.post('/generate',(req,res)=>{
	let invoice_id = req.body.invoiceId;
	let customerName = req.body.customer;
	let mobileNumber = req.body.mobile;
	let date = req.body.date;
	let buyList = req.body.items;
	let amount = Number(0);
	for(let obj of buyList){
		amount+=parseInt(obj.amount);
	}

	console.log("amount: ",amount);
	let cgst = Number((9/100)*amount).toFixed(2);
	let sgst = Number((9/100)*amount).toFixed(2);
	let totalAmount = Number(cgst) + Number(sgst) + Number(amount);

	let data = [mobileNumber];
	db.query("SELECT * FROM customer WHERE mobilenumber = ?",data,(error,result)=>{
		if(result.length == 0){
			let data = {mobilenumber:mobileNumber,customername:customerName};
			db.query("INSERT INTO customer SET ?",data,(error,result)=>{
				if(error) throw error;
				else console.log(result);
			});
		}

		let D = new Date();
		let hour = D.getHours().toString();
		let minutes = D.getMinutes().toString();
		let seconds = D.getSeconds().toString();
		let time = date + ` ${hour}:${minutes}:${seconds}`
		let data = [parseInt(invoice_id),parseInt(mobileNumber),JSON.stringify({status:"200",data:buyList}),time]
		let pdfData = {
			bill_id : invoice_id,
			customer_name:customerName,
			mobile_number:mobileNumber,
			date_time:"YYYY-MM-DD : "+time,
			items:buyList,
			cgst:" 9 %: "+cgst,
			sgst:" 9 %: "+sgst,
			total:totalAmount
		};
		console.log(pdfData);
		pdfFile = pdfCreate(pdfData);
		console.log(pdfFile)
		db.query("INSERT into invoice VALUES (?,?,?,?)",data,(error,result)=>{
			if(error){
				throw error;
			}
			else{
				res.send({status:200});
			}
		});
	});
});

app.get('/download/:id',(req,res)=>{
	let invoice_id = req.params.id;
	res.download(`${__dirname}/bills/output_${invoice_id}.pdf`);
})

app.get('/totalData',(req,res)=>{
	db.query("SELECT *,CONVERT_TZ(invoice.date_time,'+00:00','+05:30') as time from invoice INNER JOIN customer ON invoice.mobile_number = customer.mobilenumber AND mobile_number != 123456789; ",(error,result)=>{
		if(error) throw error;
		else{
			console.log(result);
			res.send({status:200,result:result});
		}
	});
})

PORT = process.env.port || 80
const server = app.listen(PORT);
server.keepAliveTimeout = 61 * 1000;