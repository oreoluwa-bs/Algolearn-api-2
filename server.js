/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');
const User = require('./models/user');

const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
} = require('./controllers/discuss');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');
const Message = require('./models/message');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD,
);

mongoose.connect(process.env.NODE_ENV === 'production' ? DB : process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}).then(() => console.log(`DB connection successful ${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}`));


const port = process.env.PORT || 5000;

// const server = app.listen(port, () => {
//     console.log(`App running on port ${process.env.PORT}`);
// });
const server = http.createServer(app);
const ioSocket = socketio(server);
server.listen(port, () => {
    console.log(`App running on port ${process.env.PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// SOCKET CONNECTION

ioSocket.on('connection', (socket) => {
    // eslint-disable-next-line consistent-return
    socket.on('join', async ({ userId, room }, callback) => {
        let userData = {};
        await User.findById(userId).then((user) => {
            userData = user;
        }).catch(() => ({ error: 'User not found' }));

        const { error, user } = addUser({ id: socket.id, userData, room });

        if (error) return callback(error);

        socket.join(user.room);

        ioSocket.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        callback();
    });


    socket.on('sendMessage', async (message, callback) => {
        const user = await getUser(socket.id);

        const messageData = await Message.create({
            user: user.dbID,
            course: user.room,
            content: message,
            createdAt: Date.now(),
        });

        // eslint-disable-next-line no-underscore-dangle
        ioSocket.to(user.room).emit('message', { ...messageData._doc, user });
        ioSocket.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });


        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            ioSocket.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    });
});
