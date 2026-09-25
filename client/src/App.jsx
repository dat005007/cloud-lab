import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // ==========================================
  // 1. KHAI BÁO CÁC STATE (Trạng thái) Ở ĐÂY
  // ==========================================
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null); // Thêm state này để biết đang sửa sinh viên nào


  // ==========================================
  // 2. KHAI BÁO CÁC HÀM XỬ LÝ Ở ĐÂY
  // ==========================================
  
  // Hàm lấy danh sách sinh viên (GET)
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Hàm khi bấm nút "Sửa" trên một dòng sinh viên
  const handleEdit = (student) => {
    setEditingId(student._id); // Lưu lại ID đang sửa
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });
  };

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
        setEditingId(null); // Reset lại trạng thái sau khi sửa xong
      } else {
        // Nếu không có -> Gọi API POST (Thêm mới)
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

  // Hàm xử lý Xóa (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchStudents(); // Tải lại danh sách
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
      }
    }
  };

  // ==========================================
  // 3. PHẦN GIAO DIỆN (return JSX) Ở DƯỚI CÙNG
  // ==========================================
  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản Lý Sinh Viên Bản 2.0</h2>

      {/* Form Nhập liệu (Dùng chung cho cả Thêm và Sửa) */}
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