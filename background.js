var enabled = true;

function getFile(file)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", file, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function parse() {
    var rules = (getFile(chrome.extension.getURL('./input.txt')));
    rules = JSON.parse(rules);
    return rules;
}

function check(from, to) {
    from = from.replace(/https?:\/\/(www\.)?/, '');
    from = from.replace(/\/.*$/, '');
    var rules = parse();
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

blockAll();
