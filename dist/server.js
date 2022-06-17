"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
// Server Config
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer);
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(express_1.default.urlencoded({ extended: true }));
// Routes Config
// Starting Server
var port_number = app.listen(process.env.PORT || 8080);
httpServer.listen(port_number);
// Socket Config
let connectedUsers = [];
io.on('connection', (socket) => {
    console.log("Conectado");
    socket.on('join-request', (username) => {
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
    socket.on('send-msg', (txt) => {
        let data = {
            username: socket.username,
            message: txt
        };
        socket.emit('show-msg', data);
        socket.broadcast.emit('show-msg', data);
    });
});
