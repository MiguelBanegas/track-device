import { useMemo, useEffect } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { formatBsAsDateTime } from "../utils/formatters";
import { haversineKm, getSpeedColor } from "../utils/geoUtils";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const lastMarkerIcon = L.divIcon({
  className: "last-pin-v2",
  html: "<div></div>",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lon]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, points]);
  return null;
}

function FocusPoint({ point }) {
  const map = useMap();
  useEffect(() => {
    if (point) {
      map.setView([point.lat, point.lon], 16, { animate: true });
    }
  }, [map, point]);
  return null;
}

export default function MapDisplay({ sortedLocations, lastLocation, selectedPoint }) {
  const hasLocations = sortedLocations.length > 0;
  
  // Split polyline into colored segments based on speed
  const coloredSegments = useMemo(() => {
    if (sortedLocations.length < 2) return [];
    
    const segments = [];
    for (let i = 1; i < sortedLocations.length; i++) {
      const prev = sortedLocations[i-1];
      const curr = sortedLocations[i];
      
      const t1 = new Date(prev.recorded_at).getTime();
      const t2 = new Date(curr.recorded_at).getTime();
      const dtHours = (t2 - t1) / (1000 * 3600);
      
      let speed = 0;
      if (curr.speed !== undefined && curr.speed !== null) {
        speed = curr.speed;
      } else if (dtHours > 0) {
        speed = haversineKm(prev, curr) / dtHours;
      }
      
      segments.push({
        positions: [[prev.lat, prev.lon], [curr.lat, curr.lon]],
        color: getSpeedColor(speed)
      });
    }
    return segments;
  }, [sortedLocations]);

  return (
    <div className="map-wrap glass">
      <MapContainer
        center={[-34.6037, -58.3816]}
        zoom={12}
        scrollWheelZoom
        className="map"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {hasLocations && <FitBounds points={sortedLocations} />}
        {selectedPoint && <FocusPoint point={selectedPoint} />}
        
        {coloredSegments.map((seg, i) => (
          <Polyline 
            key={i} 
            positions={seg.positions} 
            pathOptions={{ color: seg.color, weight: 4, opacity: 0.8 }} 
          />
        ))}

        {selectedPoint && (
          <Marker position={[selectedPoint.lat, selectedPoint.lon]} icon={markerIcon}>
            <Popup permanent>
              <div style={{ padding: '4px' }}>
                <strong>Punto Seleccionado</strong><br/>
                {formatBsAsDateTime(selectedPoint.recorded_at)}
              </div>
            </Popup>
          </Marker>
        )}

        {hasLocations && !selectedPoint && (
          <Marker
            position={[sortedLocations[sortedLocations.length - 1].lat, sortedLocations[sortedLocations.length - 1].lon]}
            icon={lastMarkerIcon}
          >
            <Popup>
              <div style={{ padding: '4px' }}>
                <strong>Último punto en ruta</strong><br/>
                {formatBsAsDateTime(sortedLocations[sortedLocations.length - 1].recorded_at)}
              </div>
            </Popup>
          </Marker>
        )}

        {lastLocation && !hasLocations && !selectedPoint && (
          <Marker
            position={[lastLocation.lat, lastLocation.lon]}
            icon={lastMarkerIcon}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <div style={{ fontSize: '12px' }}>
                Posición Actual<br/>
                {formatBsAsDateTime(lastLocation.recorded_at)}
              </div>
            </Tooltip>
          </Marker>
        )}
      </MapContainer>
      
      {!hasLocations && (
        <div className="empty" style={{ background: 'transparent', color: 'var(--text-muted)' }}>
          Sin datos de ruta. Ajusta los filtros.
        </div>
      )}
    </div>
  );
}
