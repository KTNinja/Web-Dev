const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const JWT_SECRET = (new Date()).toISOString() + (Math.random()).toString();

let users = [];

app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Public/index.html");
})

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        "username": username,
        "password": password
    })

    res.status(200).json({
        "message": "Successfull signup"
    })
})

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = users.find(user => user.username === username && user.password === password);
    //foundUser = {
    //      "username": username,
    //      "password": password
    //}
    if(foundUser){
        let token = jwt.sign({
            "username": username
        }, JWT_SECRET);

        res.json({
            "token": token
        })
    }else{
        res.json({
            "message": "Incorrect username/password"
        })
    }
})

function authMiddleware(req, res, next){
    let token = req.headers.token;
    let user

    try{
        user = jwt.verify(token, JWT_SECRET);
    } catch(err){
        user = null;
    }

    if(user){
        req.user = user;
        return next();
    } else{
        res.json({
            "message": "invalid token"
        })
    }
}

// app.use(authMiddleware);

app.get("/me", authMiddleware, (req, res) => {
    
    let username = req.user.username;

    let foundUser = users.find(user => user.username === username);

    if(foundUser){
        res.json({
            "username": foundUser.username,
            "password": foundUser.password
        })
    }
    
})

app.listen("3000", ()=>{
    console.log("Server listening at port 3000");
})