const collectionsDiv = document.querySelector('.collections');
const newFolderBtn = document.querySelector('.toolbar button');
const folderCountText = document.querySelector('.total-folder-count');

function updateFolderCount() {
    const count = document.querySelectorAll('.folder').length;
    folderCountText.textContent = `Total Folders: ${count}`;
}

function addDeleteListener(folderElement) {
    const deleteBtn = folderElement.querySelector('.delete-icon');
    if (!deleteBtn) return;

    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent folder click
        folderElement.remove();
        updateFolderCount();
    });
}

function addFolderClickListener(folderElement) {
    folderElement.addEventListener('click', () => {
        document.getElementById('main-view').style.display = 'none';
        document.getElementById('folder-view').style.display = 'block';

        const folderName = folderElement.querySelector('.folder-name').value;
        document.querySelector('.name').textContent = folderName;
    });
}

function createFolder(name = 'New Folder', items = 0) {
    const folder = document.createElement('div');
    folder.className = 'folder';

    folder.innerHTML = `
        <div class="header">
            <span class="material-symbols-outlined">folder</span>
            <input class="folder-name" type="text" value="${name}" />
            <div class="total-items">Total Items: ${items}</div>
            <span class="material-symbols-outlined delete-icon">delete</span>
        </div>
    `;

    folder.querySelector('.folder-name').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    addDeleteListener(folder);

    return folder;
}

// Initial setup: add delete listener to existing folders
document.querySelectorAll('.folder').forEach(addDeleteListener);

// Handle "New Folder" button click
newFolderBtn.addEventListener('click', () => {
    const folder = createFolder();
    addFolderClickListener(folder);
    collectionsDiv.appendChild(folder);
    updateFolderCount();
});

// Initial folder count update
updateFolderCount();
