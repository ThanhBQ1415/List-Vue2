# Task Management Backend API

Backend API cho hệ thống quản lý công việc được xây dựng bằng Express.js và TypeScript.

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy ở chế độ development
npm run dev

# Build project
npm run build

# Chạy production
npm start
```

## Xác thực & Token

- Các API (trừ đăng ký, đăng nhập, tạo user mới) **yêu cầu gửi token JWT** trong header:
  
  ```http
  Authorization: Bearer <token>
  ```
- Đăng nhập thành công sẽ nhận được token từ API `/api/users/login`.
- Gửi token này trong mọi request cần xác thực.

## Cấu trúc API

### Users
- `GET /api/users` **(Yêu cầu đăng nhập)** - Lấy danh sách tất cả users
- `GET /api/users/:id` **(Yêu cầu đăng nhập)** - Lấy user theo ID
- `POST /api/users` - Tạo user mới
- `POST /api/users/register` - Đăng ký tài khoản
- `POST /api/users/login` - Đăng nhập (trả về token)
- `PUT /api/users/:id` **(Yêu cầu đăng nhập)** - Cập nhật user
- `DELETE /api/users/:id` **(Yêu cầu đăng nhập)** - Xóa user

### Projects
- `GET /api/projects` **(Yêu cầu đăng nhập)** - Lấy danh sách projects (có thể filter theo ownerId)
- `GET /api/projects/:id` **(Yêu cầu đăng nhập)** - Lấy project theo ID
- `POST /api/projects` **(Yêu cầu đăng nhập)** - Tạo project mới
- `PUT /api/projects/:id` **(Yêu cầu đăng nhập)** - Cập nhật project
- `DELETE /api/projects/:id` **(Yêu cầu đăng nhập)** - Xóa project

### Tasks
- `GET /api/tasks` **(Yêu cầu đăng nhập)** - Lấy danh sách tasks (có thể filter theo projectId, statusId, assigneeId, creatorId)
- `GET /api/tasks/:id` **(Yêu cầu đăng nhập)** - Lấy task theo ID
- `POST /api/tasks` **(Yêu cầu đăng nhập)** - Tạo task mới
- `PUT /api/tasks/:id` **(Yêu cầu đăng nhập)** - Cập nhật task
- `DELETE /api/tasks/:id` **(Yêu cầu đăng nhập)** - Xóa task

### Statuses
- `GET /api/statuses` **(Yêu cầu đăng nhập)** - Lấy danh sách statuses (có thể filter theo projectId)
- `GET /api/statuses/:id` **(Yêu cầu đăng nhập)** - Lấy status theo ID
- `POST /api/statuses` **(Yêu cầu đăng nhập)** - Tạo status mới
- `PUT /api/statuses/:id` **(Yêu cầu đăng nhập)** - Cập nhật status
- `DELETE /api/statuses/:id` **(Yêu cầu đăng nhập)** - Xóa status

### Labels
- `GET /api/labels` **(Yêu cầu đăng nhập)** - Lấy danh sách labels
- `GET /api/labels/:id` **(Yêu cầu đăng nhập)** - Lấy label theo ID
- `POST /api/labels` **(Yêu cầu đăng nhập)** - Tạo label mới
- `PUT /api/labels/:id` **(Yêu cầu đăng nhập)** - Cập nhật label
- `DELETE /api/labels/:id` **(Yêu cầu đăng nhập)** - Xóa label

### Comments
- `GET /api/comments` **(Yêu cầu đăng nhập)** - Lấy danh sách comments (có thể filter theo taskId, userId)
- `GET /api/comments/:id` **(Yêu cầu đăng nhập)** - Lấy comment theo ID
- `POST /api/comments` **(Yêu cầu đăng nhập)** - Tạo comment mới
- `PUT /api/comments/:id` **(Yêu cầu đăng nhập)** - Cập nhật comment
- `DELETE /api/comments/:id` **(Yêu cầu đăng nhập)** - Xóa comment

### Checklist Items
- `GET /api/checklist` **(Yêu cầu đăng nhập)** - Lấy danh sách checklist items (có thể filter theo taskId, isCompleted)
- `GET /api/checklist/:id` **(Yêu cầu đăng nhập)** - Lấy checklist item theo ID
- `POST /api/checklist` **(Yêu cầu đăng nhập)** - Tạo checklist item mới
- `PUT /api/checklist/:id` **(Yêu cầu đăng nhập)** - Cập nhật checklist item
- `PATCH /api/checklist/:id/toggle` **(Yêu cầu đăng nhập)** - Toggle trạng thái hoàn thành
- `DELETE /api/checklist/:id` **(Yêu cầu đăng nhập)** - Xóa checklist item

## Ví dụ sử dụng

### Đăng nhập lấy token
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "yourpassword"
  }'
```

### Gọi API cần token (ví dụ: lấy danh sách users)
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <token>"
```

### Tạo project mới (cần token)
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "My Project",
    "description": "A new project",
    "ownerId": 1
  }'
```

## Response Format

Tất cả API responses đều có format thống nhất:

```json
{
  "success": true,
  "data": {...},
  "total": 10
}
```

Hoặc khi có lỗi:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Environment Variables

Tạo file `.env` trong thư mục gốc:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
```

## Health Check

- `GET /health` - Kiểm tra trạng thái server

## Lưu ý

- Các API có đánh dấu **(Yêu cầu đăng nhập)** bắt buộc phải gửi token hợp lệ.
- Đăng nhập để lấy token, sau đó gửi token trong header cho các API cần xác thực.
- API hỗ trợ CORS để frontend có thể gọi từ domain khác. 