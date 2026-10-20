import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // ==========================================
  // 1. KHAI BÁO CÁC STATE VÀ API URL TƯƠNG ĐỐI
  // ==========================================
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  // Sử dụng đường dẫn tương đối để Nginx Reverse Proxy tự động điều hướng ngầm
  const API_URL = '/api/students';

  // ==========================================
  // 2. KHAI BÁO CÁC HÀM XỬ LÝ
  // ==========================================

  // Hàm tải danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    }
  };

  // Tự động tải dữ liệu khi mở trang
  useEffect(() => {
    fetchStudents();
  }, []);

  // Hàm xử lý Submit form (Thêm mới hoặc Cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Nếu có editingId -> Gọi API PUT (Cập nhật)
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setEditingId(null);
      } else {
        // Nếu không -> Gọi API POST (Thêm mới)
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      // Xóa trắng form và tải lại danh sách
      setFormData({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
    }
  };

  // Hàm khi bấm nút "Sửa" trên một dòng sinh viên
  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });
  };

  // Hàm xử lý Xóa (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này không?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchStudents();
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
      }
    }
  };

  // ==========================================
  // 3. PHẦN GIAO DIỆN (return JSX)
  // ==========================================
  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản Lý Sinh Viên Phiên bản 2.0 (Nginx Proxy)</h2>

      {/* Form Nhập liệu */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Mã SV" 
          value={formData.studentId} 
          onChange={(e) => setFormData({...formData, studentId: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="Họ tên" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          required 
        />
        <button type="submit">
          {editingId ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>

      {/* Bảng hiển thị danh sách */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Mã SV</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>
                <button onClick={() => handleEdit(student)}>Sửa</button>
                <button 
                  onClick={() => handleDelete(student._id)} 
                  style={{ marginLeft: '5px', backgroundColor: 'red', color: 'white' }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;