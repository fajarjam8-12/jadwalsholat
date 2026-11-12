import { PrayerTimesData } from '../utils/prayerEngine';

export interface SunnahPractice {
  id: string;
  title: string;
  subtitle: string;
  category: 'sholat_sunnah' | 'dzikir_harian' | 'amalan_jumat' | 'puasa_sunnah';
  timeSlotDescription: string;
  rakatCount?: string;
  niatArabic?: string;
  niatLatin?: string;
  niatTranslation?: string;
  virtue: string;
  haditsSource: string;
  isActiveNow: boolean;
  isTodaySpecial?: boolean; // e.g. Friday special or Monday/Thursday fasting
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Determines which Sunnah practices are active, upcoming, or relevant today
 */
export function getContextualSunnahPractices(
  now: Date,
  hijriDay: number,
  prayers: PrayerTimesData
): {
  activePractices: SunnahPractice[];
  allPractices: SunnahPractice[];
  fridaySpecial: SunnahPractice | null;
  fastingSpecial: SunnahPractice | null;
} {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, 4 = Thursday, 5 = Friday

  const fajrMin = parseTimeToMinutes(prayers.fajr);
  const sunriseMin = parseTimeToMinutes(prayers.sunrise);
  const dhuhrMin = parseTimeToMinutes(prayers.dhuhr);
  const asrMin = parseTimeToMinutes(prayers.asr);
  const maghribMin = parseTimeToMinutes(prayers.maghrib);
  const ishaMin = parseTimeToMinutes(prayers.isha);

  const isFriday = dayOfWeek === 5;
  const isThursdayEvening = dayOfWeek === 4 && currentMinutes >= maghribMin;
  const isFridayPeriod = isFriday || isThursdayEvening;

  const isMonday = dayOfWeek === 1;
  const isThursday = dayOfWeek === 4;
  const isAyyamulBidh = hijriDay === 13 || hijriDay === 14 || hijriDay === 15;

  const practices: SunnahPractice[] = [
    // 1. Tahajud & Witir (01:00 s.d. Subuh)
    {
      id: 'tahajud',
      title: 'Sholat Tahajud & Witir',
      subtitle: 'Sepertiga Malam Terakhir',
      category: 'sholat_sunnah',
      timeSlotDescription: '01:00 WIB s.d. Masuk Subuh',
      rakatCount: '2 - 8 rakaat + 3 rakaat Witir',
      niatArabic: 'أُصَلِّيْ سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ لِلّٰهِ تَعَالَى',
      niatLatin: 'Ushallii sunnatat-tahajjudi rak’ataini lillaahi ta’aalaa',
      niatTranslation: 'Aku niat sholat sunnah Tahajjud dua rakaat karena Allah Ta’ala.',
      virtue: 'Sholat sunnah paling utama setelah sholat fardhu, waktu mustajab doa dan permohonan ampunan.',
      haditsSource: 'HR. Muslim no. 1163',
      isActiveNow: currentMinutes >= 60 && currentMinutes < fajrMin,
    },

    // 2. Dzikir Pagi & Menunggu Syuruq (Subuh s.d. Syuruq)
    {
      id: 'dzikir-pagi',
      title: 'Dzikir Pagi & Menunggu Syuruq',
      subtitle: 'Pahala Sempurna Haji & Umrah',
      category: 'dzikir_harian',
      timeSlotDescription: 'Selepas Subuh s.d. Terbit Matahari (Syuruq)',
      niatArabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
      niatLatin: 'Ashbahnaa wa ashbahal-mulku lillaahi wal-hamdulillaah',
      niatTranslation: 'Kami berpagi hari dan berpagi hari pula kerajaan milik Allah, segala puji bagi Allah.',
      virtue: 'Duduk berdzikir di tempat sholat hingga matahari terbit lalu sholat 2 rakaat mendapat pahala seperti haji dan umrah sempurna.',
      haditsSource: 'HR. At-Tirmidzi no. 586 (hasan)',
      isActiveNow: currentMinutes >= fajrMin && currentMinutes <= sunriseMin + 15,
    },

    // 3. Sholat Dhuha (Syuruq + 20 menit s.d. Dzuhur - 15 menit)
    {
      id: 'dhuha',
      title: 'Sholat Sunnah Dhuha',
      subtitle: 'Sedekah 360 Persendian Tubuh',
      category: 'sholat_sunnah',
      timeSlotDescription: '±06:30 WIB s.d. 11:30 WIB (Pra-Dzuhur)',
      rakatCount: '2, 4, 6, atau 8 rakaat',
      niatArabic: 'أُصَلِّيْ سُنَّةَ الضُّحَى رَكْعَتَيْنِ لِلّٰهِ تَعَالَى',
      niatLatin: 'Ushallii sunnatadh-dhuhaa rak’ataini lillaahi ta’aalaa',
      niatTranslation: 'Aku niat sholat sunnah Dhuha dua rakaat karena Allah Ta’ala.',
      virtue: 'Mencukupi sedekah bagi seluruh persendian tulang tubuh manusia dan pembuka pintu kelapangan rezeki yang berkah.',
      haditsSource: 'HR. Muslim no. 720',
      isActiveNow: currentMinutes >= sunriseMin + 20 && currentMinutes < dhuhrMin - 15,
    },

    // 4. Rawatib Qabliyah Dzuhur
    {
      id: 'rawatib-qabliyah-dhuhr',
      title: 'Rawatib Qabliyah Dzuhur',
      subtitle: 'Sunnah Muakkadah Siang Hari',
      category: 'sholat_sunnah',
      timeSlotDescription: 'Saat masuk waktu Dzuhur sebelum sholat fardhu',
      rakatCount: '2 atau 4 rakaat',
      niatArabic: 'أُصَلِّيْ سُنَّةَ الظُّهْرِ رَكْعَتَيْنِ قَبْلِيَّةً لِلّٰهِ تَعَالَى',
      niatLatin: 'Ushallii sunnatadh-dhuhri rak’ataini qabliyyatan lillaahi ta’aalaa',
      niatTranslation: 'Aku niat sholat sunnah sebelum Dzuhur dua rakaat karena Allah Ta’ala.',
      virtue: 'Rasulullah SAW tidak pernah meninggalkan 4 rakaat sebelum Dzuhur karena pada saat itu pintu-pintu langit dibuka.',
      haditsSource: 'HR. At-Tirmidzi no. 478',
      isActiveNow: currentMinutes >= dhuhrMin - 15 && currentMinutes <= dhuhrMin + 20,
    },

    // 5. Rawatib Ba'diyah Dzuhur
    {
      id: 'rawatib-badiyah-dhuhr',
      title: 'Rawatib Ba’diyah Dzuhur',
      subtitle: 'Penjaga dari Api Neraka',
      category: 'sholat_sunnah',
      timeSlotDescription: 'Selepas sholat fardhu Dzuhur',
      rakatCount: '2 rakaat (Muakkad) atau 4 rakaat',
      niatArabic: 'أُصَلِّيْ سُنَّةَ الظُّهْرِ رَكْعَتَيْنِ بَعْدِيَّةً لِلّٰهِ تَعَالَى',
      niatLatin: 'Ushallii sunnatadh-dhuhri rak’ataini ba’diyyatan lillaahi ta’aalaa',
      niatTranslation: 'Aku niat sholat sunnah sesudah Dzuhur dua rakaat karena Allah Ta’ala.',
      virtue: 'Barangsiapa memelihara empat rakaat sebelum Dzuhur dan empat rakaat sesudahnya, Allah haramkan dirinya dari api neraka.',
      haditsSource: 'HR. Abu Dawud no. 1269 & At-Tirmidzi',
      isActiveNow: currentMinutes >= dhuhrMin + 10 && currentMinutes < asrMin - 20,
    },

    // 6. Sholat Sunnah Qabliyah Ashar
    {
      id: 'qabliyah-asr',
      title: 'Sunnah Qabliyah Ashar',
      subtitle: 'Mendapat Rahmat Khusus dari Allah',
      category: 'sholat_sunnah',
      timeSlotDescription: 'Menjelang sholat fardhu Ashar',
      rakatCount: '2 atau 4 rakaat',
      niatArabic: 'أُصَلِّيْ سُنَّةَ الْعَصْرِ رَكْعَتَيْنِ قَبْلِيَّةً لِلّٰهِ تَعَالَى',
      niatLatin: 'Ushallii sunnatal-‘ashri rak’ataini qabliyyatan lillaahi ta’aalaa',
      niatTranslation: 'Aku niat sholat sunnah sebelum Ashar dua rakaat karena Allah Ta’ala.',
      virtue: '"Semoga Allah merahmati seseorang yang sholat empat (atau dua) rakaat sebelum Ashar."',
      haditsSource: 'HR. At-Tirmidzi no. 430 & Ahmad',
      isActiveNow: currentMinutes >= asrMin - 20 && currentMinutes <= asrMin + 15,
    },

    // 7. Dzikir Petang & Doa Mustajab Menjelang Maghrib
    {
      id: 'dzikir-petang',
      title: 'Dzikir Petang & Doa Menjelang Senja',
      subtitle: 'Benteng Perlindungan Malam Hari',
      category: 'dzikir_harian',
      timeSlotDescription: 'Selepas Ashar s.d. Terbenam Matahari (Maghrib)',
      niatArabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
      niatLatin: 'Amsaynaa wa amsal-mulku lillaahi wal-hamdulillaah',
      niatTranslation: 'Kami memasuki waktu sore dan pada sore ini kekuasaan milik Allah.',
      virtue: 'Membentengi diri dari godaan setan, marabahaya, dan memperoleh ketenangan jiwa.',
      haditsSource: 'HR. Muslim no. 2723',
      isActiveNow: currentMinutes >= asrMin + 30 && currentMinutes < maghribMin,
    },

    // 8. Rawatib Ba'diyah Maghrib
    {
      id: 'rawatib-badiyah-maghrib',
      title: 'Rawatib Ba’diyah Maghrib',
      subtitle: 'Sunnah Muakkadah Petang',
      category: 'sholat_sunnah',
      timeSlotDescription: 'Selepas sholat fardhu Maghrib',
      rakatCount: '2 rakaat',
      niatArabic: 'أُصَلِّيْ سُنَّةَ الْمَغْرِبِ رَكْعَتَيْنِ بَعْدِيَّةً لِلّٰهِ تَعَالَى',
      niatLatin: 'Ushallii sunnatal-maghribi rak’ataini ba’diyyatan lillaahi ta’aalaa',
      niatTranslation: 'Aku niat sholat sunnah sesudah Maghrib dua rakaat karena Allah Ta’ala.',
      virtue: 'Termasuk dalam 12 rakaat rawatib yang dijanjikan istana megah di dalam surga.',
      haditsSource: 'HR. Muslim no. 728',
      isActiveNow: currentMinutes >= maghribMin + 5 && currentMinutes < ishaMin,
    },

    // 9. Rawatib Ba'diyah Isya
    {
      id: 'rawatib-badiyah-isha',
      title: 'Rawatib Ba’diyah Isya & Witir',
      subtitle: 'Penutup Amalan Sholat Hari Ini',
      category: 'sholat_sunnah',
      timeSlotDescription: 'Selepas sholat fardhu Isya sebelum tidur',
      rakatCount: '2 rakaat Ba’diyah + 1/3 rakaat Witir',
      niatArabic: 'أُصَلِّيْ سُنَّةَ الْعِشَاءِ رَكْعَتَيْنِ بَعْدِيَّةً لِلّٰهِ تَعَالَى',
      niatLatin: 'Ushallii sunnatal-‘isyaa’i rak’ataini ba’diyyatan lillaahi ta’aalaa',
      niatTranslation: 'Aku niat sholat sunnah sesudah Isya dua rakaat karena Allah Ta’ala.',
      virtue: 'Menjadikan sholat malam ganjil (Witir) sebagai penutup sholat sebelum beristirahat.',
      haditsSource: 'HR. Al-Bukhari no. 998',
      isActiveNow: currentMinutes >= ishaMin + 10 || currentMinutes < 60,
    },
    // 1. Sholat Sunnah Fajar / Qabliyah Subuh
    {
      id: 'qabliyah-fajr',
      title: 'Sholat Sunnah Fajar (Qabliyah Subuh)',
      subtitle: 'Lebih Baik dari Dunia dan Seisinya',
      category: 'sholat_sunnah',
      timeSlotDescription: 'Setelah adzan Subuh sebelum sholat fardhu',
      rakatCount: '2 rakaat ringan',
      niatArabic: 'أُصَلِّيْ سُنَّةَ الْفَجْرِ رَكْعَتَيْنِ قَبْلِيَّةً لِلّٰهِ تَعَالَى',
      niatLatin: 'Ushallii sunnatal-fajri rak’ataini qabliyyatan lillaahi ta’aalaa',
      niatTranslation: 'Aku niat sholat sunnah fajar dua rakaat sebelum Subuh karena Allah Ta’ala.',
      virtue: '"Dua rakaat fajar (sebelum Subuh) lebih baik daripada dunia beserta seluruh isinya."',
      haditsSource: 'HR. Muslim no. 725',
      isActiveNow: currentMinutes >= fajrMin && currentMinutes < fajrMin + 25,
    },

    // 2. Sholat Isyraq (Terbit Matahari + 15 Menit)
    {
      id: 'isyraq',
      title: 'Sholat Sunnah Isyraq',
      subtitle: 'Pahala Sempurna Haji dan Umrah',
      category: 'sholat_sunnah',
      timeSlotDescription: '±15-20 menit setelah Syuruq (Matahari Terbit)',
      rakatCount: '2 rakaat',
      niatArabic: 'أُصَلِّيْ سُنَّةَ الْإِشْرَاقِ رَكْعَتَيْنِ لِلّٰهِ تَعَالَى',
      niatLatin: 'Ushallii sunnatal-isyraaqi rak’ataini lillaahi ta’aalaa',
      niatTranslation: 'Aku niat sholat sunnah Isyraq dua rakaat karena Allah Ta’ala.',
      virtue: 'Bagi yang sholat Subuh berjamaah lalu berdzikir hingga matahari terbit dan sholat 2 rakaat, mendapat pahala haji dan umrah sempurna.',
      haditsSource: 'HR. At-Tirmidzi no. 586',
      isActiveNow: currentMinutes >= sunriseMin + 15 && currentMinutes < sunriseMin + 45,
    },

    // 3. Sholat Sunnah Wudhu & Tahiyyatul Masjid
    {
      id: 'sunnah-wudhu',
      title: 'Sholat Sunnah Syukrul Wudhu',
      subtitle: 'Amalan Sahabat Bilal bin Rabah',
      category: 'sholat_sunnah',
      timeSlotDescription: 'Setiap selesai berwudhu (Kapan saja)',
      rakatCount: '2 rakaat',
      niatArabic: 'أُصَلِّيْ سُنَّةَ الْوُضُوْءِ رَكْعَتَيْنِ لِلّٰهِ تَعَالَى',
      niatLatin: 'Ushallii sunnatal-wudhuu’i rak’ataini lillaahi ta’aalaa',
      niatTranslation: 'Aku niat sholat sunnah wudhu dua rakaat karena Allah Ta’ala.',
      virtue: 'Nabi SAW mendengar suara langkah terompah Bilal di surga berkat menjaga sholat dua rakaat setiap selesai bersuci.',
      haditsSource: 'HR. Bukhari no. 1147 & Muslim',
      isActiveNow: false,
    },

    // 4. Sholat Sunnah Taubat
    {
      id: 'sunnah-taubat',
      title: 'Sholat Sunnah Taubat',
      subtitle: 'Pembersih Dosa dan Penenang Jiwa',
      category: 'sholat_sunnah',
      timeSlotDescription: 'Dianjurkan terutama di malam hari / sepertiga malam',
      rakatCount: '2 rakaat',
      niatArabic: 'أُصَلِّيْ سُنَّةَ التَّوْبَةِ رَكْعَتَيْنِ لِلّٰهِ تَعَالَى',
      niatLatin: 'Ushallii sunnatat-taubati rak’ataini lillaahi ta’aalaa',
      niatTranslation: 'Aku niat sholat sunnah Taubat dua rakaat karena Allah Ta’ala.',
      virtue: 'Barangsiapa berwudhu dengan sempurna lalu sholat dua rakaat dan beristighfar memohon ampunan, niscaya Allah mengampuni dosanya.',
      haditsSource: 'HR. Abu Dawud no. 1521 & At-Tirmidzi',
      isActiveNow: currentMinutes >= 120 && currentMinutes < fajrMin,
    },
  ];

  // Friday Special Deed: Surah Al-Kahfi & Shalawat
  let fridaySpecial: SunnahPractice | null = null;
  if (isFridayPeriod) {
    fridaySpecial = {
      id: 'amalan-jumat-kahfi',
      title: 'Amalan Hari Jumat: Membaca Surah Al-Kahfi',
      subtitle: 'Sayyidul Ayyam (Hari Paling Mulia)',
      category: 'amalan_jumat',
      timeSlotDescription: 'Kamis Malam (Malam Jumat) s.d. Jumat Senja',
      virtue: 'Dipancarkan cahaya kemuliaan baginya di antara dua Jumat dan dilindungi dari fitnah Dajjal.',
      haditsSource: 'HR. An-Nasa’i, Al-Baihaqi & Al-Hakim (shahih)',
      isActiveNow: true,
      isTodaySpecial: true,
      niatArabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
      niatLatin: 'Allaahumma shalli ‘alaa Muhammad wa ‘alaa aali Muhammad',
      niatTranslation: 'Ya Allah, limpahkanlah shalawat kepada Nabi Muhammad dan keluarga Nabi Muhammad.',
    };
  }

  // Fasting Special: Senin-Kamis atau Ayyamul Bidh
  let fastingSpecial: SunnahPractice | null = null;
  if (isAyyamulBidh) {
    fastingSpecial = {
      id: 'puasa-ayyamul-bidh',
      title: `Puasa Sunnah Ayyamul Bidh (${hijriDay} Hijriyah)`,
      subtitle: 'Puasa Hari Putih Pertengahan Bulan',
      category: 'puasa_sunnah',
      timeSlotDescription: 'Tanggal 13, 14, 15 Setiap Bulan Hijriyah',
      virtue: 'Pahalanya seperti berpuasa sepanjang tahun jika rutin dikerjakan setiap bulan.',
      haditsSource: 'HR. Abu Dawud no. 2449 (shahih)',
      isActiveNow: true,
      isTodaySpecial: true,
      niatArabic: 'نَوَيْتُ صَوْمَ أَيَّامِ الْبِيْضِ سُنَّةً لِلّٰهِ تَعَالَى',
      niatLatin: 'Nawaitu shauma ayyaamil-biidhi sunnatan lillaahi ta’aalaa',
      niatTranslation: 'Aku niat puasa sunnah hari-hari putih (Ayyamul Bidh) karena Allah Ta’ala.',
    };
  } else if (isMonday || isThursday) {
    const dayName = isMonday ? 'Senin' : 'Kamis';
    fastingSpecial = {
      id: `puasa-${dayName.toLowerCase()}`,
      title: `Puasa Sunnah Hari ${dayName}`,
      subtitle: 'Hari Diangkatnya Catatan Amal',
      category: 'puasa_sunnah',
      timeSlotDescription: `Setiap Hari ${dayName}`,
      virtue: 'Nabi SAW bersabda: "Amal-amal manusia diperiksa pada hari Senin dan Kamis, maka aku suka amalku diperiksa saat aku berpuasa."',
      haditsSource: 'HR. At-Tirmidzi no. 747',
      isActiveNow: true,
      isTodaySpecial: true,
      niatArabic: `نَوَيْتُ صَوْمَ يَوْمِ ال${isMonday ? 'اثْنَيْنِ' : 'خَمِيْسِ'} سُنَّةً لِلّٰهِ تَعَالَى`,
      niatLatin: `Nawaitu shauma yaumil-${isMonday ? 'itsnaini' : 'khamiisi'} sunnatan lillaahi ta’aalaa`,
      niatTranslation: `Aku niat puasa sunnah hari ${dayName} karena Allah Ta’ala.`,
    };
  }

  const activePractices = practices.filter((p) => p.isActiveNow);

  return {
    activePractices,
    allPractices: practices,
    fridaySpecial,
    fastingSpecial,
  };
}
