# Track Device - Midnight Tech Tracker 🛰️

Una aplicación web moderna y profesional para el monitoreo de localizaciones GPS en tiempo real, diseñada con una estética **"Midnight Tech"** (Glassmorphism + Dark Mode).

## ✨ Características Principales

- **🛰️ Monitoreo en Tiempo Real**: Modo Live que actualiza la posición cada 30 segundos automáticamente.
- **🗺️ Mapa Interactivo**: 
  - Visualización de la ruta con segmentos de colores según la velocidad.
  - Marcadores personalizados para la última posición conocida.
  - Centrado dinámico al seleccionar puntos históricos.
- **📊 Gestión de Datos**:
  - Filtros avanzados por dispositivo, fecha y hora.
  - Tabla de historial de puntos paginada y ordenada cronológicamente (más recientes primero).
  - Cálculo de estadísticas (distancia total recorrida).
- **📥 Exportación**: Descarga de trayectorias en formato **GPX** compatible con dispositivos GPS y aplicaciones como Google Earth.
- **💎 Interfaz Premium**: Diseño responsivo basado en Glassmorphism, animaciones fluidas con Framer Motion e iconos modernos con Lucide React.

## 🚀 Tecnologías Utilizadas

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Mapas**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Estilos**: Vanilla CSS con variables CSS personalizadas.

## 🛠️ Instalación y Desarrollo

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/TU_USUARIO/track-device.git
    cd track-device
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Ejecutar en modo desarrollo**:
    ```bash
    npm run dev
    ```

4.  **Generar build de producción**:
    ```bash
    npm run build
    ```

## 🌐 Configuración de API

La aplicación está configurada actualmente para conectarse a `https://api.appvelocidad.mabcontrol.ar`. Puedes ajustar la base de la URL en `src/hooks/useLocations.js`.

---
Desarrollado con ❤️ para el monitoreo inteligente de dispositivos.
