
const collectionsDiv = document.querySelector('.collections');
const newFolderBtn = document.querySelector('.toolbar button');
const folderCountText = document.querySelector('.total-folder-count');

function updateFolderCount() {
  folderCountText.textContent = `Total Folders: ${document.querySelectorAll('.folder').length}`;
}

function addDeleteListener(folder) {
  const del = folder.querySelector('.delete-icon');
  if (del) del.addEventListener('click', e => {
    e.stopPropagation();
    folder.remove();
    updateFolderCount();
  });
}

function addFolderClickListener(folder) {
  folder.addEventListener('click', () => {
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('folder-view').style.display = 'block';
    document.querySelector('.name').textContent = folder.querySelector('.folder-name').value;
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
  folder.querySelector('.folder-name').addEventListener('click', e => e.stopPropagation());
  addDeleteListener(folder);
  return folder;
}

newFolderBtn.addEventListener('click', () => {
  const folder = createFolder();
  addFolderClickListener(folder);
  collectionsDiv.appendChild(folder);
  updateFolderCount();
});

updateFolderCount();
