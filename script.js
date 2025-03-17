const linksKey = 'CLOWNADESOSLINKS';
let currentEditIndex = null;
let isEditMode = false;

const modal = document.getElementById('modal');
const deleteBtn = document.getElementById('delete-btn');
const editModeBtn = document.getElementById('edit-mode');

// Инициализация
document.getElementById('add-link').addEventListener('click', () => showModal());
document.querySelector('.btn-cancel').addEventListener('click', closeModal);
document.querySelector('.btn-save').addEventListener('click', saveLink);
deleteBtn.addEventListener('click', handleDelete);
editModeBtn.addEventListener('click', toggleEditMode);

function loadLinks() {
    const links = JSON.parse(localStorage.getItem(linksKey)) || [];
    const list = document.getElementById('link-list');
    list.innerHTML = '';

    links.forEach((link, index) => {
        const li = document.createElement('li');
        li.className = 'link-item';
        li.innerHTML = `
            <div class="link-icon">
                <i class="fas fa-link"></i>
            </div>
            <div class="link-content">
                <h3 class="link-title">${link.name}</h3>
                <p class="link-description">${link.description || ''}</p>
            </div>
        `;

        li.addEventListener('click', () => {
            if(isEditMode) {
                showModal(link, index);
            } else {
                window.open(link.url, '_blank');
            }
        });

        list.appendChild(li);
    });
}

function showModal(linkData = null, index = null) {
    currentEditIndex = index;
    const isEditing = !!linkData;
    
    // Настройка модального окна
    document.getElementById('modal-title').textContent = isEditing ? 'Редактировать ссылку' : 'Новая ссылка';
    deleteBtn.style.display = isEditing ? 'flex' : 'none';
    
    if(isEditing) {
        document.getElementById('link-name').value = linkData.name;
        document.getElementById('link-url').value = linkData.url;
        document.getElementById('link-desc').value = linkData.description;
    } else {
        document.getElementById('link-name').value = '';
        document.getElementById('link-url').value = '';
        document.getElementById('link-desc').value = '';
    }
    
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
    currentEditIndex = null;
}

function saveLink() {
    const linkData = {
        name: document.getElementById('link-name').value.trim(),
        url: document.getElementById('link-url').value.trim(),
        description: document.getElementById('link-desc').value.trim()
    };

    if(!validateLink(linkData)) return;

    const links = JSON.parse(localStorage.getItem(linksKey)) || [];
    
    if(typeof currentEditIndex === 'number') {
        links[currentEditIndex] = linkData;
    } else {
        links.push(linkData);
    }

    localStorage.setItem(linksKey, JSON.stringify(links));
    closeModal();
    loadLinks();
}

function handleDelete() {
    if(typeof currentEditIndex !== 'number' || !confirm('Вы уверены, что хотите удалить эту ссылку?')) return;
    
    const links = JSON.parse(localStorage.getItem(linksKey)) || [];
    links.splice(currentEditIndex, 1);
    localStorage.setItem(linksKey, JSON.stringify(links));
    
    closeModal();
    loadLinks();
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    editModeBtn.style.backgroundColor = isEditMode ? '#404040' : '#2d2d2d';
    loadLinks();
}

function validateLink({ name, url }) {
    if(!name || !url) {
        alert('Пожалуйста, заполните все обязательные поля');
        return false;
    }
    
    if(!url.startsWith('http://') && !url.startsWith('https://')) {
        alert('URL должен начинаться с http:// или https://');
        return false;
    }
    
    return true;
}

// Первоначальная загрузка
loadLinks();