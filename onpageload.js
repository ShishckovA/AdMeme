function getRandNum(n) {
    return (Math.floor(Math.random() * n));
}

function getImgBytes() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({"request": "getFromStorage", "key" : "files"}, async function(result) {
            var files = result.files;
            if (typeof files == "undefined" || files.length == 0) {
                resolve("");
                return;
            }
            var n = getRandNum(files.length);
            resolve(files[n]);
        });
    });
}

function convertToDataURL(bytes) {
    return new Promise((resolve, reject) => {
        var blob = new Blob([bytes]);
        var fr = new FileReader();
        fr.onload = ((event)=> {
            resolve(fr.result);
        });
        //TODO: CATCH ERROR
        fr.readAsDataURL(blob);
    });
}

function getUrlsFromStorage() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({"request": "getFromStorage", "key" : "files"}, result => {
            console.log(result);
            resolve(result.files);
        });
    });
}

async function deleteAll(pageRules) {
    var files = await getUrlsFromStorage(); 
    for (var i = 0; i < pageRules.length; i++) {
        var rule = pageRules[i];
        var ps = document.querySelectorAll(rule["htmlRuleSelector"]);
        for (var j = 0; j < ps.length; j++) {
            var p = ps[j];
            var w = p.offsetWidth;
            var h = p.offsetHeight;
            if (typeof files == "undefined" || files.length == 0) {
                p.outerHTML = "";
            }
            else {
                var n = getRandNum(files.length);
                var a = files[n];
                p.outerHTML = "<img src=\"" + a + "\" width=" + w + "px>";
            }
        }
    }
}

function getPageRules() {
    var cpageRules = [];
    var url = document.URL;
    url = url.replace(/https?:\/\/(www\.)?/, '');
    url = url.replace(/\/.*$/, '');
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({"request": "getRules"}, function(response) {
            rules = response.rules;
            for (var ruleN = 0; ruleN < rules["htmlRuleFilters"].length; ruleN++) {
                var rule = rules["htmlRuleFilters"][ruleN];
                var allDomains = false;
                var goodDomains = [];
                if ("domains" in rule["options"]) {
                    goodDomains = rule["options"]["domains"];
                }
                else {
                    allDomains = true;
                }
                if (allDomains || goodDomains.indexOf(url) != -1) {
                    cpageRules.push(rule);
                }
            }
            console.log(cpageRules.length);
            resolve(cpageRules);
        }); 
    });
}

async function run(event) {
    var pageRules = await getPageRules();
    // if (document.URL.indexOf("youtube.com") != -1) {
    //     return;
    // }
    chrome.runtime.sendMessage({"request": "getEnabled"}, async function(response) {
        enabled = response.enabled;
        if (enabled) {
            deleteAll(pageRules);
        }
    });
}

var rules;
window.addEventListener("load", run);
// run();
// console.log(pageRules.length)
// setInterval(run, 2000);

// const targetNode = document.getElementsByTagName('body')[0];

// const config = { attributes: true, childList: true, subtree: true };

// const callback = function(mutationsList, observer) {
//     for(let mutation of mutationsList) {
//         if (mutation.type === 'childList') {
//             console.log('A child node has been added or removed.');
//         }
//         else if (mutation.type === 'attributes') {
//             console.log('The ' + mutation.attributeName + ' attribute was modified.');
//         }
//         else {}
//     }
// };
// window.addEventListener("click", function() {deleteAll(pageRules)}) ;

// const observer = new MutationObserver(callback);

// observer.observe(targetNode, config);
