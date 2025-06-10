const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { z } = require("zod");
mongoose.set("strictQuery", false);
const jwt = require("jsonwebtoken");
const JWT_SECRET = new Date().toISOString() + Math.random().toString;

const {UserModel, TodoModel} = require("./db");

mongoose.connect('mongodb+srv://tiwari2000kartik:RfoFSmOYNXDB578t@cluster0.7tbnx8a.mongodb.net/ZodHashedTodoApp')
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Error :- ", err));

app.use(express.json());

app.post("/signup", async (req, res) => {

    const validationSchema = z.object({
        email: z.string(),
        password: z.string()
    });

    const parsedDataWithSuccess = validationSchema.safeParse(req.body);

    if(!parsedDataWithSuccess.success){
        res.json({
            message: "Incorrect email/password format",
            error: parsedDataWithSuccess.error
        });
        return;
    }
    let email = req.body.email;
    let password = req.body.password;

    let hashedPassword = await bcrypt.hash(password.toString(), 5);

    const findUser = await UserModel.findOne({
        email: email
    });

    if(findUser){
        res.json({
            message: "email already registered"
        })
    } else{
        await UserModel.create({
            email,
            password: hashedPassword,
            todos: []

        });

        res.json({
            message: "User successfully registered"
        })
    }  
})

app.post("/signin", async (req, res) => {
    



    let email = req.body.email;
    let password = req.body.password;

    const findUser = await UserModel.findOne({
        email: email,
    });

    if(!findUser){
        res.json({
            message: "Incorrect username/password"
        })
    } else{
        const passwordCheck = await bcrypt.compare(password.toString(), findUser.password);
        if(passwordCheck){
            const token = jwt.sign({
                id: findUser._id
            }, JWT_SECRET);
            res.json({
                token: token
            });
        } else{
            res.json({
                message: "Wrong Password"
            })
        }
        
    }


})

async function auth(req, res, next){
    try{
        const user = jwt.verify(req.headers.token, JWT_SECRET);
        let userId = user.id;
        const findUser = await UserModel.findOne({
            _id: userId
        });
        req.user = findUser;
        return next();
    } catch(err){
        res.send({
            message: "Authentication failed!!"
        });
        console.error("Auth Error :- ", err);
    }
}

app.post("/todo", auth, async (req, res) => {
    let todo = req.body.title;

    try{
        let findUser = req.user;
        let createdTodo = await TodoModel.create({
            title: todo,
            done: false,
            creator: findUser._id
        })
        findUser.todos.push(createdTodo._id);
        await findUser.save();

        res.json({
            message: "Todo Added succesfully"
        })
    } catch(err){
        res.json({
            message: "Error adding todo"
        });
        console.error("Error :- ", err);
    }
})

app.get("/todos", auth, async (req, res) => {
    try{
        let findUser = req.user;
        await findUser.populate({
            path: "todos",
            select: "title-_id"
        })

        res.json({
            todos: findUser.todos
        })
    } catch(err){
        res.json({
            message: "Error Showing todo"
        });
        console.error("Error :- ", err);
    }
})

app.listen("3000", ()=>{
    console.log("server listening at PORT 3000")
});