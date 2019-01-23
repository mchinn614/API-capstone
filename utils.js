"use strict";

const utils = (function () {

    function searchString(field, term) {
        let temp = typeof term === "string" ? term : term.toString();
        const strArray = temp
        .toLowerCase()
        .split(/[ ,.&]/)
        .filter(Boolean)
        .map(item => field + ":" + item);
        return strArray.join("+AND+");
    }

    function paginate(url,locator,resultNum,pageContainer,dataContainer,pageSize,alias,loadingCallback,displayCallback){
        $(pageContainer).pagination({
            dataSource: url,
            locator: locator,
            totalNumberLocator: function(response){
                return response[`${resultNum}`]
            },
            pageSize:pageSize,
            alias: alias,
            ajax: {
                beforeSend: loadingCallback
            },
            callback: function(data, pagination) {
                    var html = displayCallback(data);
                    $(dataContainer).html(html);
            }
        });
    
    }


return {
    searchString,
    paginate
  };
})();