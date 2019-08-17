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


// document.getElementById('files').addEventListener('change', handleFileSelect, false);
window.onload = function () {
	function updateLabel() {
		var enabled = chrome.extension.getBackgroundPage().enabled;
		document.getElementById('toggle_button').value = enabled ? "Disable" : "Enable";
	}
	document.getElementById('toggle_button').onclick = function () {
		var background = chrome.extension.getBackgroundPage();
		background.enabled = !background.enabled;
		updateLabel();
	};
	updateLabel();
    document.getElementById('check').onclick = checkCB;
}

