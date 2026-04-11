// Vercel Serverless Function Handler
import app from './server.js';
import { connectDB } from './config/database.js';

// Global variable เพื่อเก็บสถานะการเชื่อมต่อ Database (ป้องกันการต่อซ้ำหลายรอบ)
let isConnected = false;

const connectDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    // พยายามเชื่อมต่อ Database
    await connectDB();
    isConnected = true;
    console.log('✅ MongoDB Connected (Serverless Mode)');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // ไม่ throw error เพื่อให้ function ยังทำงานต่อได้ (เผื่อเป็นปัญหาชั่วคราว)
  }
};

// Vercel Entry Point
export default async function handler(req, res) {
  // 1. จัดการเรื่อง CORS Preflight (OPTIONS) ในระดับบนสุด
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    return res.status(200).end();
  }

  // 2. รอให้เชื่อมต่อ Database สำเร็จก่อนทำงานต่อ
  await connectDatabase();

  // 3. ส่งต่อ Request ให้ Express App (server.js) จัดการ
  return app(req, res);
}
