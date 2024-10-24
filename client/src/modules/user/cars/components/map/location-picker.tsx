import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import { message, Button } from 'antd';
import styles from './location-picker.module.css';
import Swal from 'sweetalert2';

// Define your custom marker icons
const companyIcon = new L.Icon({
  iconUrl: '/icons/company-pin.png', // Path to the company marker icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userIcon = new L.Icon({
  iconUrl: '/icons/user-pin.png', // Path to the user-selected marker icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Function to calculate the distance between two coordinates (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const MapComponent: React.FC = () => {
  const companyLocation: LatLngTuple = [10.0099506, 76.3752933]; // Company location
  const [selectedLocation, setSelectedLocation] = useState<LatLngTuple | null>(null);

  // Function to get the user's current location using Geolocation API
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const distance = calculateDistance(companyLocation[0], companyLocation[1], latitude, longitude);

          if (distance <= 20) {
            setSelectedLocation([latitude, longitude]); // Set user location
          } else {
            Swal.fire({
              title: "Sorry..",
              text: "We only provide services around 20 KM",
              icon: "question"
            });
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert('Unable to retrieve your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Function to reset the selected location
  const removeLocation = () => {
    setSelectedLocation(null); // Clear the selected location
  };

  // Component to handle user clicking on the map to set a marker
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const distance = calculateDistance(companyLocation[0], companyLocation[1], lat, lng);

        if (distance <= 20) {
          setSelectedLocation([lat, lng]); // Set clicked location
        } else {
          Swal.fire({
            title: "Sorry..",
            text: "We only provide services around 20 KM",
            icon: "question"
          });
        }
      },
    });

    return selectedLocation ? (
      <Marker position={selectedLocation} icon={userIcon}>
        <Popup>Your delivery location!</Popup>
      </Marker>
    ) : null;
  };

  return (
    <div>
      <MapContainer
        center={companyLocation}
        zoom={12}
        className={styles.locationContainer}
      >
        {/* Tile layer for the map */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Circle indicating the 20km delivery radius */}
        <Circle center={companyLocation} radius={20000} />

        {/* Marker for company location */}
        <Marker position={companyLocation} icon={companyIcon}>
          <Popup>This is the company location!</Popup>
        </Marker>

        {/* Marker component for user's location */}
        <LocationMarker />
      </MapContainer>
      <div style={{ marginBottom: '10px', marginTop:'10px' }} className={styles.buttons}>
        <Button onClick={getCurrentLocation} type="primary" style={{ marginRight: '10px' }}>
          Use Current Location
        </Button>
        <Button onClick={removeLocation} danger>
          Remove Location
        </Button>
      </div>
    </div>
  );
};

export default MapComponent;
