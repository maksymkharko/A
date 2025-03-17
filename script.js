const linksKey = 'CLOWNADESOSLINKS';
let editMode = false;
const icons = [
    'fas fa-globe', 'fas fa-envelope', 'fas fa-music', 
    'fas fa-video', 'fas fa-file', 'fas fa-image',
    'fas fa-link', 'fas fa-book', 'fas fa-rss'
];

function loadLinks() {
    const links = JSON.parse(localStorage.getItem(linksKey)) || [];
    const list = document.getElementById('link-list');
    list.innerHTML = '';
    
    links.forEach((link, index) => {
        const li = document.createElement('li');
        li.className = `list-item ${editMode ? 'edit-mode' : ''}`;
        li.innerHTML = `
            <button class="delete-btn" onclick="deleteLink(${index})">
                <i class="fas fa-times"></i>
            </button>
            <i class="${link.icon}"></i>
            <div class="list-item-content">
                <a href="${link.url}" target="_blank">${link.name}</a>
                ${link.description ? `<div class="description">${link.description}</div>` : ''}
            </div>
            <div class="edit-buttons">
                <button onclick="editLink(${index})">
                    <i class="fas fa-pencil"></i>
                </button>
            </div>
        `;
        list.appendChild(li);
    });
}

function saveLinks(links) {
    localStorage.setItem(linksKey, JSON.stringify(links));
}

function addLink() {
    const name = prompt('Введите название ссылки:');
    if (!name) return;
    
    const url = prompt('Введите URL:');
    if (!url) return;
    
    const links = JSON.parse(localStorage.getItem(linksKey)) || [];
    links.push({ 
        name, 
        url,
        icon: 'fas fa-link',
        description: '' 
    });
    saveLinks(links);
    loadLinks();
}

function editLink(index) {
    const links = JSON.parse(localStorage.getItem(linksKey)) || [];
    const link = links[index];
    
    const newName = prompt('Новое название:', link.name);
    const newUrl = prompt('Новый URL:', link.url);
    const newDescription = prompt('Описание:', link.description);
    const newIcon = prompt(`Доступные иконки:\n${icons.join('\n')}\nВведите класс иконки:`, link.icon);
    
    if (newName) link.name = newName;
    if (newUrl) link.url = newUrl;
    if (newDescription !== null) link.description = newDescription;
    if (newIcon && icons.includes(newIcon)) link.icon = newIcon;
    
    saveLinks(links);
    loadLinks();
}

function deleteLink(index) {
    if (confirm('Удалить эту ссылку?')) {
        const links = JSON.parse(localStorage.getItem(linksKey)) || [];
        links.splice(index, 1);
        saveLinks(links);
        loadLinks();
    }
}

// Инициализация
document.getElementById('add-link').addEventListener('click', addLink);
document.getElementById('edit-mode').addEventListener('click', () => {
    editMode = !editMode;
    document.body.classList.toggle('edit-mode', editMode);
    loadLinks();
});

loadLinks();