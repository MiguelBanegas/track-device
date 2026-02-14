import { useState, useCallback, useMemo } from "react";
import { toISOStringFromLocal } from "../utils/formatters";
import { calculateDistanceStats } from "../utils/geoUtils";

const API_BASE = "https://api.appvelocidad.mabcontrol.ar";

export function useLocations() {
  const [locations, setLocations] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [lastLocation, setLastLocation] = useState(null);

  const sortedLocations = useMemo(() => {
    if (!locations.length) return [];
    return [...locations].sort(
      (a, b) => new Date(a.recorded_at) - new Date(b.recorded_at),
    );
  }, [locations]);

  const stats = useMemo(
    () => calculateDistanceStats(sortedLocations),
    [sortedLocations],
  );

  const fetchLocations = useCallback(async ({ deviceId, from, to, limit }) => {
    setError("");
    setLoading(true);
    try {
      const params = new URLSearchParams({
        from: toISOStringFromLocal(from),
        to: toISOStringFromLocal(to),
        limit: String(limit || 200),
      });
      const url = `${API_BASE}/devices/${encodeURIComponent(deviceId)}/locations?${params}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setLocations(data.locations ?? []);
      setCount(data.count ?? 0);
      setLastUpdated(new Date().toISOString());
      return data.locations ?? [];
    } catch (err) {
      setError(err.message || "Error consultando la API");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLastLocation = useCallback(async ({ deviceId, from, to }) => {
    try {
      const params = new URLSearchParams({
        from: toISOStringFromLocal(from),
        to: toISOStringFromLocal(to),
        limit: "1",
      });
      const url = `${API_BASE}/devices/${encodeURIComponent(deviceId)}/locations?${params}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const latest = Array.isArray(data.locations) ? data.locations[0] : null;
      if (latest) {
        setLastLocation(latest);
        setLastUpdated(new Date().toISOString());
      }
    } catch (err) {
      console.error("Error fetching last location:", err);
    }
  }, []);

  return {
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
  };
}
