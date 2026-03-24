import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current directory (ESM compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST, before importing any modules that use them
const envPath = path.resolve(__dirname, '.env');

// Check if file exists using fs (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('🔍 Looking for .env at:', envPath);
  const envExists = fs.existsSync(envPath);
  console.log('📄 .env file exists:', envExists);

  if (envExists) {
    const envResult = dotenv.config({ path: envPath });
    if (envResult.error) {
      console.error('❌ Error loading .env file:', envResult.error.message);
    } else {
      console.log('✅ Loaded .env from:', envPath);
    }
  } else {
    console.warn('⚠️  Warning: .env file not found at:', envPath);
    dotenv.config(); // Try default location
  }
} else {
  // In production (Vercel), environment variables are set by Vercel
  dotenv.config();
}

// Debug: Check critical environment variables
const dbUrl = process.env.DATABASE_URL || process.env.MONGODB_URI;
if (process.env.NODE_ENV !== 'production') {
  console.log('\n🔍 Environment Variables Status:');
  console.log('  DATABASE_URL:', dbUrl ? `✅ Set` : '❌ Missing');
  console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
  console.log('  FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:5173');
  console.log('');
}

// Import middleware, routes, and database config (after env setup)
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import teacherRoutes from './routes/teacher.js';
import studentRoutes from './routes/student.js';
import lessonRoutes from './routes/lesson.js';
import adminRoutes from './routes/admin.js';
import ttsRoutes from './routes/ttsRoutes.js';

// Setup Express app
const app = express();

// Rate limiting (less aggressive for Vercel)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 200 : 100 // Higher limit for production
});

// Get frontend URL for CORS
const getFrontendUrl = () => {
  let url = "http://localhost:5173";

  if (process.env.FRONTEND_URL) {
    url = process.env.FRONTEND_URL;
  } else if (process.env.VERCEL) {
    // For Vercel, construct URL from VERCEL_URL or use default
    url = `https://${process.env.VERCEL_URL || 'bearthai.vercel.app'}`;
  }

  // Remove trailing slash to match browser Origin header
  return url.replace(/\/$/, '');
};

// Get CORS origins (array for development, single for production)
const getCorsOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    return getFrontendUrl();
  }

  // Development: allow multiple common localhost ports
  return [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    getFrontendUrl() // Also add any custom frontend URL
  ];
};

// Middleware
app.use(limiter);
app.use(cors({
  origin: getCorsOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check - ต้องอยู่ก่อน DB middleware เพื่อไม่ให้โดน error "Client must be connected" ตอน cold start
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Static files (only if not on Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.use('/uploads', express.static('public/uploads'));
}

// Database connection middleware (Critical for Vercel/Serverless) - หลัง /health
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed in middleware:', error);
    res.status(503).json({
      success: false,
      message: 'Database connection failed. Please try again in a moment.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teacher', authMiddleware, teacherRoutes);
app.use('/api/student', authMiddleware, studentRoutes);
app.use('/api/lessons', authMiddleware, lessonRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/tts', ttsRoutes); // TTS can be public or semi-protected if needed

// Error handling
app.use(errorHandler);

// Setup Socket.io only for development/local server
let server, io;
const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

if (!isProduction) {
  server = createServer(app);
  io = new Server(server, {
    cors: {
      origin: getFrontendUrl(),
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-classroom', (classroomId) => {
      socket.join(`classroom-${classroomId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}


// Start local development server (not for Vercel)
if (!isProduction) {
  const PORT = process.env.PORT || 3000;

  (async () => {
    if (!dbUrl) {
      console.error('\n❌ CRITICAL ERROR: DATABASE_URL is not set!');
      console.error('   Server cannot start without database connection.');
      process.exit(1);
    }

    try {
      console.log('\n🔄 Connecting to MongoDB...');
      await connectDB();
      console.log('✅ Database connection established\n');
    } catch (error) {
      console.error('\n❌ FATAL ERROR: Failed to connect to database');
      console.error('   Error:', error.message);
      process.exit(1);
    }

    server.listen(PORT, () => {
      console.log(`🚀 BearThai API Server is running on port ${PORT}`);
      console.log(`📚 Web CAI ภาษาไทย ป.1 - Ready for learning!`);
    });
  })();
}

// Export app for Vercel and development
export default app;
export { io };
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.use(cors({
  origin: [
    'http://localhost:5173', // สำหรับการพัฒนาในเครื่องท้องถิ่น
    'https://bearthai-frontend-79qc1vsyw-patcharapong-phunsapamorns-projects.vercel.app', // สำหรับ **Frontend** บน Vercel
    'https://bearthai-frontend-9xqv6zeh6-patcharapong-phunsapamorns-projects.vercel.app', // อีก URL ของ **Frontend**
  ],
  credentials: true, // อนุญาตให้ส่ง cookies หรือข้อมูลที่ต้องการความปลอดภัย
}));
