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

function run(event) {
    deleteBanners();
    deleteFromVk();
}
// run();
window.addEventListener("load", run);
