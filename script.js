async function downloadImage(url, filename) {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || url.split('/').pop() || `image_${Date.now()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
  } catch (error) {
    console.error('Error downloading image:', error);
  }
}

async function crawlPageForImages(pageUrl) {
  try {
    // Note: This requires a proxy to bypass CORS or needs to be run as a browser extension
    const response = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(pageUrl)}`
    );
    const data = await response.json();
    const html = data.contents;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');

    const imageUrls = Array.from(images)
      .map((img) => {
        return (
          img.src || img.dataset.src || img.dataset.srcset?.split(',')[0].trim()
        );
      })
      .filter((url) => url);

    console.log('Found images:', imageUrls);
    return imageUrls;
  } catch (error) {
    console.error('Error crawling page:', error);
    return [];
  }
}

// Usage example
const pageUrl = 'https://example.com';
crawlPageForImages(pageUrl).then((imageUrls) => {
  imageUrls.forEach((url, index) => {
    setTimeout(() => downloadImage(url), index * 1000); // Stagger downloads
  });
});
