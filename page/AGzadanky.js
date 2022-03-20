// duplicated in popup.js, background.js, options.js (like inferface)
const CHROME_STORAGE_OPTIONS_NAMESPACE = "pro-oc-ag-options";

const AG_VYROBCE_TESTU_KOD = "AGVyrobceTestuKod";
const AG_VYROBCE_TESTU_TITLE = "AGVyrobceTestuTitle";
const AG_VYROBCE_LIST_URL = "AGVyrobceListUrl";

const AG_CERT = "AGCert";

var PDFDocument = PDFLib.PDFDocument;
var rgb = PDFLib.rgb;
var StandardFonts = PDFLib.StandardFonts;

function getRegistrDomain(useTestRegisters, callback) {
  callback(useTestRegisters ? "eregpublicsecure2.ksrzis.cz" : "eregpublicsecure.ksrzis.cz");
}

function getEregRegistrDomain(useTestRegisters, callback) {
  callback(useTestRegisters ? "ereg2.ksrzis.cz" : "ereg.ksrzis.cz");
}

function getRegistrUrl(useTestRegisters, callback) {
  getRegistrDomain(useTestRegisters, function(registrDomain) {
      callback("https://" + registrDomain);
  });
}

function getEregRegistrUrl(useTestRegisters, callback) {
  getEregRegistrDomain(useTestRegisters, function(registrDomain) {
      callback("https://" + registrDomain);
  });
}

function getSaveVysledekPoctTestuUrl(useTestRegisters, callback) {
  getRegistrUrl(useTestRegisters, function(registrUrl) {
    callback(registrUrl + "/Registr/CUD/Overeni/SaveVysledekPoctTestu");
  });
}

function getAGVyrobceTestuUrl() {
  return chrome.runtime.getURL("assets/export.JSON");
}

function getRegistrCUDOvereniGetCertifikatCisloZadankyUrl(useTestRegisters, cisloZadanky, callback) {
  getRegistrUrl(useTestRegisters, function(registrUrl) {
    callback(registrUrl + "/Registr/CUD/Overeni/GetCertifikat?cislo=" + cisloZadanky);
  });
}

function getRegistrCUDOvereniCisloPojistenceUIUrl(useTestRegisters, callback) {
  getRegistrUrl(useTestRegisters, function(registrUrl) {
    callback(registrUrl + "/Registr/CUD/Overeni");
  });
}

function getRegistrCUDOvereniPotvrditUrl(useTestRegisters, callback) {
  getRegistrUrl(useTestRegisters, function(registrUrl) {
    callback(registrUrl + "/Registr/CUD/Overeni/Potvrdit");
  });
}

function getRegistrCUDOvereniPotvrditUrlParams(kodOsoby, heslo, cisloZadanky, vyrobceTestuKod, typTestuKod, vysledek) {
    var urlParams = new URLSearchParams();

    urlParams.set("Cislo", cisloZadanky);
    urlParams.set("VyrobcePoctTestuKod", vyrobceTestuKod);
    urlParams.set("PracovnikJmeno", "");
    urlParams.set("PracovnikPrijmeni", "");
    urlParams.set("PracovnikKodOsoby", kodOsoby);
    urlParams.set("Heslo", heslo);
    urlParams.set("VysledkyPoct", vysledek);
    urlParams.set("VysledkyPoctCode[0]", typTestuKod);
    urlParams.set("showFromUrl", false);
  
    return urlParams;
}

function getRegistrCUDOvereniCisloZadankyUrl(useTestRegisters, callback) {
  getRegistrUrl(useTestRegisters, function(registrUrl) {
    callback(registrUrl + "/Registr/CUD/Overeni/Json");
  });
}

function getRegistrCUDVyhledaniPacientaUrl(useTestRegisters, callback) {
  getEregRegistrUrl(useTestRegisters, function(registrUrl) {
    callback(registrUrl + "/Registr/CUDZadanky/VyhledaniPacienta");
  });
}

function getRegistrCUDOvereniCisloZadankyUrlParams(kodOsoby, heslo, cisloZadanky) {
  var urlParams = new URLSearchParams();

  urlParams.set("PracovnikKodOsoby", kodOsoby);
  urlParams.set("heslo", heslo);
  urlParams.set("Cislo", cisloZadanky);

  return urlParams;
}

