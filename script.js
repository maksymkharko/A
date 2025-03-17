const linksKey = 'CLOWNADESOSLINKS';
let editMode = false;
let currentEditIndex = null;

const modal = document.getElementById('modal');
const deleteFooter = document.getElementById('delete-footer');

// Инициализация
document.getElementById('add-link').addEventListener('click', () => showModal());
document.querySelector('.cancel').addEventListener('click', () => hideModal());
document.querySelector('.save').addEventListener('click', saveLink);
document.getElementById('edit-mode').addEventListener('click', toggleEditMode);

function loadLinks() {
    const links = JSON.parse(localStorage.getItem(linksKey)) || [];
    const list = document.getElementById('link-list');
    list.innerHTML = '';

    links.forEach((link, index) => {
        const li = document.createElement('li');
        li.className = `link-item ${editMode ? 'editable' : ''}`;
        li.innerHTML = `
            <div class="link-icon">
                <i class="fas fa-link"></i>
            </div>
            <div class="link-content">
                <h3 class="link-title">${link.name}</h3>
                <p class="link-description">${link.description || ''}</p>
            </div>
        `;

        if(editMode) {
            li.addEventListener('click', () => editLink(index));
        } else {
            li.onclick = () => window.open(link.url, '_blank');
        }

        list.appendChild(li);
    });
}

function showModal(linkData) {
    modal.style.display = 'flex';
    if(linkData) {
        document.getElementById('link-name').value = linkData.name;
        document.getElementById('link-url').value = linkData.url;
        document.getElementById('link-desc').value = linkData.description;
    }
}

function hideModal() {
    modal.style.display = 'none';
    currentEditIndex = null;
}

function saveLink() {
    const name = document.getElementById('link-name').value;
    const url = document.getElementById('link-url').value;
    const description = document.getElementById('link-desc').value;

    if(!name || !url) return alert('Заполните название и URL!');

    const links = JSON.parse(localStorage.getItem(linksKey)) || [];
    
    if(currentEditIndex !== null) {
        links[currentEditIndex] = { name, url, description };
    } else {
        links.push({ name, url, description });
    }

    localStorage.setItem(linksKey, JSON.stringify(links));
    hideModal();
    loadLinks();
}

function toggleEditMode() {
    editMode = !editMode;
    deleteFooter.classList.toggle('visible', editMode);
    document.querySelectorAll('.link-item').forEach(item => {
        item.classList.toggle('editable', editMode);
    });
    loadLinks();
}

function editLink(index) {
    const links = JSON.parse(localStorage.getItem(linksKey)) || [];
    currentEditIndex = index;
    showModal(links[index]);
}

function deleteSelectedLink() {
    const links = JSON.parse(localStorage.getItem(linksKey)) || [];
    if(currentEditIndex !== null && confirm('Удалить выбранную ссылку?')) {
        links.splice(currentEditIndex, 1);
        localStorage.setItem(linksKey, JSON.stringify(links));
        loadLinks();
    }
    currentEditIndex = null;
}

// Первоначальная загрузка
loadLinks();
