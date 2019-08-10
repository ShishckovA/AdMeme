function deleteAdSence () {
    //Lesha
    var divs = document.getElementsByTagName("script");
    for (var i = 0; i < divs.length; i++) {
        div = divs[i];
        srcURL = div.innerHTML;
        if (srcURL.indexOf("adsbygoogle") != -1) {
            div.outerHTML = "<img src=\"" + chrome.extension.getURL('memes/img' + (Math.floor(Math.random() * 10) + 1) + '.jpg') + "\">";
            alert(div.id);
        }
    }
}

function deleteBanners () {
    //Natasha
}

function deleteFromVk() {
    //Petka
}


function run(event) {
    deleteAdSence();
    deleteBanners();
    deleteFromVk();
}
// run();
window.addEventListener("load", run);
