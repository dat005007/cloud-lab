# Câu 51: Sử dụng Node.js làm Base Image
FROM node:20-alpine

# Câu 52: Thiết lập thư mục làm việc trong container
WORKDIR /app

# Câu 53: Sao chép các file cấu hình package
COPY package*.json ./

# Câu 54: Cài đặt các thư viện (node_modules)
RUN npm install

# Câu 55: Sao chép toàn bộ mã nguồn React vào container
COPY . .

# Câu 56 & 57: Build ứng dụng (tạo ra thư mục dist chứa code đã tối ưu)
RUN npm run build

# Lệnh cài thêm thư viện 'serve' để chạy các file tĩnh trong thư mục dist
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist"]