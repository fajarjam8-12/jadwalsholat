export interface DoaItem {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  source?: string;
  category: 'adzan' | 'sholat' | 'pagi_petang' | 'tasbih';
}

export const DOA_LIST: DoaItem[] = [
  {
    id: 'doa-adzan',
    title: 'Doa Setelah Adzan Selesai',
    category: 'adzan',
    arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    latin: 'Allaahumma rabba haadzihid da’watit taammah, wash-shalaatil qaa’imah, aati muhammadanil wasiilata wal fadhiilah, wab’atshu maqaamam mahmuudanil ladzii wa’adtah.',
    translation: 'Ya Allah, Tuhan pemilik seruan yang sempurna ini dan sholat yang akan didirikan, berikanlah kepada Nabi Muhammad wasilah (kedudukan tinggi) dan keutamaan, serta bangkitkanlah beliau pada tempat terpuji yang telah Engkau janjikan.',
    source: 'HR. Bukhari no. 614'
  },
  {
    id: 'dzikir-istighfar',
    title: 'Istighfar & Doa Keselamatan',
    category: 'sholat',
    arabic: 'أَسْتَغْفِرُ اللهَ (٣×) اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    latin: 'Astaghfirullah (3x). Allaahumma antas-salaamu wa minkas-salaam, tabaarakta yaa dzal jalaali wal ikraam.',
    translation: 'Aku memohon ampun kepada Allah (3x). Ya Allah, Engkau adalah Dzat yang memberi keselamatan dan dari-Mu lah keselamatan, Maha Berkah Engkau wahai Dzat yang memiliki keagungan dan kemuliaan.',
    source: 'HR. Muslim no. 591'
  },
  {
    id: 'dzikir-ayat-kursi',
    title: 'Ayat Kursi (Setelah Sholat)',
    category: 'sholat',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    latin: 'Allaahu laa ilaaha illaa huwal hayyul qayyuum, laa ta’khudzuhuu sinatuw-wa laa nawm, lahuu maa fis-samaawaati wa maa fil ardh...',
    translation: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus makhluk-Nya, tidak mengantuk dan tidak tidur...',
    source: 'QS. Al-Baqarah: 255 (HR. An-Nasa\'i)'
  },
  {
    id: 'dzikir-tasbih-tahmid-takbir',
    title: 'Tasbih, Tahmid, & Takbir (33x)',
    category: 'sholat',
    arabic: 'سُبْحَانَ اللهِ (٣٣×) ، الحَمْدُ لِلَّهِ (٣٣×) ، اللهُ أَكْبَرُ (٣٣×)',
    latin: 'Subhanallah (33x), Alhamdulillah (33x), Allahu Akbar (33x). Ditutup: Laa ilaaha illallaah wahdahu laa syariikalah...',
    translation: 'Maha Suci Allah (33x), Segala Puji bagi Allah (33x), Allah Maha Besar (33x). Barangsiapa membacanya, diampuni dosa-dosanya walau sebanyak buih di lautan.',
    source: 'HR. Muslim no. 597'
  },
  {
    id: 'doa-sebelum-subuh',
    title: 'Doa Masuk Waktu Pagi',
    category: 'pagi_petang',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    latin: 'Ashbahnaa wa ashbahal mulku lillaah, walhamdulillaah, laa ilaaha illallaahu wahdahu laa syariika lah.',
    translation: 'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah, tiada tuhan selain Allah yang Maha Esa, tiada sekutu bagi-Nya.',
    source: 'HR. Muslim no. 2723'
  }
];

export const TASBIH_PRESETS = [
  { id: 'subhanallah', title: 'Subhanallah', arabic: 'سُبْحَانَ اللهِ', target: 33, meaning: 'Maha Suci Allah' },
  { id: 'alhamdulillah', title: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', target: 33, meaning: 'Segala Puji Bagi Allah' },
  { id: 'allahuakbar', title: 'Allahu Akbar', arabic: 'اللهُ أَكْبَرُ', target: 33, meaning: 'Allah Maha Besar' },
  { id: 'astaghfirullah', title: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللهَ', target: 100, meaning: 'Aku Memohon Ampun Kepada Allah' },
  { id: 'sholawat', title: 'Sholawat Nabi', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', target: 100, meaning: 'Shalawat atas Nabi Muhammad SAW' },
  { id: 'tahlil', title: 'Laa Ilaaha Illallaah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', target: 100, meaning: 'Tiada Tuhan Selain Allah' },
];
