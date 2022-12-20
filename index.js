const express = require("express");
const app = express();
const { Server } = require("socket.io");
const cors = require("cors");



//* establising socket connection on port
const io = new Server(8000, {
    cors: {
        origin: "http://localhost:4000"
    }
});


app.use(cors());
app.use(express.static('html'));
app.use(express.static('css'));
app.use(express.static('js'));
app.use(express.static('audio'));

//* user list
const users = {}

//* when user connects
io.on('connection', (socket) => {
    //* when user connected
    socket.on('user-connect', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    })


    //* when user send message
    socket.on('sent-message', (message) => {
        socket.broadcast.emit('recieved-message', { message: message, user: users[socket.id] })
    });


    //* when user disconnect
    socket.on("disconnect", (reason) => {
        socket.broadcast.emit('user-disconnect', { message: reason, user: users[socket.id] })
    });

});



app.get("/", (req, res) => {
    res.sendFile('index.html');
});


app.listen(4000);