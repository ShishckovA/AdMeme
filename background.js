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
    var text = await getFile("https://easylist-downloads.adblockplus.org/ruadlist+easylist.txt");
    rules = getParsedData(text);
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.request == "getRules")
          sendResponse({"rules" : rules});
        if (request.request == "GetEnabled")
          sendResponse({"enabled" : enabled});
        if (request.request == "putURLS") 
            updateStorage(requst.urls);
      console.log("responce");
      });
}

function updateStorage(urls) {

}

function getUrls(id, token) {
    var url = "https://api.vk.com/method/wall.get?owner_id=-" + id + "&access_token=" + token + "&v=5.101";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    var d = JSON.parse(xhr.responseText);
    var ans = [];
    for (var i = 0; i < d['response']['items'].length; ++i) {
  itm = d['response']['items'][i];
        if  (!itm['marked_as_ads'] && itm['post_type'] == 'post') {
            if (itm['attachments'][0]['type'] == 'photo') {
                ans.push(itm['attachments'][0]['photo']['sizes'][0]['url']);
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
    return d['response']['object_id'];
}

function getUrlsByUrl(url, token) {
    return getUrls(getIdByUrl(url, token), token);
}

chrome.runtime.sendMessage({"request": "GetEnabled"}, function(response) {
        enabled = response.enabled;
        if (enabled) {
            deleteAll(pageRules);
        }
    });

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
