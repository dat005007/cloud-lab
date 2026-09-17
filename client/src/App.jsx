import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([]) 
  const [formData, setFormData] = useState({ 
    studentId: '',
    name: '',
    email: ''
  } 
) 
  const [editingId, setEditingId] = useState(null);

////                              QUAN TRỌNG CHÚ Ý 

///      lưu ý: Khi chạy trên GitHub Codespaces, bạn cần sử dụng URL của API trên Codespaces. Khi chạy trên máy local, bạn cần đổi lại thành URL của server local.

//phần này là URL của API trên GitHub Codespaces, nhưng khi chạy trên máy local, bạn cần đổi lại thành URL của server local.
  // const API_URL = 'https://solid-invention-wr5vvjpj9j46cr79-5000.app.github.dev/api/students'; 
  
  // Khi chạy trên máy local, sử dụng URL này
  const API_URL = 'http://localhost:5000/api/students';



  // Fetch danh sách sinh viên
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error(err))
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Thêm sinh viên (POST)
  // const handleSubmit = async (e) => {
  //   e.preventDefault() 
  //   try {
  //     const response = await fetch(API_URL, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(formData)
  //     })
  //     if (response.ok) {
  //       const newStudent = await response.json()
  //       setStudents([...students, newStudent]) 
  //       setFormData({ studentId: '', name: '', email: '' }) 
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }


//// handleSubmit mới
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (editingId) {
      // Gọi API Cập nhật (PUT)
      const response = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const updatedStudent = await response.json();
        // Cập nhật lại danh sách hiển thị
        setStudents(students.map(s => s._id === editingId ? updatedStudent : s));
        setEditingId(null); // Xóa trạng thái sửa
        setFormData({ studentId: '', name: '', email: '' }); // Làm rỗng form
      }
    } else {
      // Gọi API Thêm mới (POST) - Code cũ của bạn
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const newStudent = await response.json();
        setStudents([...students, newStudent]);
        setFormData({ studentId: '', name: '', email: '' });
      }
    }
  } catch (error) {
    console.error(error);
  }
};

  // MỚI THÊM: Hàm xử lý Xóa sinh viên (DELETE)
  const handleDelete = async (id) => {
    // Hiện hộp thoại xác nhận trước khi xóa
    if (!window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) return;

    try {
      // Gọi API với phương thức DELETE
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Cập nhật lại giao diện: Lọc bỏ sinh viên có id vừa xóa
        setStudents(students.filter(student => student._id !== id));
      } else {
        console.error('Không thể xóa sinh viên');
      }
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
    }
  }
  const handleEditClick = (student) => {
  setEditingId(student._id); // Lưu lại ID người đang sửa
  setFormData({              // Đổ dữ liệu cũ lên form
    studentId: student.studentId,
    name: student.name,
    email: student.email
  });
};

//   return (
//     <div className="app-container">
//       <h1 className="main-title">Quản Lý Sinh Viên</h1>

//       <div className="card form-card">
//         <h2>Thêm Sinh Viên Mới</h2>
//         <form onSubmit={handleSubmit}>
//           <input type="text" name="studentId" placeholder="Mã số sinh viên" className="modern-input" value={formData.studentId} onChange={handleInputChange} required />
//           <input type="text" name="name" placeholder="Họ tên" className="modern-input" value={formData.name} onChange={handleInputChange} required />
//           <input type="email" name="email" placeholder="Email" className="modern-input" value={formData.email} onChange={handleInputChange} required />
//           <button type="submit" className="modern-btn">Thêm sinh viên</button>
//         </form>
//       </div>

//       <div className="card list-card">
//         <h2>Danh Sách Sinh Viên</h2>
//         <div className="student-list">
//           {students.length === 0 ? (
//             <p className="empty-msg">Không có sinh viên nào.</p>
//           ) : (
//             students.map(student => (
//               <div className="student-row" key={student._id}>
//                 <span className="st-id">{student.studentId}</span>
//                 <span className="st-name">{student.name}</span>
//                 <span className="st-email">{student.email}</span>
//                 {/* MỚI THÊM: Nút Xóa */}
//                 <button 
//                   className="delete-btn" 
//                   onClick={() => handleDelete(student._id)}
//                 >
//                   Xóa
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default App;

return (
    <div className="app-container">
      <h1 className="main-title">Quản Lý Sinh Viên</h1>

      <div className="card form-card">
        {/* ĐÃ SỬA: Tiêu đề sẽ tự đổi tên khi bấm sửa */}
        <h2>{editingId ? "Cập Nhật Sinh Viên" : "Thêm Sinh Viên Mới"}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="studentId" placeholder="Mã số sinh viên" className="modern-input" value={formData.studentId} onChange={handleInputChange} required />
          <input type="text" name="name" placeholder="Họ tên" className="modern-input" value={formData.name} onChange={handleInputChange} required />
          <input type="email" name="email" placeholder="Email" className="modern-input" value={formData.email} onChange={handleInputChange} required />
          
          {/* ĐÃ SỬA: Chữ trên nút bấm sẽ tự đổi khi bấm sửa */}
          <button type="submit" className="modern-btn">
            {editingId ? "Cập nhật" : "Thêm sinh viên"}
          </button>
        </form>
      </div>

      <div className="card list-card">
        <h2>Danh Sách Sinh Viên</h2>
        <div className="student-list">
          {students.length === 0 ? (
            <p className="empty-msg">Không có sinh viên nào.</p>
          ) : (
            students.map(student => (
              <div className="student-row" key={student._id}>
                <span className="st-id">{student.studentId}</span>
                <span className="st-name">{student.name}</span>
                <span className="st-email">{student.email}</span>
                
                {/* ĐÃ THÊM: Nút Sửa nằm kế bên nút Xóa */}
                <button 
                  className="edit-btn" 
                  onClick={() => handleEditClick(student)}
                  style={{marginRight: '10px'}}
                >
                  Sửa
                </button>
                
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(student._id)}
                >
                  Xóa
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App;