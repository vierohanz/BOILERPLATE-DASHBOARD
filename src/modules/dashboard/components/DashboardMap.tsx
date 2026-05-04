import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, Users, AlertTriangle, ChevronDown, Crosshair } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER: [number, number] = [-7.15, 110.14];
const DEFAULT_ZOOM = 9;

// Helper to expose map instance
const MapRef: React.FC<{ setMap: (map: L.Map) => void }> = ({ setMap }) => {
  const map = useMap();
  useEffect(() => { setMap(map); }, [map, setMap]);
  return null;
};

import { Select } from '../../../components/ui/Select';
import { Calendar } from 'lucide-react';

const DashboardMap: React.FC = () => {
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState('2023');
  const [hoveredData, setHoveredData] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [legendOpen, setLegendOpen] = useState(true);
  const { theme } = useTheme();

  const yearOptions = [
    { value: '2021', label: 'Tahun 2021' },
    { value: '2022', label: 'Tahun 2022' },
    { value: '2023', label: 'Tahun 2023' },
  ];

  useEffect(() => {
    fetch('/geojson/JT_1105_2.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Map Load Error:', err));
  }, []);

  const getColor = (prevalensi: number) => {
    return prevalensi > 30 ? '#997599' :
           prevalensi > 20 ? '#d74e5e' :
           prevalensi > 10 ? '#f7da83' :
                             '#31a354';
  };

  const mapStyle = (feature: any) => {
    const val = feature.properties[`stunting_${selectedYear}prevalensi_stunting`];
    const prevalence = parseFloat(val);
    const isTarget = hoveredData?.name === feature.properties.ADM2_EN || selectedRegion?.properties?.ADM2_EN === feature.properties.ADM2_EN;

    return {
      fillColor: getColor(prevalence || 0),
      weight: isTarget ? 3 : 1,
      opacity: 1,
      color: theme === 'dark' ? (isTarget ? '#fbbf24' : 'rgba(255,255,255,0.15)') : (isTarget ? '#1e293b' : '#94a3b8'),
      fillOpacity: isTarget ? 1 : 0.75,
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const cityName = feature.properties.ADM2_EN;
    const val = feature.properties[`stunting_${selectedYear}prevalensi_stunting`];

    if (cityName) {
      const labelText = cityName.split(' ').pop() || cityName;
      layer.bindTooltip(labelText, {
        permanent: true,
        direction: 'center',
        className: 'dashboard-map-label',
        offset: [0, 0]
      });
    }

    layer.on({
      mouseover: (e: any) => {
        const l = e.target;
        setHoveredData({ name: cityName, val: val || '0' });
        l.setStyle({ weight: 3, color: theme === 'dark' ? '#fbbf24' : '#1e293b', fillOpacity: 1 });
        l.bringToFront();
      },
      mouseout: (e: any) => {
        const l = e.target;
        if (selectedRegion?.properties?.ADM2_EN !== cityName) {
          setHoveredData(null);
          l.setStyle(mapStyle(feature));
        }
      },
      click: (e: any) => {
        const l = e.target;
        setSelectedRegion(feature);
        setHoveredData({ name: cityName, val: val || '0' });
        l.setStyle({ weight: 3, color: theme === 'dark' ? '#fbbf24' : '#1e293b', fillOpacity: 1 });
        l.bringToFront();
      }
    });
  };

  // Compute summary stats from geojson
  const computeStats = () => {
    if (!geoData) return { total: 0, avg: '0', highRisk: 0 };
    const features = geoData.features || [];
    let sum = 0, count = 0, highRisk = 0;
    features.forEach((f: any) => {
      const val = parseFloat(f.properties[`stunting_${selectedYear}prevalensi_stunting`]);
      if (!isNaN(val)) {
        sum += val;
        count++;
        if (val > 20) highRisk++;
      }
    });
    return { total: count, avg: count > 0 ? (sum / count).toFixed(1) : '0', highRisk };
  };

  const stats = computeStats();

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';

  const legendItems = [
    { color: '#997599', label: '> 30%', desc: 'Sangat Tinggi' },
    { color: '#d74e5e', label: '> 20%', desc: 'Tinggi' },
    { color: '#f7da83', label: '> 10%', desc: 'Sedang' },
    { color: '#31a354', label: '< 10%', desc: 'Rendah' },
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic styles for map labels */}
      <style>{`
        .dashboard-map-label {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          font-weight: 700 !important;
          font-size: 10px !important;
          color: ${theme === 'dark' ? 'rgba(255,255,255,0.7)' : '#334155'} !important;
          pointer-events: none !important;
          text-shadow: ${theme === 'dark' ? '0 0 4px rgba(0,0,0,0.8)' : '0 0 3px white'};
          white-space: nowrap;
          letter-spacing: 0.5px;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          background: var(--bg-card) !important;
          color: var(--text-main) !important;
          box-shadow: 0 20px 60px -15px rgba(0,0,0,0.3) !important;
          border: 1px solid var(--border-color) !important;
        }
        .leaflet-popup-tip {
          background: var(--bg-card) !important;
        }
        .leaflet-popup-close-button {
          color: var(--text-muted) !important;
        }
      `}</style>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-main uppercase tracking-widest">Data Stunting & Persebaran</h2>
          <p className="text-text-muted text-xs mt-1">Peta sebaran stunting di wilayah Jawa Tengah</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface-card border border-border-subtle rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Users size={18} />
          </div>
          <div>
            <p className="text-lg font-black text-text-main">{stats.total}</p>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Kab/Kota</p>
          </div>
        </div>
        <div className="bg-surface-card border border-border-subtle rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <TrendingDown size={18} />
          </div>
          <div>
            <p className="text-lg font-black text-text-main">{stats.avg}%</p>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Rata-rata Stunting</p>
          </div>
        </div>
        <div className="bg-surface-card border border-border-subtle rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertTriangle size={18} />
          </div>
          <div>
            <p className="text-lg font-black text-text-main">{stats.highRisk} Kota</p>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Risiko Tinggi</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-surface-card border border-border-subtle rounded-3xl overflow-hidden relative shadow-lg transition-colors duration-300" style={{ height: 520 }}>
        {geoData ? (
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            zoomControl={false}
            attributionControl={false}
            className="h-full w-full z-0"
            style={{ background: theme === 'dark' ? '#111318' : '#f1f5f9' }}
          >
            <MapRef setMap={(map) => { mapInstanceRef.current = map; }} />
            <TileLayer key={theme} url={tileUrl} />
            <GeoJSON
              key={`${selectedYear}-${theme}-${geoData.features?.length}`}
              data={geoData}
              style={mapStyle}
              onEachFeature={onEachFeature}
            />

            {selectedRegion && (
              <Popup
                position={L.geoJSON(selectedRegion).getBounds().getCenter()}
                eventHandlers={{ remove: () => setSelectedRegion(null) }}
              >
                <div className="p-1 min-w-[180px]">
                  <p className="font-black text-sm uppercase tracking-wide">{selectedRegion.properties.ADM2_EN}</p>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="opacity-60">Prevalensi</span>
                      <span className="font-black" style={{ color: getColor(parseFloat(selectedRegion.properties[`stunting_${selectedYear}prevalensi_stunting`]) || 0) }}>
                        {selectedRegion.properties[`stunting_${selectedYear}prevalensi_stunting`] || '0'}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs items-center">
                      <span className="opacity-60">Tahun</span>
                      <span className="font-bold">{selectedYear}</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      {parseFloat(selectedRegion.properties[`stunting_${selectedYear}prevalensi_stunting`]) > 20 ? (
                        <><TrendingUp size={12} className="text-rose-500" /><span className="text-[10px] text-rose-500 font-bold">Perlu perhatian</span></>
                      ) : (
                        <><TrendingDown size={12} className="text-emerald-500" /><span className="text-[10px] text-emerald-500 font-bold">Terkendali</span></>
                      )}
                    </div>
                  </div>
                </div>
              </Popup>
            )}
          </MapContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Memuat Peta...</p>
            </div>
          </div>
        )}
        {/* Custom Map Controls (rendered as HTML overlay, not inside Leaflet) */}
        <div className="absolute top-4 left-4 z-1000 flex flex-col gap-2">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-10 h-10 bg-surface-card border border-border-subtle rounded-xl flex items-center justify-center text-text-main hover:bg-primary hover:text-slate-900 hover:border-primary transition-all shadow-lg text-lg font-bold"
          >+</button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-10 h-10 bg-surface-card border border-border-subtle rounded-xl flex items-center justify-center text-text-main hover:bg-primary hover:text-slate-900 hover:border-primary transition-all shadow-lg text-lg font-bold"
          >−</button>
          <button
            onClick={() => mapInstanceRef.current?.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 0.8 })}
            className="w-10 h-10 bg-surface-card border border-border-subtle rounded-xl flex items-center justify-center text-text-muted hover:bg-primary hover:text-slate-900 hover:border-primary transition-all shadow-lg"
            title="Kembali ke posisi awal"
          >
            <Crosshair size={16} />
          </button>
        </div>

        {/* Year Selector */}
        <div className="absolute top-4 right-4 z-1000">
          <Select 
            value={selectedYear} 
            onChange={setSelectedYear}
            options={yearOptions}
            icon={<Calendar />}
            className="w-44"
          />
        </div>

        {/* Hover Info Box */}
        <AnimatePresence>
          {(hoveredData || selectedRegion) && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="absolute bottom-4 left-4 z-1000 bg-surface-card/90 backdrop-blur-xl border border-border-subtle rounded-2xl shadow-2xl p-4 min-w-[160px]"
            >
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Data Stunting</p>
              <p className="text-sm font-black text-text-main leading-tight">
                {hoveredData ? hoveredData.name?.split(' ').pop() : selectedRegion?.properties.ADM2_EN?.split(' ').pop()}
              </p>
              <p className="text-lg font-black mt-1" style={{ color: getColor(parseFloat(hoveredData?.val || selectedRegion?.properties[`stunting_${selectedYear}prevalensi_stunting`]) || 0) }}>
                {hoveredData ? hoveredData.val : selectedRegion?.properties[`stunting_${selectedYear}prevalensi_stunting`] || '0'}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-1000">
          <div className="bg-surface-card/90 backdrop-blur-xl border border-border-subtle rounded-2xl shadow-2xl overflow-hidden">
            <button
              onClick={() => setLegendOpen(!legendOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-main transition-colors"
            >
              <span>Legenda</span>
              <ChevronDown size={14} className={`transition-transform ${legendOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {legendOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-3 space-y-2 overflow-hidden"
                >
                  {legendItems.map(item => (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-bold text-text-muted">{item.label} — {item.desc}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMap;
