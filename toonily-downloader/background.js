chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'downloadImage') {
    downloadWithReferer(request.url, request.filename, request.referer).then(
      sendResponse
    );
    return true; // Keep message channel open
  }
});

async function downloadWithReferer(url, filename, referer) {
  try {
    // Fetch the image with proper headers
    const response = await fetch(url, {
      headers: {
        Referer: referer,
        'User-Agent': navigator.userAgent,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    // Use chrome.downloads API to save the file
    await chrome.downloads.download({
      url: blobUrl,
      filename: `toonily/${filename}`,
      conflictAction: 'uniquify',
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
