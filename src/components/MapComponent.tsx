import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, RotateCw, ZoomIn, ZoomOut, Layers, HelpCircle, Navigation } from 'lucide-react';
import { Country } from '../data/countries';

interface MapComponentProps {
  countries: Country[];
  selectedCountry: Country | null;
  onSelectCountry: (c: Country) => void;
  isDarkMode: boolean;
}

// Low-overhead, compact stylized vertices of Earth's main continents to draw a realistic natural earth layer
const CONTINENTS: { name: string; color: string; polygon: [number, number][] }[] = [
  {
    name: 'Afrika',
    color: '#85a95d', // Natural olive/warm green
    polygon: [
      [35, 10], [32, 25], [30, 32], [25, 34], [15, 40], [10, 42], [5, 48], 
      [-5, 39], [-15, 35], [-25, 31], [-34, 19], [-30, 15], [-20, 14], 
      [-10, 10], [0, 9], [5, -12], [14, -17], [22, -16], [32, -9], [35, 10]
    ]
  },
  {
    name: 'Janubiy Amerika',
    color: '#719e56', // Lush jungle green
    polygon: [
      [12, -72], [10, -60], [5, -50], [-5, -35], [-12, -37], [-20, -40], 
      [-30, -50], [-40, -63], [-55, -67], [-48, -75], [-35, -73], [-25, -70], 
      [-15, -75], [-5, -81], [2, -80], [8, -78], [12, -72]
    ]
  },
  {
    name: 'Shimoliy Amerika',
    color: '#93b574', // Pine green
    polygon: [
      [75, -100], [70, -135], [60, -165], [55, -162], [48, -125], [35, -120], 
      [30, -115], [20, -105], [8, -78], [13, -80], [20, -97], [25, -97], 
      [25, -80], [30, -81], [38, -74], [45, -60], [55, -55], [65, -50], [75, -100]
    ]
  },
  {
    name: 'Yevrosiyo',
    color: '#7da462', // Rich continental green-khaki
    polygon: [
      [75, 40], [70, 15], [60, 5], [52, -10], [45, -1], [36, -5],
      [36, 12], [30, 18], [30, 34], [25, 43], [12, 43], [12, 54], [18, 72],
      [8, 77], [8, 81], [22, 90], [10, 102], [1, 103], [5, 115],
      [15, 130], [20, 140], [35, 142], [42, 145], [60, 165], [74, 175],
      [77, 130], [75, 90], [75, 40]
    ]
  },
  {
    name: 'Avstraliya',
    color: '#cba86a', // Sandy/gold outback plains
    polygon: [
      [-12, 131], [-21, 114], [-31, 115], [-35, 115], [-35, 138], [-38, 140], 
      [-37, 150], [-25, 153], [-10, 142], [-12, 131]
    ]
  },
  {
    name: 'Antarktida',
    color: '#e2f4f2', // Frozen glacier white/cyan
    polygon: [
      [-70, -180], [-68, -120], [-72, -60], [-74, 0], [-72, 60], 
      [-68, 120], [-70, 180], [-89, 180], [-89, -180], [-70, -180]
    ]
  }
];

