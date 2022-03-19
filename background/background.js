// duplicated in popup.js, background.js, options.js (like inferface)
const AUTO_REMOVE_CHROME_STORAGE_ALARM_NAME = 'AutoRemoveChromeStorageAlarmName';
const AUTO_REMOVE_CHROME_STORAGE_MINS = 120;
const AUTO_REMOVE_CHROME_STORAGE_ALARM_PERIOD_MINS = 1; // 0.1 testing purpose

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'UlozitZadankaData' && msg.data) {
        addZadankaToSyncStorage(msg.data);
    }
});

function addZadankaToSyncStorage(zadanka) {
  chrome.storage.sync.set({[zadanka.Cislo]: zadanka});
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  if(alarm.name == AUTO_REMOVE_CHROME_STORAGE_ALARM_NAME) {
    filterZadankyInSyncStorage();
  }
});

function filterZadankyInSyncStorage() {
  chrome.storage.sync.get(null, (data) => {
    if(data) {
      var zadankaCislaToRemove = [];
      for(const [x, zadanka] of Object.entries(data)) {
        if(!hasZadankaValidData(zadanka) || isZadankaToRemove(zadanka)) {
          zadankaCislaToRemove.push(zadanka.Cislo);
        }
      }
      chrome.storage.sync.remove(zadankaCislaToRemove);
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

function hasZadankaValidData(zadanka) {
    if(
      zadanka.Cislo &&
      zadanka.OrdinaceVystavilDate && 
      zadanka.TestovanyCisloPojistence &&
      zadanka.TestovanyJmeno &&
      zadanka.TestovanyPrijmeni &&
      zadanka.TestovanyDatumNarozeni &&
      zadanka.TestovanyNarodnostNazev &&
      zadanka.UseTestRegisters) {
        return true;
    } else {
        return false;
    }
}

function isZadankaToRemove(zadanka) {
    const OrdinaceVystavilDate = new Date(zadanka.OrdinaceVystavilDate);
    const DatumAutomatickePotvrzeni = new Date(OrdinaceVystavilDate.getTime() + AUTO_REMOVE_CHROME_STORAGE_MINS * 60000);
  
    var isToRemove = (new Date()) > DatumAutomatickePotvrzeni;
  
    return isToRemove ? true : false;         
}
  