function getRegistrLoginCookieName() {
  return "MyUniqueKey";
}

function addTextTdToTr(tr, text) {
  var td = document.createElement("td");
  td.textContent = text ? text : "";
  tr.appendChild(td);
}

function addTdLinkToTr(tr, url, text) {
  var td = document.createElement("td");
  var a = document.createElement("a");

  a.href = url;
  a.textContent = text;
  a.target = "_blank";

  td.appendChild(a);
  tr.appendChild(td);
}

function addOckoUzisProfilLinkToTr(td, url, text, Jmeno, Prijmeni, DatumNarozeni, Narodnost, TestovanyCisloPojistence) {
  var form = document.createElement("form");
  form.action = url;
  form.method = "POST";
  form.target = "_blank";

  var inputJmeno = document.createElement("input");
  inputJmeno.type = "hidden";
  inputJmeno.value = Jmeno;
  inputJmeno.name = "Jmeno";
  form.appendChild(inputJmeno);

  var inputPrijmeni = document.createElement("input");
  inputPrijmeni.type = "hidden";
  inputPrijmeni.value = Prijmeni;
  inputPrijmeni.name = "Prijmeni";
  form.appendChild(inputPrijmeni);

  var inputTypVyhledavani = document.createElement("input");
  inputTypVyhledavani.type = "hidden";
  inputTypVyhledavani.value = "VyhledatPacienta";
  inputTypVyhledavani.name = "DuvodVyhledani";
  form.appendChild(inputTypVyhledavani);

  var inputTypVyhledavani = document.createElement("input");
  inputTypVyhledavani.type = "hidden";
  inputTypVyhledavani.value = Narodnost == "CZ" ? "JmenoPrijmeniRC" : "CizinecJmenoPrijmeniDatumNarozniObcanstvi";
  inputTypVyhledavani.name = "TypVyhledani";
  form.appendChild(inputTypVyhledavani);

  if(Narodnost == "CZ") {
    var inputTestovanyCisloPojistence = document.createElement("input");
    inputTestovanyCisloPojistence.type = "hidden";
    inputTestovanyCisloPojistence.value = TestovanyCisloPojistence;
    inputTestovanyCisloPojistence.name = "RodneCislo";
    form.appendChild(inputTestovanyCisloPojistence);
  } else {
    var inputZemeKod = document.createElement("input");
    inputZemeKod.type = "hidden";
    inputZemeKod.value = Narodnost;
    inputZemeKod.name = "ZemeKod";
    form.appendChild(inputZemeKod);

    var inputDatumNarozeni= document.createElement("input");
    inputDatumNarozeni.type = "hidden";
    inputDatumNarozeni.value = DatumNarozeni;
    inputDatumNarozeni.name = "DatumNarozeni";
    form.appendChild(inputDatumNarozeni);
  }

  var inputSubmit = document.createElement("input");
  inputSubmit.type = "submit";
  inputSubmit.setAttribute("class", "button-other ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only")
  inputSubmit.value = text;
  form.appendChild(inputSubmit);

  var inputSubmitHidden = document.createElement("input");
  inputSubmitHidden.type = "hidden";
  inputSubmitHidden.name = "_submit";
  inputSubmitHidden.value = "None";
  form.appendChild(inputSubmitHidden);

  td.appendChild(form);
}

function addRegistrCUDOvereniTypVyhledavaniCisloPostLinkToTr(useTestRegisters, td, text, cislo) {

  getRegistrCUDOvereniCisloPojistenceUIUrl(useTestRegisters, function(url) {

    var form = document.createElement("form");
    form.action = url;
    form.method = "POST";
    form.target = "_blank";

    var inputTypVyhledavani = document.createElement("input");
    inputTypVyhledavani.type = "hidden";
    inputTypVyhledavani.value = "Cislo";
    inputTypVyhledavani.name = "TypVyhledavani";
    form.appendChild(inputTypVyhledavani);

    var inputCislo = document.createElement("input");
    inputCislo.type = "hidden";
    inputCislo.value = cislo;
    inputCislo.name = "Cislo";
    form.appendChild(inputCislo);

    var inputSubmit = document.createElement("input");
    inputSubmit.type = "submit";
    inputSubmit.setAttribute("class", "button-action ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only");
    inputSubmit.value = text;
    form.appendChild(inputSubmit);

    td.appendChild(form);
  });
}

