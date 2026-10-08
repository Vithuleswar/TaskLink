import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { ENV } from './config/env.js';

import authRoutes from './routes/auth.routes.js';
import workersRoutes from './routes/workers.routes.js';
import adminRoutes from './routes/admin.routes.js';
import bhashiniRoutes from './routes/bhashini.routes.js';
import consentRoutes from './routes/consent.routes.js';
import tenancyRoutes from './routes/tenancy.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import matchingRoutes from './routes/matching.routes.js';
import rulesRoutes from './routes/rules.routes.js';
import chatRoutes from './routes/chat.routes.js';
import supportRoutes from './routes/support.routes.js';
import paymentsRoutes from './routes/payments.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import groupsRoutes from './routes/groups.routes.js';
import voiceRoutes from './routes/voice.routes.js';
import locationRoutes from './routes/location.routes.js';
import welfareRoutes from './routes/welfare.routes.js';
import kycRoutes from './routes/kyc.routes.js';

const app = express();
const server = http.createServer(app);

// Socket.IO server for real-time booking updates and translated chat
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[API ${req.method}] ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  return res.json({
    status: 'healthy',
    service: 'TaskLink Core API Gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    commission: '0% guaranteed',
  });
});

// Fallback local file upload handler for development
app.put('/api/workers/upload-fallback/:filename', (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'File upload simulated in local fallback mode',
    url: `http://localhost:${ENV.PORT}/uploads/${req.params.filename}`,
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/rules', rulesRoutes);
app.use('/api/bhashini', bhashiniRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/tenancy', tenancyRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/welfare', welfareRoutes);
app.use('/api/kyc', kycRoutes);

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`🔌 [Socket.IO] Client connected: ${socket.id}`);

  socket.on('join_booking', (bookingId: string) => {
    socket.join(`booking:${bookingId}`);
    console.log(`[Socket.IO] Client ${socket.id} joined room booking:${bookingId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 [Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Export io instance for route emitters
export { io };

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('[API Error]:', err);
  return res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  server.listen(ENV.PORT, () => {
    console.log(`🚀 [TaskLink API] Running on http://localhost:${ENV.PORT}`);
    console.log(`🛡️  0% Platform Commission enforced by cooperative ledger.`);
  });
}

export default app;
