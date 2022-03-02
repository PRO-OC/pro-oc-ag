function getDatumNarozeniZRodneCislo(rodneCislo) {
    if (!rodneCislo) {
      return "";
    }
    
    var year = rodneCislo.substring(0, 2);
    var month = rodneCislo.substring(2, 4);
    var day = rodneCislo.substring(4, 6);
  
    if(month > 50) {
      month = parseInt(month) - 50;
    }
  
    var actualYearLast2Pos = ((new Date()).getFullYear()).toString().substr(-2);
    if(year < actualYearLast2Pos) {
      year = "20" + year;
    } else {
      year = "19" + year;
    }
  
    return day + "." + month + "." + year;
}

function getRegistrDomain() {
    return "eregpublicsecure.ksrzis.cz";
}

function getTestRegistrDomain() {
    return "eregpublicsecure2.ksrzis.cz";
}

function getRegistrUrl() {
    return "https://" + getTestRegistrDomain();
}

function getTestRegistrUrl() {
    return "https://" + getTestRegistrDomain();
}

function getEregRegistrDomain() {
    return "ereg.ksrzis.cz";
}

function getEregRegistrUrl() {
    return "https://" + getEregRegistrDomain();
}

function getTestEregRegistrDomain() {
    return "ereg2.ksrzis.cz";
}

function getRegistrZadankaOdberneMistoPage() {
    return "/Registr/CUD/Zadanka/OdberneMisto"
}
  
function getRegistrZadankaUlozitPage() {
    return "/Registr/CUD/Zadanka/Ulozit";
}

function getEregRegistrZadankaUlozitPage() {
    return "/Registr/CUDZadanky/Zadanka/Ulozit";
}

function getEregRegistrZadankaPage() {
    return "/Registr/CUDZadanky/Zadanka";
}

function isUrlZadanka(hostname, page) {

    const registrDomain = getRegistrDomain();
    const testRegistrDomain = getTestRegistrDomain();

    const eregRegistrDomain = getEregRegistrDomain();
    const testEregRegistrDomain = getTestEregRegistrDomain();

    if((hostname == registrDomain || hostname == testRegistrDomain) && (page == getRegistrZadankaOdberneMistoPage() || page == getRegistrZadankaPage())) {
        return true;
    } else if ((hostname == eregRegistrDomain || hostname == testEregRegistrDomain) && (page == getEregRegistrZadankaPage())) {
        return true;
    } else {
        return false;
    }
}

function isUrlZadankaPrintPage(hostname, page) {

    const registrDomain= getRegistrDomain();
    const testRegistrDomain = getTestRegistrDomain();

    const eregRegistrDomain = getEregRegistrDomain();
    const testEregRegistrDomain = getTestEregRegistrDomain();

    if((hostname == registrDomain || hostname == testRegistrDomain) && (page == getRegistrZadankaOdberneMistoPage() || page == getRegistrZadankaUlozitPage())) {
        return true;
    } else if ((hostname == eregRegistrDomain || hostname == testEregRegistrDomain) && (page == getEregRegistrZadankaUlozitPage())) {
        return true;
    } else {
        return false;
    }
}

const header = document.getElementsByTagName("header");
const printDiv = document.getElementById("printDiv");

if(
    header && 
    header[0] && 
    header[0].children && 
    header[0].children[0] &&
    printDiv
    ) {
    if(isUrlZadankaPrintPage(window.location.hostname, window.location.pathname)) {
        const CisloZadanky = header[0].children[0].innerText.trim();
        addCisloZadanky(CisloZadanky);
    }
}

function addCisloZadanky(cislo) {

    var zadankaDataJSON = getZadankaDataFromSessionStorage();
    var zadankaData = JSON.parse(zadankaDataJSON);

    if(zadankaData && cislo) {

        zadankaData["Cislo"] = cislo;

        if (zadankaData.IsAntigenTypyTestu) {
            chrome.runtime.sendMessage({
                "text": "UlozitZadankaData",
                "data": zadankaData
            });
        }
    }
}

