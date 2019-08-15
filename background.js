function getFile(file)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", file, false); 
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function updateRules() {
    // get ezist
    // parse ezist
    var rules = (getFile(chrome.extension.getURL('./input.txt')));
    rules = JSON.parse(rules);
}

function updateInput() {

}

var rules = getParsedData("https://easylist-downloads.adblockplus.org/ruadlist+easylist.txt");
