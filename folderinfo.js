const addLinkButton = document.querySelector('.add-link-button');
const currentFolderName = document.querySelector('.name');

addLinkButton.addEventListener('click', async () => {
  // Get active tab URL using a Promise wrapper
  const { url: tabUrl, title: linkName } = await new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve({ url: tabs[0].url, title: tabs[0].title });
    });
  });

  const linkElement = document.createElement('div');
  linkElement.className = 'link';
  linkElement.innerHTML = `
    <span class="link-name">${linkName}</span>
    <a href="${tabUrl}" target="_blank" class="link-url">${tabUrl}</a>
    <span class="material-symbols-outlined delete-icon">delete</span>
  `;

  linkElement.querySelector('.delete-icon').addEventListener('click', (e) => {
    e.stopPropagation();
    linkElement.remove();
  });

  document.getElementById('folder-view').appendChild(linkElement);
});