function getSessionStorageZadankaName() {
    return "ZadankaTab";
}

function getZadankaDataFromSessionStorage() {
    return window.sessionStorage.getItem(getSessionStorageZadankaName());
}

function setZadankaDataToSessionStorage(zadankaForm) {

    var zadankaFormData = new FormData(zadankaForm);

    var OrdinaceVystavilDate = new Date();
    // Testing purpose: -1 hour
    // OrdinaceVystavilDate.setHours(OrdinaceVystavilDate.getHours() - 1);

    var zadankaSentData = {};

    zadankaSentData["OrdinaceVystavilDate"] = OrdinaceVystavilDate.toISOString();
    zadankaSentData["TestovanyCisloPojistence"] = zadankaFormData.get("TestovanyCisloPojistence");
    zadankaSentData["TestovanyJmeno"] = zadankaFormData.get("TestovanyJmeno");
    zadankaSentData["TestovanyPrijmeni"] = zadankaFormData.get("TestovanyPrijmeni");
    zadankaSentData["TestovanyDatumNarozeni"] = zadankaFormData.get("TestovanyNarodnost") == "CZ" ? getDatumNarozeniZRodneCislo(zadankaFormData.get("TestovanyCisloPojistence")) : zadankaFormData.get("TestovanyDatumNarozeni");
    zadankaSentData["TestovanyNarodnostNazev"] = zadankaFormData.get("TestovanyNarodnost");
    zadankaSentData["OrdinaceVystavil"] = zadankaFormData.get("OrdinaceVystavil");
    var IsAntigenTypyTestuElement = document.getElementById("TypyTestuList_2__Selected");
    zadankaSentData["IsAntigenTypyTestu"] = IsAntigenTypyTestuElement ? IsAntigenTypyTestuElement.checked : false;
    const UseTestRegisters = getUseTestRegisters(window.location.hostname);;
    zadankaSentData["UseTestRegisters"] = UseTestRegisters;

    window.sessionStorage.setItem(getSessionStorageZadankaName(), JSON.stringify(zadankaSentData));
}

const zadankaForm = document.getElementById("editForm");

if(zadankaForm) {
    zadankaForm.addEventListener("submit", () => {
        setZadankaDataToSessionStorage(zadankaForm);
    });
}

function getUseTestRegisters(hostname) {

    const registrDomain = getRegistrDomain();
    const testRegistrDomain = getTestRegistrDomain();

    const eregRegistrDomain = getEregRegistrDomain();
    const testEregRegistrDomain = getTestEregRegistrDomain();

    if(hostname == testRegistrDomain || hostname == testEregRegistrDomain) {
        return true;
    } else if(hostname == registrDomain || hostname == eregRegistrDomain) {
        return false;
    }
}

var sendButton = document.querySelector(".actions > button[value='odeslat']");

if(sendButton) {
    if(
        isUrlZadanka(window.location.hostname, window.location.pathname ||
        isUrlZadankaUlozit(window.location.hostname, window.location.pathname))
    ) {
        sendButton.setAttribute("style", "display: none;");
    }
}

function getRegistrZadankaPage() {
    return "/Registr/CUD/Zadanka";
}

function isUrlZadankaUlozit(hostname, page) {

    const registrDomain = getRegistrDomain();
    const testRegisterDomain = getTestRegistrDomain();

    const eregRegistrDomain = getEregRegistrDomain();
    const testEregRegistrDomain = getTestEregRegistrDomain();

    if((hostname == registrDomain || hostname == testRegisterDomain) && (page == getRegistrZadankaOdberneMistoPage() || page == getRegistrZadankaPage())) {
        return true;
    } else if ((hostname == eregRegistrDomain || hostname == testEregRegistrDomain) && (page == getEregRegistrZadankaPage() || page == getEregRegistrZadankaUlozitPage())) {
        return true;
    } else {
        return false;
    }
}