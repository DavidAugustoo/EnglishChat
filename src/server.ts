import express from 'express';
import path from 'path';
import { createServer } from "http";
import { Server } from 'socket.io';
import { Socket } from 'dgram';

// Server Config
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({extended: true}));

// Starting Server
var port_number = app.listen(3000);
httpServer.listen(port_number);

// Socket Config
let connectedUsers: string[] = [];

io.on('connection', (socket: any) => {
    console.log("Conectado");
    
    socket.on('join-request', (username: string) => {
        socket.username = username;
        connectedUsers.push(username);
        console.log(connectedUsers);

        socket.emit('user-ok', connectedUsers);
        socket.broadcast.emit('list-update', {
            joined: username,
            list: connectedUsers
        });
    });

    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(item => item != socket.username);
        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: connectedUsers
        });
    });

    socket.on('send-msg', (txt: string) => {
        let data = {
            username: socket.username,
            message: txt
        }

        socket.emit('show-msg', data);
        socket.broadcast.emit('show-msg', data);
    })
});