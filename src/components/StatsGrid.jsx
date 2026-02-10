import { motion } from "framer-motion";
import { Navigation, MapPin, FastForward, Clock } from "lucide-react";
import { formatDistance, formatBsAsDateTime } from "../utils/formatters";

export default function StatsGrid({ stats, count, lastUpdated }) {
  const items = [
    {
      label: "Distancia Total",
      value: `${formatDistance(stats.totalKm)} km`,
      icon: <Navigation size={18} />,
      color: "var(--primary)",
    },
    {
      label: "Puntos Registrados",
      value: count,
      icon: <MapPin size={18} />,
      color: "#818cf8",
    },
    {
      label: "Segmentos Válidos",
      value: `${stats.used} / ${stats.used + stats.skipped}`,
      icon: <FastForward size={18} />,
      color: "#fbbf24",
    },
    {
      label: "Última Actualización",
      value: lastUpdated ? formatBsAsDateTime(lastUpdated).split(",")[1] : "—",
      icon: <Clock size={18} />,
      color: "#94a3b8",
    },
  ];

  return (
    <div className="stats-container">
      {items.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="stat-card glass"
        >
          <div className="stat-card-header">
            <span style={{ color: item.color }}>{item.icon}</span>
            {item.label}
          </div>
          <div className="stat-value">{item.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
