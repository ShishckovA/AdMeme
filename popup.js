function checkCB() {
    var urls = [];
    var dict = {};
    var rads = document.getElementsByClassName('groups');
    for (rad of rads) {
        if (rad.checked) { 
            urls.push(rad.value);
        }
        dict[rad.value] = rad.checked;
        console.log(rad.value, rad.checked);
    }
    if (urls.length == 0) {
        alert("Выберите хотяб одну!!");
        return;
    }
    alert(urls);
    chrome.runtime.sendMessage({"request": "putURLS", "urls" : urls});
    chrome.storage.sync.set({memoryUrls: dict}, function() {
          console.log('remembered');
    });
}


function insertUrl(url, name) {
    var rads = document.getElementsByClassName('groups');
    var elem = document.createElement('input');
    elem.type = "checkbox";
    elem.classList.add('groups');
    elem.value = url;
    elem.special = '1';
    var br = document.createElement('br');
    br.special = '1';
    var text = document.createElement('b')
    text.special = '1';
    text.innerHTML = name;
    document.body.insertBefore(text, rads[0]);
    document.body.insertBefore(br, rads[0]);
    document.body.insertBefore(elem, text);
}

function getChecked() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['memoryUrls'], function(result) {
            resolve(result.memoryUrls);
        });
    })
}

async function loadHtml(urls) {
    for (var i = 0; i < urls.length; ++i) {
       insertUrl(urls[i][0], urls[i][1]);
    }
    var mem = await getChecked();
    if (mem != undefined) {
        var rads = document.getElementsByClassName('groups');
        for (var i = 0; i < rads.length; ++i) {
            rads[i].checked = mem[rads[i].value];
        }
    }
}

function checkUrl(urls, url) {
    for (var i = 0; i < urls.length; ++i) {
        if (urls[i][0] == url) return true;
    }
    if (url == "https://vk.com/dank_memes_ayylmao" || url == "https://vk.com/4ch" || url == "https://vk.com/borsch" || url == "https://vk.com/mudakoff" || url == "https://vk.com/oroom") return true;
    return false;
}

function isCorrect(url) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({"request": "isCorrect", "url" : url}, async function(result) {
            resolve(result.Name);
        });
    });
}

async function saveUrl() {
    var url = document.getElementById('new_url');
    url = url.value;
    var correct = await isCorrect(url);
    if (correct == "") {
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
    myurls.push([url, correct]);
    insertUrl(url, correct);
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
        await loadHtml(myUrls);
    updateLabel();
    document.getElementById('check').onclick = checkCB;
    document.getElementById('save_button').onclick = saveUrl;
    document.getElementById('clear').onclick = clearUrls;   
}
