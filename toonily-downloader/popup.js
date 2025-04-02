document.getElementById('downloadBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  status.textContent = 'Preparing download...';

  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.url.includes('toonily.com')) {
      status.textContent = 'This only works on Toonily.com';
      return;
    }

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'downloadChapter',
    });

    if (response && response.success) {
      status.textContent = 'Download started! Check your downloads folder.';
    } else {
      status.textContent = 'Failed to start download';
    }
  } catch (error) {
    console.error(error);
    status.textContent = 'Error: ' + error.message;
  }
});
