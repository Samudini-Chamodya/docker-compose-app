const express = require('express');
const Task = require('../models/task.model');

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const tasks = await Task.find().sort({ created_at: -1 }).lean();
		res.json(tasks);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch tasks' });
	}
});

router.post('/', async (req, res) => {
	try {
		const { title, description = '', priority = 'medium', due_date = null } = req.body || {};
		if (!title || typeof title !== 'string') return res.status(400).json({ error: 'title is required' });
		const task = await Task.create({ title: title.trim(), description: description.trim(), priority, due_date, is_completed: false });
		res.status(201).json(task);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to create task' });
	}
});

router.put('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body || {};
		if (typeof updates.is_completed === 'boolean') {
			updates.is_completed = !!updates.is_completed;
		}
		const task = await Task.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
		if (!task) return res.status(404).json({ error: 'Not found' });
		res.json(task);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to update task' });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await Task.findByIdAndDelete(id);
		if (!result) return res.status(404).json({ error: 'Not found' });
		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to delete task' });
	}
});

module.exports = router;

