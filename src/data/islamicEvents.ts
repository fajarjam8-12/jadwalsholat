/**
 * Database and calculation engine for Islamic Hijri Calendar & Hari Besar Islam
 */

export interface HijriDateDetails {
  day: number;
  monthIndex: number; // 0-based: 0 = Muharram, 8 = Ramadhan, 11 = Dzulhijjah
  monthName: string;
  monthArabic: string;
  year: number;
  formatted: string;
}

export interface IslamicEvent {
  id: string;
  title: string;
  arabicTitle?: string;
  hijriDay: number;
  hijriMonthIndex: number; // 0-based
  category: 'hari_raya' | 'puasa_wajib' | 'puasa_sunnah' | 'sejarah_islam';
  description: string;
  virtue: string; // keutamaan hadits
  practiceGuide?: string;
}

export const HIJRI_MONTHS = [
  { name: 'Muharram', arabic: 'مُحَرَّم', days: 30 },
  { name: 'Safar', arabic: 'صَفَر', days: 29 },
  { name: 'Rabiul Awwal', arabic: 'رَبِيع ٱلْأَوَّل', days: 30 },
  { name: 'Rabiul Akhir', arabic: 'رَبِيع ٱلْآخِر', days: 29 },
  { name: 'Jumadil Awwal', arabic: 'جُمَادَىٰ ٱلْأُولَىٰ', days: 30 },
  { name: 'Jumadil Akhir', arabic: 'جُمَادَىٰ ٱلْآخِرَة', days: 29 },
  { name: 'Rajab', arabic: 'رَجَب', days: 30 },
  { name: 'Sya’ban', arabic: 'شَعْبَان', days: 29 },
  { name: 'Ramadhan', arabic: 'رَمَضَان', days: 30 },
  { name: 'Syawwal', arabic: 'شَوَّال', days: 29 },
  { name: 'Dzulqa’dah', arabic: 'ذُو ٱلْقَعْدَة', days: 30 },
  { name: 'Dzulhijjah', arabic: 'ذُو ٱلْحِجَّة', days: 29 },
];

