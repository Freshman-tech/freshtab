function setImage(image) {
  document.body.setAttribute(
    'style',
    `background-image: url(${image.base64});`
  );
}

document.addEventListener('DOMContentLoaded', () => {
  // Retrieve the next image object
  chrome.storage.local.get('nextImage', (data) => {
    if (data.nextImage) {
      setImage(data.nextImage);
    }
  });
});
