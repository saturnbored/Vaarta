const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const {connectDB} = require('./config/db');
const {notFound, errorHandler} = require('./middlewares/errorMiddleware');

const {Server} = require('socket.io');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('API is running.');
// });

// app.get('/api/chats', (req, res) => {
//     res.send(chats);
// });

app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, console.log(`Server started on PORT ${PORT}`));

const io = new Server(server, {
    pingTimeout: 6000,
    cors: "http://localhost:3000"
});

io.on('connection', (socket) => {
    console.log('Connected to the socket.');
    
    // Establishing initial connection with the socket
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    // User requesting to join a particular chat
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log(`User joined room : ${room}`);
    });

    // A user a started typing
    socket.on('typing', (room) => {
        socket.in(room).emit('typing');
    });

    // A user has stopped typing
    socket.on('stop typing', (room) => {
        socket.in(room).emit('stop typing');
    });

    // A new message has been recieved from a user, this message will be forwarded to the desired recipients.
    socket.on('new message', (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;

        if(!chat.users)
            return console.log('chat.users not defined');
        
        chat.users.forEach((user) => {
            if(user._id == newMessageRecieved.sender._id)
                return;
            socket.in(user._id).emit('message recieved', newMessageRecieved);
        });

    });

    //  User has disconnected
    socket.off('setup', () => {
        console.log('USER DISCONNECTED');
        socket.leave(userData._id);
    });

});




