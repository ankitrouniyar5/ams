import React, { useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import HomeIcon from '@material-ui/icons/Home';
import PhoneIcon from '@material-ui/icons/Phone';
import RoomIcon from '@material-ui/icons/Room';
import TimerIcon from '@material-ui/icons/Timer';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import '../styles.css'
import axios from "axios";
import io from "socket.io-client";



let socket;
function Notification(props) {

    const [user , setUser] = useState("");
    const [notifications , setNotifications] = useState([]);
    const [alerts , setAlerts ] = useState([]);
    const [page ,setPage] = useState(0);

    function getUser(){
            const params = new URLSearchParams(props.location.search);
            const q = params.get('user');
            setUser(q)
    }

    socket = io();
    

    useEffect(()=>{
            getUser();
            socket.emit('join', user);
            
    },[user]);
   

    socket.on('notify',()=>{
        console.log("New notification");
        setAlerts ((prev)=>  [...prev , "New notification"])  
    })
 
    console.log(alerts);

    async function getNotification(){

        try {
            const notificationsRes = await axios.get(`/notifications?page=${page}`);
            setNotifications(notificationsRes.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getNotification();
    },[page]);

    function handleClick(e,_id){
        e.preventDefault();
        e.target.style.backgroundColor = 'white'
        axios.put(`/notifications/${_id}`)
    }

    function renderNotifications(){

        if(notifications.length === 1 ){
            return <h2>You dont have any notifications yet.</h2>
        }
        
        return notifications.map((nf,index)=>{
            return <div key={index} 
                        className="notifications" 
                        onClick = {(e)=>handleClick(e,nf._id)} 
                        style={(nf.read) ? {backgroundColor:"white"} : {backgroundColor:"#b8bfba"}}
                        _id = {nf._id}
                    >
                        <HomeIcon /> Customer's  Address :{ nf.customer_address }<br /><br />
                        <PhoneIcon />Phone :{ nf.customer_phone }<br /><br />
                        <RoomIcon />Searched Pin : { nf.pincode }<br /><br />
                        <TimerIcon />Searched At : {nf.time} <br /><br />
                </div>
        })
    }

    function reloadPage(){
        window.location.reload();
    }
    
    function increasePage(){
        setPage(page+1);
    }
    function decreasePage(){
        if(page !== 0){
            setPage(page-1);
        }
    }
    return (
        <div>
         <div className = "container">
            <div className = "alert" onClick = {reloadPage}>
                <Badge badgeContent={ alerts.length } color="primary">
                    <MailIcon />
                </Badge>
                <span className="mx-2">Click to get new notifications.</span>
            </div>
            <div className = "row">
              {renderNotifications()}  
            </div>
            <div className ="paginationBar">
                <button className = "btn btn-primary text-align-center mr-3" onClick={decreasePage}>previous</button>
                <button className = "btn btn-primary text-align-center" onClick={increasePage}>next</button>
            </div>
        </div>
        </div>
    );
}

export default Notification;