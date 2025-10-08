document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskInputBtn = document.getElementById('task-input-btn');
    const taskList = document.getElementById('task-list');

    // === Local Storage ===
    const saveTasks = () => {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(li => {
            const text = li.querySelector('.task-text').textContent;
            const completed = li.classList.contains('completed');
            tasks.push({ text, completed });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasks = () => {
        const stored = localStorage.getItem('tasks');
        if (!stored) return;
        JSON.parse(stored).forEach(task => {
            createTaskElement(task.text, task.completed);
        });
    };

    // === Fungsi Membuat Elemen Task ===
    const createTaskElement = (text, completed = false) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (completed) li.classList.add('completed');

        li.innerHTML = `
            <label class="task-label">
                <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''}>
                <span class="task-text">${text}</span>
            </label>
            <div class="task-actions">
                <button class="edit-btn"><i data-feather="edit-2"></i></button>
                <button class="delete-btn"><i data-feather="trash-2"></i></button>
            </div>
        `;

        taskList.appendChild(li);
        feather.replace(); // refresh icons
    };

    // === Fungsi Menambah Task ===
    const addTask = (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (!text) return;

        createTaskElement(text);
        taskInput.value = '';
        saveTasks(); // simpan setelah tambah task
    };

    // === Event Listeners ===
    taskInputBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask(e);
    });

    // Event delegation untuk edit / delete / checkbox
    taskList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;

        // Hapus task
        if (e.target.closest('.delete-btn')) {
            li.remove();
            saveTasks();
        }

        // Edit task
        if (e.target.closest('.edit-btn')) {
            const textSpan = li.querySelector('.task-text');
            const newText = prompt('Edit task:', textSpan.textContent);
            if (newText !== null && newText.trim() !== '') {
                textSpan.textContent = newText.trim();
                saveTasks();
            }
        }

        // Checkbox
        if (e.target.classList.contains('task-checkbox')) {
            li.classList.toggle('completed', e.target.checked);
            saveTasks();
        }
    });

    // === Muat ulang task saat halaman dibuka ===
    loadTasks();
});
