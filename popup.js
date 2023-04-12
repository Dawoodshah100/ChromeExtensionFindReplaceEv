chrome.runtime.sendMessage({ action: "getSelectedText" }, (response) => {
  const findInput = document.getElementById("findText");
  if (findInput && response.selectedText) {
    findInput.value = response.selectedText;
  }
});
const findText = document.getElementById("findText");
const replaceText = document.getElementById("replaceText");
const ignoreCase = document.getElementById("ignoreCase");
const regexCheckbox = document.getElementById("regex");
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
      args: [find, replace, caseInsensitive, regexCheckbox.checked],
    });
  } catch (error) {
    console.error(error);
  }
}

function findAndReplace(findText, replaceText, ignoreCase, useRegex) {
  

  let regex;
  if (useRegex) {
    const flags = ignoreCase ? "gi" : "g";
    try {
      regex = new RegExp(findText, flags);
    } catch (error) {
      console.error("Invalid regular expression:", error);
      return;
    }
  } else {
    const flags = ignoreCase ? "gi" : "g";
    regex = new RegExp(findText.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"), flags);
  }

  const sourceHTML = document.documentElement.outerHTML;

  if (regex.test(sourceHTML)) {
    const newHTML = sourceHTML.replace(regex, replaceText);
    document.open();
    document.write(newHTML);
    document.close();
  }
}
