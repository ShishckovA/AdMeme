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
    var imgs = document.getElementsByTagName("img");
    var divs = document.getElementsByTagName("div");
    //var inses = document.getElementsByTagName("ins");
    for (var i = 0; i < imgs.length; i++) {
        img = imgs[i];
	//img.src = chrome.extension.getURL('memes/img' + (Math.floor(Math.random() * 10) + 1) + '.jpg');
	if (img.className.indexOf("ads", 0) != -1) {
        	img.src = chrome.extension.getURL('memes/img' + (Math.floor(Math.random() * 10) + 1) + '.jpg');
	}
    }
    for (var i = 0; i < txts.length; i++) {
        img = divs[i];
	//img.src = chrome.extension.getURL('memes/img' + (Math.floor(Math.random() * 10) + 1) + '.jpg');
	if (img.className.indexOf("ads", 0) != -1 && img.className.indexOf("text", 0) != -1) {
        	img.parentNode.removeChild(img);
	}
    }
}

function run(event) {
    deleteBanners();
    deleteFromVk();
}

window.addEventListener("load", run);
