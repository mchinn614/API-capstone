# Know Pharma

https://mchinn614.github.io/KnowPharma/

## Summary
This app enables users to learn about the pharmaceutical company that makes their medicines. 

Based on the users' search, the app will render links to current news about the pharmaceutical company and information about the type of  medicines that the company manufactures.

## How to use the app

#### Landing Page
Enter the medicine or the company name of the pharmaceutical company that you are interested in learning about.
![LandingPage](https://github.com/mchinn614/KnowPharma/blob/master/images/LandingPage.JPG "LandingPage")

#### Select Company
If prompted, select the company by clicking button.
![SelectCompany](https://github.com/mchinn614/KnowPharma/blob/master/images/SelectCompany.JPG "SelectCompany")

#### Results Page
Current news about the company and a list of medicines that the company makes will be rendered on the page
![ResultsPage](https://github.com/mchinn614/KnowPharma/blob/master/images/SearchResults.JPG "Results Page")

News results are paginated. Note that medicine results are not paginated due to complications with OpenFDA API. Pagination for these results will be in scope of future work.
![Pagination](https://github.com/mchinn614/KnowPharma/blob/master/images/Pagination.JPG "Pagination")

User may click on each drug to display information about the condition that the medicine is intended to treat and the medicine's intended usage. To start over, the user may click the "clear search" button.
![DrugIndication](https://github.com/mchinn614/KnowPharma/blob/master/images/DrugIndication.JPG "DrugIndication")

## Technology Used
The Know Pharma app uses jQuery, javascript, HTML, and CSS. The data are pulled from the News API and the OpenFDA API. Pagination was implemented using the pagination.js library for the News API.
