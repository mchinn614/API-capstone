// functions used to call OpenFDA API and News API
'use strict';

const api = (function () {

    const fdaUrl = "https://api.fda.gov/drug/label.json?search=";

    function getFdaData(field, input, failureCallback, limit=1) {

        return (
            
            fetch(fdaUrl + utils.searchString(field,input)+ `&limit=${limit}`)
            .catch(error=>failureCallback(error))

        );

    }

    function paginateNews(companyName,dataContainer,pageContainer,loadingCallback,displayCallback){

        const query = companyName + ' AND drug'
        const url = `https://newsapi.org/v2/everything?language=en&apiKey=8454a788c9ee43aaa925a9c288118ed7&q=
            ${query}&sortBy=popularity`;
        const alias = {
            pageNumber:'page',
        }

        const pageSize = 10;

        utils.paginate(url,'articles','totalResults',pageContainer,dataContainer,pageSize,alias,loadingCallback,displayCallback);
    
    }

 
  return { 
      
    getFdaData,
    paginateNews

  };
}());


