const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    todos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'todos'
        }
    ]
});

const todoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    done: {
        type: Boolean
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }
});

const UserModel = mongoose.model('users', userSchema);
const TodoModel = mongoose.model('todos', todoSchema);

module.exports = {
    UserModel,
    TodoModel
}