function getAGVyrobceTestuKod(vyrobceTestuNazev, vyrobceTestuKodOptions, vyrobceTestuNazevOptions, callback) {

  // data o žádance neobsahují kód, aby se kód nemusel dohledávat ve všech výrobcích tak pokud je shodný s uvedeným v nastavení, použije se ten
  if(vyrobceTestuNazev == vyrobceTestuNazevOptions) {
    callback(vyrobceTestuKodOptions);
    return;
  }

  // pokud není název výrobce v žádance
  if(!vyrobceTestuNazev) {

    // pokusí se vzít z nastavení uloženého do cookie
    if(vyrobceTestuKodOptions && vyrobceTestuNazevOptions) {
      callback(vyrobceTestuKodOptions);
      return;
    } 
    // pokud není název výrobce v žádance a není ani v nastavení, vrací null
    else {
      callback(null);
      return;
    }
  }

  // pokud se název antigenního testu v nastavení neshoduje s tím na žádance, musím se skrze API dotázat na list všech výrobců a najít odpovídající id
  var url = getAGVyrobceTestuUrl();

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type","application/json; charset=UTF-8");
  xhr.onreadystatechange = function() {
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
      var data = JSON.parse(xhr.responseText);

      if(!data || !data.deviceList) {
        callback(null);
      }

      data.deviceList.forEach(vyrobce => {
        if(vyrobce.commercial_name + " - " + vyrobce.manufacturer.name == vyrobceTestuNazev) {
          callback(vyrobce.id_device);
          return;
        }
      });
    }
  }
  xhr.send();
}

function addZadankaCertifikatButtonToTr(td, text, zadanka) {

  var input = document.createElement("input");
  input.type = "button";
  input.value = text;
  input.setAttribute("class", "button-action ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only")

  input.addEventListener('click', function() {

    getRegistrCUDOvereniGetCertifikatCisloZadankyUrl(zadanka.UseTestRegisters, zadanka.Cislo, function(url) {

      if(typeof browser === 'undefined') {
        chrome.downloads.download({url});
      } else {
        var xhrCertifikat = new XMLHttpRequest();
        xhrCertifikat.open("GET", url, true);
        xhrCertifikat.setRequestHeader("Content-Type","application/json; charset=UTF-8");
        xhrCertifikat.responseType = 'blob';
        xhrCertifikat.onreadystatechange = function() {
          if(xhrCertifikat.readyState === XMLHttpRequest.DONE && xhrCertifikat.status == 200) {

            var file = new Blob([xhrCertifikat.response], { 
              type: "application/pdf" 
            });

            var fileUrl = URL.createObjectURL(file);
            window.open(fileUrl);
          }
        }
        xhrCertifikat.send();
      }
    });
  }, false);

  td.appendChild(input);
}

function padStart(num, padLen, padChar) {
    var pad = new Array(1 + padLen).join(padChar);
    return (pad + num).slice(-pad.length);
}

function getDateWithHoursAndMinutes(date) {
  var dateObj = new Date(date);
  return dateObj.getDate() +
  "." +
  (dateObj.getMonth() + 1) +
  "." +
  dateObj.getFullYear() +
  " " +
  padStart(dateObj.getHours(), 2, "0") +
  ":" +
  padStart(dateObj.getMinutes(), 2, "0");
}

function getOptionsFromLocalStorage(callback) {
  chrome.storage.local.get([CHROME_STORAGE_OPTIONS_NAMESPACE], function(data) {
    callback(data[CHROME_STORAGE_OPTIONS_NAMESPACE]);
  });
}

function getRegistrLoginCookies(useTestRegisters, callback) {
  getRegistrUrl(useTestRegisters, function(registrUrl) {
    chrome.cookies.get({
      url: registrUrl, 
      name: getRegistrLoginCookieName()
    },
    function(cookie) {
      if(!cookie) {
        callback(new URLSearchParams());
      } else {
        var cookieParams = new URLSearchParams(cookie.value);
        callback(cookieParams);
      }
    });
  });
}

