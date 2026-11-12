import React, { useState, useEffect } from 'react';
import { Compass, Navigation, RefreshCw, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { calculateQiblaDirection, calculateDistanceToKaaba, getAngleDifference } from '../utils/qibla';
import { CityInfo } from '../data/cities';
import { audioEngine } from '../utils/audioEngine';
import { IslamicStarPattern, RubElHizbIcon } from './IslamicOrnaments';

interface QiblaCompassProps {
  city: CityInfo;
  batterySaver: boolean;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({ city, batterySaver }) => {
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [hasSensor, setHasSensor] = useState<boolean | null>(null);
  const [sensorPermission, setSensorPermission] = useState<'granted' | 'prompt' | 'denied'>('prompt');
  const [manualRotation, setManualRotation] = useState<number>(0);
  const [alignedVibrated, setAlignedVibrated] = useState<boolean>(false);

  const qiblaAngle = calculateQiblaDirection(city.latitude, city.longitude);
  const distanceKm = calculateDistanceToKaaba(city.latitude, city.longitude);

  const effectiveHeading = hasSensor ? compassHeading : manualRotation;
  const angleDiff = getAngleDifference(effectiveHeading, qiblaAngle);
  const isAligned = Math.abs(angleDiff) <= 3;

  useEffect(() => {
    if (isAligned && !alignedVibrated) {
      audioEngine.triggerVibration([80, 50, 120]);
      setAlignedVibrated(true);
    } else if (!isAligned && alignedVibrated) {
      setAlignedVibrated(false);
    }
  }, [isAligned, alignedVibrated]);

  const requestIOSOrientation = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (response === 'granted') {
          setSensorPermission('granted');
          setupListener();
        } else {
          setSensorPermission('denied');
        }
      } catch (err) {
        console.warn('iOS orientation permission error', err);
      }
    } else {
      setupListener();
    }
  };

  const setupListener = () => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;

      if ('webkitCompassHeading' in e && typeof (e as { webkitCompassHeading?: number }).webkitCompassHeading === 'number') {
        heading = (e as { webkitCompassHeading: number }).webkitCompassHeading;
      } else if (e.alpha !== null) {
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null && !isNaN(heading)) {
        setHasSensor(true);
        setCompassHeading(Math.round(heading));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setupListener();
      const timer = setTimeout(() => {
        setHasSensor((prev) => (prev === null ? false : prev));
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setHasSensor(false);
    }
  }, []);

  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center p-3.5 max-w-md mx-auto rounded-3xl bg-gradient-to-b from-stone-900/60 via-stone-900/90 to-emerald-950/30 border border-emerald-950/80 shadow-xl">
      <IslamicStarPattern opacity={0.06} />

      {/* Header Info (Compact) */}
      <div className="relative z-10 text-center mb-1">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold mb-1 shadow-sm">
          <Navigation className="w-3 h-3 text-emerald-400" />
          <span>Arah Kiblat: {qiblaAngle}°</span>
        </div>
        <h2 className="text-base font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
          <RubElHizbIcon size={14} className="text-emerald-400" />
          <span>Kompas Arah Kiblat</span>
        </h2>
        <p className="text-[10px] text-stone-400">
          {city.name} • ±{distanceKm.toLocaleString('id-ID')} km dari Ka&apos;bah, Makkah
        </p>
      </div>

      {/* Compact Circular Compass Dial (Reduced to w-56 h-56 / 224px for single-screen fit) */}
      <div className="relative z-10 w-56 h-56 flex items-center justify-center my-2">
        {/* Outer Ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
            isAligned
              ? 'border-emerald-400 shadow-xl shadow-emerald-500/50 bg-emerald-950/30 ring-2 ring-emerald-400/40'
              : 'border-emerald-900/60 bg-black/60 shadow-lg shadow-black/90'
          }`}
        />

        {/* Rotating Compass Disc based on heading */}
        <div
          className="absolute inset-2.5 rounded-full transition-transform duration-150 ease-out"
          style={{ transform: `rotate(${-effectiveHeading}deg)` }}
        >
          <svg className="w-full h-full" viewBox="0 0 220 220">
            {/* Islamic 8-point geometric star pattern on compass base */}
            <polygon
              points="110,30 125,95 190,110 125,125 110,190 95,125 30,110 95,95"
              fill="none"
              stroke="#047857"
              strokeWidth="0.8"
              opacity="0.3"
            />

            {/* Cardinal Markers */}
            <text x="110" y="24" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="bold">U</text>
            <text x="200" y="115" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">T</text>
            <text x="110" y="206" textAnchor="middle" fill="#a8a29e" fontSize="12" fontWeight="bold">S</text>
            <text x="20" y="115" textAnchor="middle" fill="#a8a29e" fontSize="12" fontWeight="bold">B</text>

            {/* Degree Ticks */}
            {Array.from({ length: 36 }).map((_, i) => {
              const deg = i * 10;
              const isMajor = deg % 30 === 0;
              return (
                <line
                  key={deg}
                  x1="110"
                  y1={isMajor ? '30' : '35'}
                  x2="110"
                  y2="40"
                  stroke={deg === 0 ? '#ef4444' : isMajor ? '#34d399' : '#065f46'}
                  strokeWidth={isMajor ? '1.5' : '1'}
                  transform={`rotate(${deg} 110 110)`}
                />
              );
            })}

            {/* Target Ka'bah Marker */}
            <g transform={`rotate(${qiblaAngle} 110 110)`}>
              <line x1="110" y1="42" x2="110" y2="65" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
              <rect x="102" y="20" width="16" height="16" rx="2" fill="#10b981" stroke="#34d399" strokeWidth="1" />
              <rect x="102" y="24" width="16" height="2.5" fill="#fde047" />
              <polygon points="110,12 104,18 116,18" fill="#34d399" />
            </g>
          </svg>
        </div>

        {/* Center Target Indicator Needle */}
        <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
          <div
            className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all ${
              isAligned
                ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-stone-950 scale-105 shadow-md shadow-emerald-500/60 ring-2 ring-emerald-400/40'
                : 'bg-stone-950/90 border border-emerald-900/60 text-stone-300'
            }`}
          >
            {isAligned ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-stone-950" />
                <span className="text-[9px] font-black uppercase">Tepat</span>
              </>
            ) : (
              <>
                <span className="font-mono text-base font-black text-emerald-300 leading-none">
                  {Math.abs(Math.round(angleDiff))}°
                </span>
                <span className="text-[8px] uppercase tracking-tight text-stone-400 mt-0.5">
                  {angleDiff > 0 ? 'Kanan ➔' : '⬅ Kiri'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Top Direction Indicator (Phone Top) */}
        <div className="absolute top-0.5 left-1/2 -translate-x-1/2 text-emerald-400 z-20">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <polygon points="12,2 22,22 12,18 2,22" />
          </svg>
        </div>
      </div>

      {/* Alignment Status Banner (Slim) */}
      <div className="relative z-10 w-full mt-1">
        {isAligned ? (
          <div className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-900/80 to-teal-900/80 border border-emerald-400 text-center shadow-sm">
            <p className="text-xs font-bold text-white flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              Perangkat Tepat Menghadap Kiblat!
            </p>
          </div>
        ) : (
          <div className="py-1.5 px-3 rounded-xl bg-stone-950/80 border border-stone-800 text-center">
            <p className="text-[11px] text-stone-300 font-medium">
              Putar HP hingga jarum Ka&apos;bah berada lurus di atas
            </p>
          </div>
        )}
      </div>

      {/* Calibration status or fallback slider */}
      <div className="relative z-10 w-full mt-2 pt-1.5 border-t border-stone-800/80">
        {hasSensor === false ? (
          <div className="bg-stone-950/90 border border-stone-800 p-2.5 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center gap-1 text-amber-400 font-medium text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Mode Simulasi Putar Manual:</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="359"
                value={manualRotation}
                onChange={(e) => setManualRotation(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5"
              />
              <span className="font-mono text-emerald-400 font-bold text-xs whitespace-nowrap">
                {manualRotation}°
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[10px] text-stone-400 px-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Sensor Kompas Aktif
            </span>
            <button
              onClick={requestIOSOrientation}
              className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              Kalibrasi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
