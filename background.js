try {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendRequest(tab.id, {action: "getSource"}, function(source) {
            alert(source);
        });
    });
}
catch (ex) {
    alert(ex);
}