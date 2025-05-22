# Secure File Upload System with Multi-Layered Validation

A real-world secure document upload system built with Node.js and Express.  
This project demonstrates how to safely handle file uploads by applying layered security best practices.

> ✅ Mitigates common threats like RCE, XSS, DoS, malware uploads, and directory traversal.

---

## Project Objective

To build a secure web component that allows users to upload files (e.g., documents, images) while preventing:

- ❌ Remote Code Execution (RCE)
- ❌ Uploading web shells
- ❌ Oversized file DoS attacks
- ❌ Cross-site scripting (XSS) via SVG/HTML
- ❌ Directory traversal exploits
- ❌ Inadvertent malware hosting

---

## Security Features Implemented

| Layer                         | Description |
|------------------------------|-------------|
| ✅ File Type Whitelisting     | Only allows `image/jpeg`, `image/png`, `application/pdf` |
| ✅ MIME Type Detection        | Uses `file-type` to read real magic bytes (not just extensions) |
| ✅ Secure File Renaming       | Randomly renames files to prevent path guessing or overwrites |
| ✅ File Size Limiting         | Max upload size set to 2MB |
| ✅ Non-Executable Upload Dir  | Files stored outside web root and never executed |
| ✅ Rate Limiting              | 5 uploads per IP per 15 minutes using `express-rate-limit` |
| ✅ Logging                    | Logs all upload attempts (IP, file, status, reason) |
| ✅ Clean UI with Feedback     | Users see styled success/error messages in real time |

---

## 🖼️ UI Preview

Here are examples of the secure upload system in action:

### 1. Rejected File Type (e.g., `.php`)
<img src="screenshots/1. rejected-file-type.jpg" width="600"/>
Attempting to upload unsupported files like `.php`, `.exe`, or `.html` triggers MIME-based blocking.

---

###  2. Oversized File Upload (>2MB)
<img src="screenshots/2. large-file.jpg" width="600"/>
Files larger than 2MB are automatically rejected with a styled error message.

---

###  3. Rate Limiting Triggered
<img src="screenshots/3. rate-limit-error.jpg" width="600"/>
After 5 uploads in a 15-minute window, users are rate-limited to prevent DoS-style spamming.

---

### 4. Renamed Files in `/uploads/` Folder
<img src="screenshots/4. renamed-uploads-folder.jpg" width="600"/>
Uploaded files are renamed using cryptographic random strings — original filenames are never exposed or reused.

---

### 📄 5. Logged Upload Attempts (`upload.log`)
<img src="screenshots/5. upload-log-view.jpg" width="600"/>
Each upload — success or failure — is logged with IP, file name, result, and reason.

---

## 🚀 How to Run Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/LydiahMuigwa/secure-file-upload.git
   cd secure-file-upload
2. **Install dependencies**
   ```bash
   npm install
3. **Create folders (if not auto-created)**
    ```bash
    mkdir uploads temp_uploads    
4. **Run the app**
   ```bash
   node server.js
5. **Open your browser and go to**
    ```bash
    http://localhost:3000

# Tech Stack

- Node.js & Express — server framework
- Multer — file upload middleware
- file-type — magic byte MIME detection
- crypto — secure random filename generation
- express-rate-limit — rate limiting
- basic HTML/CSS — clean responsive frontend
- express-rate-limit — rate limiting
- basic HTML/CSS — clean responsive frontend

