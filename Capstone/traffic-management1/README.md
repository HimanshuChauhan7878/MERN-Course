# 🚦 Smart Traffic Violation & Fine Management System

A comprehensive MERN-based digital enforcement platform for traffic authorities to record violations, issue e-challans, track offenders, manage payments, and analyze traffic patterns.

## ✨ Features

- **Violation Recording**: Officers can record violations with location, images, and timestamps
- **E-Challan System**: Automated challan generation with online payment
- **Analytics Dashboard**: Real-time insights on violations, revenue, and traffic patterns
- **Repeat Offender Tracking**: Automatic tracking and enhanced penalties
- **Heatmap Analysis**: Visualize violation hotspots
- **Role-Based Access**: Separate dashboards for Admin, Officers, and Citizens
- **Vehicle Search**: Public search for challans by vehicle number
- **Payment Integration**: Online payment processing for challans

## 🛠️ Tech Stack

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Twilio (SMS notifications)

### Frontend
- React 18
- React Router DOM
- Vite
- Modern CSS with gradients and animations

## 📦 Installation

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

Start the backend server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory (optional):

```env
VITE_API_URL=/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000` and the backend on `http://localhost:3001`.

## 🚀 Usage

### Demo Credentials

After seeding the database, you can use these credentials:

- **Admin**: admin@traffic.com
- **Officer**: officer@traffic.com  
- **Citizen**: citizen@traffic.com

(Default password for all: Check your seed data)

### User Roles

1. **Admin**: Full access to analytics, all challans, and system management
2. **Officer**: Can record violations and view assigned cases
3. **Citizen**: Can search and pay challans

## 📁 Project Structure

```
traffic-management1/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Auth middleware
│   │   └── utils/          # Helper functions
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (Auth)
│   │   ├── services/      # API services
│   │   └── styles.css     # Global styles
│   └── index.html
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Violations
- `POST /api/violations` - Create violation (Officer only)

### Challans
- `GET /api/challans/my-challans` - Get user's challans
- `GET /api/challans` - Get all challans (Admin/Officer)
- `GET /api/challans/:id` - Get challan by ID
- `GET /api/challans/vehicle/:vehicleNumber` - Search by vehicle
- `PATCH /api/challans/:id/status` - Update status (Admin)

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats (Admin)
- `GET /api/analytics/heatmap` - Heatmap data

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments/history` - Payment history

## 🎨 Features in Detail

### Admin Dashboard
- Total challans, pending, paid statistics
- Revenue tracking
- Violations by type (charts)
- Repeat offenders list
- Recent challans with filtering

### Officer Dashboard
- Record new violations
- View recent challans
- Statistics overview

### Citizen Dashboard
- Search challans by vehicle number
- View personal challans
- Pay challans online
- Payment history

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Protected API routes
- Secure password hashing (bcrypt)

## 📝 License

This project is part of a MERN course capstone project.

## 👨‍💻 Development

For development, both servers support hot-reload:
- Backend: `npm run dev` (uses nodemon)
- Frontend: `npm run dev` (uses Vite HMR)

## 🤝 Contributing

This is a capstone project. For improvements, please create issues or pull requests.

---

Built with ❤️ using MERN Stack
