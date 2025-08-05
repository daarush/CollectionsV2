document.getElementById('back-button').onclick = function () {
	document.getElementById('folder-view').style.display = 'none';
	document.getElementById('main-view').style.display = 'block';
};

document.querySelector('.add-link-button').addEventListener('click', async () => {
	const { url, title } = await new Promise(resolve => {
		chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
			resolve({ url: tabs[0].url, title: tabs[0].title });
		});
	});
	const link = document.createElement('div');
	link.className = 'link-item';
	link.innerHTML = `
    <span class="link-name" title="${title}">${title}</span>
    <a href="${url}" target="_blank" class="link-url">${url}</a>
    <span class="material-symbols-outlined delete-icon">delete</span>
  `;


	link.querySelector('.delete-icon').addEventListener('click', e => {
		e.stopPropagation();
		link.remove();
	});
	document.querySelector('.links').appendChild(link);
});


addtoStorage = async (folderName, items) => {
	const folderData = {
		name: folderName,
		items: items.map(item => ({
			type: item.type,
			name: item.name,
			url: item.url || ''
		}))
	};

	let storedFolders = await chrome.storage.local.get('folders');
	storedFolders = storedFolders.folders || [];
	storedFolders.push(folderData);
	await chrome.storage.local.set({ folders: storedFolders });
}