<<<<<<< HEAD
async function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    // files is a FileList of File objects. List some properties.
    var output = [];
    chrome.storage.local.get(["files"], function(result) {
        var allfiles = result.files;
        if (typeof allfiles == "undefined") {
            allfiles = [];
        }
        for (var i = 0, f; f = files[i]; i++) {
            output.push('<li><strong>', (f.name), '</strong> (', f.type || 'n/a', ') - ',
                      f.size, ' bytes, last modified: ',
                      f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                      '</li>');
            allfiles.push({f});
            for (var t in f) {
                console.log(t, f[t]);
                console.log(f.text());
            }
        }
        chrome.storage.local.set({"files": allfiles}, function() {
          // console.log('Value is set to ');
        });   
        document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

        chrome.storage.local.get(["files"], function(result) {
            console.log(result.files.length);
            console.log(result.files);
        });
    });
}
document.getElementById('files').addEventListener('change', handleFileSelect, false);
=======
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
>>>>>>> 5c085bbcdc613d4f5f375b58428c5aeab48362ba
