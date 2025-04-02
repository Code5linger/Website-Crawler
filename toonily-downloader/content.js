// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'downloadChapter') {
    downloadChapterImages().then(sendResponse);
    return true; // Keep message channel open for async response
  }
});

async function downloadChapterImages() {
  try {
    const readingContent = document.querySelector('.reading-content');
    if (!readingContent) {
      return { success: false, error: 'Could not find comic content' };
    }

    const images = readingContent.querySelectorAll('img');
    const imageUrls = Array.from(images)
      .map((img) => {
        return (
          img.getAttribute('data-src') ||
          img.getAttribute('data-lazy-src') ||
          img.src
        );
      })
      .filter((url) => url && url.includes('toonily.net'));

    if (imageUrls.length === 0) {
      return { success: false, error: 'No images found' };
    }

    // Download each image
    for (const [index, url] of imageUrls.entries()) {
      try {
        const filename = `page_${String(index + 1).padStart(3, '0')}.jpg`;
        await chrome.runtime.sendMessage({
          action: 'downloadImage',
          url: url,
          filename: filename,
          referer: window.location.href,
        });
      } catch (error) {
        console.error(`Failed to download ${url}:`, error);
      }
    }

    return { success: true, count: imageUrls.length };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
