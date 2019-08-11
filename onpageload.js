function getRandNum(n) {
    return (Math.floor(Math.random() * n) + 1);
}

function getImgSrc() {
    return chrome.extension.getURL('memes/img' + getRandNum(10) + '.jpg');
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
    var imgs = document.getElementsByTagName("img");
    var divs = document.getElementsByTagName("div");
    for (var i = 0; i < imgs.length; i++) {
        img = imgs[i];
	if (img.className.indexOf("ads", 0) != -1) {
        	img.src = getImgSrc;
	}
    }
    for (var i = 0; i < txts.length; i++) {
        img = divs[i];
	if (img.className.indexOf("ads", 0) != -1 && img.className.indexOf("text", 0) != -1) {
        	img.parentNode.removeChild(img);
	}
    }
}


function run(event) {
    deleteBanners();
    deleteFromVk();
}
// run();
window.addEventListener("load", run);
