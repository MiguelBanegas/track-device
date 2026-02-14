import { useState, useEffect, useMemo } from "react";
import { useLocations } from "./hooks/useLocations";
import { toDateTimeLocalValue } from "./utils/formatters";
import { Download, Activity } from "lucide-react";
import { motion } from "framer-motion";

import Filters from "./components/Filters";
import MapDisplay from "./components/MapDisplay";
import PointsTable from "./components/PointsTable";
import RouteUploader from "./components/RouteUploader";
import { formatBsAsDateTime } from "./utils/formatters";

import "./App.css";

export default function App() {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const [deviceId, setDeviceId] = useState("gps-001");
  const [from, setFrom] = useState(toDateTimeLocalValue(startOfDay));
  const [to, setTo] = useState(toDateTimeLocalValue(endOfDay));
  const [limit, setLimit] = useState(200);
  const [isLive, setIsLive] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);

  const {
    locations,
    sortedLocations,
    count,
    loading,
    error,
    lastUpdated,
    lastLocation,
    stats,
    fetchLocations,
    fetchLastLocation,
    setLocations,
    setLastLocation,
  } = useLocations();

  const handleFileUpload = (data) => {
    if (!data.routePoints || !Array.isArray(data.routePoints)) {
      alert("El archivo no contiene un formato de recorrido válido (falta routePoints)");
      return;
    }

    const mappedLocations = data.routePoints.map(p => ({
      lat: p.latitude,
      lon: p.longitude,
      recorded_at: new Date(p.timestamp).toISOString(),
      speed: p.speed,
      altitude: p.altitude
    }));

    setLocations(mappedLocations);
    setUploadedData(data);
    if (data.id) setDeviceId(`Archivo: ${data.id}`);
    if (mappedLocations.length > 0) {
      setLastLocation(mappedLocations[mappedLocations.length - 1]);
    }
  };

  const handleFetch = (e) => {
    if (e) e.preventDefault();
    setSelectedPoint(null);
    setUploadedData(null);
    fetchLocations({ deviceId, from, to, limit });
  };

  // Live Mode effect
  useEffect(() => {
    if (!isLive || !deviceId) return;

    const tick = () => {
      const nowStr = toDateTimeLocalValue(new Date());
      setTo(nowStr); // Actualizamos el input "Hasta" al momento actual
      fetchLocations({ deviceId, from, to: nowStr, limit });
    };

    tick();
    const timer = setInterval(tick, 30_000);
    return () => clearInterval(timer);
  }, [isLive, deviceId, from, limit, fetchLocations]);

  const downloadGPX = () => {
    if (!sortedLocations.length) return;
    
    let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TrackDevice" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>Route ${deviceId}</name>
    <trkseg>`;
    
    sortedLocations.forEach(p => {
      gpx += `
      <trkpt lat="${p.lat}" lon="${p.lon}">
        <time>${p.recorded_at}</time>
      </trkpt>`;
    });
    
    gpx += `
    </trkseg>
  </trk>
</gpx>`;
    
    const blob = new Blob([gpx], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `route-${deviceId}.gpx`;
    a.click();
  };

  const pointsForTable = useMemo(() => {
    return [...sortedLocations].reverse();
  }, [sortedLocations]);

  return (
    <div className="page">
      <header className="header">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1>Track Device</h1>
          <div className="header-status">
            <div className="status-dot"></div>
            Sistema de Monitoreo Activo
          </div>
        </motion.div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className={`btn ${isLive ? 'live-active' : ''}`} 
            onClick={() => setIsLive(!isLive)}
            style={{ 
              background: isLive ? 'rgba(45, 212, 191, 0.2)' : 'var(--glass-bg)',
              color: isLive ? 'var(--primary)' : 'var(--text-muted)',
              border: isLive ? '1px solid var(--primary)' : '1px solid var(--glass-border)'
            }}
          >
            <Activity size={18} className={isLive ? 'pulse' : ''} />
            {isLive ? 'Live On' : 'Live Off'}
          </button>
          
          <button 
            className="btn glass" 
            onClick={downloadGPX} 
            disabled={!sortedLocations.length}
            style={{ background: 'var(--glass-bg)', color: 'var(--text)' }}
          >
            <Download size={18} />
            Exportar GPX
          </button>
        </div>
      </header>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Filters 
          deviceId={deviceId} setDeviceId={setDeviceId}
          from={from} setFrom={setFrom}
          to={to} setTo={setTo}
          limit={limit} setLimit={setLimit}
          onFetch={handleFetch}
          loading={loading}
        />
        <RouteUploader onUpload={handleFileUpload} />
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="glass" 
          style={{ padding: '1rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
        >
          {error}
        </motion.div>
      )}

      <main className="main-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <MapDisplay 
            sortedLocations={sortedLocations} 
            lastLocation={lastLocation} 
            selectedPoint={selectedPoint}
          />
          <PointsTable points={pointsForTable} onSelectPoint={setSelectedPoint} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="panel glass" style={{ height: 'fit-content' }}>
            <div className="stat-card-header">{uploadedData ? 'Info de Recorrido' : 'Info del Dispositivo'}</div>
            {uploadedData ? (
              <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', display: 'grid', gap: '0.5rem' }}>
                <div><strong>ID:</strong> {uploadedData.id}</div>
                <div><strong>Inicio:</strong> {formatBsAsDateTime(new Date(uploadedData.startTime).toISOString())}</div>
                <div><strong>Fin:</strong> {formatBsAsDateTime(new Date(uploadedData.endTime).toISOString())}</div>
                <div><strong>Distancia:</strong> {uploadedData.distance.toFixed(2)} km</div>
                <div><strong>T. Conducción:</strong> {uploadedData.drivingTime} min</div>
                <div><strong>T. Parado:</strong> {uploadedData.stoppedTime} min</div>
                <div><strong>Vel. Máxima:</strong> {uploadedData.maxSpeed} km/h</div>
                <div><strong>Vel. Promedio:</strong> {uploadedData.avgSpeed} km/h</div>
              </div>
            ) : (
              <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', display: 'grid', gap: '0.5rem' }}>
                <div><strong>ID:</strong> {deviceId}</div>
                <div><strong>Filtro:</strong> {count} puntos</div>
                <div><strong>Distancia:</strong> {stats.totalKm.toFixed(2)} km</div>
                <div><strong>Última Sinc:</strong> {lastUpdated ? formatBsAsDateTime(lastUpdated) : '—'}</div>
                <div><strong>Status:</strong> {loading ? 'Cargando...' : 'Sincronizado'}</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
