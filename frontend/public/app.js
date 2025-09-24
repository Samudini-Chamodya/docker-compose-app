const api = {
	async list() {
		const res = await fetch('/api/tasks');
		return res.json();
	},
	async create(payload) {
		const res = await fetch('/api/tasks', {
			method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
		});
		return res.json();
	},
	async update(id, payload) {
		const res = await fetch(`/api/tasks/${id}`, {
			method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
		});
		return res.json();
	},
	async remove(id) {
		const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
		return res.json();
	}
};

const el = (sel) => document.querySelector(sel);
const listEl = el('#taskList');
const form = el('#taskForm');
const filterStatus = el('#filterStatus');
const filterPriority = el('#filterPriority');
const themeToggle = el('#themeToggle');

function priorityBadge(priority) {
	return `<span class="priority ${priority}">${priority}</span>`;
}

function formatDate(iso) {
	if (!iso) return '';
	return new Date(iso).toLocaleDateString();
}

function taskItem(t) {
	const done = !!t.is_completed;
	return `
	<li class="task ${done ? 'done' : ''}" data-id="${t._id}">
		<div class="meta">
			<input type="checkbox" ${done ? 'checked' : ''} />
			<div>
				<div class="title">${t.title}</div>
				<div class="desc">${t.description || ''}</div>
			</div>
		</div>
		<div class="dates">
			${priorityBadge(t.priority)}
			${t.due_date ? ` • due ${formatDate(t.due_date)}` : ''}
		</div>
		<div class="actions">
			<button class="edit">Edit</button>
			<button class="danger delete">Delete</button>
		</div>
	</li>`;
}

async function render() {
	let tasks = await api.list();
	if (filterStatus.value !== 'all') {
		const wantDone = filterStatus.value === 'done';
		tasks = tasks.filter(t => !!t.is_completed === wantDone);
	}
	if (filterPriority.value !== 'all') {
		tasks = tasks.filter(t => t.priority === filterPriority.value);
	}
	listEl.innerHTML = tasks.map(taskItem).join('');
}

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	const payload = {
		title: el('#title').value.trim(),
		description: el('#description').value.trim(),
		priority: el('#priority').value,
		due_date: el('#due_date').value || null
	};
	if (!payload.title) return;
	await api.create(payload);
	form.reset();
	await render();
});

listEl.addEventListener('click', async (e) => {
	const item = e.target.closest('.task');
	if (!item) return;
	const id = item.dataset.id;
	if (e.target.matches('input[type="checkbox"]')) {
		const checked = e.target.checked;
		await api.update(id, { is_completed: checked });
		await render();
	}
	if (e.target.matches('.delete')) {
		await api.remove(id);
		await render();
	}
	if (e.target.matches('.edit')) {
		const currentTitle = item.querySelector('.title').textContent;
		const newTitle = prompt('Update title', currentTitle);
		if (newTitle && newTitle.trim() && newTitle !== currentTitle) {
			await api.update(id, { title: newTitle.trim() });
			await render();
		}
	}
});

filterStatus.addEventListener('change', render);
filterPriority.addEventListener('change', render);

// Theme toggle
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') root.classList.add('light');

themeToggle.addEventListener('click', () => {
	root.classList.toggle('light');
	localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

render();
