import jsonData from './latest.json';


const fetchData = async () => {

  // Check if the data is valid
  if (
    Array.isArray(jsonData) &&
    'Organisation Name' in jsonData[0] &&
    'Town/City' in jsonData[0] &&
    'Type & Rating' in jsonData[0]
  ) {
    const result = jsonData.map(record => { // Process all records
      const { 'Organisation Name': organisationName, 'Town/City': townCity, 'Type & Rating': typeRating } = record;
      return { organisationName, townCity, typeRating };
    });
    return result;
  }
};

fetchData().then(data => console.log(data)).catch(err => console.error(err));
