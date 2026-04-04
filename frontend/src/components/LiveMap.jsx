import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const center = [22.5726, 88.3639]; // Default start center (Kolkata)

const LiveMap = ({ accidents = [] }) => {
  // Create beautiful dynamic custom markers based on severity
  const getMarkerIcon = (severity) => {
    let colorClass = 'bg-success';
    
    if (severity === 'High') {
      colorClass = 'bg-danger';
    } else if (severity === 'Medium') {
      colorClass = 'bg-warning';
    }
    
    return L.divIcon({
      className: 'custom-leaflet-marker bg-transparent border-none', // Override defaults
      html: `
        <div class="relative w-4 h-4">
          <div class="absolute inset-0 rounded-full ${colorClass} shadow-[0_0_10px_rgba(0,0,0,0.8)] z-10 border border-white/20"></div>
          <div class="absolute -inset-2 rounded-full ${colorClass} opacity-40 animate-ping z-0"></div>
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  return (
    <div className="glass-panel w-full h-[450px] relative overflow-hidden">
      {/* Title overlay */}
      <div className="absolute top-4 left-4 z-[400] bg-panel/90 backdrop-blur px-4 py-2 rounded-lg border border-white/10 shadow-lg">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          Live Feed Map (Open Source)
        </h2>
      </div>

      <MapContainer 
        center={center} 
        zoom={12} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', borderRadius: '0.75rem', zIndex: 10 }}
      >
        {/* Dark mode CartoDB TileLayer - free API alternative */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {accidents.map((accident) => (
          <Marker 
            key={accident.id} 
            position={[accident.lat, accident.lng]}
            icon={getMarkerIcon(accident.severity)}
          >
            <Popup className="custom-popup">
              <div className="p-1 text-gray-800">
                <h3 className="font-bold text-lg mb-1">{accident.location_name}</h3>
                <p className="text-sm">
                  <span className="font-semibold">Severity:</span> 
                  <span className={`ml-1 font-medium ${accident.severity === 'High' ? 'text-red-600' : accident.severity === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {accident.severity}
                  </span>
                </p>
                <p className="text-sm"><span className="font-semibold">Status:</span> {accident.status}</p>
                <p className="text-sm"><span className="font-semibold">Confidence:</span> {Math.round(accident.confidence * 100)}%</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(accident.timestamp).toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
