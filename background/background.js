// duplicated in popup.js, background.js, options.js (like inferface)
const CHROME_STORAGE_NAMESPACE = "pro-oc-ag";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'UlozitZadankaData' && msg.data) {
        addZadankaToSyncStorage(CHROME_STORAGE_NAMESPACE, msg.data, function (error) {
            console.log(error);
        });
    }
});

function addZadankaToSyncStorage(where, zadanka, errorCallback, successCallback) {
    chrome.storage.sync.get(where, (syncData) => {
        if (chrome.runtime.error) {
            errorCallback(chrome.runtime.error);
        } else {

            if(!Array.isArray(syncData[where])) {
                syncData = {
                    [where] : []
                };
            }
            syncData[where].push(zadanka);
  
            chrome.storage.sync.set({[where] : syncData[where]}, () => {
                if (chrome.runtime.error) {
                    typeof errorCallback === 'function' && errorCallback();
                } else {
                    typeof successCallback === 'function' && successCallback();
                }
            });
        }
    });
}