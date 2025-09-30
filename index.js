import express from "express"; //express for creatin server
import mysql from "mysql"; //connecting to local database
import bodyParser from "body-parser"; //reading user input from forms 
import bcrypt from "bcrypt"; //hashing passwords from user input

const app = express();
const port = 3000;


app.listen(port, ()=>{
	console.log(`Connected on Port: ${port}`);
});

let con = mysql.createConnection(
	{
		host: "localhost",
		user: "root",
		password: "Bong1Themb@",
		database: "studentCreds"
	}
); //configure connection to database

con.connect((err)=>{
	if (err) throw err;
	console.log("Connected");
}) //connect to database

app.use(express.static("public")); //styles and js in this folder
app.use(bodyParser.urlencoded({extended: true})); //middleware for handling user input.

app.get("/", (req, res)=>{
res.render("registration.ejs");
})

app.get("/login", (req, res)=>{
	res.render("login.ejs");
})

app.post("/register", (req, res)=>{
	let name = req.body["fullname"];
	let email = req.body["email"];
	let password = req.body["password"];
	let finalPassword = req.body["retypePassword"];
	const saltRounds = 10;

	if (password != finalPassword){
		res.render("registration.ejs", {message: "Passwords much match"});
	}

	else {
		bcrypt.hash(finalPassword, saltRounds, function (err, hash) {
    		if (err) {
        	console.error(err);
			return;
    		}

			let sql = `INSERT INTO students (name, email, password) VALUES (?, ?, ?)`;
			con.query(sql, [name, email, hash], function (err, result){
			if (err) throw err;
			console.log("1 record inserted");
			res.render('registration.ejs', {message: "Registration Successful! Log in to Continue."});
			})
		});
	}
})
