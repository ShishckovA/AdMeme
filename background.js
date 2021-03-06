var enabled = true;
var rules;
var ready;
var dict_req = {};
var dict_req_regexp = {};
var no_domain = [];
var no_domain_regexp = [];

function sleeper(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
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

async function updateInput() {
    var unEnded = await fetch("https://easylist-downloads.adblockplus.org/ruadlist+easylist.txt")
    var text = await unEnded.text();
    rules = getParsedData(text);
}

async function updateStorage(urls) {
    var toStUrls = [];
    for (var url of urls) {
        var strUrl = "http://universum.pythonanywhere.com/api/getImages?url=" + url;
        var req = await fetch(strUrl);
        var currentGroupUrls = (await req.json()).response;
        for (currentGroupUrl of currentGroupUrls) {
            toStUrls.push(currentGroupUrl);
        }
        await sleeper(1000);
        console.log(url);
    }
    console.log(toStUrls);

}

function getFromStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], function(result) {
            resolve(result[key]);
        });
    })
}

function putToStorage(key, data) {
    console.log(key, data);
    obj = new Object();
    obj[key] = data;
    chrome.storage.local.set(obj);
}

function dictOfUrlsToList(dict) {
    var urls = [];
    for (var url in dict) {
        if (dict[url]) {
            urls.push(url);
        }
    }
    return urls;
}

async function main() {
    ready = updateInput();
    ready.then(function() {
        blockAll();
        console.log("started");
    });
}


chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        console.log("This is a first install!");

    } 
    else if (details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
    chrome.storage.sync.get(["memoryUrls"], result => {
        updateStorage([]);
        var dict = result["memoryUrls"];
        var urls = dictOfUrlsToList(dict);
        updateStorage(urls);
    });
});



var rules;

var defaultUrls = [["https://vk.com/dank_memes_ayylmao", "Dank memes"],
                   ["https://vk.com/borsch", "Борщ"],
                   ["https://vk.com/sortnlogn", "Сортируй"],
                   ["https://vk.com/oroom", "Чёткие приколы"],
                   ["https://vk.com/cringey", "Cringe"]];

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.request == "getRules") {
            ready.then(() => {
                sendResponse({"rules" : rules});
            });
            return true;
        }
        if (request.request == "getEnabled") {
            sendResponse({"enabled" : enabled});
            return true;
        }
        if (request.request == "defaultUrls") {
            console.log({"defaultUrls" : defaultUrls});
            sendResponse({"defaultUrls" : defaultUrls});
            return true;
        }
        if (request.request == "getFromStorage") {
            (async () => {
                var ans = await getFromStorage(request.key);
                var key = request.key;
                var d = new Object();
                d[key] = ans; 
                sendResponse(d);
            })();
            return true;
        }
        if (request.request == "putURLS") {
            updateStorage(request.urls);
            return true;
        }
        if (request.request == "isCorrect") {
            (async () => {
                var ans = (await fetch("http://universum.pythonanywhere.com/api/getName?url=" + request.url)); 
                ans = (await ans.json()).response;
                sendResponse(ans);
            })();
            return true;
        }
    });

chrome.runtime.onConnect.addListener(function (externalPort) {
    externalPort.onDisconnect.addListener(function() {
        chrome.storage.sync.get(["memoryUrls"], result => {
            updateStorage([]);
            var dict = result["memoryUrls"];
            var urls = dictOfUrlsToList(dict);
            updateStorage(urls);
        });
    });

})

main();
