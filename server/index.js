import express from 'express';
import { Server as Socketio } from 'socket.io'
import http from 'http';
import * as os from 'node:os';
import * as pty from 'node-pty';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import chokidar from 'chokidar';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Socketio({
    cors: "*",
});
io.attach(server);
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({ origin: '*' }));
// pty instance mean to create a pseudo terminal

chokidar
    .watch('./user', { ignoreInitial: true })
    .on('all', (event, filePath) => {
        io.emit('file:refresh', filePath);
    });


const ptyProcess = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: "/app/user",
    env: process.env
});

ptyProcess.onData((data) => {
    io.emit('terminal:data', data);
});


io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('terminal:write', (data) => {
        ptyProcess.write(data)
    })

    socket.on('file:changed', async ({ path, content }) => {
        await fs.writeFile(`./user${path}`, content)
    })




})




app.get('/files', async (req, res) => {

    try {
        const data = await genratefileTree('./user')
        return res.send(data)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "cant fetched files"
        })
    }
})


app.get('/files/content', async (req, res) => {
    const path = req.query.path;
    const content = await fs.readFile(`./user${path}`, 'utf-8')
    return res.json({ content })
})


async function genratefileTree(directory) {

    const tree = {}
    async function buildTree(currentDirectory, currentTree) {
        const files = await fs.readdir(currentDirectory);
        for (const file of files) {
            const filePath = path.join(currentDirectory, file)
            const stats = await fs.stat(filePath);
            if (stats.isDirectory()) {
                currentTree[file] = {}
                await buildTree(filePath, currentTree[file])
            }
            else {
                currentTree[file] = null
            }
        }
    }
    await buildTree(directory, tree)
    return tree;
}




server.listen(9000, () => {
    console.log('Docker Server is running on http://localhost:9000');
});
