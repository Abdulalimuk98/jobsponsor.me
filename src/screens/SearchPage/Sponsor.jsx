import React, { useState, useEffect, useCallback } from 'react';
import stringSimilarity from 'string-similarity';
import sicCodes from './sicCodes';
import sicCodeTitles from './sicCodeTitles.json';
import axios from 'axios';
import './style.css';
import MapComponent from './MapComponent'; 
import SearchPage from './SearchPage';


const Sponsor = ({ sponsor }) => {
  const [logoColor, setLogoColor] = useState('');
  const [emoji, setEmoji] = useState('');
  const [industryTitle, setIndustryTitle] = useState(''); // Add this line
  const [companyNumber, setCompanyNumber] = useState(null);
  const [postalCode, setPostalCode] = useState(null);
  const [coordinates, setCoordinates] = useState(null);




  useEffect(() => {
    setLogoColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
  }, [sponsor]);

  const logoUrl = sponsor ? `https://ui-avatars.com/api/?name=${encodeURIComponent(sponsor["Organisation Name"])}&background=${logoColor.slice(1)}&color=fff&size=512` : '';

  function capitalizeFirstAlphaNumeric(str) {
    let found = false;
    return str.toLowerCase().replace(/./g, (char) => {
      if (!found && /[a-z0-9]/i.test(char)) {
        found = true;
        return char.toUpperCase();
      }
      return char;
    });
  }

  let sponsorName = sponsor ? (sponsor["Organisation Name"]) : '';
  let city = sponsor ? capitalizeFirstAlphaNumeric(sponsor["Town/City"]) : '';


useEffect(() => {
  const proxyUrl = 'https://morning-forest-98492-a0c1be7ff19a.herokuapp.com/';
  const fullSponsorName = sponsorName;

  const fetchCompanies = (name) => {
    const targetUrl = `https://api.company-information.service.gov.uk/advanced-search/companies?company_name_includes=${encodeURIComponent(name)}`;
    return fetch(proxyUrl + targetUrl, {
      headers: {
        'Authorization': '362599da-f055-4e24-b3dc-931bb18dfa99',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
    })
    .then(response => response.json())
    .catch(error => {
      // console.error(error);
    });
  }

const first4WordsOfSponsorName = fullSponsorName.split(' ').slice(0, 4).join(' ');

fetchCompanies(first4WordsOfSponsorName)
.then(data => {
  if (data) {
    // console.log('Companies:', data.items); // Check the companies returned by the API
    if (data.items && data.items.length > 0) {
      const bestMatch = data.items.reduce((bestMatch, currentCompany) => {
        if (currentCompany.company_name) {
          // Preprocess the company names
          const preprocessedFullSponsorName = fullSponsorName.replace(/[.,\/#!$%\^*;:{}=\-_`~()]/g,"").replace(/\s+/g, '').toUpperCase().replace(/\bLTD\b/g, "LIMITED");
          const preprocessedCurrentCompanyName = currentCompany.company_name.replace(/[.,\/#!$%\^*;:{}=\-_`~()]/g,"").replace(/\s+/g, '').toUpperCase().replace(/\bLTD\b/g, "LIMITED");

          // console.log('Comparing:', preprocessedFullSponsorName, 'and', preprocessedCurrentCompanyName); // Check the strings being compared

          const currentSimilarity = stringSimilarity.compareTwoStrings(preprocessedFullSponsorName, preprocessedCurrentCompanyName);
          // console.log('Similarity:', currentSimilarity); // Check the similarity score

          return currentSimilarity > bestMatch.similarity ? {company: currentCompany, similarity: currentSimilarity} : bestMatch;
        } else {
          return bestMatch;
        }
      }, {company: null, similarity: 0});
      // console.log(bestMatch);
      
      // Get the SIC code of the best matched company
      const sicCode = bestMatch.company.sic_codes[0];
      const companyNumber = bestMatch.company.company_number; // Define ccompany_number here
      const postalCode = bestMatch.company.registered_office_address.postal_code;

      // console.log('Fetched postal code:', postalCode);

      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=AIzaSyDafs_zu5GrGTqiPRnkDtdTyhsbwtxkB5o`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setCoordinates({ lat: location.lat, lng: location.lng });
        }
      })
      .catch(error => console.error('Error fetching geocoding data:', error));

      let industryTitle = '';
      for (let section in sicCodeTitles) {
        const range = sicCodeTitles[section].Range.split('-');
        const minRange = parseInt(range[0]);
        const maxRange = parseInt(range[1]);
        if (sicCode >= minRange && sicCode <= maxRange) {
          industryTitle = sicCodeTitles[section].Title.split(';')[0]; // Split the title on ';' and take the first part
          break;
        }
      }

      const emoji = sicCodes[sicCode];


      setEmoji(emoji);
      setIndustryTitle(industryTitle);
      setCompanyNumber(companyNumber);
      setPostalCode(postalCode);


    }
  } else {
    // console.log('No data returned from fetchCompanies');

    // console.log(sponsorName); 
    // console.log(companyNumber); 

  }
})
.catch(error => {
  // console.error('Error fetching companies:', error);
});
}, [sponsorName]);


return (
  <div className="sponsor">
    {sponsor ? (
      <>
        <img className="logo" src={logoUrl} alt="Logo" style={{backgroundColor: logoColor}} />
        <div className='right-column'>
        <h2 className="sponsor-name">{sponsorName} </h2>
        <p className="city">City: {city}</p>
        <p className="type">Type/Rating: {sponsor["Type & Rating"]}</p>
        <p className="emoji">{emoji} <span className='industryTitle'>{industryTitle}</span></p>
        <p hidden={true} > {companyNumber} </p>
        <div hidden={true}>
          <MapComponent coordinates={coordinates} sponsorName={sponsorName} />
        </div>
        </div>
      </>
    ) : (
      <p>Loading...</p>
    )}
  </div>

  );
}

export default Sponsor;