chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'findReplaceContextMenu',
    title: 'Find and Replace',
    contexts: ['selection'],
  });
});

let selectedText = '';

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === 'findReplaceContextMenu') {
    selectedText = info.selectionText;

    // Open the extension popup
    try {
      await chrome.action.openPopup();
    } catch (error) {
      console.error('Failed to open popup:', error);
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSelectedText') {
    sendResponse({ selectedText });
  }
});
