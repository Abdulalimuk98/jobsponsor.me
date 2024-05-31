import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = ({ sponsorName, sponsorLocations }) => {
  console.log('Sponsor Locations:', sponsorLocations);



  const [currentLocation, setCurrentLocation] = useState({ lat: -34.397, lng: 150.644 });
  const [markers, setMarkers] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocationFetched, setUserLocationFetched] = useState(false);
  const [shownSponsors, setShownSponsors] = useState([]);


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



return (
  <LoadScript googleMapsApiKey='AIzaSyDafs_zu5GrGTqiPRnkDtdTyhsbwtxkB5o'>
    <GoogleMap
      id="map"
      mapContainerStyle={{ height: "100%", width: "100%" }}
      zoom={12}
      center={currentLocation}
      onClick={() => setActiveMarker(null)}
    >
        <Marker position={currentLocation}></Marker>
        {sponsorLocations && sponsorLocations.map((location, index) => (
        <Marker key={index} position={{ lat: parseFloat(location.lat), lng: parseFloat(location.lng) }} onClick={() => setActiveMarker(location)} />
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
  );
};

export default MapComponent;