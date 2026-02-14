import { Upload, FileJson } from "lucide-react";
import { useState } from "react";

export default function RouteUploader({ onUpload }) {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file) => {
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          onUpload(json);
        } catch (err) {
          alert("Error al procesar el archivo JSON: " + err.message);
        }
      };
      reader.readAsText(file);
    } else {
      alert("Por favor sube un archivo .json válido");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="panel glass">
      <div className="stat-card-header">
        <Upload size={16} /> Subir Recorrido (.json)
      </div>
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('json-upload').click()}
      >
        <input 
          id="json-upload"
          type="file" 
          accept=".json"
          onChange={(e) => handleFile(e.target.files[0])}
          style={{ display: 'none' }}
        />
        <FileJson size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Arrastra tu archivo aquí o haz clic para buscar
        </p>
      </div>
    </div>
  );
}
