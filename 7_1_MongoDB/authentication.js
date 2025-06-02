
const jwt = require("jsonwebtoken");
const JWT_SECRET = new Date().toISOString() + Math.random().toString;
const {UserModel, TodoModel} = require("./db");


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

module.exports = {
    jwt,
    JWT_SECRET,
    auth
}