export default function MapComponent({
  countries,
  selectedCountry,
  onSelectCountry,
  isDarkMode,
}: MapComponentProps) {
  // Navigation tabs config: 'globe' (Default beautiful 3D sphere) vs 'flat' (accurate standard leaflet)
  const [viewMode, setViewMode] = useState<'globe' | 'flat'>('flat');

  // --- LEAFLET FLAT MAP LOGIC ---
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [code: string]: L.Marker }>({});
  const [mapStyle, setMapStyle] = useState<'satellite' | 'topographic' | 'colorful'>('satellite');

  const getTileUrl = (style: typeof mapStyle) => {
    switch (style) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'topographic':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
      case 'colorful':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  // Switch views and trigger resized layout corrections
  useEffect(() => {
    if (viewMode === 'flat') {
      setTimeout(() => {
        if (!mapContainerRef.current || mapRef.current) return;
        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
          maxBounds: [[-85, -180], [85, 180]],
          maxBoundsViscosity: 1.0,
          minZoom: 2,
        }).setView([20, 10], 2.5);

        mapRef.current = map;
        const tileLayer = L.tileLayer(getTileUrl(mapStyle), {
          attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        tileLayerRef.current = tileLayer;

        // Render markers
        countries.forEach((country) => {
          const isSelected = selectedCountry?.code === country.code;
          const customIcon = L.divIcon({
            className: 'custom-map-marker-icon',
            html: `
              <div class="relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-transform ${
                isSelected
                  ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 scale-125 border-2 border-white ring-4 ring-indigo-500/30 text-white font-extrabold'
                  : 'bg-white dark:bg-slate-900 border-2 border-indigo-500/80 text-indigo-600 dark:text-indigo-400 font-extrabold hover:scale-110'
              }">
                <span class="text-[10px] select-none font-extrabold tracking-tight">${country.code}</span>
                ${isSelected ? '<span class="absolute -inset-0.5 rounded-full border border-white animate-ping opacity-60"></span>' : ''}
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const marker = L.marker(country.coords, { icon: customIcon })
            .addTo(map)
            .on('click', () => onSelectCountry(country));

          marker.bindTooltip(`
            <div class="px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 font-sans">
              <strong>${country.emoji} ${country.name}</strong>
              <div class="text-[10px] text-slate-500">Poytaxt: ${country.capital}</div>
            </div>
          `, { permanent: false, className: 'custom-tooltip-wrapper', opacity: 0.95 });

          markersRef.current[country.code] = marker;
        });
      }, 100);
    } else {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        tileLayerRef.current = null;
        markersRef.current = {};
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [viewMode]);

  // Leaflet style swap
  useEffect(() => {
    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(getTileUrl(mapStyle));
    }
  }, [mapStyle]);

  // Handle selected country flight focus on flat map
  useEffect(() => {
    if (viewMode === 'flat' && mapRef.current && selectedCountry) {
      mapRef.current.flyTo(selectedCountry.coords, 5, { duration: 1.5 });
      const activeMarker = markersRef.current[selectedCountry.code];
      if (activeMarker) {
        setTimeout(() => activeMarker.openTooltip(), 1500);
      }
    }
  }, [selectedCountry, viewMode]);


  // --- 3D EARTH GLOBE LANDSCAPE RENDERING ENGINE ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Rotation parameters: Yaw (horizontal longitude) and Pitch (vertical latitude)
  const currentYaw = useRef<number>(1.12); // Central Asia longitude default center
  const currentPitch = useRef<number>(0.55); // Latitude skew default

  // Ease targets to enable ultra-smooth cinematic transitions
  const targetYaw = useRef<number>(1.12);
  const targetPitch = useRef<number>(0.55);

  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const dragDistance = useRef<number>(0);
  const yawVelocity = useRef<number>(0.002); // Elegant automatic slow cosmic spin on startup
  const pitchVelocity = useRef<number>(0); // Smooth vertical rotation momentum

  const zoomRef = useRef<number>(1.0); // Fluid current zoom factor
  const targetZoom = useRef<number>(1.0); // Target zoom factor for easing animations

  // Coordinates mapping tracking dictionary for click identification
  const countryPositionsOnScreen = useRef<{
    [code: string]: { x: number; y: number; visible: boolean; country: Country };
  }>({});

  const [hoveredNode, setHoveredNode] = useState<Country | null>(null);

  // --- Real NASA Satellite Texture Loader & Offscreen buffering ---
  const satelliteTextureRef = useRef<HTMLImageElement | null>(null);
  const [satelliteTextureLoaded, setSatelliteTextureLoaded] = useState<boolean>(false);
  const satelliteTextureData = useRef<Uint32Array | null>(null);
  const satelliteTextureWidth = useRef<number>(0);
  const satelliteTextureHeight = useRef<number>(0);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Earthmap1000x500compac.jpg/640px-Earthmap1000x500compac.jpg';
    
    img.onload = () => {
      try {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0);
          const imgData = tempCtx.getImageData(0, 0, img.width, img.height);
          satelliteTextureData.current = new Uint32Array(imgData.data.buffer);
          satelliteTextureWidth.current = img.width;
          satelliteTextureHeight.current = img.height;
          satelliteTextureRef.current = img;
          setSatelliteTextureLoaded(true);
        }
      } catch (err) {
        console.error("Failed to parse satellite texture data:", err);
      }
    };
    img.onerror = () => {
      console.error("Failed to load satellite texture background from Wikimedia Commons");
    };
  }, []);

  // Auto focus the globe rotation variables upon selection
  useEffect(() => {
    if (selectedCountry) {
      const lonRad = -(selectedCountry.coords[1] * Math.PI) / 180;
      const latRad = (selectedCountry.coords[0] * Math.PI) / 180;

      targetYaw.current = lonRad;
      targetPitch.current = latRad;
      yawVelocity.current = 0; // Stop automatic drift upon focused country selection
      pitchVelocity.current = 0; // Stop vertical drift upon focused country selection
    }
  }, [selectedCountry]);

  // Canvas context initializer and animation orchestrator loop
  useEffect(() => {
    if (viewMode !== 'globe') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fluid wheel-scroll zoom scaling handler
    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      const zoomStep = 0.08;
      if (e.deltaY < 0) {
        // Zoom in dynamically
        targetZoom.current = Math.min(3.5, targetZoom.current + zoomStep * targetZoom.current);
      } else {
        // Zoom out dynamically
        targetZoom.current = Math.max(0.6, targetZoom.current - zoomStep * targetZoom.current);
      }
    };
    canvas.addEventListener('wheel', handleWheelEvent, { passive: false });

    // High Density Pixel Ratio Setup
    let width = 0;
    let height = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height || 450;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    let rect = canvas.parentElement?.getBoundingClientRect();
    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Static ambient stars layer inside outer space
    const stars: { x: number; y: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 75; i++) {
      stars.push({
        x: Math.random() * 1200,
        y: Math.random() * 800,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    // Mathematical unit coordinates projection and rotational matrix multiplier
    const projectAndRotate = (lat: number, lon: number, yAngle: number, pAngle: number) => {
      const phi = (lat * Math.PI) / 180;
      const lambda = (lon * Math.PI) / 180;

      // 3D Spherical unit cartesian
      const x3d = Math.cos(phi) * Math.sin(lambda);
      const y3d = Math.sin(phi);
      const z3d = Math.cos(phi) * Math.cos(lambda);

      // Y-axis rotation (Yaw / Longitude)
      const x1 = x3d * Math.cos(yAngle) - z3d * Math.sin(yAngle);
      const z1 = x3d * Math.sin(yAngle) + z3d * Math.cos(yAngle);

      // X-axis rotation (Pitch / Latitude)
      const y2 = y3d * Math.cos(pAngle) - z1 * Math.sin(pAngle);
      const z2 = y3d * Math.sin(pAngle) + z1 * Math.cos(pAngle);

      return [x1, y2, z2]; // x_rot, y_rot, z_depth
    };

    let pulseRadiusAngle = 0;

    // Direct render draw frame sequence
    const renderFrame = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Smooth kinetic zoom interpolation
      zoomRef.current += (targetZoom.current - zoomRef.current) * 0.12;

      const Cx = width / 2;
      const Cy = height / 2;
      const R = Math.max(140, Math.min(width, height) * 0.38) * zoomRef.current;

      pulseRadiusAngle += 0.08;

      // Inertial automatic drift controls
      if (!isDragging.current) {
        let activeInertia = false;

        // Yaw (horizontal) friction momentum deceleration (positive & negative values supported)
        if (Math.abs(yawVelocity.current) > 0.0001) {
          targetYaw.current += yawVelocity.current;
          yawVelocity.current *= 0.95; // Friction deceleration coefficient
          activeInertia = true;
        }

        // Pitch (vertical) friction momentum deceleration (positive & negative values supported)
        if (Math.abs(pitchVelocity.current) > 0.0001) {
          targetPitch.current += pitchVelocity.current;
          pitchVelocity.current *= 0.95; // Friction deceleration coefficient
          activeInertia = true;
        }

        // Slow natural cosmic rotation if no ongoing manual selection, nor active momentum decay
        if (!activeInertia && !selectedCountry) {
          targetYaw.current += 0.0008;
        }

        // Kinetic transition easing
        currentYaw.current += (targetYaw.current - currentYaw.current) * 0.08;
        currentPitch.current += (targetPitch.current - currentPitch.current) * 0.08;
      } else {
        currentYaw.current = targetYaw.current;
        currentPitch.current = targetPitch.current;
      }

      // Constrain Pitch to avoid locking poles upside down
      currentPitch.current = Math.max(-1.4, Math.min(1.4, currentPitch.current));

      // 1. Draw outer space backing star fields
      ctx.save();
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x % width, star.y % height, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 2. Draw outer luminous atmosphere halo (Earth air layer)
      ctx.save();
      const atmosphereGrad = ctx.createRadialGradient(Cx, Cy, R * 0.96, Cx, Cy, R * 1.15);
      atmosphereGrad.addColorStop(0, 'rgba(56, 189, 248, 0.42)');
      atmosphereGrad.addColorStop(0.35, 'rgba(99, 102, 241, 0.25)');
      atmosphereGrad.addColorStop(0.65, 'rgba(124, 58, 237, 0.08)');
      atmosphereGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = atmosphereGrad;
      ctx.beginPath();
      ctx.arc(Cx, Cy, R * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // --- MASK EVERYTHING INSIDE SPHERE ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(Cx, Cy, R, 0, Math.PI * 2);
      ctx.clip();

      // 3. Draw stunning volumetric shaded deep Water Ocean sphere (Natural Blue Gradients) or NASA Satellite Texture
      if (mapStyle === 'satellite' && satelliteTextureLoaded && satelliteTextureData.current) {
        const texData = satelliteTextureData.current;
        const textWidth = satelliteTextureWidth.current;
        const textHeight = satelliteTextureHeight.current;

        const sizeIndex = Math.ceil(R * 2);
        const offSize = Math.min(512, Math.max(128, sizeIndex));

        if (!offscreenCanvasRef.current) {
          offscreenCanvasRef.current = document.createElement('canvas');
        }
        const offCanvas = offscreenCanvasRef.current;
        if (offCanvas.width !== offSize || offCanvas.height !== offSize) {
          offCanvas.width = offSize;
          offCanvas.height = offSize;
        }

        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          const offImgData = offCtx.createImageData(offSize, offSize);
          const offData32 = new Uint32Array(offImgData.data.buffer);

          const cx = offSize / 2;
          const cy = offSize / 2;
          const r = cx - 2;
          const rSq = r * r;

          const yaw = currentYaw.current;
          const pitch = currentPitch.current;

          const cosY = Math.cos(yaw);
          const sinY = Math.sin(yaw);
          const cosP = Math.cos(pitch);
          const sinP = Math.sin(pitch);

          // Sunlight source vector (upper-left, slightly in front)
          const lx = -0.508;
          const ly = 0.609;
          const lz = 0.609;

          for (let y = 0; y < offSize; y++) {
            const dy = y - cy;
            const dySq = dy * dy;
            const rowOffset = y * offSize;

            for (let x = 0; x < offSize; x++) {
              const dx = x - cx;
              const distSq = dx * dx + dySq;

              if (distSq <= rSq) {
                const nx = dx / r;
                const ny = -dy / r;
                const nz = Math.sqrt(Math.max(0, 1.0 - nx * nx - ny * ny));

                // 3D rotations matching projectAndRotate mathematically
                const rx1 = nx * cosY - nz * sinY;
                const rz1 = nx * sinY + nz * cosY;
                const ry1 = ny;

                const rx2 = rx1;
                const ry2 = ry1 * cosP - rz1 * sinP;
                const rz2 = ry1 * sinP + rz1 * cosP;

                const lat = Math.asin(Math.max(-1.0, Math.min(1.0, ry2)));
                const lon = Math.atan2(rx1, rz2);

                const u = (lon + Math.PI) / (2.0 * Math.PI);
                const v = (Math.PI / 2.0 - lat) / Math.PI;

                const tx = ((Math.floor(u * textWidth) % textWidth) + textWidth) % textWidth;
                const ty = ((Math.floor(v * textHeight) % textHeight) + textHeight) % textHeight;

                const c = texData[ty * textWidth + tx];

                const rVal = c & 0xFF;
                const gVal = (c >> 8) & 0xFF;
                const bVal = (c >> 16) & 0xFF;
                const aVal = (c >> 24) & 0xFF;

                // Dynamic light shading: deep shadow on the dark side of earth
                const dotVal = nx * lx + ny * ly + nz * lz;
                const intensity = Math.max(0, dotVal);
                const shade = 0.08 + 0.92 * intensity;

                // --- 1. SPECULAR SOLAR GLARE FOR OCEAN WATER ---
                // Identify ocean pixels (high blue bias, low red saturation on earth maps)
                const isWater = (bVal > rVal * 1.15) && (bVal > gVal * 0.95) && (rVal < 90);
                let spec = 0;
                if (isWater && intensity > 0) {
                  // Direct reflection vector formula z element relative to View [0, 0, 1]
                  const rz = 2 * dotVal * nz - lz;
                  if (rz > 0) {
                    spec = Math.pow(rz, 18) * 0.78; // brilliant specular solar gloss
                  }
                }

                // --- 2. PROCEDURAL DRIFTING CLOUDS ---
                // Animate slightly over time (Date.now() / X) to simulate slow planetary rotation wind
                const timeSec = Date.now() / 16000;
                const cu = u * 10 + timeSec;
                const cv = v * 10;
                
                const cloudNoise = Math.sin(cu) * Math.cos(cv) + 
                                   Math.sin(cu * 2.3 - cv * 1.7) * 0.45 + 
                                   Math.cos(cu * 4.2 + cv * 2.9) * 0.25;

                // Cloud thickness influenced by latitude bands (warm moist zones vs dry bands)
                const latBand = Math.sin(v * Math.PI) * (0.65 + 0.35 * Math.cos(v * Math.PI * 4));
                const cloudIntensity = Math.max(0, (cloudNoise + 0.3) / 1.7) * latBand;
                const cloudDensity = Math.min(1.0, Math.pow(cloudIntensity * 1.45, 1.25) * 1.3);

                // Cloud layers reflect the incoming solar light heavily
                const cloudLit = 0.35 + 0.65 * intensity;
                const cloudR = 255 * cloudLit;
                const cloudG = 255 * cloudLit;
                const cloudB = 255 * cloudLit;

                // Ground features receive a soft shadows from clouds
                const shadowFactor = 1.0 - cloudDensity * 0.45;
                let groundR = rVal * shade * shadowFactor;
                let groundG = gVal * shade * shadowFactor;
                let groundB = bVal * shade * shadowFactor;

                // Combine landmass/water pixel with cloud texture overlay
                let finalR = groundR * (1.0 - cloudDensity) + cloudR * cloudDensity;
                let finalG = groundG * (1.0 - cloudDensity) + cloudG * cloudDensity;
                let finalB = groundB * (1.0 - cloudDensity) + cloudB * cloudDensity;

                // Apply shiny specular reflecting points directly on top
                if (spec > 0) {
                  finalR = finalR * (1.0 - spec) + 255 * spec;
                  finalG = finalG * (1.0 - spec) + 255 * spec;
                  finalB = finalB * (1.0 - spec) + 255 * spec;
                }

                // Atmosphere Rayleigh blue scatter rim glow at boundaries
                const edge = 1.0 - nz;
                const rimGlow = Math.pow(edge, 5) * 0.62;

                const nr = Math.min(255, Math.max(0, finalR + rimGlow * 135));
                const ng = Math.min(255, Math.max(0, finalG + rimGlow * 185));
                const nb = Math.min(255, Math.max(0, finalB + rimGlow * 255));

                offData32[rowOffset + x] = (aVal << 24) | (nb << 16) | (ng << 8) | nr;
              } else {
                offData32[rowOffset + x] = 0;
              }
            }
          }
          offCtx.putImageData(offImgData, 0, 0);
          ctx.drawImage(offCanvas, Cx - R, Cy - R, R * 2, R * 2);
        }
      } else {
        const oceanGrad = ctx.createRadialGradient(
          Cx - R * 0.35,
          Cy - R * 0.35,
          R * 0.1,
          Cx,
          Cy,
          R
        );
        // Beautiful custom ambient planet color shading depending on styling selection
        if (mapStyle === 'satellite') {
          if (isDarkMode) {
            oceanGrad.addColorStop(0, '#0f2b48'); // Dark satellite teal
            oceanGrad.addColorStop(0.5, '#051424'); // Deep satellite navy
            oceanGrad.addColorStop(0.9, '#020912'); // Twilight shadow
            oceanGrad.addColorStop(1, '#000205');
          } else {
            oceanGrad.addColorStop(0, '#1e40af'); // Bright ocean blue
            oceanGrad.addColorStop(0.4, '#1e3a8a'); // Satellite deep water
            oceanGrad.addColorStop(0.9, '#111827'); // Dark ocean bottom
            oceanGrad.addColorStop(1, '#030712');
          }
        } else if (mapStyle === 'topographic') {
          if (isDarkMode) {
            oceanGrad.addColorStop(0, '#334155'); // Slate relief gray
            oceanGrad.addColorStop(0.5, '#1e293b'); // Contour dark gray
            oceanGrad.addColorStop(0.9, '#0f172a');
            oceanGrad.addColorStop(1, '#020617');
          } else {
            oceanGrad.addColorStop(0, '#f1f5f9'); // Contour off-white paper base
            oceanGrad.addColorStop(0.5, '#cbd5e1'); // Light steel gray contour
            oceanGrad.addColorStop(0.9, '#64748b'); // Paper depth shadows
            oceanGrad.addColorStop(1, '#475569');
          }
        } else {
          // Classic 'colorful' (Rangdor) vibrant ocean gradients (Default look)
          if (isDarkMode) {
            oceanGrad.addColorStop(0, '#1052b5'); // Shimmering ocean blue
            oceanGrad.addColorStop(0.5, '#0b3273'); // Classic cobalt royal blue
            oceanGrad.addColorStop(0.9, '#031433'); // Shadow depth
            oceanGrad.addColorStop(1, '#01081a'); // Dark edge
          } else {
            oceanGrad.addColorStop(0, '#38bdf8'); // Sky blue reflection
            oceanGrad.addColorStop(0.4, '#1d4ed8'); // Bright deep blue
            oceanGrad.addColorStop(0.9, '#1e3a8a'); // Shaded water
            oceanGrad.addColorStop(1, '#172554'); // Dark edge limit
          }
        }
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(Cx - R, Cy - R, R * 2, R * 2);

        // 4. Draw latitude & longitude graticules (Translucent parallels)
        ctx.save();
        ctx.strokeStyle = isDarkMode ? 'rgba(147, 197, 253, 0.07)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;

        // Draw meridians
        for (let lon = -180; lon <= 180; lon += 30) {
          ctx.beginPath();
          let initialized = false;
          for (let lat = -80; lat <= 80; lat += 5) {
            const [x, y, z] = projectAndRotate(lat, lon, currentYaw.current, currentPitch.current);
            if (z >= 0) {
              const px = Cx + x * R;
              const py = Cy - y * R;
              if (!initialized) {
                ctx.moveTo(px, py);
                initialized = true;
              } else {
                ctx.lineTo(px, py);
              }
            } else {
              initialized = false;
            }
          }
          ctx.stroke();
        }

        // Draw parallels
        for (let lat = -70; lat <= 70; lat += 20) {
          ctx.beginPath();
          let initialized = false;
          for (let lon = -180; lon <= 180; lon += 5) {
            const [x, y, z] = projectAndRotate(lat, lon, currentYaw.current, currentPitch.current);
            if (z >= 0) {
              const px = Cx + x * R;
              const py = Cy - y * R;
              if (!initialized) {
                ctx.moveTo(px, py);
                initialized = true;
              } else {
                ctx.lineTo(px, py);
              }
            } else {
              initialized = false;
            }
          }
          ctx.stroke();
        }
        ctx.restore();

        // 5. Draw fully-featured realistic continent landmasses (Natural Earth Colors!)
        ctx.save();
        CONTINENTS.forEach((continent) => {
          ctx.beginPath();
          let activePoint = false;

          continent.polygon.forEach(([lat, lon]) => {
            const [x, y, z] = projectAndRotate(lat, lon, currentYaw.current, currentPitch.current);

            // Render only vertices wrapping forward
            if (z >= -0.15) {
              const px = Cx + x * R;
              const py = Cy - y * R;
              if (!activePoint) {
                ctx.moveTo(px, py);
                activePoint = true;
              } else {
                ctx.lineTo(px, py);
              }
            }
          });

          ctx.closePath();
          
          // Compute custom continent fill & path stroke based on mapStyle
          if (mapStyle === 'satellite') {
            let satColor = '#3d6e35';
            if (continent.name === 'Afrika') {
              satColor = isDarkMode ? '#524c30' : '#8c8253'; // desert safari
            } else if (continent.name === 'Avstraliya') {
              satColor = isDarkMode ? '#61381c' : '#a05c2e'; // outback red sand
            } else if (continent.name === 'Antarktida') {
              satColor = isDarkMode ? '#8fa4bc' : '#dae3ed'; // ice glacier snow
            } else {
              satColor = isDarkMode ? '#1e3f19' : '#3d6e35'; // forest green
            }
            ctx.fillStyle = satColor;
            ctx.fill();

            // Smooth realistic continent boundaries
            ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.12)';
            ctx.lineWidth = 1;
            ctx.stroke();
          } else if (mapStyle === 'topographic') {
            const topoColor = isDarkMode ? '#713f12' : '#b45309'; // topographic amber/clay look
            ctx.fillStyle = topoColor;
            ctx.fill();

            // Prominent contour elevation lines for topographic aesthetic
            ctx.strokeStyle = isDarkMode ? 'rgba(217, 119, 6, 0.45)' : 'rgba(245, 158, 11, 0.65)';
            ctx.lineWidth = 1.6;
            ctx.stroke();
          } else {
            // 'colorful' (Rangdor) maps custom distinct hue for each continent
            ctx.fillStyle = isDarkMode ? `${continent.color}cc` : continent.color;
            ctx.fill();

            // Border outlines
            ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.45)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        });
        ctx.restore();

        // 6. Draw dynamic shaded hemisphere shadow (Adds realistic 3D volumetric sphere sense)
        const shadeGrad = ctx.createRadialGradient(
          Cx - R * 0.4,
          Cy - R * 0.4,
          R * 0.7,
          Cx,
          Cy,
          R
        );
        shadeGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        shadeGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.2)');
        shadeGrad.addColorStop(0.9, 'rgba(0, 0, 0, 0.55)');
        shadeGrad.addColorStop(1, 'rgba(0, 0, 0, 0.82)');
        ctx.fillStyle = shadeGrad;
        ctx.beginPath();
        ctx.arc(Cx, Cy, R, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore(); // END CLIPPED SPHERE MASK RESTORATION

      // 6.5. Draw soft outer planetary Rayleigh scattering atmosphere layer (extending outside radius R towards sun-lit side)
      ctx.save();
      // Shift light sphere towards sun direction (upper-left) to simulate glowing Rayleigh rim scatter
      const haloGrad = ctx.createRadialGradient(
        Cx - R * 0.22, 
        Cy - R * 0.22, 
        R * 0.94, 
        Cx, 
        Cy, 
        R * 1.25
      );
      haloGrad.addColorStop(0, 'rgba(125, 185, 255, 0.58)');
      haloGrad.addColorStop(0.25, 'rgba(85, 155, 245, 0.36)');
      haloGrad.addColorStop(0.55, 'rgba(40, 95, 210, 0.16)');
      haloGrad.addColorStop(0.85, 'rgba(12, 35, 90, 0.03)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(Cx, Cy, R * 1.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 7. Draw Country Floating Pins, Glow Beacons, Emojis (Visible on Front Hemisphere)
      ctx.save();
      const tempPositions: typeof countryPositionsOnScreen.current = {};

      countries.forEach((country) => {
        const [x, y, z] = projectAndRotate(
          country.coords[0],
          country.coords[1],
          currentYaw.current,
          currentPitch.current
        );

        const px = Cx + x * R;
        const py = Cy - y * R;
        const isVisible = z >= 0.05; // Visible if z depth is positive front side

        tempPositions[country.code] = { x: px, y: py, visible: isVisible, country };

        if (isVisible) {
          const isSelected = selectedCountry?.code === country.code;

          // Draws glowing pulsing indicator concentric rings for focused Selection target
          if (isSelected) {
            ctx.save();
            const pulseRadius = 14 + Math.sin(pulseRadiusAngle) * 6;
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(px, py, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Concentric background pulse ring
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(px, py, pulseRadius + 6, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          // Render the beautiful rounded circular badge with country code matching the image design
          ctx.save();
          const rBadge = isSelected ? 11.5 : 8.5;
          
          // Subtle outer shadow for realistic 3D overlay sense
          ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetY = 1.6;

          ctx.beginPath();
          ctx.arc(px, py, rBadge, 0, Math.PI * 2);
          if (isSelected) {
            const grad = ctx.createLinearGradient(px - rBadge, py - rBadge, px + rBadge, py + rBadge);
            grad.addColorStop(0, '#6366f1');
            grad.addColorStop(1, '#8b5cf6');
            ctx.fillStyle = grad;
          } else {
            ctx.fillStyle = isDarkMode ? '#1e293b' : '#ffffff';
          }
          ctx.fill();

          // Smooth inner border outlines
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;
          ctx.beginPath();
          ctx.arc(px, py, rBadge, 0, Math.PI * 2);
          if (isSelected) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
          } else {
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.85)';
            ctx.lineWidth = 1.25;
          }
          ctx.stroke();

          // Render centered Two-Letter country codes
          ctx.font = isSelected ? 'bold 9px sans-serif' : 'bold 7px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          if (isSelected) {
            ctx.fillStyle = '#ffffff';
          } else {
            ctx.fillStyle = isDarkMode ? '#cbd5e1' : '#4f46e5';
          }
          ctx.fillText(country.code, px, py);
          ctx.restore();

          // Selected target country text badge label drawn cleanly
          if (isSelected) {
            ctx.save();
            ctx.font = 'bold 10px "Plus Jakarta Sans"';
            const textWidth = ctx.measureText(country.name).width;
            
            // Text capsule backdrop
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(px - textWidth / 2 - 8, py - 35, textWidth + 16, 18, 5);
            ctx.fill();
            ctx.stroke();

            // Text letters
            ctx.fillStyle = '#ffffff';
            ctx.fillText(country.name, px, py - 26);
            ctx.restore();
          }
        }
      });

      countryPositionsOnScreen.current = tempPositions;
      ctx.restore();

      animationFrameId.current = requestAnimationFrame(renderFrame);
    };

    animationFrameId.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      canvas.removeEventListener('wheel', handleWheelEvent);
      resizeObserver.disconnect();
    };
  }, [viewMode, countries, selectedCountry, isDarkMode, mapStyle, satelliteTextureLoaded]);

  // --- GLOBE MOUSE & TOUCH EVENT HANDLERS ---
  const handleInteractionStart = (clientX: number, clientY: number) => {
    isDragging.current = true;
    startX.current = clientX;
    startY.current = clientY;
    dragDistance.current = 0;
    yawVelocity.current = 0; // Freeze spin when actively holding the world
    pitchVelocity.current = 0;
  };

  const handleInteractionMove = (clientX: number, clientY: number) => {
    if (!isDragging.current) return;

    const dx = clientX - startX.current;
    const dy = clientY - startY.current;

    // Track total displacement during drag sequence
    dragDistance.current += Math.sqrt(dx * dx + dy * dy);

    startX.current = clientX;
    startY.current = clientY;

    // Direct, highly responsive rotational adjustment scaling to match natural physical dragging
    targetYaw.current -= dx * 0.0055;
    targetPitch.current += dy * 0.0055;

    // Record slide velocity momentum for releases (horizontal & vertical) to match natural drag inertia
    yawVelocity.current = -dx * 0.004;
    pitchVelocity.current = dy * 0.004;
  };

  const handleInteractionEnd = () => {
    isDragging.current = false;
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // If displacement was a minor tap/click, identify nearest country under cursor
    if (dragDistance.current < 6) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      let nearest: { country: Country; dist: number } | null = null;
      const hitLimit = Math.max(14, 18 * zoomRef.current);

      Object.values(countryPositionsOnScreen.current).forEach(({ x, y, visible, country }) => {
        if (!visible) return;
        const dist = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
        if (dist < hitLimit) {
          if (!nearest || dist < nearest.dist) {
            nearest = { country, dist };
          }
        }
      });

      if (nearest) {
        onSelectCountry((nearest as any).country);
      }
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let found: Country | null = null;
    let mindist = Math.max(14, 18 * zoomRef.current);

    Object.values(countryPositionsOnScreen.current).forEach(({ x, y, visible, country }) => {
      if (!visible) return;
      const dist = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
      if (dist < mindist) {
        found = country;
        mindist = dist;
      }
    });

    if (found !== hoveredNode) {
      setHoveredNode(found);
    }
  };

  // Flying home function
  const orbitToDefault = () => {
    if (viewMode === 'globe') {
      targetZoom.current = 1.0;
      // Rotate seamlessly back to core Central Asia coordinates (Uzbekistan!)
      const uz = countries.find(c => c.code === 'UZ') || countries[0];
      if (uz) {
        onSelectCountry(uz);
      } else {
        targetYaw.current = 1.12;
        targetPitch.current = 0.55;
        yawVelocity.current = 0;
        pitchVelocity.current = 0;
      }
    } else {
      if (mapRef.current) {
        mapRef.current.flyTo([41.3775, 64.5853], 5, { duration: 1.5 });
      }
    }
  };

  return (
    <div id="map-container-frame" className="relative w-full h-full min-h-[350px] sm:min-h-[450px] lg:h-full rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-sm shadow-slate-100 dark:shadow-none bg-[#090d16] dark:bg-slate-950 transition-colors duration-300 flex flex-col">
      
      {/* 2D Map Container element */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-10 block" 
      />

      {/* Map Interactive HUD control to fly back home centered */}
      <div className="absolute bottom-5 left-5 z-20">
        <button
          id="map-reset-btn"
          onClick={orbitToDefault}
          className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 duration-150 cursor-pointer border border-indigo-550"
        >
          <Navigation className="w-3.5 h-3.5 rotate-45" />
          <span>Uzbekistonga qaytish</span>
        </button>
      </div>

      {/* Modern custom zoom panel in the top-right tailored for 2D Map */}
      <div className="absolute top-5 right-5 z-20 flex flex-col items-end space-y-2 pointer-events-auto">
        <div className="p-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-lg flex items-center space-x-1">
          <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 px-2 font-mono tracking-widest hidden sm:inline-block">Yaqinlashtirish:</span>
          <button
            id="flat-zoom-in-btn"
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.zoomIn();
              }
            }}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-slate-755"
            title="Yaqinlashtirish"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            id="flat-zoom-out-btn"
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.zoomOut();
              }
            }}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-slate-755"
            title="Uzoqlashtirish"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
