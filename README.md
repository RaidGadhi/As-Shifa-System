# 🏥 As-Shifa Healthcare Management System

A secure, role-based healthcare management system built with plain HTML, CSS, and JavaScript for the front-end, and Node.js for backend security features. This prototype emphasizes core **secure software development practices** such as 2FA, activity logging, RBAC, input validation, and more.

---

## 🔐 Key Security Features

| Feature                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| 🔑 2FA via Email        | Sends a fixed 6-digit code to a configured email address for login (demo). |
| 📜 Activity Logging     | Logs all key actions (login, logout, view, edit, etc.) with timestamps.    |
| 🕒 Session Timeout      | Auto-logout after 5 minutes of inactivity.                                 |
| 🔒 Password Hashing     | Uses bcrypt to hash passwords on registration and login comparison.        |
| 👥 RBAC                 | Patients, doctors, and staff have clearly defined access levels.           |
| 🚫 Rate Limiting        | Blocks brute-force attacks (max 10 login attempts/min per IP).             |
| 🧼 Input Validation     | Sanitizes all user input to prevent injection attacks.                     |


##🎯 Future Enhancements
Real-time alerts to admin dashboard

JWT-based session management

HTTPS with valid SSL

Deployment on Render or Vercel

##👨‍💻 Authors
Raid Gadhi

Zahid AlAbadllah

Faisal Alqarni

Abdulrahman Bunaiyan


