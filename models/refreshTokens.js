const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Collection for refresh tokens 
const refreshTokenSchema = new Schema({
    token : {
        type: String        
    }       
}, {timestamps: true})  // Auto assign timestamp

const RefreshTokens = mongoose.model('Tokens', refreshTokenSchema) 

module.exports = RefreshTokens;



// const mongoose = require('mongoose')
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     name: {
//         type: String,        
//         required: true
        
//     },
//     pass:{
//         type: String,
//         required: true
//     }    
// }, {timestamps: true})  // Auto assign timestamp

// const User = mongoose.model('User', userSchema) // Every time we use it, it will automaticly look for 'User' collection

// module.exports = User;