export const MAJOR_ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: 'tahun-baru-hijriyah',
    title: 'Tahun Baru Islam (1 Muharram)',
    arabicTitle: 'رَأْسُ السَّنَةِ الْهِجْرِيَّة',
    hijriDay: 1,
    hijriMonthIndex: 0,
    category: 'sejarah_islam',
    description: 'Peringatan awal tahun kalender Hijriyah dan momentum hijrah Rasulullah SAW.',
    virtue: 'Bulan Muharram adalah salah satu dari 4 bulan haram (suci) yang sangat dimuliakan oleh Allah SWT.',
  },
  {
    id: 'puasa-asyura',
    title: 'Puasa Tasu’a & Asyura (9-10 Muharram)',
    arabicTitle: 'صَوْمُ تَاسُوعَاء وَعَاشُورَاء',
    hijriDay: 10,
    hijriMonthIndex: 0,
    category: 'puasa_sunnah',
    description: 'Puasa sunnah pada hari ke-9 dan ke-10 bulan Muharram.',
    virtue: 'Nabi SAW bersabda: "Puasa hari Asyura menghapuskan dosa setahun yang lalu." (HR. Muslim no. 1162)',
    practiceGuide: 'Disunnahkan berpuasa tanggal 9 (Tasu\'a) dan 10 Muharram (Asyura) untuk menyelisihi kaum Yahudi.',
  },
  {
    id: 'maulid-nabi',
    title: 'Maulid Nabi Muhammad SAW (12 Rabiul Awwal)',
    arabicTitle: 'مَوْلِدُ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّم',
    hijriDay: 12,
    hijriMonthIndex: 2,
    category: 'sejarah_islam',
    description: 'Hari kelahiran manusia termulia pembawa rahmat bagi semesta alam, Nabi Muhammad SAW.',
    virtue: 'Momentum memperbanyak shalawat, membaca sirah nabawiyah, dan meneladani akhlak Rasulullah SAW.',
  },
  {
    id: 'isra-miraj',
    title: 'Isra’ Mi’raj (27 Rajab)',
    arabicTitle: 'إِسْرَاءُ وَمِعْرَاج',
    hijriDay: 27,
    hijriMonthIndex: 6,
    category: 'sejarah_islam',
    description: 'Perjalanan agung Rasulullah SAW dari Masjidil Haram ke Masjidil Aqsa hingga Sidratul Muntaha.',
    virtue: 'Peristiwa diterimanya perintah ibadah sholat lima waktu langsung dari Allah SWT.',
  },
  {
    id: 'nisfu-syaban',
    title: 'Malam Nisfu Sya’ban (15 Sya’ban)',
    arabicTitle: 'لَيْلَةُ نِصْفِ شَعْبَان',
    hijriDay: 15,
    hijriMonthIndex: 7,
    category: 'sejarah_islam',
    description: 'Pertengahan bulan Sya’ban menjelang datangnya bulan suci Ramadhan.',
    virtue: 'Malam di mana Allah memandang hamba-Nya dengan penuh ampunan bagi yang memohon maghfirah.',
    practiceGuide: 'Perbanyak istighfar, sholat malam, dan puasa sunnah di siang harinya.',
  },
  {
    id: 'awal-ramadhan',
    title: 'Awal Puasa Ramadhan (1 Ramadhan)',
    arabicTitle: 'غُرَّةُ شَهْرِ رَمَضَان',
    hijriDay: 1,
    hijriMonthIndex: 8,
    category: 'puasa_wajib',
    description: 'Hari pertama kewajiban puasa Ramadhan, pintu surga dibuka dan pintu neraka ditutup.',
    virtue: 'Bulan diturunkannya Al-Qur\'an dan amalan sunnah dilipatgandakan pahalanya setara fardhu.',
  },
  {
    id: 'nuzulul-quran',
    title: 'Nuzulul Qur’an (17 Ramadhan)',
    arabicTitle: 'نُزُولُ الْقُرْآن',
    hijriDay: 17,
    hijriMonthIndex: 8,
    category: 'sejarah_islam',
    description: 'Peringatan pertama kali ayat suci Al-Qur’an (Surah Al-’Alaq 1-5) turun ke bumi di Gua Hira.',
    virtue: 'Malam tadarrus Al-Qur’an, istighotsah, dan mendekatkan diri kepada kalamullah.',
  },
  {
    id: 'lailatul-qadr',
    title: 'Malam Lailatul Qadar (10 Malam Terakhir)',
    arabicTitle: 'لَيْلَةُ الْقَدْر',
    hijriDay: 25, // representasi malam ganjil
    hijriMonthIndex: 8,
    category: 'sejarah_islam',
    description: 'Malam kemuliaan yang lebih baik daripada seribu bulan.',
    virtue: '"Malam kemuliaan itu lebih baik daripada seribu bulan." (QS. Al-Qadr: 3)',
    practiceGuide: 'I’tikaf di masjid, memperbanyak doa: Allaahumma innaka ‘afuwwun tuhibbul ‘afwa fa’fu ‘annii.',
  },
  {
    id: 'idul-fitri',
    title: 'Hari Raya Idul Fitri (1 Syawwal)',
    arabicTitle: 'عِيدُ الْفِطْرِ الْمُبَارَك',
    hijriDay: 1,
    hijriMonthIndex: 9,
    category: 'hari_raya',
    description: 'Hari kemenangan umat Islam setelah sebulan penuh berpuasa Ramadhan.',
    virtue: 'Disunnahkan mengumandangkan takbir, membayar zakat fitrah, dan sholat Id berjamaah.',
  },
  {
    id: 'puasa-syawwal',
    title: 'Puasa Sunnah 6 Hari Syawwal (2-7 Syawwal)',
    arabicTitle: 'صِيَامُ سِتَّةِ أَيَّامٍ مِنْ شَوَّال',
    hijriDay: 2,
    hijriMonthIndex: 9,
    category: 'puasa_sunnah',
    description: 'Puasa sunnah 6 hari di bulan Syawwal setelah hari raya Idul Fitri.',
    virtue: '"Barangsiapa berpuasa Ramadhan lalu melanjutkannya dengan enam hari di bulan Syawal, maka pahalanya seperti berpuasa setahun penuh." (HR. Muslim no. 1164)',
  },
  {
    id: 'fathu-makkah',
    title: 'Fathu Makkah (20 Ramadhan)',
    arabicTitle: 'فَتْحُ مَكَّة الْمُكَرَّمَة',
    hijriDay: 20,
    hijriMonthIndex: 8,
    category: 'sejarah_islam',
    description: 'Pembebasan kota Makkah Al-Mukarramah tanpa pertumpahan darah dan pembersihan Ka’bah dari berhala.',
    virtue: 'Kemenangan dakwah tauhid yang membuktikan keagungan sifat pemaaf Rasulullah SAW.',
  },
  {
    id: 'perang-badar',
    title: 'Yaumul Furqan - Perang Badar (17 Ramadhan)',
    arabicTitle: 'غَزْوَةُ بَدْرٍ الْكُبْرَى',
    hijriDay: 17,
    hijriMonthIndex: 8,
    category: 'sejarah_islam',
    description: 'Perang Badar Kubra di mana 313 prajurit muslimin dibantu ribuan malaikat mengalahkan 1.000 kaum kafir Quraisy.',
    virtue: 'Hari pembeda (Al-Furqan) antara yang haq dan yang bathil yang mengokohkan sendi peradaban Islam.',
  },
  {
    id: 'sepuluh-awal-dzulhijjah',
    title: '10 Hari Pertama Dzulhijjah (1-10 Dzulhijjah)',
    arabicTitle: 'عَشْرُ ذِي الْحِجَّةِ الْمُبَارَكَة',
    hijriDay: 1,
    hijriMonthIndex: 11,
    category: 'sejarah_islam',
    description: 'Hari-hari yang paling dicintai Allah untuk beramal shalih di sepanjang tahun.',
    virtue: '"Tidak ada hari di mana amal shalih lebih dicintai oleh Allah daripada hari-hari ini (10 awal Dzulhijjah)." (HR. Bukhari)',
    practiceGuide: 'Perbanyak puasa sunnah, tahlil, takbir, tahmid, dan sedekah.',
  },
  {
    id: 'hari-tarwiyah',
    title: 'Hari Tarwiyah (8 Dzulhijjah)',
    arabicTitle: 'يَوْمُ التَّرْوِيَة',
    hijriDay: 8,
    hijriMonthIndex: 11,
    category: 'puasa_sunnah',
    description: 'Hari persiapan wukuf dan awal mula jamaah haji menuju Mina untuk membekali air.',
    virtue: 'Disunnahkan berpuasa sunnah bagi muslim yang tidak sedang menunaikan ibadah haji.',
  },
  {
    id: 'puasa-arafah',
    title: 'Hari Arafah & Puasa Arafah (9 Dzulhijjah)',
    arabicTitle: 'يَوْمُ عَرَفَة وَصَوْمُ عَرَفَة',
    hijriDay: 9,
    hijriMonthIndex: 11,
    category: 'puasa_sunnah',
    description: 'Hari wukuf jamaah haji di Padang Arafah dan puasa sunnah utama bagi yang tidak berhaji.',
    virtue: '"Puasa Arafah dapat menghapuskan dosa setahun yang lalu dan setahun yang akan datang." (HR. Muslim no. 1162)',
  },
  {
    id: 'idul-adha',
    title: 'Hari Raya Idul Adha (10 Dzulhijjah)',
    arabicTitle: 'عِيدُ الْأَضْحَىٰ الْمُبَارَك',
    hijriDay: 10,
    hijriMonthIndex: 11,
    category: 'hari_raya',
    description: 'Hari Raya Qurban mengenang keteladanan Nabi Ibrahim AS dan Nabi Ismail AS.',
    virtue: 'Disunnahkan sholat Idul Adha dan menyembelih hewan qurban bagi yang berkemampuan.',
  },
  {
    id: 'hari-tasyrik',
    title: 'Hari Tasyrik (11, 12, 13 Dzulhijjah)',
    arabicTitle: 'أَيَّامُ التَّشْرِيق',
    hijriDay: 11,
    hijriMonthIndex: 11,
    category: 'sejarah_islam',
    description: 'Hari-hari makan, minum, dan mengingat Allah SWT (diharamkan berpuasa).',
    virtue: 'Hari penyembelihan qurban dan memperbanyak takbir muqayyad selepas sholat fardhu.',
  },
  {
    id: 'awal-rajab',
    title: 'Awal Bulan Rajab (Bulan Haram Suci)',
    arabicTitle: 'غُرَّةُ شَهْرِ رَجَبِ الأَصَبّ',
    hijriDay: 1,
    hijriMonthIndex: 6,
    category: 'sejarah_islam',
    description: 'Masuknya salah satu dari 4 Asyhurul Hurum (bulan suci yang dimuliakan).',
    virtue: 'Bulan menanam benih amal kebajikan untuk dipupuk di Sya’ban dan dipanen di bulan suci Ramadhan.',
  },
];

