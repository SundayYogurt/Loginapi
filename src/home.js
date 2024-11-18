async function getUser() {
  try {
    // ดึง Token จาก localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // ถ้าไม่มี Token, แจ้งเตือนและเปลี่ยนเส้นทางไปหน้า Login
      alert('คุณไม่ได้ล็อกอิน!');
      window.location.href = 'login.html';
      return;
    }

    // ส่งคำขอไปยัง API เพื่อดึงข้อมูลผู้ใช้
    const response = await axios.get('http://localhost:8000/api/users', {
      headers: {
        'Authorization': `Bearer ${token}` // ส่ง token ใน header
      }
    });

 

    const users = response.data;

    // ตรวจสอบว่า response.data เป็น array หรือไม่
    if (!Array.isArray(users)) {
      throw new Error('ข้อมูลผู้ใช้ไม่ถูกต้อง');
    }

    const tableBody = document.querySelector('#userTable tbody');
    tableBody.innerHTML = ''; // ล้างข้อมูลในตารางก่อนจะใส่ข้อมูลใหม่

    // Loop through the users and add them to the table
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.email}</td>
        <td>${user.password}</td> <!-- แสดงรหัสผ่าน -->
        <td>${user.status || 'N/A'}</td>
      `;
      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    alert(`เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้: ${error.message}`);
  }
}

// เรียกใช้งาน getUser เมื่อโหลดหน้าเสร็จ
document.addEventListener('DOMContentLoaded', getUser);

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

const token = localStorage.getItem('token');
if (!token) {
  alert('คุณไม่ได้ล็อกอิน หรือ Token หมดอายุ');
  window.location.href = 'login.html'; // เปลี่ยนเส้นทางไปหน้า login
  return;
}

// ส่งคำขอไปยัง API
const response = await axios.get('http://localhost:8000/api/users', {
  headers: {
    'Authorization': `Bearer ${token}` // ส่ง Token ใน Header
  }
});
