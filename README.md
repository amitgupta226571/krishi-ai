# 🌾 KrishiAI – Smart AI Farming Assistant

KrishiAI is an AI-powered agriculture platform that helps farmers detect crop diseases, receive intelligent farming advice, monitor weather conditions, estimate crop yield, and access market information—all from a single web application.

The application uses **Google Gemini AI**, **Supabase**, **React**, **TanStack Start**, and **Vite** to deliver a modern, fast, and scalable farming assistant.

---

## ✨ Features

### 🤖 AI Farmer Chat
- AI-powered agricultural assistant
- Farming best practices
- Crop management guidance
- Fertilizer recommendations
- Pest and disease suggestions
- Organic and chemical treatment advice

### 🌿 Crop Disease Detection
- Upload crop images
- AI-based disease identification
- Confidence score
- Possible causes
- Recommended treatment
- Prevention tips

### 🌦 Weather Dashboard
- Weather information
- Farming recommendations
- Crop planning support

### 📈 Crop Yield Prediction
- AI-assisted yield estimation
- Agricultural insights

### 💰 Market Information
- Crop market data
- Price information

### 👤 User Authentication
- Email & Password login
- Google OAuth login
- Secure authentication using Supabase

### 📜 History
- Chat history
- Disease detection history
- Previous reports

---

# 🖥 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- TanStack Start
- TanStack Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Lucide Icons

## Backend

- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Storage
- Row Level Security (RLS)

## AI

- Google Gemini API
- Gemini 2.5 Flash

---

# 📁 Project Structure

```
krishi-ai/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── integrations/
│   ├── lib/
│   ├── routes/
│   ├── router.tsx
│   ├── server.ts
│   ├── start.ts
│   └── styles.css
│
├── supabase/
│   ├── migrations/
│   └── config.toml
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/krishi-ai.git

cd krishi-ai
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Create Environment File

Create

```
.env
```

Add

```env
VITE_SUPABASE_URL=

VITE_SUPABASE_PUBLISHABLE_KEY=

VITE_SUPABASE_PROJECT_ID=

SUPABASE_URL=

SUPABASE_PUBLISHABLE_KEY=

SUPABASE_SERVICE_ROLE_KEY=

GEMINI_API_KEY=
```

---

## 4. Configure Supabase

Create a new Supabase project.

Run migrations

```bash
supabase db push
```

Create Storage Bucket

```
crop-images
```

Enable

- Email Authentication
- Google Authentication

---

## 5. Run

```bash
npm run dev
```

Application

```
http://localhost:8080
```

---

# 🔑 Environment Variables

| Variable | Description |
|-----------|-------------|
| VITE_SUPABASE_URL | Supabase Project URL |
| VITE_SUPABASE_PUBLISHABLE_KEY | Supabase Publishable Key |
| VITE_SUPABASE_PROJECT_ID | Supabase Project ID |
| SUPABASE_URL | Supabase URL |
| SUPABASE_PUBLISHABLE_KEY | Publishable Key |
| SUPABASE_SERVICE_ROLE_KEY | Service Role Key |
| GEMINI_API_KEY | Google Gemini API Key |

---

# 📦 Build

```bash
npm run build
```

---

# ▶ Preview Production Build

```bash
npm run preview
```

---

# 🌍 Deployment

The project can be deployed on:

- Vercel
- Netlify
- Render
- Railway

Remember to configure all environment variables in the deployment dashboard.

---

# 🔒 Authentication

Supports

- Email & Password
- Google OAuth

Authentication is powered by Supabase Auth.

---

# 🗄 Database

Supabase PostgreSQL

Main Tables

- profiles
- disease_reports
- chat_messages

Storage

```
crop-images
```

---

# 🧠 AI Features

Gemini AI is used for:

- Crop disease diagnosis
- Agricultural chatbot
- Fertilizer recommendations
- Treatment suggestions
- Prevention guidance

---

# 📷 Disease Detection Workflow

1. Upload crop image
2. Image stored in Supabase Storage
3. Gemini AI analyzes the image
4. Disease prediction generated
5. Treatment recommendations displayed
6. Report saved to history

---

# 💬 AI Chat Workflow

1. User submits question
2. Gemini AI processes request
3. AI returns structured farming advice
4. Conversation stored in Supabase

---

# 🔐 Security

- Supabase Authentication
- Protected Routes
- Row Level Security (RLS)
- Environment Variables
- Secure Storage

---

# 📚 Future Improvements

- Voice Assistant
- Multiple Language Support
- Offline Mode
- Live Weather API
- IoT Sensor Integration
- Satellite Crop Monitoring
- Push Notifications
- Government Scheme Recommendations

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added feature"
```

4. Push

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

**Amit Gupta**

M.Tech (Research) – Computer Science & Engineering

Delhi Technological University (DTU)

GitHub: https://github.com/amitgupta226571

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and supports future development.

---

## 🌱 "Empowering Farmers with Artificial Intelligence"
