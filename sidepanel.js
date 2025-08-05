// DOM element references
// Grabs main UI elements for folders and controls
const collectionsDiv = document.querySelector('.collections');
const newFolderBtn = document.querySelector('.toolbar button');
const folderCountText = document.querySelector('.total-folder-count');


// Update folder count
// Shows total folders in UI
function updateFolderCount() {
    folderCountText.textContent = `Total Folders: ${document.querySelectorAll('.folder').length}`;
}


// Add delete button event
// Removes folder when delete icon is clicked
function addDeleteListener(folder) {
    const del = folder.querySelector('.delete-icon');
    if (del) del.addEventListener('click', e => {
        e.stopPropagation();
        folder.remove();
        updateFolderCount();
    });
}


// Add folder click event
// Opens folder view and sets folder name
function addFolderClickListener(folder) {
    folder.addEventListener('click', () => {
        document.getElementById('main-view').style.display = 'none';
        document.getElementById('folder-view').style.display = 'block';
        document.querySelector('.name').textContent = folder.querySelector('.folder-name').value;
    });
}


// Create folder element
// Builds folder UI and adds delete event
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


// New folder button event
// Adds a new folder to the list
newFolderBtn.addEventListener('click', () => {
    const folder = createFolder();
    addFolderClickListener(folder);
    collectionsDiv.appendChild(folder);
    updateFolderCount();
});


// Initial folder count
// Sets folder count on load
updateFolderCount();


// Back button event
// Returns to main view from folder view
document.getElementById('back-button').onclick = function () {
    document.getElementById('folder-view').style.display = 'none';
    document.getElementById('main-view').style.display = 'block';
};


// Add link button event
// Adds current tab as a link to the list
function resolveImageUrl(rawSrc, baseUrl) {
    try {
        return new URL(rawSrc, baseUrl).href;
    } catch {
        return '';
    }
}

function getFirstContentImage(tempDiv, baseUrl) {
    const images = Array.from(tempDiv.querySelectorAll('img'));

    for (const img of images) {
        const src = img.getAttribute('src') || '';
        const lowerSrc = src.toLowerCase();

        const widthAttr = parseInt(img.getAttribute('width'));
        const heightAttr = parseInt(img.getAttribute('height'));

        const isSmall = (widthAttr && widthAttr < 64) || (heightAttr && heightAttr < 64);
        const isIconLike = /(logo|icon|sprite|favicon|blank|svg)/.test(lowerSrc);
        const isDataImage = src.startsWith('data:');

        if (!isSmall && !isIconLike && !isDataImage) {
            return resolveImageUrl(src, baseUrl);
        }
    }

    return '';
}



document.querySelector('.add-link-button').addEventListener('click', async () => {
    const { url, title } = await new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            resolve({ url: tabs[0].url, title: tabs[0].title });
        });
    });

    const invalidSchemes = ['chrome://', 'edge://', 'about:', 'file://', 'chrome-extension://'];
    if (invalidSchemes.some(scheme => url.startsWith(scheme))) {
        alert('Cannot fetch preview for this type of page.');
        return;
    }

    let imageUrl = '';
    try {
        const html = await fetch(url).then(res => res.text());
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const ogImage = tempDiv.querySelector('meta[property="og:image"]')?.content;
        const resolvedImg = getFirstContentImage(tempDiv, url);

        imageUrl = resolvedImg || ogImage || '';
    } catch (err) {
        console.warn('Failed to fetch preview image:', err);
    }

    const link = document.createElement('div');
    link.className = 'link-item';
    link.innerHTML = `
    <div class="link-content">
      ${imageUrl ? `<img class="link-image" src="${imageUrl}" alt="Preview Image" />` : ''}
      <div class="link-info">
        <span class="link-name" title="${title}">${title}</span><br/>
        <a href="${url}" target="_blank" class="link-url">${url}</a>
      </div>
    </div>
    <span class="material-symbols-outlined delete-icon">delete</span>
  `;

    link.querySelector('.delete-icon').addEventListener('click', e => {
        e.stopPropagation();
        link.remove();
    });

    document.querySelector('.links').appendChild(link);
});
