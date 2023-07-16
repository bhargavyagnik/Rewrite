chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.create({ url: 'https://www.bhargavyagnik.com' });
  });