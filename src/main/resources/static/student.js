document.addEventListener("DOMContentLoaded", () => {
    loadStudents();

    // Xử lý khi Submit Form (Thêm mới hoặc Cập nhật)
    document.getElementById("studentForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("studentId").value;
        const student = {
            studentCode: document.getElementById("studentCode").value,
            fullName: document.getElementById("fullName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            className: document.getElementById("className").value
        };

        if (id) {
            // Sửa (PUT)
            await fetch(`http://localhost:8080/api/students/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student)
            });
        } else {
            // Thêm mới (POST)
            await fetch("http://localhost:8080/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student)
            });
        }

        resetForm();
        loadStudents();
    });
});

// Lấy danh sách sinh viên (hoặc tìm kiếm)
async function loadStudents(keyword = "") {
    try {
        let url = "http://localhost:8080/api/students";
        if (keyword.trim() !== "") {
            url += `?keyword=${encodeURIComponent(keyword.trim())}`;
        }
        const response = await fetch(url);
        const students = await response.json();
        renderStudents(students);
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    }
}

// Đổ dữ liệu ra bảng
function renderStudents(students) {
    const tbody = document.getElementById("studentTableBody");
    tbody.innerHTML = "";

    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Không tìm thấy sinh viên nào</td></tr>`;
        return;
    }

    students.forEach(s => {
        const safeCode = (s.studentCode || '').replace(/'/g, "\\'");
        const safeName = (s.fullName || '').replace(/'/g, "\\'");
        const safeEmail = (s.email || '').replace(/'/g, "\\'");
        const safePhone = (s.phone || '').replace(/'/g, "\\'");
        const safeClass = (s.className || '').replace(/'/g, "\\'");

        const row = `
        <tr>
            <td>${s.studentCode || ''}</td>
            <td>${s.fullName || ''}</td>
            <td>${s.email || ''}</td>
            <td>${s.phone || ''}</td>
            <td>${s.className || ''}</td>
            <td class="text-center">
                <button class="btn btn-warning-custom btn-sm me-1 px-2 fw-bold" 
                    onclick="fillFormForEdit('${s.id}', '${safeCode}', '${safeName}', '${safeEmail}', '${safePhone}', '${safeClass}')">
                    Sửa
                </button>
                <button class="btn btn-danger btn-sm px-2 fw-bold" onclick="deleteStudent('${s.id}')">
                    Xóa
                </button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Chức năng Tìm kiếm
function searchStudents() {
    const keyword = document.getElementById("searchInput").value;
    loadStudents(keyword);
}

// Xóa từ khóa tìm kiếm
function clearSearch() {
    document.getElementById("searchInput").value = "";
    loadStudents();
}

// Đưa dữ liệu sinh viên lên Form để sửa
function fillFormForEdit(id, code, name, email, phone, className) {
    document.getElementById("studentId").value = id;
    document.getElementById("studentCode").value = code;
    document.getElementById("fullName").value = name;
    document.getElementById("email").value = email;
    document.getElementById("phone").value = phone;
    document.getElementById("className").value = className;

    document.getElementById("formTitle").innerText = "Cập nhật thông tin sinh viên";
    document.getElementById("btnSave").innerText = "Lưu cập nhật";
}

// Reset Form về trạng thái Thêm mới
function resetForm() {
    document.getElementById("studentId").value = "";
    document.getElementById("studentForm").reset();
    document.getElementById("formTitle").innerText = "Thêm sinh viên";
    document.getElementById("btnSave").innerText = "Thêm sinh viên";
}

// Chức năng Xóa sinh viên
async function deleteStudent(id) {
    if (confirm("Bạn có chắc chắn muốn xóa sinh viên này không?")) {
        await fetch(`http://localhost:8080/api/students/${id}`, { method: "DELETE" });
        loadStudents();
    }
}