const STORAGE_KEY = 'CLOWNADESOSLINKS';

// Инициализация хранилища
const storage = {
    get: () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
    set: (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
};

let isEditMode = false;
let currentEditIndex = null;

// Рендер закладок
function renderBookmarks() {
    const bookmarks = storage.get();
    const list = document.getElementById('bookmarksList');
    list.innerHTML = bookmarks.map((bookmark, index) => `
        <div class="bookmark" data-index="${index}" onclick="handleBookmarkClick(event, '${bookmark.url}')">
            <i class="${bookmark.icon || 'fas fa-link'} bookmark-icon"></i>
            <div>
                <h3>${bookmark.name}</h3>
                <p>${bookmark.description || ''}</p>
            </div>
        </div>
    `).join('');

    // Добавляем класс для режима редактирования
    if (isEditMode) {
        document.body.classList.add('edit-mode');
    } else {
        document.body.classList.remove('edit-mode');
    }
}

// Обработчик клика на закладку
function handleBookmarkClick(event, url) {
    if (isEditMode) return; // В режиме редактирования не переходим по ссылке
    event.preventDefault();
    window.open(url, '_blank');
}

// Обработчики событий
document.getElementById('addBtn').addEventListener('click', () => {
    document.getElementById('addModal').style.display = 'block';
});

document.getElementById('editBtn').addEventListener('click', () => {
    isEditMode = !isEditMode;
    document.getElementById('editBtn').classList.toggle('active', isEditMode);
    renderBookmarks();
});

document.getElementById('cancelAddBtn').addEventListener('click', () => {
    document.getElementById('addModal').style.display = 'none';
});

document.getElementById('cancelEditBtn').addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none';
});

document.getElementById('saveBtn').addEventListener('click', () => {
    const bookmarks = storage.get();
    const newBookmark = {
        name: document.getElementById('nameInput').value,
        url: document.getElementById('urlInput').value,
        description: document.getElementById('descInput').value,
        icon: 'fas fa-link'
    };

    if (!newBookmark.name || !newBookmark.url) {
        alert('Название и URL обязательны!');
        return;
    }

    storage.set([...bookmarks, newBookmark]);
    renderBookmarks();
    document.getElementById('addModal').style.display = 'none';
});

document.getElementById('updateBtn').addEventListener('click', () => {
    const bookmarks = storage.get();
    const updatedBookmark = {
        name: document.getElementById('editNameInput').value,
        url: document.getElementById('editUrlInput').value,
        description: document.getElementById('editDescInput').value,
        icon: 'fas fa-link'
    };

    if (!updatedBookmark.name || !updatedBookmark.url) {
        alert('Название и URL обязательны!');
        return;
    }

    bookmarks[currentEditIndex] = updatedBookmark;
    storage.set(bookmarks);
    renderBookmarks();
    document.getElementById('editModal').style.display = 'none';
});

document.getElementById('deleteBtn').addEventListener('click', () => {
    const bookmarks = storage.get();
    bookmarks.splice(currentEditIndex, 1);
    storage.set(bookmarks);
    renderBookmarks();
    document.getElementById('editModal').style.display = 'none';
});

// Обработка клика на закладку в режиме редактирования
document.getElementById('bookmarksList').addEventListener('click', (e) => {
    if (!isEditMode) return;

    const bookmarkElement = e.target.closest('.bookmark');
    if (!bookmarkElement) return;

    const index = bookmarkElement.dataset.index;
    const bookmarks = storage.get();
    const bookmark = bookmarks[index];

    document.getElementById('editNameInput').value = bookmark.name;
    document.getElementById('editUrlInput').value = bookmark.url;
    document.getElementById('editDescInput').value = bookmark.description || '';
    currentEditIndex = index;

    document.getElementById('editModal').style.display = 'block';
});

// Инициализация
renderBookmarks();
