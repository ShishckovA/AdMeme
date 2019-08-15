function getParsedData(easyListString) {
    let parserData = {};
    let urlToCheck = '';

    // This is the site who's URLs are being checked, not the domain of the URL being checked.
    let currentPageDomain = 'vk.com';

    abpFilterParser.parse(easyListString, parserData);
    var list =  {
        "htmlRuleFilters" : parserData.htmlRuleFilters,
        "filters" : parserData.filters,
        "noFingerprintFilters" : parserData.noFingerprintFilters,
        "exceptionFilters" : parserData.exceptionFilters
    }
    return list;
}    

