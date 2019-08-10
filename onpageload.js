function getImgSrc() {
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
    //Petka
}

function run(event) {
    deleteBanners();
    //deleteFromVk();
}

window.addEventListener("load", run);
