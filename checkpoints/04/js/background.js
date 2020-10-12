const UNSPLASH_ACCESS_KEY = '<your unsplash access key>';

function validateResponse(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }

  return response;
}

function getCollections() {
  return new Promise((resolve) => {
    chrome.storage.local.get('collections', (result) => {
      const collections = result.collections || '';
      resolve(collections);
    });
  });
}

async function getRandomPhoto() {
  const collections = await getCollections();

  const endpoint =
    'https://api.unsplash.com/photos/random?orientation=landscape';

  if (collections) {
    endpoint += `&collections=${collections}`;
  }

  const headers = new Headers();
  headers.append('Authorization', `Client-ID ${UNSPLASH_ACCESS_KEY}`);

  let response = await fetch(endpoint, { headers });
  const json = await validateResponse(response).json();
  response = await fetch(json.urls.raw + '&q=85&w=2000');
  json.blob = await validateResponse(response).blob();

  return json;
}

async function nextImage() {
  try {
    const image = await getRandomPhoto();

    const fileReader = new FileReader();
    fileReader.readAsDataURL(image.blob);
    fileReader.addEventListener('load', (event) => {
      const { result } = event.target;
      image.base64 = result;
      chrome.storage.local.set({ nextImage: image });
    });
  } catch (err) {
    console.log(err);
  }
}

chrome.runtime.onInstalled.addListener(nextImage);

chrome.runtime.onMessage.addListener((request) => {
  if (request.command === 'next-image') {
    nextImage();
  }
});
