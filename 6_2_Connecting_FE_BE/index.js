const express = require("express");
const app = express();
const dotenv = require("dotenv");
const nodemon = require("nodemon");
const jwt = require('jsonwebtoken');
const JWT_SECRET = "kartik12345";

dotenv.config();

const PORT = process.env.PORT;

let users = [];

app.use(express.json());



app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username,
        password
    })

    res.send("User signed up successfully");
})

app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = users.find(user => user.username === username && user.password === password);

    if(foundUser){
        const token = jwt.sign({
            username: foundUser.username
        }, JWT_SECRET);
        res.json({
            token: token
        })
        
    } else{
        res.send("Wrong id or password");
    }


})

app.use((req, res, next) => {
    if(req.headers.token){
        return next();
    } else{
        res.send("User not signed in!! Sorry")
    }
})



app.get('/me', (req, res) => {
    const token = req.headers.token;

    const foundUser = jwt.verify(token, JWT_SECRET);

    const username = foundUser.username;

    let targetUser = users.find(user => user.username === username);

    res.json(targetUser);

})

app.listen(PORT, ()=>{
    console.log("Server running at PORT " + PORT);
})