const mysql = require('mysql');

config = {
	host: process.env.dbhost,
	port: process.env.dbport,
	user: process.env.dbuser,
	password: process.env.dbpwd,
	database: process.env.dbname
}

const con = mysql.createConnection(config);
con.connect((err)=>{
	if(err) console.log(err);
	else console.log("Connected");
})

module.exports = con;