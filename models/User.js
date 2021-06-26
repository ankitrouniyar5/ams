const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    admin :{
        type : Number,
        required : true
    },
    branch :{
        type : String,
    },
    notification : [{
        customer_phone : String,
        customer_address : String,
        pincode : Number,
        time : Date,
        read : Boolean 
    }]

})

const User = mongoose.model('User',UserSchema,'User');

module.exports = User