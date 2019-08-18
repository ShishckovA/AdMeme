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
    var elem = document.createElement('label');
    elem.classList.add('container');
    elem.classList.add('special');
    elem.innerHTML = '<input type="checkbox" value="' + url + '">' + name + '<span class="checkmark"></span>';
}

function getChecked() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['memoryUrls'], function(result) {
            resolve(result.memoryUrls);
        });
    })
}

async function loadMy(urls) {
    for (var i = 0; i < urls.length; ++i) {
       insertUrl(urls[i][0], urls[i][1]);
    }
}

function loadDefault(urls) {
    for (var i = 0; i < urls.length; ++i) {
       insertUrl(urls[i][0], urls[i][1]);
    }
}

async function putChecks() {
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
    var defaulturls = await getDefautl();
    if (myurls == undefined)
        myurls = [];
    if (checkUrl(myurls, url) || checkUrl(defaulturls, url)) {
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

function getDefault() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({"request": "defaultUrls"}, async function(result) {
            resolve(result.defaultUrls);
        });
    });
}

function removeAll() {
    var elems = document.getElementsByClassName('special');
    for (var i = elems.length - 1; i >= 0; i--) {
        elems[i].parentNode.removeChild(elems[i]);
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
    var myUrls = await getUrls();
    var defaultUrls = await getDefault();
    loadDefault(defaultUrls);
    if (myUrls != undefined)
        loadMy(myUrls);
    putCheckes();
    updateLabel();
    document.getElementById('apply_button').onclick = checkCB;
    document.getElementById('small_btn blue').onclick = saveUrl;
    document.getElementById('btn blue').onclick = clearUrls;   
}
