// duplicated in popup.js, background.js, options.js (like inferface)
const CHROME_STORAGE_NAMESPACE = "pro-oc-ag";

const AUTO_REMOVE_CHROME_STORAGE_ALARM_NAME = 'AutoRemoveChromeStorageAlarmName';
const AUTO_REMOVE_CHROME_STORAGE_MINS = 120;
const AUTO_REMOVE_CHROME_STORAGE_ALARM_PERIOD_MINS = 1; // 0.1 testing purpose

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'UlozitZadankaData' && msg.data) {
        addZadankaToSyncStorage(CHROME_STORAGE_NAMESPACE, msg.data);
    }
});

function addZadankaToSyncStorage(where, zadanka) {
    chrome.storage.sync.get(where, function(syncData) {

        if(!syncData || !Array.isArray(syncData[where])) {
            syncData = {
                [where] : []
            };
        }
        syncData[where].push(zadanka);

        chrome.storage.sync.set({[where] : syncData[where]});
    });
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  if(alarm.name == AUTO_REMOVE_CHROME_STORAGE_ALARM_NAME) {
    filterZadankyToRemove();
  }
});

function filterZadankyToRemove() {
    chrome.storage.sync.get(CHROME_STORAGE_NAMESPACE, (data) => {
      if(data && Array.isArray(data[CHROME_STORAGE_NAMESPACE])) {

        data[CHROME_STORAGE_NAMESPACE] = data[CHROME_STORAGE_NAMESPACE].filter(function(zadanka) {
          return !isZadankaToRemove(zadanka) ? true : false;
        });

        chrome.storage.sync.set({[CHROME_STORAGE_NAMESPACE]: data[CHROME_STORAGE_NAMESPACE]});
      }
    });
  }

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.get(AUTO_REMOVE_CHROME_STORAGE_ALARM_NAME, alarm => {
       if (!alarm) {
          chrome.alarms.create(AUTO_REMOVE_CHROME_STORAGE_ALARM_NAME, {
            periodInMinutes: AUTO_REMOVE_CHROME_STORAGE_ALARM_PERIOD_MINS
          });
       }
    });
});

function isZadankaToRemove(zadanka) {
    const OrdinaceVystavilDate = new Date(zadanka.OrdinaceVystavilDate);
    const DatumAutomatickePotvrzeni = new Date(OrdinaceVystavilDate.getTime() + AUTO_REMOVE_CHROME_STORAGE_MINS * 60000);
  
    var isToRemove = (new Date()) > DatumAutomatickePotvrzeni;
  
    return isToRemove ? true : false;         
}
  