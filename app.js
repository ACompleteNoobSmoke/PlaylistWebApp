//import the express module
var express = require('express');

//import body-parser
var bodyParser = require('body-parser');

//store the express in a variable 
var app = express();

//use for mysql database
var mysql = require('mysql');
//var { response } = require('express');
//var { response2 } = require('express');

//use to create database connection
var con = mysql.createConnection({
    user: "root",
    password: "codingroot1!",
    database: "WebSQL"
})

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(express.static(__dirname + '/pages'))

//configure body-parser for express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//app.use(express.static(__dirname + '/design'))


//This piece of code creates the server  
//and listens to the request at port 3000
//we are also generating a message once the 
//server is created
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});




//#region -- Server Pages
//allow express to access our html file
var link = ' ';
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/" + "pages/HomePage.htm");
    link = '/';
});

app.get('/register', function(req, res) {
    res.sendFile(__dirname + "/" + "pages/RegistrationPage.htm");
})

app.get('/registerSaved', function(req, res) {
    res.sendFile(__dirname + "/" + "pages/TargetPage.htm");
});

app.get('/registerSuccess', function(req, res) {
    res.redirect('/registerSaved');
})

app.get('/registerFail', function(req, res) {
    res.redirect('/register')
})

app.get('/signinSuccess', function(req, res) {
    res.redirect('/registerSaved');
})

app.get('/signinFail', function(req, res) {
    res.redirect('/');
})

app.get('/about', function(req, res) {
    res.sendFile(__dirname + "/" + "pages/AboutPage.htm");
    link = '/about';
})

app.get('/news', function(req, res) {
    res.sendFile(__dirname + "/" + "pages/NewsPage.htm");
    link = '/news';
})

app.get('/contact', function(req, res) {
    res.sendFile(__dirname + "/" + "pages/ContactPage.htm");
    link = '/contact';
})

//#endregion -- End Of Server Pages

//#region -- POST Methods
//route the GET request to the specified path, "/user". 
//This sends the user information to the path  
app.post('/signin', function(req, res) {
    var signData = {}
    signData[0] = req.body.userName;
    signData[1] = req.body.userPassWord;

    //this line is optional and will print the response on the command prompt
    //It's useful so that we know what infomration is being transferred 
    //using the server
    console.log(signData);

    //convert the response in JSON format
    //res.end(JSON.stringify(response));

    signUpDatabase(signData, function(result) {
        dataWorked = result;
        var signAddress = ' ';
        if (dataWorked == null) {
            console.log(signData[0] + ' ' + signData[1] + " Profile Does Not Exist");
            signAddress = link
        } else {
            console.log(signData[0] + ' ' + signData[1] + " Profile Exist");
            signAddress = '/signinSuccess';
        }
        res.redirect(signAddress);
    });
});

app.post('/returningUser', function(req, res) {
    var data = {}
    data[0] = req.body.fname;
    data[1] = req.body.lname;
    data[2] = req.body.uname;
    data[3] = req.body.email;
    data[4] = req.body.pwd;

    console.log(data);

    registerDatabase(data, function(result) {
        dataWorked = result;
        var regAddress = ' ';
        if (dataWorked == true) {
            console.log("Profile Saved");
            regAddress = '/registerSuccess';
        } else {
            console.log(data[0] + " Already Exist");
            regAddress = '/registerFail';
        }
        res.redirect(regAddress);
    });
});

//#endregion -- End Of Post Methods

//#region -- Database Methods

var dataWorked = ' ';

//Checks database for sign in information
function signUpDatabase(signData, callback) {
    var username = signData[0];
    var pwd = signData[1];
    var sql = "SELECT * FROM WebUser Where userName = '" + username + "' And password = '" + pwd + "'";
    con.query(sql, function(err, result) {
        var existingProfile = false;
        if (result == 0) {
            existingProfile = null;
        } else {
            existingProfile = result;
        }
        dataWorked = existingProfile;
        callback(existingProfile)
    });
}

//Puts User Information Into Database
function registerDatabase(data, callback) {
    var fname = data[0];
    var lname = data[1];
    var uname = data[2]
    var email = data[3];
    var pwd = data[4];
    var sql = "INSERT INTO WebUser (firstName, lastName, userName,  email, password) VALUES ('" + fname + "', '" + lname + "', '" + uname + "', '" + email + "', '" + pwd + "' )";
    con.query(sql, function(err, result) {
        var savedProfile = false;
        if (err) {
            savedProfile = false;
        } else {
            savedProfile = true;
        }
        dataWorked = savedProfile;
        callback(savedProfile)
    });
}

//#endregion -- End of Database Methods