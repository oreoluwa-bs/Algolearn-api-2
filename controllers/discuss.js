/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
// const { ioSocket } = require('../server');


const users = [];

const addUser = ({ id, userData, room }) => {
    const {
        color, photo, firstname, lastname,
    } = userData;
    const name = `${firstname} ${lastname}`;
    // eslint-disable-next-line no-param-reassign
    room = room.trim();
    const existingUser = users.find((user) => user.room === room && user.dbID === userData._id);

    if (!name || !room) return { error: 'Username and room are required.' };
    if (existingUser) {
        return { error: 'Username is taken' };
    }

    const user = {
        id,
        firstname,
        lastname,
        color,
        photo,
        room,
        dbID: userData._id,
    };

    users.push(user);
    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    // users = users.filter((user) => user.id !== id);
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
    // findUser,
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
};
