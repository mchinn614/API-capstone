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
        console.log(url)
        $(pageContainer).pagination({
            dataSource: url,
            locator: locator,
            totalNumberLocator: function(response){
                console.log(response[`${resultNum}`])
                return response[`${resultNum}`]
            },
            pageSize:pageSize,
            alias: alias,
            ajax: {
                beforeSend: loadingCallback
            },
            callback: function(data, pagination) {
                    console.log(data)
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