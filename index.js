'use strict'

//Searches user input against 3 OpenFDA endpoints. If more than one successful request then
//prioritize in order: manufacturer_name, brand_name, generic_name
//Next determine  is more than one companythat matches search criteria and render results accordingly
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
        console.log(responseJson)
        const numResults = responseJson.map(item=>item.meta.results.total);
        for (let i=0;i<numResults.length;i++){
            if (numResults[i]===1){
                renderData(responseJson[i]);
            }
            else if (numResults[i]>1){
                renderMultipleResults(responseJson[i],numResults[i])
                break
            }
        }
      })
      .catch(error=>displayUnknownError(error))
}


//if more than one result of search function is found, then render button for each unique company
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


//when company is chosen by user, then handle selection, use search function by ID
function handleSelection(){
    $('#companyButton').on('click',function(){
        api.getFdaData('id',$(this).attr('class'),displayApiError)
        .then(response=>response.json())
        .then(responseJson=>renderData(responseJson))
        .catch(error=>displayUnknownError(error));

        })

};

//renders news and and drug data view
function renderData(json){
    const companyName = json.results[0].openfda.manufacturer_name;
    api.getNewsData(companyName,displayApiError)
    .then(newsData=>newsData.json())
    .then(newsDataJson => renderCompanyNews(companyName,newsDataJson))
    .catch(error=>displayUnknownError(error));

    renderCompanyDrugList(companyName);
}

//renders company news
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

//renders list of drugs made by company and allows user to view indications of each medicine
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
                    <p class='hide'>${responseJson.results[i].indications_and_usage}</p>
                </button>`
            )
        }
        $(toggleDrugDescription);
    })
    .catch(error=>displayError(error))
};

//allows user to show and hide indications of drugs
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

//error handling
function displayUnknownError(error){
    $('section').each(section=>$('section').empty());
    $('form').append(`<p class='error'>Unknown Error</p>`)
}

//error handling
function displayApiError(error){
    $('section').each(section=>$('section').empty());
    $('form').append(`<p class='error'>${error.message}</p>`)
};

//callback function to start function
function handleSubmit(){
    $('.search-form').on('submit',event=>{
        event.preventDefault();
        $('body').removeClass('center-body');
        const userInput=$('.search').val();
        search(userInput);
    });
};

$(handleSubmit);