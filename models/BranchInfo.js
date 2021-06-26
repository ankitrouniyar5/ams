const mongoose = require('mongoose');

const branchInfoSchema = mongoose.Schema({

    Institution_Name:{
        type : String
    },
    Branch_Name:{
        type : String
    },
    Address:{
        type : String
    },
    City :{
        type : String
    },
    Contact_Number :{
        type : String
    },
    Branch_Incharge:{
        type : String
    },
    Pincode_covered:{
        type : String
    },
    pincodes :[{
        type : String
    }]
})

const BranchInfo = mongoose.model('BranchInfo',branchInfoSchema,'BranchInfo');

module.exports = BranchInfo