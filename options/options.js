// duplicated in popup.js, background.js, options.js (like inferface)
const CHROME_STORAGE_OPTIONS_NAMESPACE = "pro-oc-ag-options";

const AG_VYROBCE_TESTU_KOD = "AGVyrobceTestuKod";
const AG_VYROBCE_TESTU_TITLE = "AGVyrobceTestuTitle";
const AG_VYROBCE_LIST_URL = "AGVyrobceListUrl";
const AG_CERT = "AGCert";
const SUBMIT_RESULT = "SubmitResult";
const RELOAD_RESULT = "ReloadResult";

function setOptionsToLocalStorage(options) {
  chrome.storage.local.set({[CHROME_STORAGE_OPTIONS_NAMESPACE] : options});
}

function getOptionsFromLocalStorage(callback) {
  chrome.storage.local.get([CHROME_STORAGE_OPTIONS_NAMESPACE], function(data) {
    callback(data[CHROME_STORAGE_OPTIONS_NAMESPACE]);
  });
}

function getAGVyrobceTestuListFetch(url, callback) {
  fetch(url, {
    method: 'get'
  })
  .then(function (response) {
    if(response.status == 200) {
        response.text().then(function(text) {
          try {
            var json = JSON.parse(text);
            callback(json.deviceList ? json.deviceList : []);
          } catch(err) {
            callback([]);
          }
        });
    } else {
      callback([]);
    }
  })
  .catch(function (error) {
    console.log(error);
    callback([]);
  });
}

function getAGVyrobceTestuList(callback) {

  getOptionsFromLocalStorage(function(optionsURLSearchParams) {

    var options = new URLSearchParams(optionsURLSearchParams);
    var AGVyrobceListUrl = options.get(AG_VYROBCE_LIST_URL);

    if(AGVyrobceListUrl) {
      getAGVyrobceTestuListFetch(AGVyrobceListUrl, function(AGVyrobceList) {
        if(AGVyrobceList.length) {
          callback(true, AGVyrobceList);
        } else {
          getAGVyrobceTestuListFetch(chrome.runtime.getURL("assets/export.JSON"), function(AGVyrobceList) {
            callback(false, AGVyrobceList);
          });
        }
      });
    } else {
      getAGVyrobceTestuListFetch(chrome.runtime.getURL("assets/export.JSON"), function(AGVyrobceList) {
        callback(false, AGVyrobceList);
      });
    }
  });
}

function setOptionTextInputValueToElement(elementValue, elementName) {
  var Element = document.getElementById(elementName);
  if(Element) {
    Element.value = elementValue;
  } else {
    console.error("Element: `" + elementName + " does not exists.");
  }
}

function setAGVyrobceTestuList(AGVyrobceTestuList, AGVyrobceTestuKodValue) {
  var AGVyrobceTestuKod = document.getElementById("AGVyrobceTestuKod");

  AGVyrobceTestuList ? AGVyrobceTestuList.forEach((AGvyrobce) => {
    AGVyrobceTestuKod.add(new Option(AGvyrobce.commercial_name + " - " + AGvyrobce.manufacturer.name, AGvyrobce.id_device), undefined);
  }) : undefined;

  if(AGVyrobceTestuKodValue) {
    AGVyrobceTestuKod.value = AGVyrobceTestuKodValue;
  } else {
    AGVyrobceTestuKod.value = "";
  }
}

