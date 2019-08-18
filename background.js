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
    var text = await getFile("https://easylist-downloads.adblockplus.org/ruadlist+easylist.txt");
    rules = getParsedData(text);
}

function writeToStorage(files) {
    chrome.storage.local.set({"files" : files});
}

function getUrls(id, token) {
    var url = "https://api.vk.com/method/wall.get?owner_id=-" + id + "&access_token=" + token + "&v=5.101";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    var d = JSON.parse(xhr.responseText);
    var ans = [];
    if (!("response" in d)) {
        var dfsdf = false;
    }
    for (var i = 0; i < d['response']['items'].length; ++i) {
        var itm = d['response']['items'][i];
        if  (!itm['marked_as_ads'] && itm['post_type'] == 'post' && "attachments" in itm) {
            if (itm['attachments'][0]['type'] == 'photo') {
                var arrSizes = itm['attachments'][0]['photo']['sizes'];
                ans.push(itm['attachments'][0]['photo']['sizes'][arrSizes.length - 1]['url']);
            }
        }
    }
    return ans;
}

function getIdByUrl(url, token) {
    var ind = url.indexOf("vk.com");
    if (ind == -1) return 0;
    url = url.slice(ind + 7);
    if (url.indexOf("public") == 0) {
        return url.slice(6);
    }
    var name = url;
    var req = "https://api.vk.com/method/utils.resolveScreenName?screen_name=" + name + "&access_token=" + token + "&v=5.101";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", req, false);
    xhr.send();
    var d = JSON.parse(xhr.responseText);
    console.log(d['response']['object_id']);
    return d['response']['object_id'];
}

function getUrlsByUrl(url, token) {
    return getUrls(getIdByUrl(url, token), token);
}

async function updateStorage(urls) {
    var toStUrls = [];
    for (var url of urls) {
        var req = (await fetch("http://universum.pythonanywhere.com/api/getImages?url=" + url));
        var currentGroupUrls = (await req.json()).response;
        for (currentGroupUrl of currentGroupUrls) {
            toStUrls.push(currentGroupUrl);
        }
        await sleeper(1000);
    }
    console.log(toStUrls);
    writeToStorage(toStUrls);
}

function getFromStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], function(result) {
            resolve(result[key]);
        });
    })
}

function putToStorage(key, data) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({key : data}, function(result) {
            resolve(result);
        });
    })
}

async function main() {
    ready = updateInput();
    await ready;
    blockAll();
}

var rules;
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.request == "getRules") {
            ready.then(() => {
                sendResponse({"rules" : rules});
            });
            return true;
        }
        if (request.request == "GetEnabled") {
            sendResponse({"enabled" : enabled});
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
        }
    });

updateInput();

main();
