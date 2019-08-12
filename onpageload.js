function pprint(obj, indent)
{
  var result = "";
  if (indent == null) indent = "   ";

  for (var property in obj)
  {
    var value = obj[property];
    if (typeof value == 'string')
      value = "'" + value + "'";
    else if (typeof value == 'object')
    {
      if (value instanceof Array)
      {
        // Just let JS convert the Array to a string!
        value = "[ " + value + " ]";
      }
      else
      {
        // Recursive dump
        // (replace "  " by "\t" or something else if you prefer)
        var od = pprint(value, indent + "  ");
        // If you like { on the same line as the key
        //value = "{\n" + od + "\n" + indent + "}";
        // If you prefer { and } to be aligned
        value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
      }
    }
    result += indent + "'" + property + "' : " + value + ",\n";
  }
  return result.replace(/,\n$/, "");
}



function getImgSrc() {
//     var fs = require('fs');
//     const testFolder = './memes';
//     fs.readdirSync(testFolder).forEach(file => {
//         alert(file);
//         console.log(file);
// });
    return chrome.extension.getURL('memes/img' + (Math.floor(Math.random() * 10) + 1) + '.jpg')
}

function deleteBanners () {
    var reg = new RegExp("img_and_title");
    var ps = document.querySelectorAll("[class$='js-ads-block']");
    for (var i = 0; i < ps.length; i++) {
        p = ps[i];
        p.innerHTML = "<img src=\"" + getImgSrc() + "\">";
    }
}

function deleteFromVk() {
    if (document.URL.indexOf("vk.com") != -1) {
        var ps = document.querySelectorAll("[class^='ads_ads_box']");
        for (var i = 0; i < ps.length; i++) {
            p = ps[i];
            p.innerHTML = "<img src=\"" + getImgSrc() + "\">";
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
    // deleteBanners();
    // deleteFromVk();
    deleteAll();
    console.log("finished");
}



var delayInMilliseconds = 4000; //1 second
setTimeout(function() {
  run();
}, delayInMilliseconds);