function saveOptions(
  AGVyrobceTestuKod,
  AGVyrobceListUrl,
  AGCert
  ) {

  var options = new URLSearchParams();

  options.set(AG_CERT, AGCert);
  options.set(AG_VYROBCE_LIST_URL, AGVyrobceListUrl);

  if(AGVyrobceTestuKod) {

    // předem uložený i AG vyrobce title, aby se nemusely procházet všichni výrobci při vytahování ze storage
    getAGVyrobceTestuList(function(givenUrlWorks, AGVyrobceTestuList) {

      if(AGVyrobceTestuList && AGVyrobceTestuList.length) {

        var AGVyrobceTestu = AGVyrobceTestuList.filter(AGVyrobce => AGVyrobce.id_device == AGVyrobceTestuKod)[0];
        if(AGVyrobceTestu && AGVyrobceTestu.commercial_name && AGVyrobceTestu.manufacturer && AGVyrobceTestu.manufacturer.name) {
          var AGVyrobceTestuTitle = AGVyrobceTestu.commercial_name + " - " + AGVyrobceTestu.manufacturer.name;
          options.set(AG_VYROBCE_TESTU_TITLE, AGVyrobceTestuTitle);
        }
        options.set(AG_VYROBCE_TESTU_KOD, AGVyrobceTestuKod);
      }

      setOptionsToLocalStorage(options.toString());

      if(givenUrlWorks) {
        setResult(SUBMIT_RESULT, "Uloženo v " + new Date().toString() + ". List výrobců se ze zadané URL načíst podařilo.");
      } else {
        setResult(SUBMIT_RESULT, "Uloženo v " + new Date().toString() + ". List výrobců se ze zadané URL načíst nepodařilo.");
      }
    });
  } else {
    setOptionsToLocalStorage(options.toString());

    setResult(SUBMIT_RESULT, "Uloženo v " + new Date().toString());
  }
}

function clearResult(elementId) {
  setResult(elementId, "");
}

function setResult(elementId, text) {
  var result = document.getElementById(elementId);
  result.innerHTML = text;
}

function getOptions(callback) {
  getOptionsFromLocalStorage(function(optionsURLSearchParams) {
    var options = new URLSearchParams(optionsURLSearchParams);
    callback(options);
  });
}

const zadankaForm = document.getElementById("zadanka");
if(zadankaForm) {
  zadankaForm.addEventListener("submit", function(event) {

    event.preventDefault();

    clearResult(SUBMIT_RESULT);

    var zadankaFormData = new FormData(zadankaForm);

    var AGCert = document.getElementById(AG_CERT);
    if(AGCert.files[0]) {
      var reader = new FileReader()
      reader.onload = function() {
        saveOptions(
          zadankaFormData.get(AG_VYROBCE_TESTU_KOD) ? zadankaFormData.get(AG_VYROBCE_TESTU_KOD) : "",
          zadankaFormData.get(AG_VYROBCE_LIST_URL),
          reader.result
        )
      }
      reader.readAsDataURL(AGCert.files[0]);
    }
  });
}

const AGVyrobceTestuKodReloadButton = document.getElementById("AGVyrobceTestuKodReload");

AGVyrobceTestuKodReloadButton.addEventListener("click", function(event) {

    event.preventDefault();

    clearResult(RELOAD_RESULT);

    getOptions(function(options) {
      getAGVyrobceTestuList(function (givenUrlWorks, AGVyrobceTestuList) {
        setAGVyrobceTestuList(AGVyrobceTestuList, options.get(AG_VYROBCE_TESTU_KOD));
        var AGVyrobceListUrl = options.get(AG_VYROBCE_LIST_URL);
        addMessageWhenAGVyrobceTestuListWasLoaded(AGVyrobceListUrl, givenUrlWorks);
      });
    });
});

function addMessageWhenAGVyrobceTestuListWasLoaded(AGVyrobceListUrl, givenUrlWorks) {
  if(AGVyrobceListUrl) {
    if(givenUrlWorks) {
      setResult(RELOAD_RESULT, "Načteno v " + new Date().toString() + ". List výrobců se ze zadané URL načíst podařilo.");
    } else {
      setResult(RELOAD_RESULT, "Načteno v " + new Date().toString() + ". List výrobců se ze zadané URL načíst nepodařilo.");
    }
  } else {
    setResult(RELOAD_RESULT, "Načteno v " + new Date().toString() + ". List výrobců nebyl URL adresou přenastavený, proto se použil defaultní.");
  }
}

window.onload = function() {
  getOptions(function(options) {

    var AGVyrobceListUrl = options.get(AG_VYROBCE_LIST_URL);

    getAGVyrobceTestuList(function (givenUrlWorks, AGVyrobceTestuList) {
      setAGVyrobceTestuList(AGVyrobceTestuList, options.get(AG_VYROBCE_TESTU_KOD));
      addMessageWhenAGVyrobceTestuListWasLoaded(AGVyrobceListUrl, givenUrlWorks);
    });
    setOptionTextInputValueToElement(AGVyrobceListUrl, AG_VYROBCE_LIST_URL);
  });
};