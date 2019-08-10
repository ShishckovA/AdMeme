function getImgSrc() {
    return chrome.extension.getURL('memes/img' + (Math.floor(Math.random() * 10) + 1) + '.jpg')
} 

function run(event) {
    deleteAdSence();
    deleteBanners();
    deleteFromVk();
}

window.addEventListener("load", run);
