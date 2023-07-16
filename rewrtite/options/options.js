document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const cohereapiKey = document.querySelector('#cohereapiKey').value;
    chrome.storage.sync.set({ cohereapiKey }, () => {
      // Update status to notify the user that options were saved
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    });
  });
// from https://github.com/cohere-ai/sandbox-condense/blob/main/condense/options/options.js  