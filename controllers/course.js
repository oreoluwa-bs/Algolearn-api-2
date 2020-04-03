const Course = require('../models/course');
const factory = require('./handlerFactory');

exports.getAllCourses = factory.getAll(Course);

exports.getCourse = factory.getOne(Course);

exports.createCourse = factory.createOne(Course);

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);
