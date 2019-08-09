function run(event) {
    var imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
        img = imgs[i];
        img.src = "http://www.sickchirpse.com/wp-content/uploads/2012/04/Nic-Cages-Face.jpg";
    }
}

window.addEventListener("load", run);