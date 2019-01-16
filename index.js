'use strict'

/*
App will accept input from search bar and return results for news related to 
pharmaceutical company and list other drugs that company manufactures

OpenFDA and NEWS API are used 

separate API request to api.js

*/

$(handleSubmit);

function handleSubmit(){
    $('.search-form').on('submit',event=>{
        event.preventDefault();
        $('body').removeClass('center-body');
        const userInput=$('.search').val();
        search(userInput);
    });
};

//Request all data from FDA API and then determine if manufacturer name matches userInput
//if manufacturer name matches userInput, then getNewsData
// or there is 1 result for brand name or generic name endpoints, then get manufacturer name and getNewsData
//if generic userInput contained within generic or brand name, then determine number of results
//if zero, then display message stating that no results were found
//if more than one result is found, then renderMultipleReults (company name, drug name)
//byId will use search=id: endpoint if user chooses drug from list

function search(input){
    $('section').empty();
    Promise.all([
        api.getFdaData("openfda.manufacturer_name",input,displayApiError),
        api.getFdaData("openfda.brand_name",input,displayApiError),
        api.getFdaData("openfda.generic_name",input,displayApiError)
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
                renderData(responseJson);
            }
            else if (numResults[i]>1){
                renderMultipleResults(responseJson[i],numResults[i])
                break
            }
        }
      })
      .catch(error=>displayUnknownError(error))
}

// function getFdaData(input, byId = 0) {
//     $('section').empty();
//     const fdaUrl = "https://api.fda.gov/drug/label.json?search=";
//     if (byId === 1) {
//       fetch(fdaUrl + 'id:' + input)
//       .then(response=>response.json())
//       .then(responseJson=>{
//         const companyName = responseJson.results[0].openfda.manufacturer_name;
//         getNewsData(companyName)
//         .then(newsData=>JSON.parse(JSON.stringify(newsData)))
//         .then(newsDataJson => {
//             renderCompanyNews(companyName,newsDataJson)
//         })
//         .catch(error=>displayError(error));
//         renderCompanyDrugList(companyName);
//       })
//     } else {
//       Promise.all([
//         fetch(fdaUrl + "openfda.manufacturer_name:" + input),
//         fetch(fdaUrl + "openfda.brand_name:" + input),
//         fetch(fdaUrl + "openfda.generic_name:" + input)
//       ])
//       .then(results => {
//         const response = results.filter(item=>item.ok).map(item=>item.json());
//         return Promise.all(response);
//       })
//       .then(responseJson=>{
//         // extract result number, company name, brand name, description,  
//         const numResults = responseJson.map(item=>item.meta.results.total);
//         for (let i=0;i<numResults.length;i++){
//             if (numResults[i]===1){
//                 const companyName = responseJson[i].results[0].openfda.manufacturer_name;
//                 getNewsData(companyName)
//                 .then(newsData=>JSON.parse(JSON.stringify(newsData)))
//                 .then(newsDataJson => renderCompanyNews(companyName,newsDataJson))
//                 .catch(error=>displayError(error));
//                 renderCompanyDrugList(companyName);
//                 break

//             }
//             else if (numResults[i]>1){
//                 renderMultipleResults(responseJson[i],numResults[i])
//                 break
//             }
//         }
//       })
//       .catch(error=>displayError(error))
//     }
// }





//if more than one result of getFdaData is found, then show results (pagination??)
function renderMultipleResults(resultsJson,numResults){
    const limit = (numResults<99) ? numResults:99;
    api.getFdaData('openfda.manufacturer_name',resultsJson.results[0].openfda.manufacturer_name,limit)
    .then(response=>response.json())
    .then(responseJson=>{
        $('.drug-list').empty();
        $('.drug-list').append(`<h5>Multiple results found. Please select company from list.</h5>`)
        let companyList =[];
        for (let i=0;i<responseJson.results.length;i++){
            let companyName = responseJson.results[i].openfda.manufacturer_name[0];
            let id = responseJson.results[i].id;
            if (companyName.indexOf($('.search').val()>=0) && !companyList.includes(companyName.split(/[ ,.]/).join('').toLowerCase())){
                companyList.push(companyName.split(/[ ,.]/).join('').toLowerCase());
                $('.drug-list').append(
                    `<button id='companyButton' class='${id}'>${companyName}</button>`);
            }
        }
    
        $(handleSelection);
    })
    .catch(error=>displayError(error))

};

//when company is chosen by user, then handle selection, use getFdaData function by ID
function handleSelection(){
    $('#companyButton').on('click',function(){
        //api.getFdaData(input, id, api.getNewsData)
        api.getFdaData('id',$(this).attr('class'),displayApiError)
        .then(response=>response.json())
        .then(responseJson=>renderData(responseJson))
        .catch(error=>displayError(error));

        })

};

function renderData(json){
    const companyName = json[i].results[0].openfda.manufacturer_name;
    api.getNewsData(companyName,displayApiError)
    .then(newsData=>JSON.parse(JSON.stringify(newsData)))
    .then(newsDataJson => renderCompanyNews(companyName,newsDataJson))
    .catch(error=>displayUnknownError(error));

    renderCompanyDrugList(companyName);
}

function renderCompanyNews(companyName,newsJson){
    $('.news').append(`<h3>News About ${companyName}</h3>`);
    const articles = newsJson.articles;
    for (let i=0;i<articles.length;i++){
        $('.news').append(
            `<a href=${articles[i].url} target='_blank'>
                <ul>${articles[i].title}
                    <div class ='news-wrapper'>
                        <li class='news-source'>${articles[i].source.name}</li>
                        <li class-'news-date'>${Date(articles[i].publishedAt)}</li> 
                    </div>   
                </ul>
            </a>`)
    }
    
};

//need pagination
function renderCompanyDrugList(companyName){
    api.getFdaData('openfda.manufacturer_name',companyName,displayApiError,10)
    .then(response=>response.json())
    .then(responseJson=>{
        $('.drugs').append(`<h3>Medicines made by ${companyName}</h3>`)
        for (let i=0;i<responseJson.results.length;i++){
            $('.drugs').append(
                `<button type='submit' class='drug-name'>
                    <h4>
                    ${responseJson.results[i].openfda.brand_name} (
                    ${responseJson.results[i].openfda.generic_name})
                    </h4>
                    <p class='hide'>${responseJson.results[i].description}</p>
                </button>`
            )
        }
        $(toggleDrugDescription);
    })
    .catch(error=>displayError(error))
};

function toggleDrugDescription(){
    $('.drug-name').on('click',function(){
        const display = $(this).find("p").attr('class');
        if (display==='hide') {
            $(this).find("p").removeClass('hide');
            // $(this).find("p").addClass('show');
            $(this).addClass('show')
        } 
        else{
            $(this).removeClass('show');
            $(this).find("p").addClass('hide');
        }
    })
};


function displayUnknownError(error){
    $('section').each(section=>$('section').empty());
    $('form').append(`<p class='error'>Unknown Error</p>`)
}


function displayApiError(error){
    $('section').each(section=>$('section').empty());
    $('form').append(`<p class='error'>${error.message}</p>`)
};

