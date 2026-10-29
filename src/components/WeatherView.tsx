import React, { useState, useEffect, useRef } from 'react';
import { WeatherSubMenu } from '../types';
import { 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sparkles, 
  RefreshCw, 
  Sun, 
  Sunset,
  Moon,
  Compass,
  MapPin,
  Layers,
  Send, 
  Image as ImageIcon, 
  CheckCircle,
  Eye,
  CloudRain,
  AlertTriangle,
  Radio,
  Flame,
  ShieldAlert,
  SunMedium,
  Gauge,
  Activity,
  Zap
} from 'lucide-react';
import L from 'leaflet';

export type WindyOverlayType =
  | 'radar'
  | 'clouds'
  | 'rain'
  | 'wind'
  | 'gust'
  | 'gustAccu'
  | 'ptype'
  | 'solarpower'
  | 'capAlerts'
  | 'drought40'
  | 'uvindex';

interface WeatherViewProps {
  subCategory: WeatherSubMenu;
  onOpenAiAssistant: () => void;
}

export const WeatherView: React.FC<WeatherViewProps> = ({
  subCategory,
  onOpenAiAssistant,
}) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>('Ibiúna');
  const [mapTileLayer, setMapTileLayer] = useState<'satellite' | 'radar_storm' | 'clouds' | 'rain' | 'wind'>('satellite');
  const [radarViewMode, setRadarViewMode] = useState<'leaflet' | 'windy'>('leaflet');
  const [windyOverlay, setWindyOverlay] = useState<WindyOverlayType>('radar');
  const [colorScheme, setColorScheme] = useState<number>(7); // 7 = RainViewer Vibrant Rainbow (Green/Yellow/Red/Purple)
  
  // Weather Radar & Cloud movement animation state
  const [radarFrames, setRadarFrames] = useState<{ time: number; path: string }[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPlayingRadar, setIsPlayingRadar] = useState<boolean>(true);
  const [radarHost, setRadarHost] = useState<string>('https://tilecache.rainviewer.com');

  // AI Assistant state inside weather section
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiPlantStage, setAiPlantStage] = useState('Vegetativo Avançado (Outdoor)');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Map DOM Ref and Leaflet Instance Ref
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const radarLayersRef = useRef<L.TileLayer[]>([]);
  const markerRef = useRef<L.Marker | null>(null);

  // Fetch RainViewer Live Radar Frames for storm/cloud animation
  useEffect(() => {
    const fetchRadarData = async () => {
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        const data = await res.json();
        if (data && data.radar && data.radar.past) {
          setRadarHost(data.host || 'https://tilecache.rainviewer.com');
          // Combine past frames + available nowcast frames if present
          const allFrames = [...data.radar.past, ...(data.radar.nowcast || [])];
          setRadarFrames(allFrames);
          setCurrentFrameIndex(allFrames.length - 1); // Start at latest frame
        }
      } catch (err) {
        console.warn("RainViewer API indisponível, utilizando fallback de radar:", err);
      }
    };

    fetchRadarData();
    const interval = setInterval(fetchRadarData, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  // Radar Animation Loop Timer
  useEffect(() => {
    if (!isPlayingRadar || radarFrames.length === 0) return;

    const timer = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % radarFrames.length);
    }, 800); // cycle frames every 800ms

    return () => clearInterval(timer);
  }, [isPlayingRadar, radarFrames]);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather/inmet?city=${encodeURIComponent(selectedCity)}`);
      const json = await res.json();
      setWeatherData(json);
    } catch (err) {
      console.error("Erro ao carregar clima INMET:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [selectedCity]);

  // Leaflet Base Map Initialization & Updates
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const lat = weatherData?.coordinates?.lat || -23.6561;
    const lon = weatherData?.coordinates?.lon || -47.2222;

    const targetZoom = (mapTileLayer === 'radar_storm' || mapTileLayer === 'clouds') ? 6 : 11;

    if (!mapInstanceRef.current) {
      // Create new map
      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: targetZoom,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Custom icon for ASTRAYA Cultivation Location
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: #059669; color: white; padding: 6px 10px; border-radius: 20px; border: 2px solid white; font-weight: bold; font-size: 11px; font-family: sans-serif; box-shadow: 0 4px 6px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 4px; whitespace: nowrap;">
                🌱 ${selectedCity} (Cultivo Outdoor)
               </div>`,
        iconSize: [140, 30],
        iconAnchor: [70, 15],
      });

      const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
      marker.bindPopup(`<b>ASTRAYA Cultivo Outdoor</b><br/>${weatherData?.cityName || selectedCity}<br/>Altitude: ${weatherData?.altitude || '860m'}`);
      markerRef.current = marker;
    } else {
      // Update center & marker
      mapInstanceRef.current.setView([lat, lon], targetZoom);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lon]);
        const customIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color: #059669; color: white; padding: 6px 10px; border-radius: 20px; border: 2px solid white; font-weight: bold; font-size: 11px; font-family: sans-serif; box-shadow: 0 4px 6px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 4px; whitespace: nowrap;">
                  🌱 ${selectedCity} (Cultivo Outdoor)
                 </div>`,
          iconSize: [140, 30],
          iconAnchor: [70, 15],
        });
        markerRef.current.setIcon(customIcon);
        markerRef.current.bindPopup(`<b>ASTRAYA Cultivo Outdoor</b><br/>${weatherData?.cityName || selectedCity}<br/>Altitude: ${weatherData?.altitude || '860m'}`);
      }
    }

    // Base Tile Layer switching
    if (tileLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    let attribution = '&copy; Esri World Imagery & NASA Earth';

    if (mapTileLayer === 'radar_storm' || mapTileLayer === 'clouds') {
      // Dark / High contrast base map for vivid weather radar visibility
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; OpenStreetMap contributors & CartoDB';
    }

    if (mapInstanceRef.current) {
      const baseLayer = L.tileLayer(tileUrl, {
        maxZoom: 18,
        attribution: attribution,
      }).addTo(mapInstanceRef.current);

      tileLayerRef.current = baseLayer;
    }
  }, [weatherData, mapTileLayer, selectedCity]);

  // Handle map invalidateSize when toggling back to Leaflet HD mode
  useEffect(() => {
    if (radarViewMode === 'leaflet' && mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 50);
    }
  }, [radarViewMode]);

  // Preload and Update Animated Radar Layers (Smooth transition without tile errors or grey flickering)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clean up old radar layers first
    radarLayersRef.current.forEach((layer) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });
    radarLayersRef.current = [];

    if (mapTileLayer !== 'radar_storm' && mapTileLayer !== 'clouds') {
      return;
    }

    if (radarFrames.length === 0) return;

    const targetOpacity = mapTileLayer === 'clouds' ? 0.65 : 0.85;

    // Instantiate tile layers for ALL frames to allow instant pre-cached opacity toggling
    const layers: L.TileLayer[] = radarFrames.map((frame, idx) => {
      const radarUrl = `${radarHost}${frame.path}/256/{z}/{x}/{y}/${colorScheme}/1_1.png`;
      const layer = L.tileLayer(radarUrl, {
        maxZoom: 18,
        maxNativeZoom: 8,
        tileSize: 256,
        opacity: idx === currentFrameIndex ? targetOpacity : 0,
        attribution: 'Radar Doppler & Tempestades &copy; RainViewer / INMET',
        zIndex: 100,
      });
      if (mapInstanceRef.current) {
        layer.addTo(mapInstanceRef.current);
      }
      return layer;
    });

    radarLayersRef.current = layers;
  }, [mapTileLayer, radarFrames, colorScheme, radarHost]);

  // Toggle opacity of pre-created radar layers on currentFrameIndex change
  useEffect(() => {
    if (mapTileLayer !== 'radar_storm' && mapTileLayer !== 'clouds') return;

    const targetOpacity = mapTileLayer === 'clouds' ? 0.65 : 0.85;
    radarLayersRef.current.forEach((layer, idx) => {
      if (idx === currentFrameIndex) {
        layer.setOpacity(targetOpacity);
      } else {
        layer.setOpacity(0);
      }
    });
  }, [currentFrameIndex, mapTileLayer]);

  // Clean map instance on total unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const temp = weatherData?.temperature !== undefined ? weatherData.temperature : (loading ? '--' : 14.3);
  const rh = weatherData?.humidity !== undefined ? weatherData.humidity : (loading ? '--' : 88);
  const vpd = weatherData?.vpd !== undefined ? weatherData.vpd : 0.20;

  // AI Direct Query Handler
  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: `Meteorologia Outdoor - ${selectedCity}`,
          prompt: aiPrompt,
          plantStage: aiPlantStage,
          temp: temp,
          humidity: rh,
          vpd: vpd,
          imageBase64: selectedImage,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setAiResponse(`Erro: ${data.error}`);
      } else {
        setAiResponse(data.text);
      }
    } catch (err: any) {
      setAiResponse("Erro de conexão ao consultar a IA Agronômica da ASTRAYA.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-green-950 p-4 rounded-2xl border border-emerald-800 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-800/80 rounded-xl text-emerald-300 shrink-0">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-emerald-100 flex items-center gap-2">
                <span>3.1 Estação Meteorológica Outdoor INMET & Previsão Agroclimática</span>
              </h2>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Monitoramento agroclimático regional para cultivo outdoor em Ibiúna/SP e municípios adjacentes.
              </p>
            </div>
          </div>

          <button
            onClick={fetchWeather}
            className="p-2.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold shrink-0"
            title="Atualizar Dados INMET"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar INMET</span>
          </button>
        </div>
      </div>

      {/* MAIN METEOROLOGY SECTION */}
      {subCategory === 'estacao_inmet' && (
        <div className="space-y-6">
          {/* Live Station & Network Telemetry Bar */}
          <div className="bg-slate-900 border border-emerald-800/80 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-sm text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-emerald-300">Motor Meteorológico Ativo em Tempo Real:</span>
              <span className="text-slate-300 truncate font-medium">
                {weatherData?.station || 'Estação INMET / Rede Automática'}
              </span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto text-[11px] text-slate-400">
              {weatherData?.condition && (
                <span className="bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-lg text-emerald-300 font-medium">
                  {weatherData.condition}
                </span>
              )}
              <span>Atualizado ao vivo</span>
            </div>
          </div>

          {/* Critical High-Humidity Agronomic Alert for Outdoor Crops */}
          {(typeof rh === 'number' ? rh >= 80 : false) && (
            <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-rose-950/80 border border-amber-600/80 p-4 rounded-2xl shadow-md text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                  <span>ALERTA FITOSSANITÁRIO OUTDOOR: Umidade Crítica ({rh}%) & Ponto de Orvalho Próximo ({weatherData?.dewPoint}°C)</span>
                </div>
                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full font-bold">
                  Risco de Botrytis
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                Com umidade relativa superior a 80% e temperatura amena ({temp}°C), o risco de orvalho foliar e proliferação de fungos patogênicos (<span className="text-amber-200 font-medium">Botrytis cinerea - Mofo Cinzento</span> e <span className="text-amber-200 font-medium">Oídio</span>) é máximo nos buds e flores de Cannabis.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-emerald-300 block mb-0.5">1. Manejo do Dossel:</strong>
                  Realizar desfolha seletiva no interior e galhos baixos para manter corrente de ar contínua.
                </div>
                <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-emerald-300 block mb-0.5">2. Controle Biológico:</strong>
                  Pulverizar preventivamente <em>Bacillus subtilis</em> ou JMS (JADAM) antes da queda da temperatura noturna.
                </div>
                <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-emerald-300 block mb-0.5">3. Irrigação e Solo:</strong>
                  Suspender regas tardias para não saturar o ar ao entardecer; manter boa drenagem nos canteiros.
                </div>
              </div>
            </div>
          )}

          {/* City Selector & Elevation Badge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-slate-300 font-bold">Município do Cultivo Outdoor:</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="flex-1 sm:flex-initial bg-slate-950 border border-emerald-700/80 rounded-xl px-3.5 py-2 text-xs text-emerald-300 font-bold focus:outline-none focus:border-emerald-500 shadow-sm"
              >
                <option value="Ibiúna">📍 Ibiúna - SP (Sede / Cultivo Principal)</option>
                <option value="Cotia">📍 Cotia - SP</option>
                <option value="Vargem Grande Paulista">📍 Vargem Grande Paulista - SP</option>
                <option value="Sorocaba">📍 Sorocaba - SP</option>
                <option value="São Roque">📍 São Roque - SP</option>
                <option value="Piedade">📍 Piedade - SP</option>
              </select>

              <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950 px-2.5 py-1.5 rounded-xl border border-emerald-800/80 shrink-0">
                Alt: {weatherData?.altitude || '860m'}
              </span>
            </div>
          </div>

          {/* Main Agroclimatic Metric Cards (Outdoor Focus) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Air Temperature */}
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                Temperatura do Ar
              </span>
              <span className="text-2xl font-bold text-slate-100 block">{temp}°C</span>
              <span className="text-[10px] text-slate-400 block">Ponto Orvalho: {weatherData?.dewPoint}°C</span>
            </div>

            {/* Relative Humidity */}
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                Umidade Relativa (UR)
              </span>
              <span className="text-2xl font-bold text-slate-100 block">{rh}%</span>
              <span className="text-[10px] text-slate-400 block">Chuva 24h: {weatherData?.accumulatedRain24h || '2.4 mm'}</span>
            </div>

            {/* Wind Speed & Gusts */}
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-emerald-400" />
                Velocidade dos Ventos
              </span>
              <span className="text-2xl font-bold text-slate-100 block">{weatherData?.windSpeed || 14} <span className="text-xs font-normal text-slate-400">km/h</span></span>
              <span className="text-[10px] text-emerald-300 block truncate">
                Direção: {weatherData?.windDirection || 'ESE'} (Rajadas: {weatherData?.windGust || 21} km/h)
              </span>
            </div>

            {/* Solar Cycle (Sunrise & Sunset) */}
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Sol Desperta / Vai Embora
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-100 pt-0.5">
                <span className="flex items-center gap-1 text-amber-300">
                  <Sun className="w-3.5 h-3.5" />
                  {weatherData?.sunrise || '06:41'}
                </span>
                <span className="text-slate-500">•</span>
                <span className="flex items-center gap-1 text-orange-400">
                  <Sunset className="w-3.5 h-3.5" />
                  {weatherData?.sunset || '18:01'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block">Fotoperíodo Direto: {weatherData?.photoperiod || '11h 20m'}</span>
            </div>
          </div>

          {/* Secondary Agro Row: Moon Phase & Outdoor VPD Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Moon Phase Widget */}
            <div className="bg-slate-900 border border-emerald-800/80 p-4 rounded-2xl space-y-2 md:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{weatherData?.moonPhase?.emoji || '🌕'}</span>
                  <div>
                    <h3 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                      <span>Qual a Lua: {weatherData?.moonPhase?.name || 'Lua Crescente'}</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                        {weatherData?.moonPhase?.illumination || '68%'} iluminação
                      </span>
                    </h3>
                    <span className="text-[10px] text-slate-400">Ciclo Lunar para Cultivo Outdoor Organico</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-amber-300 block mb-1">
                  🌿 Orientação Agronômica ASTRAYA para esta Lua:
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {weatherData?.moonPhase?.agronomicTip}
                </p>
              </div>
            </div>

            {/* Outdoor VPD & Solar Radiation */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                  <span>VPD Outdoor Calculado:</span>
                  <span className="text-emerald-400 font-bold">{vpd} kPa</span>
                </span>
                <div className="mt-1 text-xs font-semibold text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {weatherData?.vpdRecommendation}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-400">
                <span>Radiação Solar: <strong className="text-slate-200">{weatherData?.solarRadiation || 720} W/m²</strong></span>
                <span>Prob. Chuva: <strong className="text-blue-300">{weatherData?.rainProbability || 25}%</strong></span>
              </div>
            </div>
          </div>

          {/* SATELLITE & WEATHER RADAR MAP SECTION */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex flex-col gap-3 border-b border-slate-800 pb-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 flex-wrap">
                      <span>Mapa de Monitoramento Agroclimático & Radar Ao Vivo</span>
                      {radarViewMode === 'leaflet' && (
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-800">
                          📡 Satélite Orbital Terrestre HD (Esri / NASA)
                        </span>
                      )}
                      {radarViewMode === 'windy' && (
                        <span className="text-[10px] bg-indigo-950 text-indigo-300 font-bold px-2.5 py-0.5 rounded-full border border-indigo-800 flex items-center gap-1">
                          <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
                          Camada Ativa: {
                            windyOverlay === 'radar' ? '⛈️ Radar Tempestades Doppler' :
                            windyOverlay === 'clouds' ? '☁️ Movimentação de Nuvens' :
                            windyOverlay === 'rain' ? '🌧️ Chuva & Acumulado' :
                            windyOverlay === 'wind' ? '💨 Fluxo de Ventos' :
                            windyOverlay === 'gust' ? '🌪️ Rajadas de Vento' :
                            windyOverlay === 'gustAccu' ? '🌀 Acumulação de Vento' :
                            windyOverlay === 'ptype' ? '💧 Tipo de Precipitação' :
                            windyOverlay === 'solarpower' ? '☀️ Energia Solar & Irradiância' :
                            windyOverlay === 'capAlerts' ? '🚨 Alerta de Clima (CAP)' :
                            windyOverlay === 'drought40' ? '🏜️ Monitorização da Seca (0-40cm)' :
                            windyOverlay === 'uvindex' ? '🟣 Índice UV & Tricomas' : windyOverlay
                          }
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Motor meteorológico integrado para {selectedCity}/SP e microrregião. Selecione camadas orbitais, radares doppler ou parâmetros agrometeorológicos.
                    </p>
                  </div>
                </div>

                {/* City selector reminder */}
                <div className="text-xs text-slate-400 flex items-center gap-1.5 self-end sm:self-auto bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span className="text-slate-200 font-semibold">{selectedCity}</span>
                  <span className="text-[10px] text-emerald-400">● Motor Ativo</span>
                </div>
              </div>

              {/* Group 1: Base Orbital & Radar Views */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <span>📡 Camadas Base & Imagens Orbitais:</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Alta resolução de superfície</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80 text-xs">
                  <button
                    onClick={() => {
                      setRadarViewMode('leaflet');
                      setMapTileLayer('satellite');
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      radarViewMode === 'leaflet'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span>📡 Satélite HD</span>
                  </button>

                  <button
                    onClick={() => {
                      setRadarViewMode('windy');
                      setWindyOverlay('radar');
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      radarViewMode === 'windy' && windyOverlay === 'radar'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span>⛈️ Radar Tempestades</span>
                  </button>

                  <button
                    onClick={() => {
                      setRadarViewMode('windy');
                      setWindyOverlay('clouds');
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      radarViewMode === 'windy' && windyOverlay === 'clouds'
                        ? 'bg-cyan-700 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span>☁️ Movimentação Nuvens</span>
                  </button>

                  <button
                    onClick={() => {
                      setRadarViewMode('windy');
                      setWindyOverlay('rain');
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      radarViewMode === 'windy' && windyOverlay === 'rain'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span>🌧️ Chuva & Acumulado</span>
                  </button>

                  <button
                    onClick={() => {
                      setRadarViewMode('windy');
                      setWindyOverlay('wind');
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      radarViewMode === 'windy' && windyOverlay === 'wind'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span>💨 Ventos Ao Vivo</span>
                  </button>
                </div>
              </div>

              {/* Group 2: The 7 Specialized Agroclimatic Monitoring Layers requested */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Camadas de Monitoramento Especializado (Cultivo Outdoor & Estufa):</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Clique para alternar o radar</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-1.5 bg-slate-950/90 p-2 rounded-xl border border-slate-800 text-xs">
                  {/* 1. Rajadas de Vento */}
                  <button
                    onClick={() => {
                      setRadarViewMode('windy');
                      setWindyOverlay('gust');
                    }}
                    className={`p-2 rounded-lg font-semibold transition flex flex-col items-start text-left border ${
                      radarViewMode === 'windy' && windyOverlay === 'gust'
                        ? 'bg-amber-600/90 border-amber-400 text-white shadow-lg'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1 text-[11px] font-bold">
                        <Wind className="w-3.5 h-3.5 text-amber-400" />
                        Rajadas de Vento
                      </span>
                    </div>
                    <span className="text-[10px] opacity-80 mt-0.5">
                      Atual: {weatherData?.windGust || 45.4} km/h
                    </span>
                  </button>

                  {/* 2. Acumulacao de vento */}
                  <button
                    onClick={() => {
                      setRadarViewMode('windy');
                      setWindyOverlay('gustAccu');
                    }}
                    className={`p-2 rounded-lg font-semibold transition flex flex-col items-start text-left border ${
                      radarViewMode === 'windy' && windyOverlay === 'gustAccu'
                        ? 'bg-purple-600/90 border-purple-400 text-white shadow-lg'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1 text-[11px] font-bold">
                        <Gauge className="w-3.5 h-3.5 text-purple-400" />
                        Acumulacao de vento
                      </span>
                    </div>
                    <span className="text-[10px] opacity-80 mt-0.5">
                      Projeção e Persistência
                    </span>
                  </button>

                  {/* 3. Tipo de precipitação */}
                  <button
                    onClick={() => {
                      setRadarViewMode('windy');
                      setWindyOverlay('ptype');
                    }}
                    className={`p-2 rounded-lg font-semibold transition flex flex-col items-start text-left border ${
                      radarViewMode === 'windy' && windyOverlay === 'ptype'
                        ? 'bg-blue-600/90 border-blue-400 text-white shadow-lg'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-blue-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1 text-[11px] font-bold">
                        <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                        Tipo de precipitação
                      </span>
                    </div>
                    <span className="text-[10px] opacity-80 mt-0.5 truncate max-w-full">
                      {weatherData?.precipitationType || 'Chuva / Granizo'}
                    </span>
                  </button>

                  {/* 4. Energia Solar */}
                  <button
                    onClick={() => {
                      setRadarViewMode('windy');
                      setWindyOverlay('solarpower');
                    }}
                    className={`p-2 rounded-lg font-semibold transition flex flex-col items-start text-left border ${
                      radarViewMode === 'windy' && windyOverlay === 'solarpower'
                        ? 'bg-yellow-500 border-yellow-300 text-slate-950 font-bold shadow-lg'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-yellow-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1 text-[11px] font-bold">
                        <Sun className={`w-3.5 h-3.5 ${radarViewMode === 'windy' && windyOverlay === 'solarpower' ? 'text-slate-950' : 'text-yellow-400'}`} />
                        Energia Solar
                      </span>
                    </div>
                    <span className="text-[10px] opacity-80 mt-0.5">
                      {weatherData?.solarRadiation || 720} W/m² • DLI
                    </span>
                  </button>

                  {/* 5. alerta de Clima */}
                  <button
                    onClick={() => {
                      setRadarViewMode('windy');
                      setWindyOverlay('capAlerts');
                    }}
                    className={`p-2 rounded-lg font-semibold transition flex flex-col items-start text-left border ${
                      radarViewMode === 'windy' && windyOverlay === 'capAlerts'
                        ? 'bg-rose-600/90 border-rose-400 text-white shadow-lg animate-pulse'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-rose-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1 text-[11px] font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        alerta de Clima
                      </span>
                    </div>
                    <span className="text-[10px] opacity-80 mt-0.5">
                      Avisos Oficiais CAP
                    </span>
                  </button>

                  {/* 6. Monitorização da Seca */}
                  <button
                    onClick={() => {
                      setRadarViewMode('windy');
                      setWindyOverlay('drought40');
                    }}
                    className={`p-2 rounded-lg font-semibold transition flex flex-col items-start text-left border ${
                      radarViewMode === 'windy' && windyOverlay === 'drought40'
                        ? 'bg-orange-600/90 border-orange-400 text-white shadow-lg'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-orange-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1 text-[11px] font-bold">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        Monitorização da Seca
                      </span>
                    </div>
                    <span className="text-[10px] opacity-80 mt-0.5">
                      Rizosfera 0-40cm
                    </span>
                  </button>

                  {/* 7. Indice UV */}
                  <button
                    onClick={() => {
                      setRadarViewMode('windy');
                      setWindyOverlay('uvindex');
                    }}
                    className={`p-2 rounded-lg font-semibold transition flex flex-col items-start text-left border ${
                      radarViewMode === 'windy' && windyOverlay === 'uvindex'
                        ? 'bg-indigo-600/90 border-indigo-400 text-white shadow-lg'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-indigo-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1 text-[11px] font-bold">
                        <SunMedium className="w-3.5 h-3.5 text-indigo-400" />
                        Indice UV
                      </span>
                    </div>
                    <span className="text-[10px] opacity-80 mt-0.5">
                      UV {weatherData?.uvIndex !== undefined ? weatherData.uvIndex : 1.4} • Tricomas
                    </span>
                  </button>
                </div>
              </div>

              {/* Dynamic Agronomic Guidance Box for Currently Selected Layer */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-slate-200">
                      Manejo Agronômico: {
                        radarViewMode === 'leaflet' ? 'Satélite Orbital de Alta Resolução' :
                        windyOverlay === 'gust' ? 'Rajadas de Vento (Sustentação Estrutural)' :
                        windyOverlay === 'gustAccu' ? 'Acumulação de Vento (Evapotranspiração & Quebra-Ventos)' :
                        windyOverlay === 'ptype' ? 'Tipo de Precipitação (Granizo & Danos Mecânicos)' :
                        windyOverlay === 'solarpower' ? 'Energia Solar (Fotossíntese & DLI Acumulado)' :
                        windyOverlay === 'capAlerts' ? 'Alerta de Clima (Defesa e Proteção Imediata)' :
                        windyOverlay === 'drought40' ? 'Monitorização da Seca (Umidade Radicular 0-40cm)' :
                        windyOverlay === 'uvindex' ? 'Índice UV (Estímulo de Tricomas, THC/CBD & Terpenos)' :
                        windyOverlay === 'radar' ? 'Radar Doppler (Detecção Antecipada de Tempestades)' :
                        windyOverlay === 'clouds' ? 'Cobertura de Nuvens (Fotoperíodo & Luminosidade)' :
                        windyOverlay === 'rain' ? 'Chuva Acumulada (Saturação & Lixiviação de Nutrientes)' :
                        'Fluxo e Dinâmica de Ventos'
                      }
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Rede Meteorológica INMET / WMO
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {radarViewMode === 'leaflet' && 'Visualização orbital para identificação de relevo, áreas de sombreamento natural e topografia dos canteiros em ' + selectedCity + '.'}
                    {radarViewMode === 'windy' && windyOverlay === 'gust' && 'Rajadas acima de 35-40 km/h podem fraturar galhos pesados em plena floração. Verifique estacas, redes de tutoramento (Scrog/Trellis) e reforce amarrações em ' + selectedCity + ' (Atual: ' + (weatherData?.windGust || 45.4) + ' km/h).'}
                    {radarViewMode === 'windy' && windyOverlay === 'gustAccu' && 'Ventos persistentes ao longo de dias retiram a umidade do ar próximo à folha, fechando estômatos e desacelerando a fotossíntese. Aplique cobertura vegetal (mulching) e proteja bordaduras com quebra-ventos.'}
                    {radarViewMode === 'windy' && windyOverlay === 'ptype' && 'Identificação em tempo real entre chuva líquida, chuvisco e núcleos de granizo. Se houver previsão de granizo, acione lonas retráteis ou estruturas de cobertura móvel para salvar as inflorescências.'}
                    {radarViewMode === 'windy' && windyOverlay === 'solarpower' && 'A energia solar direta (atualmente ' + (weatherData?.solarRadiation || 720) + ' W/m²) comanda a taxa fotossintética e a transpiração. Dias de alta radiação exigem calibração rigorosa do VPD e reposição balanceada de macro e micronutrientes.'}
                    {radarViewMode === 'windy' && windyOverlay === 'capAlerts' && 'Avisos emitidos pela Defesa Civil e órgãos meteorológicos sobre tempestades severas, frentes polares abruptas ou ventanias para a microrregião de ' + selectedCity + '.'}
                    {radarViewMode === 'windy' && windyOverlay === 'drought40' && 'Avalia o teor de umidade no horizonte radicular de 0 a 40cm. Solos secos nessa profundidade provocam atrofia radicular e abortamento de flores; solos saturados causam asfixia e fusariose.'}
                    {radarViewMode === 'windy' && windyOverlay === 'uvindex' && 'A radiação UV-B natural (atualmente UV ' + (weatherData?.uvIndex !== undefined ? weatherData.uvIndex : 1.4) + ', máx: ' + (weatherData?.uvIndexMax || 4.0) + ') estimula os tricomas a produzirem mais resina e canabinoides protetores. Nos horários de pico, certifique-se de que as plantas estão bem hidratadas.'}
                    {radarViewMode === 'windy' && windyOverlay === 'radar' && 'O radar meteorológico doppler multicor rastreia células de tempestade em aproximação no raio de 250km, permitindo prever a chegada de frentes chuvosas com antecedência de horas.'}
                    {radarViewMode === 'windy' && windyOverlay === 'clouds' && 'A densidade de nuvens impacta diretamente a quantidade de radiação fotossinteticamente ativa (PAR) recebida pelo dossel vegetativo.'}
                    {radarViewMode === 'windy' && windyOverlay === 'rain' && 'Monitore a lâmina de chuva acumulada (atualmente ' + (weatherData?.accumulatedRain24h || '0.0 mm') + '). Chuvas torrenciais prolongadas lixiviam nutrientes do solo orgânico e exigem reposição de adubação pós-chuva.'}
                    {radarViewMode === 'windy' && windyOverlay === 'wind' && 'Circulação de ar suave (5 a 15 km/h) estimula caules mais espessos e reduz a camada de umidade estagnada ao redor das folhas, prevenindo oídio.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Map Option 1: Leaflet HD Satellite Map */}
            <div className={radarViewMode === 'leaflet' ? "relative rounded-xl overflow-hidden border border-slate-800 h-[480px] bg-slate-950" : "hidden"}>
              <div ref={mapContainerRef} className="w-full h-full z-0" />

              {/* Top Left Location & Watermark Badge */}
              <div className="absolute top-3 left-3 z-[400] bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-emerald-300 font-bold flex items-center gap-2 shadow-lg pointer-events-none">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {selectedCity} - SP • Satélite Orbital Terrestre HD (Esri & NASA)
                </span>
              </div>
            </div>

            {/* Map Option 2: Live Interactive Windy Weather Engine with Selected Overlay */}
            <div className={radarViewMode === 'windy' ? "relative rounded-xl overflow-hidden border border-slate-800 h-[480px] bg-slate-950" : "hidden"}>
              <iframe
                key={`${windyOverlay}-${selectedCity}`}
                title="Windy Live Weather Radar & Agroclimatic Layers"
                src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km%2Fh&zoom=8&overlay=${windyOverlay}&product=${
                  windyOverlay === 'radar' ? 'radar' :
                  windyOverlay === 'clouds' ? 'satellite' :
                  windyOverlay === 'drought40' ? 'drought' :
                  windyOverlay === 'capAlerts' ? 'capAlerts' : 'ecmwf'
                }&level=surface&lat=${weatherData?.coordinates?.lat || -23.6561}&lon=${weatherData?.coordinates?.lon || -47.2222}&detailLat=${weatherData?.coordinates?.lat || -23.6561}&detailLon=${weatherData?.coordinates?.lon || -47.2222}&marker=true&message=true`}
                className="w-full h-full border-none"
                allowFullScreen
              />
            </div>
          </div>

          {/* INMET REGIONAL FORECAST (PREVISÃO DO TEMPO) */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-emerald-400" />
                Previsão do Tempo INMET - {selectedCity}/SP e Região
              </h3>
              <span className="text-xs text-slate-400">Atualizado via Rede INMET</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
              {weatherData?.forecast?.map((fc: any, idx: number) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 hover:border-emerald-700/60 transition">
                  <span className="font-bold text-emerald-400 block text-[11px] truncate">{fc.day}</span>
                  <div className="text-slate-100 font-bold text-sm">
                    {fc.tempMax} <span className="text-xs font-normal text-slate-400">/ {fc.tempMin}</span>
                  </div>
                  <div className="text-[10px] text-slate-300">UR: {fc.rh}</div>
                  <div className="text-[10px] text-slate-400">Vento: {fc.wind}</div>
                  <div className="text-[10px] text-amber-300 italic pt-1 truncate">{fc.condition}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* IA ASSISTENTE CLIMA & DIAGNÓSTICO */}
      {subCategory === 'ia_assistente' && (
        <div className="bg-slate-900 border border-emerald-800/80 rounded-2xl p-4 space-y-4 shadow-sm text-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-emerald-300">
                  IA Agronômica ASTRAYA (Gemini) - Diagnóstico Outdoor
                </h3>
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-semibold">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Consulte a IA treinada em cultivo outdoor na região de Ibiúna/SP, prevenção de fungos com alta umidade, adubação foliar KNF e manejo agroclimático.
              </p>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div>
            <label className="block text-slate-400 text-[11px] font-medium mb-1.5">
              Perguntas frequentes para o cultivo outdoor:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                `Como prevenir Botrytis e oídio com alta umidade nesta fase?`,
                `Qual manejo KNF/JADAM aplicar contra lagartas e brocas no outdoor?`,
                `Como ajustar regas considerando o VPD atual de ${vpd} kPa?`,
                `Adubação foliar orgânica indicada para a fase de ${aiPlantStage}`,
              ].map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAiPrompt(sug)}
                  disabled={aiLoading}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-950/80 border border-slate-700 hover:border-emerald-500 text-[11px] text-slate-300 hover:text-emerald-200 transition text-left"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAskAi} className="space-y-3 text-xs pt-1 border-t border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Estágio de Desenvolvimento Outdoor</label>
                <select
                  value={aiPlantStage}
                  onChange={(e) => setAiPlantStage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="Preparo de Solo / Canteiro">Preparo de Solo / Canteiro (Organico)</option>
                  <option value="Mudas / Clones (Transplante)">Mudas / Clones (Transplante Outdoor)</option>
                  <option value="Vegetativo Inicial">Vegetativo Inicial Outdoor</option>
                  <option value="Vegetativo Avançado (Outdoor)">Vegetativo Avançado (Planta Grande)</option>
                  <option value="Floração Inicial (Pre-flower Outdoor)">Floração Inicial (Pre-flower Outdoor)</option>
                  <option value="Floração Plena (Buds Densos)">Floração Plena (Buds Densos)</option>
                  <option value="Maturação Final / Colheita">Maturação Final / Colheita</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Enviar Foto da Folha / Canteiro (Opcional)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="weather-img-upload"
                  />
                  <label
                    htmlFor="weather-img-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 font-medium transition"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>{selectedImage ? 'Alterar Imagem' : 'Anexar Foto'}</span>
                  </label>
                  {selectedImage && (
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="text-rose-400 hover:underline font-semibold"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail Preview */}
            {selectedImage && (
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
                <img
                  src={selectedImage}
                  alt="Pré-visualização"
                  className="w-16 h-16 object-cover rounded-lg border border-slate-700"
                />
                <div className="text-slate-300 text-xs">
                  <span className="font-semibold text-emerald-400">Foto anexada para análise fitossanitária</span>
                  <p className="text-[11px] text-slate-400">Será processada em conjunto com os dados microclimáticos da estação.</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-medium mb-1">Sua Pergunta ou Dúvida de Manejo Outdoor</label>
              <textarea
                rows={3}
                required
                placeholder="Exemplo: Com as chuvas e umidade alta em Ibiúna na fase de floração, como prevenir Botrytis e oídio com extratos de JADAM JWA ou bacillus subtilis?"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={aiLoading || !aiPrompt.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition border border-emerald-400/30 disabled:border-slate-700 disabled:text-slate-500"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                  <span>Analisando com IA Agronômica...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Consultar IA ASTRAYA</span>
                </>
              )}
            </button>
          </form>

          {/* AI Output Card */}
          {aiResponse && (
            <div className="p-4 bg-slate-950 border border-emerald-700/80 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold text-emerald-300 flex items-center gap-1.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Parecer Técnico da IA Agronômica ASTRAYA:
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(aiResponse);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] transition"
                  title="Copiar resposta"
                >
                  <span>Copiar</span>
                </button>
              </div>
              <div className="text-slate-200 whitespace-pre-wrap leading-relaxed space-y-2 pt-2">
                {aiResponse}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
