import express from 'express';
import {Server as Socketio} from 'socket.io'
import http from 'http';
import * as os from 'node:os';
import * as pty from 'node-pty';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Socketio({
    cors: "*",
});
io.attach(server);
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())
// pty instance mean to create a pseudo terminal

console.log('this is dir',process.env.INIT_CWD);


const ptyProcess = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD + '/user',
    env: process.env
});

ptyProcess.onData((data) => {
  io.emit('terminal:data', data);
});


io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

     socket.on('terminal:write',(data)=>{
        ptyProcess.write(data)
     })
})


server.listen(9000, () => {
    console.log('Docker Server is running on http://localhost:9000');
});
