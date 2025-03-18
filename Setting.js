const STORAGE_KEY = 'CLOWNADESOSLINKS';

// Экспорт данных
document.getElementById('exportBtn').addEventListener('click', () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        alert('Нет данных для экспорта!');
        return;
    }

    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}-${String(date.getSeconds()).padStart(2, '0')}`;
    const filename = `CLOWNADES_backup-${formattedDate}.json`;

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Данные успешно экспортированы!');
});

// Импорт данных
document.getElementById('importBtn').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                alert('Данные успешно импортированы!');
                window.location.href = 'index.html'; // Возврат на главную страницу
            } catch (error) {
                alert('Ошибка при импорте файла. Убедитесь, что файл корректен.');
            }
        };
        reader.readAsText(file);
    };

    input.click();
});
