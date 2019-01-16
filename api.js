/* global $ */
// provide information that is ready to be used - JSON format
'use strict';

const api = (function () {

    const fdaUrl = "https://api.fda.gov/drug/label.json?search=";

    function getFdaData(input, byId = 0, getNewsData, renderCompanyDrugList) {
        $('section').empty(); //responsibility - separate DOM maninpulation and event listeners from api request
        if (byId === 1) {
          fetch(fdaUrl + 'id:' + input)
          .then(response=>response.json())
          .then(responseJson=>{
            const companyName = responseJson.results[0].openfda.manufacturer_name;
            getNewsData(companyName)
            .then(newsData=>JSON.parse(JSON.stringify(newsData)))
            .then(newsDataJson => {
                renderCompanyNews(companyName,newsDataJson)
            })
            .catch(error=>displayError(error));
            renderCompanyDrugList(companyName);
          })
        } else {
          Promise.all([
            fetch(fdaUrl + "openfda.manufacturer_name:" + input),
            fetch(fdaUrl + "openfda.brand_name:" + input),
            fetch(fdaUrl + "openfda.generic_name:" + input)
          ])
          .then(results => {
            const response = results.filter(item=>item.ok).map(item=>item.json());
            return Promise.all(response);
          })
          .then(responseJson=>{
            // extract result number, company name, brand name, description,  
            const numResults = responseJson.map(item=>item.meta.results.total);
            for (let i=0;i<numResults.length;i++){
                if (numResults[i]===1){
                    const companyName = responseJson[i].results[0].openfda.manufacturer_name;
                    getNewsData(companyName)
                    .then(newsData=>JSON.parse(JSON.stringify(newsData)))
                    .then(newsDataJson => renderCompanyNews(companyName,newsDataJson))
                    .catch(error=>displayError(error));
                    renderCompanyDrugList(companyName);
                    break
    
                }
                else if (numResults[i]>1){
                    renderMultipleResults(responseJson[i],numResults[i])
                    break
                }
            }
          })
          .catch(error=>displayError(error))
        }
    }
  

  
  return { 
      getFdaData

  };
}());