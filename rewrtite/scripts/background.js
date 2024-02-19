chrome.runtime.onInstalled.addListener(function(details) {
  if(details.reason === 'install') {
    chrome.tabs.create({ url: 'https://www.bhargavyagnik.com/Rewrite/thankyou' });
  }
  else if (details.reason === 'update') {
    chrome.tabs.create({ url: 'https://www.bhargavyagnik.com/Rewrite/newupdate101' });
  }
  });
