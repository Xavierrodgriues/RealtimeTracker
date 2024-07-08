const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// handling connection of socket.io from script.js
io.on("connection", (socket) => {
    //handled the emit of the frontend and send back the location to the all user in the frontend 
    // so that both user can see the location
    socket.on("send-location",(data)=>{
        io.emit("received-location",{id: socket.id,...data});
    })
    console.log("new user connected");

    socket.on("disconnect",()=>{
        io.emit("user-disconnected", socket.id)
    })
});

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