function addZadankaPotvrditButtonToTr(tr, text, zadanka) {

  var td = document.createElement("td");

  var input = document.createElement("input");
  input.type = "button";
  input.value = text;
  input.setAttribute("class", "button-other ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only")

  input.addEventListener('click', function() {
    
    var confirmWindow = window.confirm("Opravdu povrdit odběr AG testu?");
    if (confirmWindow == true) {
      getRegistrLoginCookies(zadanka.UseTestRegisters, function(cookieParams) {

        var kodOsoby = cookieParams.get("kodOsoby");
        var heslo = cookieParams.get("heslo");

        if(!kodOsoby || !heslo) {
          alert("Je potřeba být přihlášený do registru Žadanky Covid-19.")
        }

        getOptionsFromLocalStorage(function(optionsURLSearchParams) {

          getRegistrCUDOvereniCisloZadankyUrl(zadanka.UseTestRegisters, function(url) {
            var options = new URLSearchParams(optionsURLSearchParams);

            var AGVyrobceTestuKod = options.get(AG_VYROBCE_TESTU_KOD);
            //var AGVyrobceTestuTitle = options.get(AG_VYROBCE_TESTU_TITLE);

            if(!AGVyrobceTestuKod) {
              alert("Výrobce testu není v nastavení uvedený.");
              return;
            }

            var urlParams = getRegistrCUDOvereniCisloZadankyUrlParams(kodOsoby, heslo, zadanka.Cislo);
            var link = url + "?" + urlParams.toString();

            var xhr = new XMLHttpRequest();
            xhr.open("GET", link, true);
            xhr.setRequestHeader("Content-Type","application/json; charset=UTF-8");
            xhr.onreadystatechange = function() {
              if(xhr.readyState === XMLHttpRequest.DONE) {

                if(xhr.status != 200) {
                  return;
                }

                var data = JSON.parse(xhr.responseText);

                if(data.Vysledek == "Stornovano" || data.Vysledek == "ZadankaNeexistuje") {
                  removeZadankaFromSyncStorage(zadanka.Cislo);                  
                  alert("Žádanka byla stornována nebo neexistuje. Bude odebrána.");
                  location.reload();
                } else if(
                  data.ZadankaExistuje && 
                  data.TypTestuNazev == "Průkaz antigenu" &&
                  data.Vysledek == "ZadankaExistuje"
                ) {
                    getRegistrCUDOvereniPotvrditUrl(zadanka.UseTestRegisters, function(url) {

                      var urlParams = getRegistrCUDOvereniPotvrditUrlParams(
                        kodOsoby,
                        heslo,
                        zadanka.Cislo,
                        AGVyrobceTestuKod,
                        "Antigen",
                        0
                      );
                      var link = url + "?" + urlParams.toString();

                      var xhrPotvrdit = new XMLHttpRequest();
                      xhrPotvrdit.open("POST", link, true);
                      xhrPotvrdit.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                      xhrPotvrdit.onreadystatechange = function() {
                        if(xhrPotvrdit.readyState === XMLHttpRequest.DONE && xhrPotvrdit.status == 200) {
                          zadanka["ProvedenOdber"] = new Date().toISOString();
                          updateZadankaInSyncStorage(zadanka);
                          location.reload();
                        }
                      };
                      xhrPotvrdit.send(urlParams.toString());
                    });
                } else if (
                  data.Vysledek == "ZadankaExistujeJizDriveKontrolovan" &&
                  data.PotvrzeniOdberu && data.PotvrzeniOdberu[0].DatumPotvrzeni) {

                  zadanka["ProvedenOdber"] = data.PotvrzeniOdberu[0].DatumPotvrzeni;
                  updateZadankaInSyncStorage(zadanka);
                  location.reload();
                }
              }
            }
            xhr.send();
          });
        });
      });
    }
  }, false);

  td.appendChild(input);
  tr.appendChild(td);
}

