export function toRad(value) {
  return (value * Math.PI) / 180;
}

export function haversineKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export function calculateDistanceStats(
  locations,
  maxSpeedKmh = 180,
  maxGapSeconds = 14400,
) {
  // 4 horas de gap máximo
  if (locations.length < 2) {
    return { totalKm: 0, used: 0, skipped: 0, maxGapSeconds, maxSpeedKmh };
  }

  // 1. Limpieza inicial: ordenar y quitar duplicados exactos o muy cercanos en el tiempo
  const sorted = [...locations].sort(
    (a, b) => new Date(a.recorded_at) - new Date(b.recorded_at),
  );

  const cleanLocations = sorted.filter((loc, idx) => {
    if (idx === 0) return true;
    const prev = sorted[idx - 1];
    const dt = (new Date(loc.recorded_at) - new Date(prev.recorded_at)) / 1000;

    // Si están a menos de 2 segundos o son la misma coordenada exacta, es un duplicado/ruido
    if (dt < 2 || (loc.lat === prev.lat && loc.lon === prev.lon)) return false;
    return true;
  });

  if (cleanLocations.length < 2) {
    return { totalKm: 0, used: 0, skipped: 0, maxGapSeconds, maxSpeedKmh };
  }

  let sum = 0;
  let used = 0;
  let skipped = 0;

  for (let i = 1; i < cleanLocations.length; i += 1) {
    const prev = cleanLocations[i - 1];
    const curr = cleanLocations[i];
    const t1 = new Date(prev.recorded_at).getTime();
    const t2 = new Date(curr.recorded_at).getTime();

    const dtSeconds = (t2 - t1) / 1000;

    if (dtSeconds <= 0 || dtSeconds > maxGapSeconds) {
      skipped += 1;
      continue;
    }

    const dKm = haversineKm(prev, curr);
    const speedKmh = dKm / (dtSeconds / 3600);

    // Si la velocidad es coherente (<180km/h), sumamos la distancia
    if (speedKmh <= maxSpeedKmh) {
      // Solo sumamos si hay un movimiento real (> 10 metros) para evitar ruido de estar quieto
      if (dKm > 0.01) {
        sum += dKm;
        used += 1;
      }
    } else {
      skipped += 1;
    }
  }

  return { totalKm: sum, used, skipped, maxGapSeconds, maxSpeedKmh };
}

export function getSpeedColor(speedKmh) {
  if (speedKmh < 40) return "#4ade80"; // Green
  if (speedKmh < 80) return "#fbbf24"; // Yellow/Orange
  if (speedKmh < 110) return "#f87171"; // Red
  return "#991b1b"; // Dark Red for excess
}
