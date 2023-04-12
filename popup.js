chrome.runtime.sendMessage({ action: "getSelectedText" }, (response) => {
  const findInput = document.getElementById("findText");
  if (findInput && response.selectedText) {
    findInput.value = response.selectedText;
  }
});
const findText = document.getElementById("findText");
const replaceText = document.getElementById("replaceText");
const ignoreCase = document.getElementById("ignoreCase");
const replaceBtn = document.getElementById("replaceBtn");

replaceBtn.addEventListener("click", performFindAndReplace);

findText.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    performFindAndReplace();
  }
});

replaceText.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    performFindAndReplace();
  }
});

async function performFindAndReplace() {
  const find = findText.value;
  const replace = replaceText.value;
  const caseInsensitive = ignoreCase.checked;

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: findAndReplace,
      args: [find, replace, caseInsensitive],
    });
  } catch (error) {
    console.error(error);
  }
}

function findAndReplace(findText, replaceText, ignoreCase) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const flags = ignoreCase ? "gi" : "g";
  const regex = new RegExp(findText, flags);
  // let node;

  // while ((node = walker.nextNode())) {
  //   if (regex.test(node.textContent)) {
  //     node.textContent = node.textContent.replace(regex, replaceText);
  //   }
  // }

  const sourceHTML = document.documentElement.outerHTML;

  if (regex.test(sourceHTML)) {
    const newHTML = sourceHTML.replace(regex, replaceText);
    document.open();
    document.write(newHTML);
    document.close();
  }
}