function addZadankaZadatNegativniVysledekButtonToTd(td, text, zadanka, jeVyzadovanyCertifikat = false) {

  var input = document.createElement("input");
  input.type = "button";
  input.value = text;
  if(jeVyzadovanyCertifikat) {
    input.setAttribute("class", "button-action ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only")
  } else {
    input.setAttribute("class", "button-other ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only")
  }

  input.addEventListener('click', function() {
    
    var confirmWindow = window.confirm("Opravdu zadat negativní výsledek AG testu?");
    if (confirmWindow == true) {
      getRegistrLoginCookies(zadanka.UseTestRegisters, function(cookieParams) {

        var kodOsoby = cookieParams.get("kodOsoby");
        var heslo = cookieParams.get("heslo");

        if(!kodOsoby || !heslo) {
          alert("Je potřeba být přihlášený do registru Žadanky Covid-19.")
        }

        getOptionsFromLocalStorage(function(optionsURLSearchParams) {

          var options = new URLSearchParams(optionsURLSearchParams);

          var AGVyrobceTestuKod = options.get("AGVyrobceTestuKod");
          var AGVyrobceTestuTitle = options.get("AGVyrobceTestuTitle");

          getRegistrCUDOvereniCisloZadankyUrl(zadanka.UseTestRegisters, function(url) {

            var urlParams = getRegistrCUDOvereniCisloZadankyUrlParams(kodOsoby, heslo, zadanka.Cislo);
            var link = url + "?" + urlParams.toString();

            var xhr = new XMLHttpRequest();
            xhr.open("GET", link, true);
            xhr.setRequestHeader("Content-Type","application/json; charset=UTF-8");
            xhr.onreadystatechange = function() {
              if(xhr.readyState === XMLHttpRequest.DONE) {

                if(xhr.status != 200) {
                  return;
                }

                var data = JSON.parse(xhr.responseText);

                if(data.Vysledek == "Stornovano" || data.Vysledek == "ZadankaNeexistuje") {
                  removeZadankaFromSyncStorage(zadanka.Cislo);
                  window.alert("Žádanka byla stornována nebo neexistuje. Bude odebrána.");
                  location.reload();
                } else if(
                  data.ZadankaExistuje && 
                  data.TypTestuNazev == "Průkaz antigenu" &&
                  data.Vysledek == "ZadankaExistujeJizDriveKontrolovan" &&
                  zadanka.Vysledek != "N"
                ) {

                  getAGVyrobceTestuKod(data.VyrobceTestuNazev, AGVyrobceTestuKod, AGVyrobceTestuTitle, (AGVyrobceTestuKod) => {

                    if(!AGVyrobceTestuKod) {
                      alert("Výrobce testu není uvedený v žádance ani v nastavení.");
                      return;
                    }

                    getRegistrCUDOvereniGetCertifikatCisloZadankyUrl(zadanka.UseTestRegisters, zadanka.Cislo, function(url) {
                    var xhrCertifikat = new XMLHttpRequest();
                    xhrCertifikat.open("GET", url, true);
                    xhrCertifikat.setRequestHeader("Content-Type","application/json; charset=UTF-8");
                    xhrCertifikat.responseType = 'blob';
                    xhrCertifikat.onreadystatechange = function() {
                      if(xhrCertifikat.readyState === XMLHttpRequest.DONE) {
                    
                        if(xhrCertifikat.status == 500) {

                          getRegistrCUDOvereniPotvrditUrl(zadanka.UseTestRegisters, function(url) {

                            var urlParams = getRegistrCUDOvereniPotvrditUrlParams(
                              kodOsoby,
                              heslo,
                              zadanka.Cislo,
                              AGVyrobceTestuKod, // v google storage muze byt zastaraly, proto prevedene z aktualni zadanky v ISIN z data.VyrobceTestuNazev
                              "Antigen",
                              "N"
                            );

                            var link = url + "?" + urlParams.toString();

                            var xhrPotvrdit = new XMLHttpRequest();
                            xhrPotvrdit.open("POST", link, true);
                            xhrPotvrdit.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                            xhrPotvrdit.onreadystatechange = function() {
                              if(xhrPotvrdit.readyState === XMLHttpRequest.DONE && xhrPotvrdit.status == 200) {
                                zadanka["Vysledek"] = "N";
                                updateZadankaInSyncStorage(zadanka);

                                if(jeVyzadovanyCertifikat) {
                                  getRegistrCUDOvereniGetCertifikatCisloZadankyUrl(zadanka.UseTestRegisters, zadanka.Cislo, function(url) {

                                    if(typeof browser === 'undefined') {
                                      chrome.downloads.download({url});
                                    } else {
                                      var xhrCertifikat = new XMLHttpRequest();
                                      xhrCertifikat.open("GET", url, true);
                                      xhrCertifikat.setRequestHeader("Content-Type","application/json; charset=UTF-8");
                                      xhrCertifikat.responseType = 'blob';
                                      xhrCertifikat.onreadystatechange = function() {
                                        if(xhrCertifikat.readyState === XMLHttpRequest.DONE && xhrCertifikat.status == 200) {
                              
                                          var file = new Blob([xhrCertifikat.response], { 
                                            type: "application/pdf" 
                                          });
                              
                                          var fileUrl = URL.createObjectURL(file);
                                          window.open(fileUrl);
                                        }
                                      }
                                      xhrCertifikat.send();
                                    }
                                  });
                                } else {
                                  location.reload();
                                }
                              }
                            }
                            xhrPotvrdit.send(urlParams.toString());
                          });
                        } else {
                          zadanka["Vysledek"] = "Ano";
                          updateZadankaInSyncStorage(zadanka);
                          location.reload();
                        }
                      }
                    }
                    xhrCertifikat.send();
                  });
                });
              }
            }
          };
          xhr.send();
        });
      });
    });
    }
  }, false);

  td.appendChild(input);
}