/**
 * Calculates current precise Hijri date details
 */
export function getDetailedHijriDate(date: Date): HijriDateDetails {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  const jdn = d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) -
              Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;

  const l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) +
            (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
  const l3 = l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
             (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const hijriMonthIndex = Math.floor((24 * l3) / 709) - 1;
  const hijriDay = l3 - Math.floor((709 * (hijriMonthIndex + 1)) / 24);
  const hijriYear = 30 * n + j - 30;

  const monthIdx = Math.max(0, Math.min(11, hijriMonthIndex));
  const monthData = HIJRI_MONTHS[monthIdx];
  const day = Math.max(1, Math.min(30, hijriDay));

  return {
    day,
    monthIndex: monthIdx,
    monthName: monthData.name,
    monthArabic: monthData.arabic,
    year: hijriYear,
    formatted: `${day} ${monthData.name} ${hijriYear} H`,
  };
}

export interface UpcomingEventInfo extends IslamicEvent {
  daysLeft: number;
  isToday: boolean;
  isTomorrow: boolean;
}

/**
 * Calculates days remaining until each major Islamic event
 */
export function getUpcomingIslamicEvents(currentHijri: HijriDateDetails): UpcomingEventInfo[] {
  // Approximate total days from start of year to a given day in hijri
  const getDayOfYear = (monthIdx: number, day: number): number => {
    let sum = 0;
    for (let i = 0; i < monthIdx; i++) {
      sum += HIJRI_MONTHS[i].days;
    }
    return sum + day;
  };

  const currentDayOfYear = getDayOfYear(currentHijri.monthIndex, currentHijri.day);
  const totalDaysInHijriYear = 354;

  const results: UpcomingEventInfo[] = MAJOR_ISLAMIC_EVENTS.map((event) => {
    const eventDayOfYear = getDayOfYear(event.hijriMonthIndex, event.hijriDay);
    let diff = eventDayOfYear - currentDayOfYear;
    if (diff < 0) {
      diff += totalDaysInHijriYear;
    }
    return {
      ...event,
      daysLeft: diff,
      isToday: diff === 0,
      isTomorrow: diff === 1,
    };
  });

  // Sort by closest upcoming
  results.sort((a, b) => a.daysLeft - b.daysLeft);
  return results;
}

/**
 * Checks if there is any major Islamic event happening tomorrow (1 day before)
 */
export function getTomorrowIslamicEvents(currentHijri: HijriDateDetails): UpcomingEventInfo[] {
  const events = getUpcomingIslamicEvents(currentHijri);
  return events.filter((e) => e.isTomorrow);
}

