const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Chỉ load file .env nếu không phải môi trường Production trên Render
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '../.env' });
}
const app = express();

// Cấu hình CORS linh hoạt cho Production
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());

// Middleware tự tạo để ghi Log HTTP Request
app.use((req, res, next) => {
    console.log(`[LOG] ${req.method} ${req.originalUrl}`);
    next();
}); 

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
// CÁC ĐƯỜNG DẪN API (ĐẶT TRƯỚC APP.LISTEN)
// ==========================================

// Endpoint Health Check cho Render Rolling Updates (BẮT BUỘC ĐẶT Ở ĐÂY)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Endpoint test đơn giản
app.get('/api/hello', (req, res) => {
    res.status(200).json({ message: "Hello từ Backend đang chạy trong Docker Container!" });
});

// Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm sinh viên mới
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Cập nhật thông tin sinh viên
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

// Xóa sinh viên
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
// KHỞI ĐỘNG SERVER (LUÔN NẰM Ở CUỐI CÙNG FILE)
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại Port: ${PORT}`);
    console.log("=== Testing CI/CD Auto Deploy v2.0 ===");
});