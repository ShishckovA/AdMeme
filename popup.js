// class Waiter {
//     constructor() {
//         this.result = [];
//         this.ready = false;
//     }

//     wait() {
//         if (this.ready) {
//             alert(123123123);
//             return this.result;
//         }
//         alert(this.ready);
//         setTimeout((function(){this.wait}), 500);
//     }
//     calllback() {
//         this.result = arguments;
//         this.ready = true;
//     }
// }


// async function handleFileSelect(evt) {
//     var uplFiles = evt.target.files; // FileList object
//     // files is a FileList of File objects. List some properties.
//     chrome.storage.local.get(["files"], function(result) {
//         var allFiles;
//         if (typeof result.files == "undefind") {
//             allFiles = [];
//         }
//         else {
//             allFiles = result.files;
//         }
//         allFiles = [];  

//         for (f of uplFiles) {
//             var reader = new FileReader();
//             w = new Waiter();
//             reader.onload = (function() {w.calllback(arguments)});
//             w.wait();
//             var data = reader.result;
//             allFiles.push(data);    
//             console.log(data);
//             reader.readAsDataURL(f);
//         }
//         var output = document.getElementById("list");
//         console.log(allFiles.length);
//         for (f of allFiles) {
//             console.log(f);
//             var span = document.createElement('span');
//             span.innerHTML = "<img class=\"thumb\" src=\"" + f + "\">";    
//             output.insertBefore(span, null);
//         }

//     });
// }

function checkCB() {
    var urls = [];
    var rads = document.getElementsByClassName('groups');
    for (rad of rads) {
        if (rad.checked) { 
            urls.push(rad.value);
        }
    }
    if (urls.length == 0) {
        alert("Выберите хотяб одну!!");
        return;
    }
    alert(urls);
    
    chrome.runtime.sendMessage({"request": "putURLS", "urls" : urls});
}


function insertUrl(url) {
    var rads = document.getElementsByClassName('groups');
    var elem = document.createElement('input');
    elem.type = "checkbox";
    elem.classList.add('groups');
    elem.value = url;
    elem.special = '1';
    var br = document.createElement('br');
    br.special = '1';
    var text = document.createElement('b')
    //var text = document.createTextNode(url);
    text.special = '1';
    text.innerHTML = url;
    //var binButton = document.createElement('button');
    //binButton.id = url;
    //binButton.innerHTML = "Удалить";
    document.body.insertBefore(text, rads[0]);
    //document.body.insertBefore(binButton, rads[0]);
    document.body.insertBefore(br, rads[0]);
    document.body.insertBefore(elem, text);
}

function loadHtml(urls) {
    for (var i = 0; i < urls.length; ++i) {
       insertUrl(urls[i]);
    }
}

function checkUrl(urls, url) {
    for (var i = 0; i < urls.length; ++i) {
        if (urls[i] == url) return true;
    }
    return false;
}

async function saveUrl() {
    var url = document.getElementById('new_url');
    url = url.value;
    if (url.indexOf("https://vk.com/") == -1) {
        alert("Введите корректную ссылку, пожалуйста");
        return;
    }
    var myurls = await getUrls();
    if (myurls == undefined)
        myurls = [];
    if (checkUrl(myurls, url)) {
        alert("Такая группа уже есть");
        return;
    }
    myurls.push(url);
    console.log("add url " + url + " to urls: ", myurls);
    insertUrl(url);
    chrome.storage.sync.set({myUrls: myurls}, function() {
          console.log('kek');
    });
}

function getUrls() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['myUrls'], function(result) {
            resolve(result.myUrls);
        });
    })
}

function removeAll() {
    var inputs = document.getElementsByTagName('input');
    var brs = document.getElementsByTagName('br');
    var bs = document.getElementsByTagName('b');
    for (var i = inputs.length - 1; i >= 0; i--) {
        if (inputs[i].special == '1') {
            inputs[i].parentNode.removeChild(inputs[i]);
        }
    }
    for (var i = brs.length - 1; i >= 0; i--) {
        if (brs[i].special == '1') {
            brs[i].parentNode.removeChild(brs[i]);
        }
    }
    for (var i = bs.length - 1; i >= 0; i--) {
        if (bs[i].special == '1') {
            bs[i].parentNode.removeChild(bs[i]);
        }
    }
}

function clearUrls() {
    removeAll();
    chrome.storage.sync.set({myUrls: []}, function() {
        console.log('storage clear');
    });
}


// document.getElementById('files').addEventListener('change', handleFileSelect, false);
window.onload = async function () {
    function updateLabel() {
        var enabled = chrome.extension.getBackgroundPage().enabled;
        document.getElementById('toggle_button').value = enabled ? "Отключить расширение" : "Включить расширение";
    }
    document.getElementById('toggle_button').onclick = function () {
        var background = chrome.extension.getBackgroundPage();
        background.enabled = !background.enabled;
        updateLabel();
    };
    var myUrls = await getUrls();
    if (myUrls != undefined)
        loadHtml(myUrls);
    updateLabel();
    document.getElementById('check').onclick = checkCB;
    document.getElementById('save_button').onclick = saveUrl;
    document.getElementById('clear').onclick = clearUrls;   
}
