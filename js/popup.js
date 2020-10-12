const input = document.getElementById('js-collections');
const form = document.getElementById('js-form');
const message = document.getElementById('js-message');

const UNSPLASH_ACCESS_KEY = '<your unsplash access key>';

async function saveCollections(event) {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  try {
    const collections = value.split(',');
    for (let i = 0; i < collections.length; i++) {
      const result = Number.parseInt(collections[i], 10);
      if (Number.isNaN(result)) {
        throw Error(`${collections[i]} is not a number`);
      }

      message.textContent = 'Loading...';
      const headers = new Headers();
      headers.append('Authorization', `Client-ID ${UNSPLASH_ACCESS_KEY}`);
      const response = await fetch(
        `https://api.unsplash.com/collections/${result}`,
        { headers }
      );

      if (!response.ok) {
        throw Error(`Collection not found: ${result}`);
      }
    }

    chrome.storage.local.set(
      {
        collections: value,
      },
      () => {
        message.setAttribute('class', 'success');
        message.textContent = 'Collections saved successfully!';
      }
    );
  } catch (err) {
    message.setAttribute('class', 'error');
    message.textContent = err;
  }
}

form.addEventListener('submit', saveCollections);

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('collections', (result) => {
    const collections = result.collections || '';
    input.value = collections;
  });
});
