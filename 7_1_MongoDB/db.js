const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'todos'
    }]
}, {timestamps: true});

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    done: {
        type: Boolean,
        required: true,
    }
}, {timestamps: true});

const UserModel = mongoose.model('users', userSchema);
const TodoModel = mongoose.model('todos', todoSchema);

module.exports = {
    UserModel,
    TodoModel
}