function addActions(tdActions, zadanka) {
  addRegistrCUDOvereniTypVyhledavaniCisloPostLinkToTr(zadanka.UseTestRegisters, tdActions, "Zkontrolovat žádanku", zadanka.Cislo);
  getRegistrCUDVyhledaniPacientaUrl(zadanka.UseTestRegisters, function(url) {
    addOckoUzisProfilLinkToTr(
      tdActions, 
      url, 
      "Profil na Pacienti Covid-19", 
      zadanka.TestovanyJmeno, 
      zadanka.TestovanyPrijmeni, 
      zadanka.TestovanyDatumNarozeni, 
      zadanka.TestovanyNarodnostNazev, 
      zadanka.TestovanyCisloPojistence
    );
  });
}

function displayZadankyKPotvrzeni(zadanky) {
  var zadankyElement = document.getElementById("zadanky");
  zadankyElement.innerHTML = "";

  if(!zadanky) {
    return;
  }

  var zadankyArray = Object.values(zadanky);
  var sortedZadankyArrayByOrdinaceVystavilDate = zadankyArray.sort(function(a, b) {
    return ((a.OrdinaceVystavilDate < b.OrdinaceVystavilDate) ? -1 : ((a.OrdinaceVystavilDate > b.OrdinaceVystavilDate) ? 1 : 0));
  });

  sortedZadankyArrayByOrdinaceVystavilDate.forEach(function(zadanka) {

    var tr = document.createElement("tr");

    addTextTdToTr(tr, zadanka.UseTestRegisters ? "Ano" : "Ne");
    addTextTdToTr(tr, getDateWithHoursAndMinutes(zadanka.OrdinaceVystavilDate));
    addTextTdToTr(tr, zadanka.Cislo);
    addTextTdToTr(tr, zadanka.TestovanyJmeno);
    addTextTdToTr(tr, zadanka.TestovanyPrijmeni);
    addTextTdToTr(tr, zadanka.TestovanyCisloPojistence);
    addTextTdToTr(tr, zadanka.TestovanyNarodnostNazev);
    addTextTdToTr(tr, zadanka.TestovanyDatumNarozeni);
    addTextTdToTr(tr, zadanka.OrdinaceVystavil);
    addTextTdToTr(tr, zadanka.TestovanyCisloCestovnihoDokladu);
    addTextTdToTr(tr, zadanka.TestovanyMistoNarozeni);
    if(zadanka.ProvedenOdber) {
      addTextTdToTr(tr, getDateWithHoursAndMinutes(zadanka.ProvedenOdber));
    } else {
      addZadankaPotvrditButtonToTr(tr, "Potvrdit provedení odběru", zadanka);
    }
    if(zadanka.Vysledek) {
      addTextTdToTr(tr, zadanka.Vysledek);
    } else {
      if (zadanka.ProvedenOdber) {
        var td = document.createElement("td");
        addZadankaZadatNegativniVysledekButtonToTd(td, "Zadat negativní výsledek", zadanka);
        addZadankaZadatNegativniVysledekButtonToTd(td, "Zadat negativní výsledek a stáhnout certifikát", zadanka, true);
        tr.appendChild(td);
      } else {
        addTextTdToTr(tr, "Není potvrzen odběr.");
      }
    }

    if(zadanka.ProvedenOdber) {
      var td = document.createElement("td");
      addZadankaCertifikatButtonToTr(td, "Stáhnout certifikát", zadanka);
      addPrintCertificateButtonToTd(td, "Certifikát VFN", zadanka);
      tr.appendChild(td);
    } else {
      addTextTdToTr(tr, "Není potvrzen odběr.");
    }

    var tdActions = document.createElement("td");
    addActions(tdActions, zadanka);
    tr.appendChild(tdActions);

    zadankyElement.insertBefore(tr, zadankyElement.firstChild);
  });
}

