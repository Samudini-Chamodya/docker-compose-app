const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { connectDb } = require('./models/db');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health and info endpoints (useful when hitting backend port directly)
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => res.json({ service: 'task-manager-backend', docs: '/api/tasks' }));

connectDb(process.env.MONGO_URI).then(() => {
	app.use('/api/tasks', tasksRouter);
	app.listen(PORT, () => {
		console.log(`Task Manager server running on http://localhost:${PORT}`);
	});
}).catch((err) => {
	console.error('Failed to connect to MongoDB', err);
	process.exit(1);
});
