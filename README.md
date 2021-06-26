# ams

  ALERT MANAGEMENT SYSTEM


This website is made using React for the front-end, NodeJS with Express for the backend and Mongo DB as the database. It uses mongoose to model the data and fetch it. It also uses socket.io library to send notification at real time.
The website is hosted at Heroku .

Site: https://alert-management-system-bns.herokuapp.com/


Screenshots of the website:
1.	Landing page:
<img src = "https://github.com/ankitrouniyar5/ams/blob/master/screeen%20shots/landing_page.png?raw=true" />

 

The landing page is very simple it allows the user to enter the pin code they want to search along with phone number and address.
After entering them the user is direct to the page where matching results are shown.
2.Branches with matching pin

After enter the query the user can see the results of the pin
All the branches are alerted about the search and in case of invalid pin the admin is alerted.

1.	With valid pin 

<img src = "https://github.com/ankitrouniyar5/ams/blob/master/screeen%20shots/withVP.png?raw=true" />

2.	With Invalid pin
 <img src = "https://github.com/ankitrouniyar5/ams/blob/master/screeen%20shots/with_Invalip_pin.png?raw=true" />

3.	Login page for Branches
After clicking  the login button in the  landing page login page is shown where the branch representatives can login.

<img src = "https://github.com/ankitrouniyar5/ams/blob/master/screeen%20shots/login_page.png?raw=true" />

 
4.	Notification Page. 
After successful login the branch representative can see the notifications generated.
The one not seen is highlighted and the one not seen is with white background.  
When  someone searches for the branch with pin ecery branch serving that pin is alerted at the same time this  is done using  socke.io.

 <img src = "https://github.com/ankitrouniyar5/ams/blob/master/screeen%20shots/notification_page.png?raw=true" />

The new notification can be fetched by clicking on the mail button at the top.

5.	Administrator account 
After logging in using admin account the admin can see all the notification generated throughout the company can be seen at one place.
 
 <img src ="https://github.com/ankitrouniyar5/ams/blob/master/screeen%20shots/admin.png?raw=true" />
Database:

The database is simple and has only two collections to store the data. 
One collection stores the branch details along with username and password and the other collection stores the notifications.