function getRegistrCUDVyhledaniPacientaUrlParams(zadanka) {
  var urlParams = new URLSearchParams();
  urlParams.set("DuvodVyhledani", "VyhledatPacienta");
  urlParams.set("TypVyhledani", zadanka.TestovanyNarodnostNazev == "CZ" ? "JmenoPrijmeniRC" : "CizinecJmenoPrijmeniDatumNarozniObcanstvi");
  urlParams.set("Jmeno", zadanka.TestovanyJmeno);
  urlParams.set("Prijmeni", zadanka.TestovanyPrijmeni);
  if(zadanka.TestovanyNarodnostNazev == "CZ") {
    urlParams.set("RodneCislo", zadanka.TestovanyCisloPojistence);
  } else {
    urlParams.set("DatumNarozeni", zadanka.TestovanyDatumNarozeni);
    urlParams.set("ZemeKod", zadanka.TestovanyNarodnostNazev);
  }
  urlParams.set("_submit", "None");
  return urlParams;
}

function loadZadankaVysledek(zadanka, callback) {

  getRegistrCUDVyhledaniPacientaUrl(zadanka.UseTestRegisters, function(url) {

    var urlParams = getRegistrCUDVyhledaniPacientaUrlParams(zadanka);
    var link = url + "?" + urlParams;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", link, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {

        var parser = new DOMParser();
        var responseDocument = parser.parseFromString(xhr.responseText, "text/html");

        var divs = responseDocument.querySelectorAll('div.textField');
        var cisloElement = Array.from(divs).find(el => {
          return el.textContent.trim().includes(zadanka.Cislo)
        });

        try {
          const stav = cisloElement.parentElement.nextSibling.nextSibling.childNodes[3].innerText.trim();

          if(
            stav != "PotvrzenoPozitivni" &&
            stav != "PotvrzenoNegativni"
            )
          {
            callback(null);
          } else {
            callback(stav == "PotvrzenoPozitivni" ? true : false);
          }
        } catch(e) {
          callback(null);
        }
      }
    };
    xhr.send(urlParams.toString());
  });
}

function addPrintCertificateButtonToTd(td, text, zadanka) {

  var input = document.createElement("input");
  input.type = "button";
  input.value = text;
  input.setAttribute("class", "button-action ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only")

  input.addEventListener('click', function() {

    loadZadankaVysledek(zadanka, (Vysledek) => {

      if(Vysledek != true || Vysledek != false) {
        Vysledek = !window.confirm("Výsledek negativní?");
      }

      if(!zadanka.TestovanyCisloCestovnihoDokladu) {
        zadanka.TestovanyCisloCestovnihoDokladu = window.prompt("Číslo cestovního dokladu", "");
      }

      if(!zadanka.TestovanyMistoNarozeni) {
        zadanka.TestovanyMistoNarozeni = window.prompt("Místo narození", "");
      }

      loadCertificatePdf(
        function(existingPdfBytes) {

          getOptionsFromLocalStorage(function(optionsURLSearchParams) {

            var options = new URLSearchParams(optionsURLSearchParams);

            var AGVyrobceTestuTitle = options.get(AG_VYROBCE_TESTU_TITLE);

            if(!AGVyrobceTestuTitle) {
              alert("V nastavení není uvedený výrobce testu.");
              return;
            }
          
            getCertificatePdf(
              existingPdfBytes,
              zadanka.TestovanyJmeno,
              zadanka.TestovanyPrijmeni,
              zadanka.TestovanyDatumNarozeni,
              zadanka.TestovanyMistoNarozeni,
              zadanka.TestovanyCisloCestovnihoDokladu,
              zadanka.OrdinaceVystavilDate,
              Vysledek,
              AGVyrobceTestuTitle,
              function(pdfDocumentObject) {
                openPdfDocumentObject(pdfDocumentObject);
              }
            );
          });
        }
      );
    });
  }, false);

  td.appendChild(input);
}

