function findAndReplace(findText, replaceText) {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
  
    const regex = new RegExp(findText, 'g');
    let node;
  
    while ((node = walker.nextNode())) {
      if (regex.test(node.textContent)) {
        node.textContent = node.textContent.replace(regex, replaceText);
      }
    }
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    findAndReplace(request.findText, request.replaceText, request.ignoreCase);
  });
  