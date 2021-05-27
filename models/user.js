const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,        
        required: true,
        unique: true
        
    },
    pass:{
        type: String,
        required: true
    },
    contacts:{
        _id: {
            type: String,
            unique: true            
        },
        name:{
            type: String,            
        },
        email:{
            type: String
        },
        phone:{
            type: String
        }
    }  
}, {timestamps: true})  // Auto assign timestamp

const User = mongoose.model('User', userSchema) // Every time we use it, it will automaticly look for 'User' collection

module.exports = User;