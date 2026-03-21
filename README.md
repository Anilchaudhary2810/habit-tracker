# 🚀 NexHabit - Advanced Habit Tracker

NexHabit is a high-end, premium habit tracking application designed for consistency and analytics. Built with a modern tech stack, it features glassmorphism design, real-time analytics, and a competitive leaderboard.

![Dashboard Preview](https://via.placeholder.com/1200x600/0f172a/0ea5e9?text=NexHabit+Dashboard+Preview)

## ✨ Features

- **🎯 Smart Habit tracking**: Assign daily tasks that only appear when relevant.
- **📅 Monthly Planning**: Plan your habits month-by-month and stay ahead.
- **📊 Progress Analytics**: Visualize your performance with dynamic charts.
- **🏆 Global Leaderboard**: Compete with other habit builders to become a master.
- **🛡️ Admin Experience**: Full administrative portal for data management.
- **📱 Mobile Responsive**: Fully optimized for phones and tablets.
- **🔒 Secure Auth**: JWT-based authentication system.

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS v4** (Modern CSS architecture)
- **Lucide Icons** (Premium iconography)
- **Framer Motion** (Smooth micro-animations)
- **Recharts** (Performance-focused charts)
- **Date-fns** (Robust date manipulations)
- **Axios** (API communication)

### Backend
- **Python 3 / Django**
- **Django Rest Framework**
- **Simple JWT** (Authentication)
- **Django CORS Headers**
- **SQLite** (Default database)

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Python](https://www.python.org/) (v3.8+)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Admin Setup

To access the **🛡️ Admin Portal**, you can use the default administrator account (created during initial setup) or create your own:

```bash
cd backend
python manage.py createsuperuser
```

Default Admin Credentials (if set up by the helper script):
- **Username**: `anil`
- **Password**: `Anil@$123`

---

## 📸 Screenshots

- **Dashboard**: Modern overview of all your metrics.
- **Planning**: Intuitive form to schedule your habits.
- **Leaderboard**: Competitive rankings and streaks.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements
This project was built to provide a premium, clutter-free habit tracking experience.
