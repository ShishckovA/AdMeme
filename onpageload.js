function getRandNum(n) {
    return (Math.floor(Math.random() * n) + 1);
}

function getImgSrc() {
    return chrome.extension.getURL('memes/img' + getRandNum(31) + '.jpg');
}

function deleteAll(pageRules) {
    for (var i = 0; i < pageRules.length; i++) {
        var rule = pageRules[i];
        var ps = document.querySelectorAll(rule["htmlRuleSelector"]);
        for (var j = 0; j < ps.length; j++) {
            console.log(rule["htmlRuleSelector"])
            p = ps[j];
            var w = p.offsetWidth;
            var h = p.offsetHeight;
            console.log(p.outerHTML);

            p.outerHTML = "<img src=\"" + getImgSrc() + "\" width=" + w + "px height=" + h + "px>";
        }
    }
}

function getPageRules() {
    var cpageRules = [];
    var url = document.URL;
    url = url.replace(/https?:\/\/(www\.)?/, '');
    url = url.replace(/\/.*$/, '');
    chrome.runtime.sendMessage({"request": "getRules"}, function(response) {
        rules = response.rules;
        // console.log(rules);
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
    }); 
    console.log(cpageRules);
    return cpageRules;
}


function run(event) {
    chrome.runtime.sendMessage({"request": "GetEnabled"}, function(response) {
        enabled = response.enabled;
        if (enabled) {
	    deleteAll(pageRules);
	}
    });
}

var rules;
var pageRules = getPageRules();
console.log(pageRules.length)
setInterval(run, 2000);

// var target = document.querySelector('body');
// var observer = new window.MutationObserver(
//     function(mutations) {
//         for (var mutatuion in mutations) 
//     }
// );

// observer.observe(target, { subtree: true, characterData: true, childList: true })
