const mongoose = require('mongoose');

let isConnected = false;

async function connectWithRetry(uri, maxAttempts = 30, delayMs = 1000) {
	let attempt = 0;
	while (attempt < maxAttempts) {
		try {
			mongoose.set('strictQuery', true);
			await mongoose.connect(uri);
			return mongoose.connection;
		} catch (err) {
			attempt += 1;
			if (attempt >= maxAttempts) throw err;
			await new Promise(r => setTimeout(r, delayMs));
		}
	}
}

async function connectDb(mongoUri) {
	if (isConnected) return mongoose.connection;
	const uri = mongoUri || process.env.MONGO_URI || 'mongodb://localhost:27017/tasksdb';
	await connectWithRetry(uri);
	isConnected = true;
	return mongoose.connection;
}

module.exports = { connectDb };

