const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: '../.env' }); 

const app = express();

// Cấu hình CORS
app.use(cors());
app.use(express.json()); 

// Import Model
const Student = require('./student.model.js'); 

const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI;

// Kết nối MongoDB
mongoose.connect(URI)
    .then(() => {
        console.log('✅ Đã kết nối thành công với MongoDB Atlas!');
    })
    .catch((err) => {
        console.error('❌ Lỗi kết nối MongoDB:', err);
    });

// ==========================================
// CÁC ĐƯỜNG DẪN API
// ==========================================

// Câu 36. Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Câu 37: Thêm sinh viên mới
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Câu 38: Cập nhật thông tin sinh viên
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        if (!updatedStudent) {
            return res.status(404).json({ message: "Không tìm thấy sinh viên" });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Câu 39: Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).json({ message: "Không tìm thấy sinh viên" });
        }
        res.status(200).json({ message: "Đã xóa sinh viên thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==========================================
// KHỞI ĐỘNG SERVER (Bắt buộc phải nằm ở cuối file)
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại Port: ${PORT}`);
});