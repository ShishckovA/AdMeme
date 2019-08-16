async function getFile(file) {
    var resp = await fetch(file);
    return resp.text();
}

function updateRules() {
    // get ezist
    // parse ezist
    var rules = (getFile(chrome.extension.getURL('./input.txt')));
    rules = JSON.parse(rules);
}

async function updateInput() {
    var text = await getFile("https://easylist-downloads.adblockplus.org/ruadlist+easylist.txt");
    var rules = getParsedData(text);
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.request == "getRules")
          sendResponse({"rules" : rules});
      console.log("responce");
      });
}

updateInput();
