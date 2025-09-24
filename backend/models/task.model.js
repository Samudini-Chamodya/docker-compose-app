const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	description: { type: String, default: '' },
	priority: { type: String, enum: ['low','medium','high'], default: 'medium' },
	due_date: { type: Date },
	is_completed: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Task', TaskSchema);



