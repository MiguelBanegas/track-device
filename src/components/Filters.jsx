import { Search, Calendar, Hash, Clock } from "lucide-react";

export default function Filters({ 
  deviceId, setDeviceId, 
  from, setFrom, 
  to, setTo, 
  limit, setLimit, 
  onFetch, loading 
}) {
  return (
    <div className="panel glass">
      <form className="form" onSubmit={onFetch}>
        <div className="field">
          <label>Dispositivo</label>
          <div className="field-input-box">
            <Hash size={16} />
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="gps-001"
              required
            />
          </div>
        </div>

        <div className="field">
          <label>Desde</label>
          <div className="field-input-box">
            <Calendar size={16} />
            <input
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <label>Hasta</label>
          <div className="field-input-box">
            <Clock size={16} />
            <input
              type="datetime-local"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <label>Límite</label>
          <div className="field-input-box">
            <Search size={16} />
            <input
              type="number"
              min="1"
              max="2000"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </div>
        </div>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Consultando..." : "Actualizar Mapa"}
          {!loading && <Search size={18} />}
        </button>
      </form>
    </div>
  );
}
