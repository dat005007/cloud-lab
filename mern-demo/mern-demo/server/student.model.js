const mongoose = require('mongoose');

// Khởi tạo Mongoose Schema
const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
});

// Tạo và export Model
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;