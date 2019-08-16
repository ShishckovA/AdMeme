
async function getFile(file) {
    var resp = await fetch(file);
    return resp.text();
}
var enabled = true;

function check(from, to) {
    from = from.replace(/https?:\/\/(www\.)?/, '');
    from = from.replace(/\/.*$/, '');
    rules_f = rules["filters"];
    for (var ruleN = 0; ruleN < rules_f.length; ruleN++) {
        var rule = rules_f[ruleN];
        if (rule["isRegex"] == false) {
            var en = false;
            if ("domains" in rule["options"]) {
                if (rule["options"]["domains"].indexOf(from) != -1) {
                    en = true;
                }
            }
            else {
                en = true;
            }
            if (en) {
                var data = rule["data"].substr(0, rule["data"].length - 1);
                if (to.indexOf(data) != -1) {
                    return true;
                }
            }
        }
        else {
            var regex = RegExp(rule["data"]);
            if (regex.test(to)) {
                return true;
            }
        }
    }
    return false;
}

function blockAll() {
    chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
            if (check(details.initiator, details.url)) {
                console.log("blocked");
                return {cancel: enabled};
            }
        },
        {urls: ["<all_urls>"]},
        ["blocking"]
    );
}

async function updateInput() {
    var text = await getFile("https://filters.adtidy.org/extension/chromium/filters/1.txt");
    rules = getParsedData(text);
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.request == "getRules")
          sendResponse({"rules" : rules});
    if (request.request == "GetEnabled")
          sendResponse({"enabled" : enabled});
      console.log("responce");
      });
}

var rules;
updateInput();
blockAll();

//chrome.webRequest.onBeforeRequest.addListener(
//  function(details) {
//      return {cancel: enabled };
//  },
//  {urls: blocked_domains},
//  ["blocking"]
//);
