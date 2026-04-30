# 🏥 HealthX - Modern Healthcare Management System

HealthX is a premium, full-stack MERN application designed to streamline healthcare management. It provides a seamless experience for patients to book appointments and a powerful, data-driven analytics dashboard for administrators to manage medical operations.

---

## 🌟 Key Features

### **For Patients (Frontend)**
- **User Authentication**: Secure registration and login for patients.
- **Doctor Discovery**: Detailed doctor profiles with specialization, experience, and descriptions.
- **Smart Appointment Booking**: Real-time form validation, auto-fill capabilities, and conflict prevention.
- **Appointment History**: Track past and upcoming medical visits with status badges.
- **Notification System**: Real-time alerts for appointment confirmations and status updates.
- **Premium UI**: Modern, glassmorphism design with full dark mode support and smooth animations.
- **Fully Responsive**: Optimized experience across Mobile, Tablet, and Desktop devices.

### **For Administrators (Dashboard)**
- **Analytics Hub**: Advanced data visualization using Recharts (Area, Pie, and Bar charts).
- **Real-Time Monitoring**: 5-second polling system for live hospital activity tracking.
- **Doctor Management**: Full CRUD operations (Add, Edit, Delete) for healthcare providers.
- **Appointment Control**: Review, accept, or reject appointments with instant UI updates.
- **Exportable Reports**: Generate and download professional PDF analytics reports with one click.
- **Messaging System**: Centralized view for patient inquiries and messages.

---

## 🚀 Tech Stack

**Frontend & Dashboard:**
- React.js (Vite)
- Tailwind CSS (Vanilla CSS components)
- Framer Motion (Animations)
- Recharts (Data Visualization)
- Lucide React (Icons)
- Axios (API Communication)
- React Toastify (Notifications)

**Backend:**
- Node.js & Express.js
- MongoDB (Mongoose ODM)
- JWT (Authentication)
- Bcrypt.js (Security)
- Cloudinary (Image Hosting)
- Cookie Parser (Session Management)

---

## 🛠️ Installation & Setup

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/healthx.git
cd healthx
```

### **2. Backend Setup**
```bash
cd backend
npm install
```
Create a `config/config.env` file:
```env
PORT=4001
MONGO_URI=your_mongodb_uri
FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174
JWT_SECRET_KEY=your_secret_key
JWT_EXPIRES=7d
COOKIE_EXPIRE=7
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **3. Frontend Setup**
```bash
cd ../frontend
npm install
npm run dev
```

### **4. Admin Dashboard Setup**
```bash
cd ../dashboard
npm install
npm run dev
```

---

## 📡 API Overview

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/user/patient/register` | Register new patient | Public |
| **POST** | `/api/v1/user/login` | Secure login (Admin/Patient) | Public |
| **GET** | `/api/v1/user/doctors` | Fetch all doctors | Public |
| **POST** | `/api/v1/appointment/post` | Book an appointment | Patient |
| **GET** | `/api/v1/analytics/stats` | Fetch dashboard analytics | Admin |
| **PUT** | `/api/v1/user/doctor/update/:id` | Update doctor profile | Admin |
| **DELETE** | `/api/v1/user/doctor/delete/:id` | Remove a doctor | Admin |

---

## 📊 Directory Structure

```text
HEALTHX/
├── backend/            # Express Server & API
│   ├── controller/     # Business Logic
│   ├── models/         # Database Schemas
│   ├── router/         # API Endpoints
│   └── utils/          # JWT & Token Helpers
├── frontend/           # Patient Web Application
│   ├── src/components/ # Reusable UI components
│   └── src/Pages/      # Main application views
└── dashboard/          # Admin Management Panel
    ├── src/components/ # Analytics & Management tools
    └── src/main.jsx    # Application Entry
```

---

## 🔮 Future Improvements
- [ ] **Video Consultations**: Integrated WebRTC for remote doctor-patient meetings.
- [ ] **Prescription Management**: Digital prescriptions downloadable via PDF.
- [ ] **Payment Gateway**: Secure online payments for appointment booking.
- [ ] **AI Symptom Checker**: Preliminary diagnostic tool for patients.

---

## 👤 Author
**Sidharth Deora**
- [GitHub](https://github.com/deorasidharth)
- [LinkedIn](https://linkedin.com/in/sidharthdeora)

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
