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

    function getNewsData(companyName,failureCallback,pageSize=10,page=1){

        const q = companyName + ' AND drug';
        const url = `https://newsapi.org/v2/everything?language=en&apiKey=8454a788c9ee43aaa925a9c288118ed7&q=
            ${q}&sortBy=popularity&pageSize=${pageSize}&page=${page}`;
        
        return (

            fetch(url)
            .catch(error=>failureCallback(error))
        );
    }
  
  return { 
      
    getFdaData,
    getNewsData

  };
}());

function searchString(field,term){
    let temp = (typeof(term)==='string') ? term:term.toString();
    const strArray = temp.toLowerCase().split(/[ ,.&]/).filter(Boolean).map(item=>field+':'+item);
    return strArray.join('+AND+')
};
