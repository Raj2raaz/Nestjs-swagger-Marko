# 🔗 URL Shortener API

A simple RESTful API built with **NestJS** and **MongoDB** that allows users to:

- Shorten long URLs
- Generate custom short codes
- Redirect to the original URL using the short code
- Track the number of clicks
- View detailed stats for each shortened URL
- View and test APIs via Swagger documentation

---

## 🚀 Deployed URL

**Backend API (Production):** [https://nestjs-swagger-marko.onrender.com/](https://nestjs-swagger-marko.onrender.com/)  

**Swagger Docs:**  [https://nestjs-swagger-marko.onrender.com/docs](https://nestjs-swagger-marko.onrender.com/)

---

## 🧠 Technologies Used

- **NestJS** (Node.js framework)
- **MongoDB** (Database)
- **Mongoose** (ODM)
- **Swagger** (API Docs)

---

## ⚙️ Local Setup Instructions

### 🔧 1. Clone the Repo

```bash
git clone https://github.com/Raj2raaz/Nestjs-swagger-Marko
cd url-shortener-api
```

### 📦 2. Install Dependencies

```bash
npm install
```

### ⚙️ 3. Create `.env` File

Create a `.env` file in the root folder and add:

```env
MONGO_URI=mongodb://localhost:27017/urlshortener
BASE_URL=http://localhost:3000
PORT=3000
```

### ▶️ 4. Run the App Locally

```bash
npm run start:dev
```

Visit:  
- API: `http://localhost:3000/`
- Swagger Docs: `http://localhost:3000/docs`

---

## 📌 API Endpoints

### 🔗 POST `/api/shorten`

Shortens a long URL.

**Request Body:**
```json
{
  "url": "https://example.com/a-very-long-url",
  "customCode": "myalias123" // optional
}
```

**Response:**
```json
{
  "originalUrl": "https://example.com/a-very-long-url",
  "shortUrl": "http://localhost:3000/r/myalias123"
}
```

---

### 🔁 GET `/api/r/:shortCode`

Redirects to the original long URL.

**Response:**  
302 Redirect → `originalUrl`  
404 Not Found → if code doesn’t exist

---

### 📊 GET `/api/stats/:shortCode`

Returns analytics for a specific short code.

**Response:**
```json
{
  "originalUrl": "https://example.com/a-very-long-url",
  "shortUrl": "http://localhost:3000/r/myalias123",
  "clicks": 12
}
```

---

## 📄 Swagger Documentation

Access all API documentation and test routes at:

👉 [`http://localhost:3000/docs`](http://localhost:3000/docs)


---

## 🙋 Author

**Subham Raj**  
Feel free to reach out for questions, collaboration, or improvements!
