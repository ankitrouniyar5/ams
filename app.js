const express = require('express')
const path = require('path');
const session = require('express-session')
const auth = require('./utilities/auth')
const isUser = auth.isUser 
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const port = process.env.PORT || 4000 

const Branch = require('./models/Branch');
const Notification = require('./models/Notification');

//initializing app
const app = express()

//connecting database

require("./mongoose");

//setting up view engine
app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'ejs')

//seting up public folder 
app.use(express.static(path.join(__dirname,'public')))

//setting up body parser middle ware
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
    origin : "*",
    credentials : true
}));

//setting up express-session middle ware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
//   cookie: { secure: true }
}))

//setting up socket io

const socketio = require('socket.io')
const http = require('http');
const server = http.createServer(app)

const io = socketio (server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: false
    }
});

io.on('connection',(socket)=>{

    socket.on('join',(username)=>{
        socket.join(username);
    })
    socket.on('sendNotification',(username)=>{
        
        if(username.length === 0 ){
            io.to('admin').emit('notify');
        }else{
            username.forEach((user) => {
                return io.to(user).emit('notify')
            }
            );
        } 
    })
})



//for enquiry details by customers
app.post('/branches',async (req,res)=>{

    const pincode = req.body.pincode;
    const phone = req.body.phone;
    const address = req.body.address;
    
    const branches = await Branch.find({pincodes :{ $in : [ pincode ] }});
    if(!Object.keys(branches).length) {
        const noti = new Notification({
            Branch_Name :"admin",
            customer_address:address,
            customer_phone:phone,
            pincode : pincode,
            read :false
        })

        await noti.save();
    }else{
        branches.forEach(async(br)=>{
            const noti = new Notification({
                Branch_Name : br.Branch_Name,
                customer_address:address,
                customer_phone:phone,
                pincode : pincode,
                read :false
            })
            await noti.save();

        })
     
    }

    res.json(branches);
})


//getting notifications for a logged in user

app.get('/notifications', isUser ,async (req,res)=>{

    try {
        let page = req.query.page;
        if(!page) page = 0;
        const user_branch = req.user_branch;
        if(user_branch === "admin"){
            const notifications = await Notification.find().sort({ time : -1 }).limit(10).skip(page*10).exec(); 
            res.status(200).json(notifications);
        }else{
            const notifications = await Notification.find({Branch_Name : user_branch}).sort({ time : -1 }).limit(10).skip(page*10).exec(); 
            res.status(200).json(notifications);
        }
        
    } catch (error) {
        // console.log(error);
        res.status(500).send("Internal Server Error");
    }

  
})

//for updating notification seen status
app.put('/notifications/:id',async(req,res)=>{

    try{

        const id = req.params.id;
        const doc = await Notification.findById(id);
        doc.read = true;
        await doc.save();
        res.json({successMessage : "Updated"});

    }catch(error){
        // console.log(error)
        res.json({errorMessage : "Error cannot update the notification now"})
    }

})

//---logging in user
app.post('/login', async (req,res)=>{

    try {
        const {username , password} = req.body;

        if(!username|| !password ) {
            return res.status(400).json({errorMessage : "Please fill all the fields" });
        }
    
        const user = await Branch.findOne({username});
        if(user){
            var isMatch = await bcrypt.compare(password,user.password);
        }

        if(!isMatch){
            return res.status(401).json({errorMessage : "Invalid username or password"});
        } 

        const token = jwt.sign({
            user_name : user.username,
            user_branch : user.Branch_Name
        },
        process.env.JWT_KEY);
        
        res.cookie("token",token,{
            httpOnly :true
        }).send()
        
    } catch (error) {
        // console.log(error)
        res.status(500).json({errorMessage : "Internal Server Error"})
    }
})

//--------- Log Out user 
app.get('/logout',async (req,res)=>{
    res.cookie("token" ,"",{
        httpOnly : true,
        expires : new Date(0)
    }).send()
})


//----------to check is a user is logged in or not
app.get('/isloggedin',(req,res)=>{

    try {
        const token = req.cookies.token;
        if(!token) return res.status(200).json(false);
     
        jwt.verify(token,process.env.JWT_KEY);
        res.json(true);
        
    } catch (error) {
        // console.log(error);
        res.json(false);
        
    }

})


if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"))
}

server.listen(port,()=>{
    console.log('Server up and running on ' + port)
})


