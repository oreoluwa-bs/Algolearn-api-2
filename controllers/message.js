const Message = require('../models/message');
const factory = require('./handlerFactory');

exports.setCourseUserIds = (req, res, next) => {
    // Allows nested routes
    if (!req.body.course) req.body.course = req.params.courseId;
    next();
};


exports.getAllMessages = factory.getAll(Message);

exports.getMessage = factory.getOne(Message);

exports.createMessage = factory.createOne(Message);

// exports.updateMessage = factory.updateOne(Message);

// exports.deleteMessage = factory.deleteOne(Message);
