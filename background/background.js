// duplicated in popup.js, background.js, options.js (like inferface)
const CHROME_STORAGE_NAMESPACE = "pro-oc-ag";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'UlozitZadankaData' && msg.data) {
        addZadankaToSyncStorage(CHROME_STORAGE_NAMESPACE, msg.data);
    }
});

function addZadankaToSyncStorage(where, zadanka) {
    chrome.storage.sync.get(where, function(syncData) {

        if(!Array.isArray(syncData[where])) {
            syncData = {
                [where] : []
            };
        }
        syncData[where].push(zadanka);

        chrome.storage.sync.set({[where] : syncData[where]});
    });
}