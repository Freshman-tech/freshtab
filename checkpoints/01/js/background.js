const UNSPLASH_ACCESS_KEY = '<your unsplash access key>';

function validateResponse(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }

  return response;
}

async function getRandomPhoto() {
  const endpoint =
    'https://api.unsplash.com/photos/random?orientation=landscape';

  const headers = new Headers();
  headers.append('Authorization', `Client-ID ${UNSPLASH_ACCESS_KEY}`);

  let response = await fetch(endpoint, { headers });
  const json = await validateResponse(response).json();

  return json;
}

async function nextImage() {
  try {
    const image = await getRandomPhoto();
    console.log(image);
  } catch (err) {
    console.log(err);
  }
}

chrome.runtime.onInstalled.addListener(nextImage);
