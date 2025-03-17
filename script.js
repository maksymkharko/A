const STORAGE_KEY = 'CLOWNADESOSLINKS';

// Инициализация хранилища
const storage = {
    get: () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
    set: (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
};

// Рендер закладок
function renderBookmarks() {
    const bookmarks = storage.get();
    const list = document.getElementById('bookmarksList');
    list.innerHTML = bookmarks.map(bookmark => `
        <div class="bookmark">
            <i class="${bookmark.icon || 'fas fa-link'} bookmark-icon"></i>
            <div>
                <h3>${bookmark.name}</h3>
                <p>${bookmark.description || ''}</p>
            </div>
        </div>
    `).join('');
}

// Обработчики событий
document.getElementById('addBtn').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'block';
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
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
    document.getElementById('modal').style.display = 'none';
});

// Инициализация
renderBookmarks();