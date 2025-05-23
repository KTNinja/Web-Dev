const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const SECRET_KEY = "secret key to be used";


/*
while signup take the user's username and password and add it to the local users file
{
    "username": user,
    "password": pass,
    // later on
    "token": token
}

while signing in, 
first check if the user exists in the users array and if found,
sign in the user successfully and return to him his unique TOKEN, also, add this token to the founduser object

what can be done using headers and authorisation next time onwards, that will be seen


*/

let users = [];



app.use(express.json());

app.post('/signin', (req, res) => {

    console.log("BEFORE SIGNIN :- ", users);
    let user = req.body.username;
    let pass = req.body.password;

    let foundUser = users.find((obj) => {
        if(obj.username === user && obj.password === pass) return obj;
    })
    let foundUserIndex = users.findIndex(obj => obj === foundUser);

    if(foundUser){
        let token = jwt.sign({
            username: user
        }, SECRET_KEY);
        // users[foundUserIndex].token = token;
        res.json({
            "token": token
        })
    }
    console.log("AFTER SIGNIN :- ", users);

})

app.post('/signup', (req, res) => {

    console.log("BEFORE SIGNUP :- ", users);
    let user = req.body.username;
    let pass = req.body.password;

    users.push({
        "username": user,
        "password": pass
    })

    res.send("User signed up succesfully");
    console.log("AFTER SIGNUP :- ", users);
})

app.get('/me', (req, res) => {
    let authToken = req.headers.token;
    // let foundUser = users.find(obj => obj.token===authToken);
    let foundUserName = jwt.verify(authToken, SECRET_KEY);
    if(foundUserName){
        res.send(foundUserName.username);
    }else{
        res.status(404).send("No user found");
    }
})

app.listen("3000", ()=>{
    console.log("App listening at PORT 3000");
})