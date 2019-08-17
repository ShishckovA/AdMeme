async function handleFileSelect(evt) {
    var uplFiles = evt.target.files; // FileList object
    // files is a FileList of File objects. List some properties.
    chrome.storage.local.get(["files"], function(result) {
        var allFiles;
        if (typeof result.files == "undefind") {
            allFiles = [];
        }
        else {
            allFiles = result.files;
        }
        allFiles = [];  

        for (f of uplFiles) {
            var reader = new FileReader();
            reader.onload = function(progressEvent) {
                var data = reader.result;
                allFiles.push(data);
                console.log(data);
            }
            reader.readAsDataURL(f);
        }
        var output = document.getElementById("list");
        console.log(allFiles.length);
        for (f of allFiles) {
            console.log(f);
            var span = document.createElement('span');
            span.innerHTML = "<img class=\"thumb\" src=\"" + f + "\">";    
            output.insertBefore(span, null);
        }

    });
}

function IFUCKINGHATEFUCKINGJS() {

}

function PIECEOFSHIT()

document.getElementById('files').addEventListener('change', handleFileSelect, false);
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
}