/* global $ */
// provide information that is ready to be used - JSON format
'use strict';

const api = (function () {

    const fdaUrl = "https://api.fda.gov/drug/label.json?search=";

    function getFdaData(field, input, failureCallback, limit=1) {

        console.log(fdaUrl + utils.searchString(field,input)+ `&limit=${limit}`)

        return (
            
            fetch(fdaUrl + utils.searchString(field,input)+ `&limit=${limit}`)
            .then(response=>response.json())
            .catch(error=>failureCallback(error))

        );

    }

    function getNewsData(companyName,pageSize=20,page=1,failureCallback){

        const q = companyName + ' AND drug';
        const url = `https://newsapi.org/v2/everything?language=en&apiKey=8454a788c9ee43aaa925a9c288118ed7&q=
            ${q}&sortBy=popularity&pageSize=${pageSize}&page=${page}`;

        return (

            fetch(url)
            .then(response=>response.json())
            .catch(error=>failureCallback(error))
        );
    }
  
  return { 
      
    getFdaData,
    getNewsData

  };
}());

// function searchString(field,term){
//     const strArray = term[0].toLowerCase().split(/[ ,.&]/).filter(Boolean).map(item=>field+':'+item);
//     return strArray.join('+AND+')
// };