function run(event) {
    var imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
        img = imgs[i];

        img.src = chrome.extension.getURL('meme.jpg');
    }
}

window.addEventListener("load", run);