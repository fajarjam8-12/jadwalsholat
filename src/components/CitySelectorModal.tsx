import React, { useState } from 'react';
import { X, Search, MapPin, Navigation, Check, Loader2 } from 'lucide-react';
import { POPULAR_CITIES, CityInfo } from '../data/cities';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: CityInfo;
  onSelectCity: (city: CityInfo) => void;
  onUseGPS: () => Promise<void>;
  isLocatingGPS: boolean;
  gpsActive: boolean;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
  onUseGPS,
  isLocatingGPS,
  gpsActive,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredCities = POPULAR_CITIES.filter((city) => {
    const q = search.toLowerCase();
    return (
      city.name.toLowerCase().includes(q) ||
      (city.province && city.province.toLowerCase().includes(q)) ||
      city.country.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Pilih Lokasi & Kota</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Button */}
        <div className="p-4 pb-2">
          <button
            onClick={async () => {
              await onUseGPS();
              onClose();
            }}
            disabled={isLocatingGPS}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-sm transition active:scale-95 ${
              gpsActive
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50'
            }`}
          >
            {isLocatingGPS ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mendeteksi Koordinat GPS...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>{gpsActive ? 'GPS Aktif (Perbarui Lokasi)' : 'Gunakan Lokasi GPS Otomatis'}</span>
              </>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari nama kota atau provinsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* City List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 max-h-[50vh] no-scrollbar">
          {filteredCities.map((city) => {
            const isSelected = !gpsActive && selectedCity.id === city.id;
            return (
              <button
                key={city.id}
                onClick={() => {
                  onSelectCity(city);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition ${
                  isSelected
                    ? 'bg-emerald-950/60 border border-emerald-500/50 text-white'
                    : 'hover:bg-stone-800/60 text-stone-300'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold">{city.name}</div>
                  <div className="text-xs text-stone-500">
                    {city.province ? `${city.province}, ` : ''}{city.country}
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            );
          })}

          {filteredCities.length === 0 && (
            <div className="text-center py-8 text-stone-500 text-sm">
              Kota tidak ditemukan. Coba kata kunci lain atau gunakan GPS Otomatis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
