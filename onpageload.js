function getRandNum(n) {
    return (Math.floor(Math.random() * n) + 1);
}

function getImgSrc() {
    return chrome.extension.getURL('memes/img' + getRandNum(15) + '.jpg');
}

function deleteBanners () {
    var ps = document.querySelectorAll("[class$='js-ads-block']");
    for (var i = 0; i < ps.length; i++) {
        p = ps[i];
        p.innerHTML = "<img src=\"" + getImgSrc() + "\">";
    }
}

function deleteFromVk() {
    if (document.URL.indexOf("vk.com") != -1) {
        var ps = document.getElementById("ads_left");
        var w = ps.offsetWidth;
        ps.outerHTML = "<img src=\"" + getImgSrc() + "\" width=" + w + "px>";

        var divs = document.querySelectorAll("[class$='_ads_block_data_w mailru-visibility-check closed_comments deep_active']");
        for (var i = 0; i < divs.length; i++) {
            div = divs[i];
            w = div.offsetWidth;
            div.outerHTML = "<img src=\"" + getImgSrc() + "\" width=" + w + "px>";
        }
    }
}

function getFile(file)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", file, false); 
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function deleteAll() {
    var rules = (getFile(chrome.extension.getURL('./input.txt')));
    var rules = JSON.parse(rules);
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
