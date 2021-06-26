const jwt = require('jsonwebtoken');


exports.isUser = (req,res,next) => {

    try {
        
        const token = req.cookies.token;
        if(!token) {
            res.status(401).json({errorMessage : "Error : 401 Unauthorized "})
        }
     
        const verified  = jwt.verify(token,process.env.JWT_KEY);
        req.user_name = verified.user_name;
        req.user_branch = verified.user_branch;
        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({errorMessage : "Error : 401 Unauthorized "})
        
    }
}

// exports.isAdmin = (req,res,next) => {

//     if(req.isAuthenticated() && res.locals.user.admin == 1){
//         next();
//     }else{
//         req.flash('danger','You are not admin')
//         res.redirect('/user/login')
//     }
// }