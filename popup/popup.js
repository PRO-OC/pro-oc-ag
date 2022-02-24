// duplicated in popup.js, background.js, options.js (like inferface)
const CHROME_STORAGE_OPTIONS_NAMESPACE = "pro-oc-options";
const CHROME_STORAGE_NAMESPACE = "pro-oc-ag";

const AGZadankyButton = document.getElementById("AGZadanky");
const OptionsPageButton = document.getElementById("OptionsPage");

if(AGZadankyButton) {
  AGZadankyButton.onclick = function() {
    chrome.tabs.create({'url': "../page/AGzadanky.html" });
  }
}

if (OptionsPageButton) {
  OptionsPageButton.onclick = function() {
      chrome.runtime.openOptionsPage();
  }
}