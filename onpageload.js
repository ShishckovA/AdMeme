function getRandNum(n) {
    return (Math.floor(Math.random() * n) + 1);
}

function getImgSrc() {
    return chrome.extension.getURL('memes/img' + getRandNum(15) + '.jpg');
}

function deleteAll() {
    var url = document.URL;

    url = url.replace(/https?:\/\/(www\.)?/, '');
    url = url.replace(/\/.*$/, '');
    console.log(url);

    for (var ruleN = 0; ruleN < rules.length; ruleN++) {
        var rule = rules[ruleN];
        var allDomains = false;
        var goodDomains = [];
        if ("domains" in rule["options"]) {
            goodDomains = rule["options"]["domains"];
        }
        else {
            allDomains = true;
        }
        if (allDomains || goodDomains.indexOf(url) != -1) {
            var ps = document.querySelectorAll(rule["htmlRuleSelector"]);
            for (var i = 0; i < ps.length; i++) {
                p = ps[i];
                var w = p.offsetWidth;
                var h = p.offsetHeight;
                p.outerHTML = "<img src=\"" + getImgSrc() + "\" width=" + w + "px height=" + h + "px>";
            }
        }
    }
}


function run(event) {
    deleteAll();
}
// run();

window.addEventListener("load", run);
