async function getFile(file) {
    var resp = await fetch(file);
    return resp.text();
}
var enabled = true;
var rules;
var ready;
var dict_req = {};
var dict_req_regexp = {};
var no_domain = [];
var no_domain_regexp = [];

async function updateInput() {
    var text = await getFile("https://easylist-downloads.adblockplus.org/ruadlist+easylist.txt");
    rules = getParsedData(text);
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.request == "getRules") {
                ready.then(() => {
                    sendResponse({"rules" : rules});
                });
                return true;
            }
            if (request.request == "GetEnabled")
                sendResponse({"enabled" : enabled});
            console.log("response");
        }
    );
}

function to_dict(field) {
    rules_f = rules[field];
    for (var ruleN = 0; ruleN < rules_f.length; ruleN++) {
        var rule = rules_f[ruleN];
        if ("domains" in rule["options"]) {
            if (rule["isRegex"] == false) {
                var data = rule["data"];
                if (data[-1] == '^') {
                    data = data.substr(0, data.length - 1);
                }
                for (var i = 0; i < rule["options"]["domains"].length; i++) {
                    var dom = rule["options"]["domains"][i];
                    dom = dom.replace(/https?:\/\/(www\.)?/, '');
                    dom = dom.replace(/\/.*$/, '');
                    if (dom in dict_req) {
                        dict_req[dom].push(data);
                    }
                    else {
                        dict_req[dom] = [data];
                    }
                }
            }
            else {
                for (var i = 0; i < rule["options"]["domains"].length; i++) {
                    var dom = rule["options"]["domains"][i];
                    dom = dom.replace(/https?:\/\/(www\.)?/, '');
                    dom = dom.replace(/\/.*$/, '');
                    if (dom in dict_req_regexp) {
                        dict_req_regexp[dom].push(rule["data"]);
                    }
                    else {
                        dict_req_regexp[dom] = [rule["data"]];
                    }
                }
            }
        }
        else {
            if (rule["isRegex"] == false) {
                if (rule["data"][-1] == '^') {
                    no_domain.push(rule["data"].substr(0, rule["data"].length - 1));
                }
                else {
                    no_domain.push(rule["data"]);
                }
            }
            else {
                no_domain_regexp.push(rule["data"]);
            }
        }
    }
}

function check(from, to) {
    if (from != undefined) {
        from = from.replace(/https?:\/\/(www\.)?/, '');
        from = from.replace(/\/.*$/, '');
    }
    if (from in dict_req) {
        for (var i = 0; i < dict_req[from].length; i++) {
            if (to.indexOf(dict_req[from][i]) != -1) {
                return true;
            }
        }
    }
    for (var i = 0; i < no_domain.length; i++) {
        if (to.indexOf(no_domain[i]) != -1) {
            return true;
        }
    }
    if (from in dict_req_regexp) {
        for (var i = 0; i < dict_req_regexp[from].length; i++) {
            try {
                var toto = RegExp(dict_req_regexp[from][i]);
            } catch (e) {
                var toto = RegExp("/" + dict_req_regexp[from][i] + "/");
            }
            if (toto.test(to)) {
                return true;
            }
        }
    }
    for (var i = 0; i < no_domain_regexp.length; i++) {
        try {
            var toto = RegExp(no_domain_regexp[i]);
        } catch (e) {
            var toto = RegExp("/" + no_domain_regexp[i] + "/");
        }
        if (toto.test(to)) {
            return true;
        }
    }
    return false;
}

function blockAll() {
    to_dict("filters");
    to_dict("noFingerprintFilters");
    chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
            if (enabled) {
                if (check(details.initiator, details.url)) {
                    console.log("blocked");
                    return {cancel: enabled};
                }
                }
        },
        {urls: ["<all_urls>"]},
        ["blocking"]
    );
}

async function main() {
    ready = updateInput();
    await ready;
    blockAll();
}

main();

//chrome.webRequest.onBeforeRequest.addListener(
//  function(details) {
//      return {cancel: enabled };
//  },
//  {urls: blocked_domains},
//  ["blocking"]
//);
