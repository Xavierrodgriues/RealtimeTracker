const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const fs = require('fs');
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

console.log('Current working directory:', __dirname); // Log current working directory
console.log('Views directory:', path.join(__dirname, 'views')); // Log views path

// Check if the index.ejs file exists
fs.access(path.join(__dirname, 'views', 'index.ejs'), fs.constants.F_OK, (err) => {
    if (err) {
        console.error('index.ejs does not exist');
    } else {
        console.log('index.ejs exists');
    }
});

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('send-location', (data) => {
        io.emit('received-location', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        io.emit('user-disconnected', socket.id);
    });
});

app.get('/', (req, res) => {
    res.render('index', (err, html) => {
        if (err) {
            console.error('Error rendering view:', err);
            res.status(500).send('Something broke!');
        } else {
            res.send(html);
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
