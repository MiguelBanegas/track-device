import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { haversineKm } from "../utils/geoUtils";

export default function SpeedChart({ sortedLocations }) {
  const chartData = useMemo(() => {
    if (sortedLocations.length < 2) return [];

    return sortedLocations.slice(1).map((curr, i) => {
      const prev = sortedLocations[i];
      const t1 = new Date(prev.recorded_at).getTime();
      const t2 = new Date(curr.recorded_at).getTime();
      const dtHours = (t2 - t1) / (1000 * 3600);
      
      let speed = 0;
      
      // Si el dispositivo ya reporta velocidad (común en protocolos GPS), la usamos
      if (curr.speed !== undefined && curr.speed !== null) {
        speed = curr.speed;
      } else if (dtHours > 0 && dtHours < 0.25) { 
        // Si no hay velocidad reportada, la calculamos pero con filtros
        const dist = haversineKm(prev, curr);
        // Ignorar saltos insignificantes (ruido de GPS)
        if (dist > 0.005) {
          speed = dist / dtHours;
        }
      }

      return {
        time: new Date(curr.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        speed: Math.round(Math.min(speed, 180)),
      };
    });
  }, [sortedLocations]);

  if (!chartData.length) return null;

  return (
    <div className="chart-card glass">
      <div className="stat-card-header">Evolución de Velocidad (km/h)</div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="var(--text-muted)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="var(--text-muted)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              unit=" km/h"
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'var(--bg)', 
                border: '1px solid var(--glass-border)',
                borderRadius: '8px' 
              }}
              itemStyle={{ color: 'var(--primary)' }}
            />
            <Area
              type="monotone"
              dataKey="speed"
              stroke="var(--primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSpeed)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
