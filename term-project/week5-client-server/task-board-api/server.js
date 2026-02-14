require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./database/connection');
const taskController = require('./src/controllers/taskController');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: true, // อนุญาตทุก origins ใน development
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Routes - Statistics (ต้องอยู่ก่อน :id routes)
app.get('/api/tasks/stats', taskController.getStatistics.bind(taskController));

// Routes - CRUD
app.get('/api/tasks', taskController.getAllTasks.bind(taskController));
app.get('/api/tasks/:id', taskController.getTaskById.bind(taskController));
app.post('/api/tasks', taskController.createTask.bind(taskController));
app.put('/api/tasks/:id', taskController.updateTask.bind(taskController));
app.delete('/api/tasks/:id', taskController.deleteTask.bind(taskController));

// Routes - Special actions
app.patch('/api/tasks/:id/next-status', taskController.moveToNextStatus.bind(taskController));

// Error handling middleware (ต้องอยู่สุดท้าย)
app.use(errorHandler);

// เริ่ม server
async function startServer() {
    try {
        // เชื่อมต่อฐานข้อมูล
        await database.connect();
        
        // เริ่ม Express server
        app.listen(PORT, () => {
            logger.info(`🚀 เซิร์ฟเวอร์ทำงานที่ http://localhost:${PORT}`);
            logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        logger.error('ไม่สามารถเริ่มเซิร์ฟเวอร์ได้:', error);
        process.exit(1);
    }
}

// จัดการการปิดอย่างถูกต้อง
process.on('SIGINT', async () => {
    logger.info('กำลังปิดเซิร์ฟเวอร์...');
    await database.close();
    process.exit(0);
});

// Production: Listen บนทุก interfaces
const HOST = process.env.HOST || '0.0.0.0';

// แก้ไข listen call:
app.listen(PORT, HOST, () => {
    logger.info(`🚀 เซิร์ฟเวอร์ทำงานที่ http://${HOST}:${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
});

startServer();
