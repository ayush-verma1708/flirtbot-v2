import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js'; // updated path
import chatRoutes from './routes/chat.js'; // updated path

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes); // Handles registration, login, and user profile
app.use('/api/chat', chatRoutes); // Handles AI chatbot communication

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI )
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import authRoutes from './routes/auth.js'; // updated path
// import chatRoutes from './routes/chat.js'; // updated path

// dotenv.config(); // Load environment variables

// const app = express();

// // Middleware
// app.use(cors()); // Enable CORS for frontend communication
// app.use(express.json()); // Parse JSON request bodies

// // Routes
// app.use('/api/auth', authRoutes); // Handles registration, login, and user profile
// app.use('/api/chat', chatRoutes); // Handles AI chatbot communication

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI )
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