function getOptionsFromLocalStorage(callback) {
  chrome.storage.local.get([CHROME_STORAGE_OPTIONS_NAMESPACE], function(data) {
    callback(data[CHROME_STORAGE_OPTIONS_NAMESPACE]);
  });
}

function loadCertificatePdf(callback) {

  getOptionsFromLocalStorage(function(data) {
    var options = new URLSearchParams(data);
    var AGCertUrl = options.get(AG_CERT);

    fetch(AGCertUrl)
      .then(response => {
        response.arrayBuffer()
      .then(existingPdfBytes => {
        callback(existingPdfBytes);
      }).catch(() => {
        alert('Je nutné v nastavení nahrát vzor certifikátu.');
      });
    });
  });
}

async function openPdfDocumentObject(pdf) {
  var pdfBytes = await pdf.save();
  var file = new Blob([pdfBytes], {type: "application/pdf"});
  var fileUrl = URL.createObjectURL(file);
  window.open(fileUrl);
}

function removeZadankaFromSyncStorage(cisloZadanky) {
  chrome.storage.sync.remove(cisloZadanky);
}

function updateZadankaInSyncStorage(zadanka) {
  chrome.storage.sync.set({[zadanka.Cislo]: zadanka});
}

function loadAndDisplayZadankyKPotvrzeni() {
  // Testing purpose: clear entire storage
  // chrome.storage.sync.clear();

  // Testing purpose: show entire storage
  /*chrome.storage.sync.get(null, function(items) {
    console.log(items);
    var allKeys = Object.keys(items);
    console.log(allKeys);
  });*/

  chrome.storage.sync.get(null, function(data) {
    displayZadankyKPotvrzeni(data);
  });
}

chrome.storage.onChanged.addListener(function(changeSet, area) {
  if(area == 'sync') {
    loadAndDisplayZadankyKPotvrzeni();
  }
});

window.onload = function() {
  loadAndDisplayZadankyKPotvrzeni();
};

async function getCertificatePdf(pdfBytes, Jmeno, Prijmeni, DatumNarozeniString, TestovanyMistoNarozeni, TravelDocumentId, DatumTestu, VysledekTestuJePositivni, Manufacturer, callback)  {
  const pdfDoc = await PDFDocument.load(pdfBytes);

  var DatumVystaveniString = new Date().toLocaleString("en-US", { year: '2-digit', day: '2-digit', month: '2-digit' });
  var CasVystaveniString = new Date().toLocaleString("en-US", { hour: '2-digit', minute: '2-digit' });
  var DatumTestuString = new Date(DatumTestu).toLocaleString("en-US", { year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  pdfDoc.registerFontkit(fontkit);

  const fontUrl = chrome.runtime.getURL("assets/Ubuntu-R.ttf");
  const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);

  const form = pdfDoc.getForm();

  form
    .getTextField(
      'Surname',
    )
    .setText(Prijmeni);

  form
    .getTextField(
      'FirstName',
    )
    .setText(Jmeno);

  form
    .getTextField(
      'DateOfBirth',
    )
    .setText(DatumNarozeniString);

  form
    .getTextField(
      'PlaceOfBirth',
    )
    .setText(TestovanyMistoNarozeni);

  form
    .getTextField(
      'TravelDocumentId',
    )
    .setText(TravelDocumentId);

  form
    .getTextField(
      'DateOfTest',
    )
    .setText(DatumTestuString);

  form
    .getCheckBox(
      VysledekTestuJePositivni ? 'ResultPositive' : 'ResultNegative',
    )
    .check();

  form
    .getTextField(
      'Manufacturer',
    )
    .setText(Manufacturer);

  form
    .getTextField(
      'Place',
    )
    .setText("Prague");

  form
    .getTextField(
      'DateNow',
    )
    .setText(DatumVystaveniString);

  form
    .getTextField(
      'TimeNow',
    )
    .setText(CasVystaveniString);

  form.updateFieldAppearances(font);

  callback(pdfDoc);
}