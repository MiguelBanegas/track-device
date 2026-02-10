import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Eye } from "lucide-react";
import { formatBsAsDateTime } from "../utils/formatters";

export default function PointsTable({ points, onSelectPoint }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(points.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPoints = points.slice(startIndex, startIndex + itemsPerPage);

  if (points.length === 0) return null;

  return (
    <div className="table-container glass">
      <div className="stat-card-header" style={{ marginBottom: '1rem' }}>
        <MapPin size={18} style={{ color: 'var(--primary)' }} />
        Historial de Puntos
      </div>
      
      <div className="table-wrapper">
        <table className="points-table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th style={{ textAlign: 'center' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {currentPoints.map((p, idx) => (
              <tr key={p.id || idx}>
                <td>{formatBsAsDateTime(p.recorded_at)}</td>
                <td>{p.lat.toFixed(6)}</td>
                <td>{p.lon.toFixed(6)}</td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    className="view-btn" 
                    onClick={() => onSelectPoint(p)}
                    title="Ver en mapa"
                  >
                    <Eye size={16} />
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="pager-btn"
          >
            <ChevronLeft size={18} />
          </button>
          
          <span className="page-info">
            Página {currentPage} de {totalPages}
          </span>
          
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="pager-btn"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
