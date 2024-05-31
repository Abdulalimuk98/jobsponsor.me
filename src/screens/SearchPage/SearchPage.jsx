import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sponsor from './Sponsor.jsx';
import stringSimilarity from 'string-similarity';
import './style.css';
import MapComponent from './MapComponent.jsx';
import jsonData from './latest.json';
import Pagination from './Pagination.jsx';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import Skeleton from 'react-loading-skeleton';




const cities = Array.from(new Set(jsonData.map(item => item["Town/City"])));



export const SearchPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: -34.397, lng: 150.644 });
  const [userLocationFetched, setUserLocationFetched] = useState(false);
  const [userCity, setUserCity] = useState(null); // Declare userCity here
  const [filteredSponsors, setFilteredSponsors] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Add this line
  const [data, setData] = useState([]);
  const [sponsors, setSponsors] = useState([]); // Add this line`
  const [lightboxOpen, setLightboxOpen] = useState(false); // Add this line
  const [sponsor, setSponsor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSponsors, setCurrentSponsors] = useState([]);
  const [sponsorLocations, setSponsorLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMarker, setActiveMarker] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postalCode, setPostalCode] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const sponsorsPerPage = 5;


  // LIGHTBOX CONTROLS
  const openLightbox = () => {
    setLightboxOpen(true);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  const selectCity = (city) => {
    setUserCity(city);
    setLightboxOpen(false);
  };
  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );  


  // GET USERS CURRENT COORDINATES
  useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  } else {
    // console.log("Geolocation is not supported by this browser.");
  }
}, []);

  //GET MY LOCATION SO THAT THE MAP KNOWS WHERE TO SET DEFAULT
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      setUserLocationFetched(true);
    });
  }, []);



function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
const handleSearch = event => {
  setSearchTerm(event.target.value);
};
const debouncedSearchTerm = useDebounce(searchTerm, 500);



// TURN USER COORDINATES TO CITY
useEffect(() => {
  if (userLocation) {
    try {
      fetch(`https://api.opencagedata.com/geocode/v1/json?q=${userLocation.latitude}+${userLocation.longitude}&key=aa2523a201e4428b991f2f11f2f87b72`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.results && data.results.length > 0) {
            const city = data.results[0].components.city;
            setUserCity(city);
          } else {
            // console.log('Geocoder returned no results');
          }
        })
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  }
}, [userLocation]);




