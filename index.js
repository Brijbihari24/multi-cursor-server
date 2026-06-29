const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors')

const app = express();
app.use(cors())
const httpServer = http.createServer(app);

const PORT = 5001 || 5002;

const io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173" }
})

io.on('connection', (socket) => {
    console.log("New User Connected:", socket.id);

    socket.on("cursor-move", (data) => {
        socket.broadcast.emit('cursor-update', {
            id: socket.id,
            x: data.x,
            y: data.y
        })
    })

    // io.on('disconnect', () => {
    //     console.log("User Disconnected");
    // })

    socket.on('disconnect', () => {
        console.log("Disconnected", socket.id);
        socket.broadcast.emit('cursor-remove', socket.id)
    })
})



httpServer.listen(PORT, () => {
    console.log(`Server is Up and Running on PORT ${PORT}`)
})