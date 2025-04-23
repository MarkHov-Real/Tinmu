# 🎵 TINMU – Tinder for Music Lovers 🎵

TINMU (Tinder-Inspired Music Universe) is a playful mobile-first app that matches users based on their favorite artists and music genres. Built with a full-stack architecture, the app prioritizes learning, test-driven development (TDD), and modern mobile UX.

> **Status:** In active development – backend basics routes completed(many to be added), mobile frontend in progress.

---

## 🧠 Concept

1. Users sign up and complete a profile.
2. They must **like at least 2 genres or artists**.
3. The system suggests **2–3 matches** who share musical tastes and gender preferences.
4. Users swipe through matches, and the cycle continues.

---

## 🛠 Tech Stack

| Layer      | Tech Used                      |
| ---------- | ------------------------------ |
| Mobile UI  | Expo Router + React Native     |
| Backend    | Node.js, Express, Prisma       |
| Database   | PostgreSQL (Dockerized)        |
| Auth       | JWT                            |
| Testing    | Jest + Supertest (TDD-first)   |
| State Mgmt | AsyncStorage (local)           |
| API Source | Spotify (optional integration) |

---

## 📂 Folder Structure

```
/tinmu
├── server               # Express backend
│   ├── routes           # Auth, users, likes, matches
│   ├── test             # Jest tests for API
│   ├── prisma           # DB schema
│   └── lib              # DB connection, auth, validation
├── app                  # Expo Router + React Native app
│   ├── screens          # Mobile screens (Login, Me, Matches, etc.)
│   ├── lib              # API client, auth helpers
│   └── store            # Auth context (AsyncStorage-based)
```

---

## 🧪 Running the Project

### 🐳 Backend

```bash
cd tinmu/server
npm install
docker compose up -d
npx prisma migrate reset
npm test         # to run the full TDD suite
npm start
```

### 📱 Mobile Frontend

```bash
cd tinmu/app
npm install
npx expo start
```

---

## 🔐 Credentials for Testing

Use these credentials for Postman or mobile login testing:

```
Email:    test@login.com
Password: test1234
```

You can also create a user using the `/users` endpoint.

---

## 🚀 Goals

- Learn TDD, React Native, and Expo deeply.
- Simulate a real tech team workflow.
- Showcase clean, testable code to recruiters.
- Deploy a mobile-ready MVP that can grow.

---

## 💡 Future Ideas

- Spotify integration to dynamically fetch artists/genres.
- Swipe animations and match notifications.
- Firebase for real-time chat.
- Deploy backend on Render / Railway.