// FILTER SPONSORS AND UPDATE CURRENT SPONSORS
// FILTER SPONSORS AND UPDATE CURRENT SPONSORS
useEffect(() => {
  let sponsors = userCity ? jsonData.filter(row => {
    const rowCity = String(row["Town/City"]); // Get the "Town/City" property of the row and convert it to a string
    return rowCity.trim().toLowerCase() === userCity.trim().toLowerCase();
  }) : jsonData;

  if (debouncedSearchTerm) {
    sponsors = sponsors.filter(sponsor =>
      sponsor["Organisation Name"].toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      sponsor["Town/City"].toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }

  setFilteredSponsors(sponsors);
  setIsLoading(false); // Set isLoading to false after filtering

  const totalSponsors = sponsors.length;
  const totalPages = Math.ceil(totalSponsors / sponsorsPerPage);

  if (currentPage > totalPages) {
    setCurrentPage(1);
  }

  const indexOfLastSponsor = currentPage * sponsorsPerPage;
  const indexOfFirstSponsor = indexOfLastSponsor - sponsorsPerPage;
  setCurrentSponsors(sponsors.slice(indexOfFirstSponsor, indexOfLastSponsor));
}, [userCity, debouncedSearchTerm, currentPage, sponsorsPerPage]);




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


  const proxyUrl = 'https://morning-forest-98492-a0c1be7ff19a.herokuapp.com/';

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

  useEffect(() => {
    const proxyUrl = 'https://morning-forest-98492-a0c1be7ff19a.herokuapp.com/';
    const fullSponsorName = sponsorName;
  
}, []);



let sponsorLocationsArray = [];



useEffect(() => {

  setSponsorLocations([]);

  // const timer = setTimeout(() => {
    currentSponsors.forEach(sponsor => {
      let sponsorName = sponsor ? (sponsor["Organisation Name"]) : '';
      const fullSponsorName = sponsorName;
      const first4WordsOfSponsorName = fullSponsorName.split(' ').slice(0, 4).join(' ');

      fetchCompanies(first4WordsOfSponsorName)
        .then(data => {
          if (data && data.items && data.items.length > 0) {
            const bestMatch = data.items.reduce((bestMatch, currentCompany) => {
              if (currentCompany.company_name) {
                const preprocessedFullSponsorName = fullSponsorName.replace(/[.,\/#!$%\^*;:{}=\-_`~()]/g,"").replace(/\s+/g, '').toUpperCase().replace(/\bLTD\b/g, "LIMITED");
                const preprocessedCurrentCompanyName = currentCompany.company_name.replace(/[.,\/#!$%\^*;:{}=\-_`~()]/g,"").replace(/\s+/g, '').toUpperCase().replace(/\bLTD\b/g, "LIMITED");
                const currentSimilarity = stringSimilarity.compareTwoStrings(preprocessedFullSponsorName, preprocessedCurrentCompanyName);
                return currentSimilarity > bestMatch.similarity ? {company: currentCompany, similarity: currentSimilarity} : bestMatch;
              } else {
                return bestMatch;
              }
            }, {company: null, similarity: 0});

            const postalCode = bestMatch.company.registered_office_address.postal_code;

            fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=AIzaSyDafs_zu5GrGTqiPRnkDtdTyhsbwtxkB5o`)
              .then(response => response.json())
              .then(data => {
                let location;
                if (data.results && data.results.length > 0) {
                  location = data.results[0].geometry.location;



                  setSponsorLocations(prevLocations => [...prevLocations, { lat: location.lat, lng: location.lng }]);
                }
              })
              .finally(() => setIsLoading(false));
              
          }
        });
    });
  // }, 1);
  // return () => clearTimeout(timer);
}, [currentSponsors]);



// PAGINATION
const paginate = pageNumber => {
  setCurrentPage(pageNumber);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};



const resetLocation = () => {
  setUserCity('');
};


  return (
    
    <div className="search-page">

        <header className="header">
          <div className="logo-search-bar">
            <img className="logo-2" alt="Logo" src="/img/logo-3.png" />
            <div className="search-selected">
              <div className="search-bar">
                <input
                  type="text"
                  className="input"
                  placeholder="Search Company Name / City..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                  {searchTerm && (
                    <button className="clear-button" onClick={() => setSearchTerm('')}>
                      x
                    </button>
                  )}
              </div>
            </div>
          </div>

          
          <div className="navigation">
            <div className="buttons">
              <div className="text-wrapper-6">About</div>
              {/* <div className="text-wrapper-7">FAQ</div> */}
            </div>
          </div>
 
        </header>

      <div className='content'>

        <div className="sponsors">

          <div className="filter-system">
            <div className="filters">

              <div className="location">
                <div className="text-wrapper-4">{userCity !== '' ? userCity : 'All Locations'}</div>
                {userCity !== '' && <button className="all-locations" onClick={resetLocation}>x</button>}
              </div>

              <div className="industry">
                <div className="text-wrapper-5">Tech</div>
              </div>

              <img className="filter-icon" alt="Filter icon" src="/img/filter-icon.svg" onClick={openLightbox} />

              {lightboxOpen && (
                <div className="lightbox">
                  <button onClick={closeLightbox}>Close</button>
                  <input type="text" value={searchTerm} onChange={handleSearch} />
                  {filteredCities.map(city => (
                    <div key={city} onClick={() => selectCity(city)}>
                      {city}
                    </div>
                  ))}
                </div>
              )}
              
            </div>

            <div className="sponsors-in-city">{`Sponsors in ${userCity || 'All Locations'}`}</div>
            <div className="number-of-sponsors">{`${filteredSponsors.length} Sponsors Found`}</div>
          </div>


                {!isLoading && currentSponsors.map((sponsor, index) => (
            <Sponsor key={index} sponsor={sponsor} />
          ))}
              



        </div>

        <div className="map">

          <LoadScript googleMapsApiKey='AIzaSyDafs_zu5GrGTqiPRnkDtdTyhsbwtxkB5o'>
            <GoogleMap
              id="map"
              mapContainerStyle={{ height: "68vh", width: "125vh" }}
              zoom={14}
              center={currentLocation}
              onClick={() => setActiveMarker(null)}
              options={{
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }],
                  },
                ],
              }}
            >
                <Marker 
                position={currentLocation} 
                icon={{
                  path: "M74.1261 10.3086C65.5739 7.58249 56.4786 9.21814 49.9626 14.2614C43.3109 9.21814 34.4871 7.58249 25.9353 10.3086C7.47328 16.306 1.63603 37.4324 6.79453 53.5163C14.668 78.1874 40.5959 91 49.9626 91C59.0579 91 85.5291 77.9148 93.1311 53.5163C98.4254 37.4324 92.5881 16.306 74.1261 10.3086Z",
                  fillColor: "#D22B2B",
                  fillOpacity: 1,
                  strokeWeight: 0, // Add an outline
                  strokeColor: 'rgba(0, 0, 0, 0.5)', // Make the outline black with 50% opacity
                  scale: 0.3
                }}
              />
                {sponsorLocations && sponsorLocations.map((location, index) => (
                  <Marker 
                  key={index} 
                  position={{ lat: parseFloat(location.lat), lng: parseFloat(location.lng) }} 
                  onClick={() => setActiveMarker(location)}
                  icon={{
                    path: "M74.1261 10.3086C65.5739 7.58249 56.4786 9.21814 49.9626 14.2614C43.3109 9.21814 34.4871 7.58249 25.9353 10.3086C7.47328 16.306 1.63603 37.4324 6.79453 53.5163C14.668 78.1874 40.5959 91 49.9626 91C59.0579 91 85.5291 77.9148 93.1311 53.5163C98.4254 37.4324 92.5881 16.306 74.1261 10.3086Z",
                    fillColor: "#292D32",
                    fillOpacity: 1,
                    strokeWeight: 0.5, // Add an outline
                    strokeColor: 'white', // Make the outline black with 50% opacity
                    scale: 0.2
                  }}
                />
              ))}
              {activeMarker && (
                <InfoWindow
                  position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div>
                    <h2>{activeMarker.sponsorName}</h2>
                  </div>
                </InfoWindow>
              )}
              </GoogleMap>
          </LoadScript>

            <div style={{ display: 'grid', justifyContent: 'center' }}>
              <Pagination
                sponsorsPerPage={sponsorsPerPage}
                totalSponsors={filteredSponsors.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>

        </div>

      </div>

      <footer className="footer">
        Powered by <a href="https://www.linkedin.com/in/abdulalim-u-k/" target="_blank" rel="noopener noreferrer"> Magic 🪄</a>
      </footer>

    </div>

  );
};




export default SearchPage;

