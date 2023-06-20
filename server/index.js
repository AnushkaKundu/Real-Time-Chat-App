const express = require('express');
const http = require('http');
const cors = require('cors');

const {addUser, removeUser, getUser, getUsersInRoom} = require('./users.js')

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const {Server} = require('socket.io');
const  {callback}  = require('util');
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });


io.on('connection', (socket) => {
    // console.log('New User');

    // socket.emit('join', ({name, room}, callback) => {
    //     console.log(name, room);

    //     const error = true;
    //     if (error) {
    //         callback({error: 'error'});
    //     }
    // });
    socket.on('join', ({name, room}, callback) => {
        const {error, user} = addUser({id: socket.id, name, room});
        if (error) return callback(error);

        socket.emit('message', {user: 'admin', text: `${user.name} welcome to room ${user.room}`}); // to user>
        socket.broadcast.to(user.room).emit('message', {user: 'admin',  text: `${user.name} has joined.`}); //to everybody else.

        socket.join(user.room);
        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', {user: user.name, text: message});
        callback();
    })

    socket.on('disconnect', () => {
        console.log('User had left!!!')
    })
})

app.use(router); //middleware

server.listen(PORT, () => {console.log(`Server has started on PORT ${PORT}`)});

