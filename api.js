/* global $ */
// provide information that is ready to be used - JSON format
'use strict';

const api = (function () {

    const fdaUrl = "https://api.fda.gov/drug/label.json?search=";

    function getFdaData(field, input, failureCallback, limit=1) {

        return (
            
            fetch(fdaUrl + searchString(field,input)+ `&limit=${limit}`)
            .catch(error=>failureCallback(error))

        );

    }

    function getNewsData(companyName,failureCallback,pageSize=20,page=1){

        const q = companyName + ' AND drug';
        const url = `https://newsapi.org/v2/everything?language=en&apiKey=8454a788c9ee43aaa925a9c288118ed7&q=
            ${q}&sortBy=popularity&pageSize=${pageSize}&page=${page}`;
        
        return (

            fetch(url)
            .catch(error=>failureCallback(error))
        );
    }

    function paginateNews(companyName,dataContainer,pageContainer,loadingCallback,displayCallback){

        const query = companyName + ' AND drug'
        const url = `https://newsapi.org/v2/everything?language=en&apiKey=8454a788c9ee43aaa925a9c288118ed7&q=
            ${query}&sortBy=popularity`;
    
        $(pageContainer).pagination({
            dataSource: url,
            locator: 'articles',
            totalNumberLocator: function(response){
                console.log(response.totalResults)
                return response.totalResults
            },
            pageSize:10,
            alias: {
                pageNumber: 'page'
                // pageSize: 'limit'
            },
            ajax: {
                beforeSend: loadingCallback
            },
            callback: function(data, pagination) {
                console.log(data)
                var html = displayCallback(data);
                $(dataContainer).html(html);
            }
        })
    }
  
  return { 
      
    getFdaData,
    getNewsData,
    paginateNews

  };
}());

function searchString(field,term){
    let temp = (typeof(term)==='string') ? term:term.toString();
    const strArray = temp.toLowerCase().split(/[ ,.&]/).filter(Boolean).map(item=>field+':'+item);
    return strArray.join('+AND+')
};

