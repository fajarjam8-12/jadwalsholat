export interface CityInfo {
  id: string;
  name: string;
  province?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export const POPULAR_CITIES: CityInfo[] = [
  // Indonesia - Jawa
  { id: 'jkt', name: 'DKI Jakarta', province: 'DKI Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta' },
  { id: 'sby', name: 'Surabaya', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.2575, longitude: 112.7521, timezone: 'Asia/Jakarta' },
  { id: 'bdg', name: 'Bandung', province: 'Jawa Barat', country: 'Indonesia', latitude: -6.9175, longitude: 107.6191, timezone: 'Asia/Jakarta' },
  { id: 'smg', name: 'Semarang', province: 'Jawa Tengah', country: 'Indonesia', latitude: -6.9667, longitude: 110.4167, timezone: 'Asia/Jakarta' },
  { id: 'ygy', name: 'Yogyakarta', province: 'DI Yogyakarta', country: 'Indonesia', latitude: -7.7956, longitude: 110.3695, timezone: 'Asia/Jakarta' },
  { id: 'slo', name: 'Surakarta (Solo)', province: 'Jawa Tengah', country: 'Indonesia', latitude: -7.5667, longitude: 110.8167, timezone: 'Asia/Jakarta' },
  { id: 'mlg', name: 'Malang', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.9797, longitude: 112.6304, timezone: 'Asia/Jakarta' },
  { id: 'bgr', name: 'Bogor', province: 'Jawa Barat', country: 'Indonesia', latitude: -6.5971, longitude: 106.8060, timezone: 'Asia/Jakarta' },
  { id: 'dpk', name: 'Depok', province: 'Jawa Barat', country: 'Indonesia', latitude: -6.4025, longitude: 106.7942, timezone: 'Asia/Jakarta' },
  { id: 'tgr', name: 'Tangerang', province: 'Banten', country: 'Indonesia', latitude: -6.1783, longitude: 106.6319, timezone: 'Asia/Jakarta' },
  { id: 'bks', name: 'Bekasi', province: 'Jawa Barat', country: 'Indonesia', latitude: -6.2383, longitude: 106.9756, timezone: 'Asia/Jakarta' },
  { id: 'crb', name: 'Cirebon', province: 'Jawa Barat', country: 'Indonesia', latitude: -6.7063, longitude: 108.5570, timezone: 'Asia/Jakarta' },
  { id: 'srn', name: 'Serang', province: 'Banten', country: 'Indonesia', latitude: -6.1200, longitude: 106.1503, timezone: 'Asia/Jakarta' },

  // Indonesia - Sumatera
  { id: 'mdn', name: 'Medan', province: 'Sumatera Utara', country: 'Indonesia', latitude: 3.5952, longitude: 98.6722, timezone: 'Asia/Jakarta' },
  { id: 'plb', name: 'Palembang', province: 'Sumatera Selatan', country: 'Indonesia', latitude: -2.9909, longitude: 104.7565, timezone: 'Asia/Jakarta' },
  { id: 'pdg', name: 'Padang', province: 'Sumatera Barat', country: 'Indonesia', latitude: -0.9471, longitude: 100.4172, timezone: 'Asia/Jakarta' },
  { id: 'pku', name: 'Pekanbaru', province: 'Riau', country: 'Indonesia', latitude: 0.5071, longitude: 101.4478, timezone: 'Asia/Jakarta' },
  { id: 'btm', name: 'Batam', province: 'Kepulauan Riau', country: 'Indonesia', latitude: 1.1301, longitude: 104.0529, timezone: 'Asia/Jakarta' },
  { id: 'bdl', name: 'Bandar Lampung', province: 'Lampung', country: 'Indonesia', latitude: -5.4500, longitude: 105.2667, timezone: 'Asia/Jakarta' },
  { id: 'ach', name: 'Banda Aceh', province: 'Aceh', country: 'Indonesia', latitude: 5.5483, longitude: 95.3238, timezone: 'Asia/Jakarta' },
  { id: 'jmb', name: 'Jambi', province: 'Jambi', country: 'Indonesia', latitude: -1.6101, longitude: 103.6131, timezone: 'Asia/Jakarta' },
  { id: 'bgl', name: 'Bengkulu', province: 'Bengkulu', country: 'Indonesia', latitude: -3.8004, longitude: 102.2655, timezone: 'Asia/Jakarta' },
  { id: 'pgk', name: 'Pangkal Pinang', province: 'Bangka Belitung', country: 'Indonesia', latitude: -2.1333, longitude: 106.1167, timezone: 'Asia/Jakarta' },

  // Indonesia - Kalimantan
  { id: 'ptk', name: 'Pontianak', province: 'Kalimantan Barat', country: 'Indonesia', latitude: -0.0263, longitude: 109.3425, timezone: 'Asia/Pontianak' },
  { id: 'bjm', name: 'Banjarmasin', province: 'Kalimantan Selatan', country: 'Indonesia', latitude: -3.3194, longitude: 114.5908, timezone: 'Asia/Makassar' },
  { id: 'bpn', name: 'Balikpapan', province: 'Kalimantan Timur', country: 'Indonesia', latitude: -1.2379, longitude: 116.8529, timezone: 'Asia/Makassar' },
  { id: 'smd', name: 'Samarinda', province: 'Kalimantan Timur', country: 'Indonesia', latitude: -0.5022, longitude: 117.1536, timezone: 'Asia/Makassar' },
  { id: 'prk', name: 'Palangka Raya', province: 'Kalimantan Tengah', country: 'Indonesia', latitude: -2.2161, longitude: 113.9139, timezone: 'Asia/Jakarta' },
  { id: 'trk', name: 'Tarakan', province: 'Kalimantan Utara', country: 'Indonesia', latitude: 3.3274, longitude: 117.5786, timezone: 'Asia/Makassar' },
  { id: 'ikn', name: 'Nusantara (IKN)', province: 'Kalimantan Timur', country: 'Indonesia', latitude: -0.9744, longitude: 116.7088, timezone: 'Asia/Makassar' },

  // Indonesia - Sulawesi, Bali, Nusa Tenggara
  { id: 'mks', name: 'Makassar', province: 'Sulawesi Selatan', country: 'Indonesia', latitude: -5.1477, longitude: 119.4327, timezone: 'Asia/Makassar' },
  { id: 'mnd', name: 'Manado', province: 'Sulawesi Utara', country: 'Indonesia', latitude: 1.4748, longitude: 124.8421, timezone: 'Asia/Makassar' },
  { id: 'plu', name: 'Palu', province: 'Sulawesi Tengah', country: 'Indonesia', latitude: -0.9003, longitude: 119.8779, timezone: 'Asia/Makassar' },
  { id: 'kdr', name: 'Kendari', province: 'Sulawesi Tenggara', country: 'Indonesia', latitude: -3.9985, longitude: 122.5126, timezone: 'Asia/Makassar' },
  { id: 'gtl', name: 'Gorontalo', province: 'Gorontalo', country: 'Indonesia', latitude: 0.5435, longitude: 123.0568, timezone: 'Asia/Makassar' },
  { id: 'dps', name: 'Denpasar', province: 'Bali', country: 'Indonesia', latitude: -8.6705, longitude: 115.2126, timezone: 'Asia/Makassar' },
  { id: 'mtr', name: 'Mataram (Lombok)', province: 'Nusa Tenggara Barat', country: 'Indonesia', latitude: -8.5833, longitude: 116.1167, timezone: 'Asia/Makassar' },
  { id: 'kpg', name: 'Kupang', province: 'Nusa Tenggara Timur', country: 'Indonesia', latitude: -10.1772, longitude: 123.6070, timezone: 'Asia/Makassar' },

  // Indonesia - Maluku & Papua
  { id: 'amb', name: 'Ambon', province: 'Maluku', country: 'Indonesia', latitude: -3.6954, longitude: 128.1814, timezone: 'Asia/Jayapura' },
  { id: 'tnt', name: 'Ternate', province: 'Maluku Utara', country: 'Indonesia', latitude: 0.7904, longitude: 127.3822, timezone: 'Asia/Jayapura' },
  { id: 'jyp', name: 'Jayapura', province: 'Papua', country: 'Indonesia', latitude: -2.5916, longitude: 140.6690, timezone: 'Asia/Jayapura' },
  { id: 'srg', name: 'Sorong', province: 'Papua Barat Daya', country: 'Indonesia', latitude: -0.8762, longitude: 131.2558, timezone: 'Asia/Jayapura' },

  // Kota-Kota Suci & Internasional
  { id: 'mkk', name: 'Makkah Al-Mukarramah', province: 'Makkah', country: 'Arab Saudi', latitude: 21.3891, longitude: 39.8579, timezone: 'Asia/Riyadh' },
  { id: 'mdh', name: 'Madinah Al-Munawwarah', province: 'Madinah', country: 'Arab Saudi', latitude: 24.5247, longitude: 39.5692, timezone: 'Asia/Riyadh' },
  { id: 'qds', name: 'Al-Quds (Yerusalem)', province: 'Yerusalem', country: 'Palestina', latitude: 31.7683, longitude: 35.2137, timezone: 'Asia/Hebron' },
  { id: 'kul', name: 'Kuala Lumpur', province: 'Wilayah Persekutuan', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869, timezone: 'Asia/Kuala_Lumpur' },
  { id: 'sin', name: 'Singapura', province: 'Singapura', country: 'Singapura', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
  { id: 'bwn', name: 'Bandar Seri Begawan', province: 'Brunei-Muara', country: 'Brunei', latitude: 4.9031, longitude: 114.9398, timezone: 'Asia/Brunei' },
  { id: 'ist', name: 'Istanbul', province: 'Istanbul', country: 'Turki', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul' },
  { id: 'cai', name: 'Kairo', province: 'Kairo', country: 'Mesir', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo' },
  { id: 'lon', name: 'London', province: 'Greater London', country: 'Inggris', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { id: 'tky', name: 'Tokyo', province: 'Tokyo', country: 'Jepang', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
];

export const DEFAULT_CITY: CityInfo = POPULAR_CITIES[0]; // Jakarta
