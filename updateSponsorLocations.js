const fs = require('fs');
const fetch = require('node-fetch');
const stringSimilarity = require('string-similarity');
const sponsors = require('./src/screens/SearchPage/latest.json');

const fetchCompanies = async (companyName) => {
    const targetUrl = `https://api.company-information.service.gov.uk/advanced-search/companies?company_name_includes=${encodeURIComponent(companyName)}`;
    console.log(`Fetching from: ${targetUrl}`);
    const response = await fetch(targetUrl, {
      headers: {
          'Authorization': '362599da-f055-4e24-b3dc-931bb18dfa99',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
    });
    if (!response.ok) {
      console.error(`Error fetching data: ${response.status}`);
      return { items: [] };
    }
    try {
      return await response.json();
    } catch (error) {
      console.error(`Error parsing JSON: ${error}`);
      return { items: [] };
    }
  };

const fetchGeocode = async (postalCode) => {
  const targetUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=AIzaSyDafs_zu5GrGTqiPRnkDtdTyhsbwtxkB5o`;
  const response = await fetch(targetUrl);
  return response.json();
};



const BATCH_SIZE = 100;
const DELAY_BETWEEN_BATCHES_MS = 1000 * 2; // 10 seconds

const updateSponsorLocations = async () => {
//   const sponsorsSubset = sponsors.slice(0, 5); // Only take the first 10 sponsors
  for (let i = 0; i < sponsors.length; i += BATCH_SIZE) {
    const batch = sponsors.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (sponsor, index) => {
      try {
        const companyName = sponsor["Organisation Name"].split(' ').slice(0, 4).join(' ');

        const companiesHouseData = await fetchCompanies(companyName);

        if (companiesHouseData.items && companiesHouseData.items.length > 0) {
          const bestMatch = companiesHouseData.items.reduce((bestMatch, company) => {
            const similarity = stringSimilarity.compareTwoStrings(
              company.company_name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toUpperCase(),
              sponsor["Organisation Name"].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toUpperCase()
            );
            return similarity > bestMatch.similarity ? { company, similarity } : bestMatch;
          }, { company: null, similarity: 0 });

          if (bestMatch.company) {
            const postalCode = bestMatch.company.registered_office_address.postal_code;

            const geocodingData = await fetchGeocode(postalCode);

            if (geocodingData.results.length > 0) {
              const location = geocodingData.results[0].geometry.location;
              sponsors[i + index] = {
                ...sponsor,
                location
              };
            }
          }
        }
      } catch (error) {
        console.error(`Error updating location for sponsor: ${sponsor["Organisation Name"]}`);
        console.error(error);
      }
    }));

    // Write the updated sponsors array to a file after each batch
    fs.writeFileSync('./src/screens/SearchPage/latest.json', JSON.stringify(sponsors, null, 2));

    // Delay between batches to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES_MS));
  }

  // Terminate the script after processing all sponsors
  process.exit(0);
};

// Schedule the update script to run every 14 hours
setInterval(updateSponsorLocations, 14 * 60 * 60 * 1000);


// Run the script immediately
updateSponsorLocations();
