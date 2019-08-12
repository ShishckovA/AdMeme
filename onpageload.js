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
            div.innerHTML = "<img src=\"" + getImgSrc() + "\" width=" + w + "px>";
        }
    }
}

function deleteAll() {
var rules = [
   {
     'isException' : false,
     'options' :
     {
       'domains' : [ "bit-tech.net" ],
       'skipDomains' : [  ]
     },
     'htmlRuleSelector' : '.xtag_container'
   },
   {
     'isException' : false,
     'options' :
     {
       'domains' : [ "fanfics.me" ],
       'skipDomains' : [  ]
     },
     'htmlRuleSelector' : '.FicHead.ContentTable > .left'
   },
   {
     'isException' : false,
     'options' :
     {
       'domains' : [ "maximonline.ru" ],
       'skipDomains' : [  ]
     },
     'htmlRuleSelector' : '.top-banner'
   },
   {
     'isException' : false,
     'options' :
     {
       'domains' : [ "fijisun.com.fj" ],
       'skipDomains' : [  ]
     },
     'htmlRuleSelector' : '.widget-3'
   }
];

    var url = document.URL;
    var url = url.substr(url.indexOf(".") + 1);
    var url = url.substr(0, url.indexOf("/")) // https://foo.baz.bar/spam/eggs/ to baz.bar
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
            alert(-1)
            var ps = document.querySelectorAll(rule["htmlRuleSelector"]);
            for (var i = 0; i < ps.length; i++) {
                p = ps[i];
                p.innerHTML = "<img src=\"" + getImgSrc() + "\">";
            }
        }
    }

}

function run(event) {
    deleteBanners();
    deleteFromVk();
}
// run();
window.addEventListener("load", run);
