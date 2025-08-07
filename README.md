# 🎬 CineAdmin

**CineAdmin** is a powerful admin dashboard for managing a movie streaming platform. It provides full control over movies, users, and comments — with fast, modern UI and a secure, scalable backend.

---

## 🔧 Tech Stack

### 🖥️ Frontend
- **React** + **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Lucide Icons**
- **React Hot Toast** for notifications
- **Debounced search** & dynamic filters
- **Optimistic UI** with smooth transitions

### 🛠️ Backend
- **NestJS** — Modular, type-safe, and scalable Node.js framework
- **PostgreSQL**
- **JWT Authentication**
- **Role-based Authorization (Admin, Viewer, etc.)**
- **RESTful API** consumed by the frontend

---

## ✨ Features

- 🎞️ **Movie Management**: 
  - Add / edit / delete movies
  - Approve or reject movies
  - Search by title or genre
  - View movies in a table format

- 👥 **User Management**:
  - View user details
  - Update roles (Admin / User)
  - Delete users

- 💬 **Comment Moderation**:
  - View and delete comments from users

- 📊 **Statistics Dashboard**:
  - View user count, movie count, and platform stats

- 🔍 **Smart Search**:
  - Debounced search bar
  - Filter by genre, release date, or approval status

- ⚙️ **Optimistic Updates**:
  - Instant UI updates before server confirmation

---

## 📁 Project Structure

```bash
.
├── components        # UI components (tables, cards, inputs, etc.)
├── app              # Next.js App Router structure
├── hooks            # Custom React hooks (e.g., useDebounce, useDashboard)
├── types            # Global TypeScript interfaces
├── api              # Axios-based service layer
├── styles           # Tailwind & theme configs
└── README.md
