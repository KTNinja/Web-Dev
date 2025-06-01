const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {UserModel, TodoModel} = require("./db");

const JWT_SECRET = new Date().toISOString() + Math.random().toString

mongoose.set("strictQuery", false);

mongoose.connect("mongodb+srv://tiwari2000kartik:RfoFSmOYNXDB578t@cluster0.7tbnx8a.mongodb.net/ToDo_App")
.then(() => console.log("Connected to Mongo DB successfully"))
.catch(err => console.error('Mongo db connection error :- ', err));

// const usersList = [];

app.use(express.json());

app.post("/signup", async (req, res) => {
    const {username, password} = req.body;

    // check if the username exists already
    let existingUser = await UserModel.findOne({username: username});

    if(existingUser){
        return res.status(400).json({
            message: "User already exists"
        });
    }

    await UserModel.create({
        username,
        password,
        todos: []
    })

    res.json({
        message: "SUCCESS"
    })


})

app.post("/signin", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let foundUser = await UserModel.findOne({
        username: username,
        password: password
    })

    // let foundUser = usersList.find(user => user.username === username && user.password === password);

    if(foundUser){
        const token = jwt.sign({
            userId: foundUser._id
        }, JWT_SECRET);
        res.json({
            token: token
        })
    } else{
        res.json({
            message: "Failure"
        })
    }

})

async function auth(req, res, next){
    const token = req.headers.token;

    try{
        let userIdFound = jwt.verify(token, JWT_SECRET);
        let foundId = userIdFound.userId;
        let foundUser = await UserModel.findOne({
            _id: foundId
        });
        req.foundUser = foundUser;
        return next();
    } catch(err){
        res.json({
            message: err
        })
    }
}

app.post("/todo", auth, async (req, res) => {
    let todo = req.body.title;
    let targetUser = req.foundUser;

    let newTodo = await TodoModel.create({
        title: todo,
        creator: targetUser._id,
        done: false
    })

    targetUser.todos.push(newTodo._id);
    await targetUser.save();
    
    // usersList[req.index].todo.push(todo);
    res.json({
        message: "ToDo Added"
    })
})

app.get("/todos", auth, async (req, res) => {
    await req.foundUser.populate({
        path: 'todos',
        select: 'title-_id'
    });
    res.json({
        todos: req.foundUser.todos
    })
    
})

app.listen("3000", () => {
    console.log("SERVER LISTENING AT PORT 3000");
});