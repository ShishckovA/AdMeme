function run(event) {
    var imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
        img = imgs[i];

        img.src = chrome.extension.getURL('memes/img' + (Math.floor(Math.random() * 10) + 1) + '.jpg');
    }
}

window.addEventListener("load", run);
