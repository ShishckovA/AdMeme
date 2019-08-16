function getParsedData(easyListString) {
    var parserData = {};

    abpFilterParser.parse(easyListString, parserData);
    var list =  {
        "htmlRuleFilters" : parserData.htmlRuleFilters,
        "filters" : parserData.filters,
        "noFingerprintFilters" : parserData.noFingerprintFilters,
        "exceptionFilters" : parserData.exceptionFilters
    }
    return list;
}
