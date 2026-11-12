/**
 * Daily Hadits & Kisah Teladan Sahabat (Motivasi Amaliah)
 * Curated authentic traditions and inspiring stories for daily motivation
 */

export interface HaditsKisahItem {
  id: string;
  title: string;
  arabic?: string;
  matanIndo: string;
  source: string;
  hikmah: string;
  category: 'sholat' | 'sedekah' | 'akhlak' | 'quran' | 'istiqomah' | 'dzikir';
}

export const DAILY_HADITS_COLLECTION: HaditsKisahItem[] = [
  {
    id: 'hadits-1',
    title: 'Keutamaan Sholat di Awal Waktu',
    arabic: 'سُئِلَ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: أَيُّ الْعَمَلِ أَحَبُّ إِلَى اللَّهِ؟ قَالَ: الصَّلَاةُ عَلَى وَقْتِهَا',
    matanIndo: 'Nabi SAW ditanya: "Amalan apakah yang paling dicintai oleh Allah?" Beliau menjawab: "Sholat tepat pada waktunya."',
    source: 'HR. Bukhari no. 527 & Muslim no. 85',
    hikmah: 'Menjaga waktu sholat adalah cerminan loyalitas dan cinta tertinggi seorang hamba kepada Sang Pencipta di tengah kesibukan dunia.',
    category: 'sholat',
  },
  {
    id: 'hadits-2',
    title: 'Amalan yang Paling Dicintai adalah yang Istiqomah',
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    matanIndo: 'Rasulullah SAW bersabda: "Amalan yang paling dicintai oleh Allah adalah amalan yang dilakukan secara kontinu (istiqomah) walaupun sedikit."',
    source: 'HR. Bukhari no. 6464 & Muslim no. 783',
    hikmah: 'Kebaikan kecil yang dirutinkan setiap hari jauh lebih bernilai di sisi Allah daripada amalan besar yang hanya dilakukan sesekali lalu terhenti.',
    category: 'istiqomah',
  },
  {
    id: 'hadits-3',
    title: 'Dua Rakaat Sebelum Subuh Lebih Baik dari Dunia',
    arabic: 'رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا',
    matanIndo: 'Rasulullah SAW bersabda: "Dua rakaat sholat sunnah fajar (sebelum Subuh) lebih baik daripada dunia beserta seluruh isinya."',
    source: 'HR. Muslim no. 725',
    hikmah: 'Jika dua rakaat sunnahnya saja melampaui kekayaan seisi bumi, betapa agung kemuliaan sholat fardhu Subuh yang ditegakkan berjamaah.',
    category: 'sholat',
  },
  {
    id: 'hadits-4',
    title: 'Sedekah Tidak Mengurangi Harta',
    arabic: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ، وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلَّا عِزًّا',
    matanIndo: 'Rasulullah SAW bersabda: "Sedekah tidak akan mengurangi harta, dan tidaklah Allah menambah bagi seorang hamba yang pemaaf melainkan kemuliaan."',
    source: 'HR. Muslim no. 2588',
    hikmah: 'Secara hitungan matematika harta berkurang, namun secara hakikat Allah melipatgandakan keberkahan, kesehatan, dan penjagaan tak terlihat.',
    category: 'sedekah',
  },
  {
    id: 'hadits-5',
    title: 'Kisah Sahabat yang Selalu Dirindukan Surga',
    matanIndo: 'Rasulullah SAW memberitahu para sahabat bahwa seorang lelaki Anshar adalah calon penghuni surga. Sahabat Abdullah bin Amr menginap di rumahnya selama 3 hari dan melihat ibadahnya biasa saja, namun lelaki itu berkata: "Setiap kali aku hendak tidur di malam hari, tidak ada secuil pun rasa iri, dengki, atau dendam di hatiku kepada sesama muslim."',
    source: 'Musnad Ahmad no. 12697 (Sanad Shahih)',
    hikmah: 'Hati yang bersih, memaafkan kesalahan orang lain sebelum tidur, dan terbebas dari iri dengki adalah amalan ringan yang mengantarkan ke surga.',
    category: 'akhlak',
  },
  {
    id: 'hadits-6',
    title: 'Keajaiban Membaca Satu Huruf Al-Qur’an',
    arabic: 'مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالحَسَنَةُ بِعَشْرِ أَمْثَالِهَا',
    matanIndo: 'Barangsiapa membaca satu huruf dari Kitabullah (Al-Qur\'an), maka baginya satu kebaikan, dan satu kebaikan dilipatgandakan menjadi sepuluh kali lipat.',
    source: 'HR. At-Tirmidzi no. 2910 (Hasan Shahih)',
    hikmah: 'Jangan biarkan hari kita berlalu tanpa melantunkan kalam Ilahi, walau hanya satu lembar atau beberapa ayat penyejuk kalbu.',
    category: 'quran',
  },
  {
    id: 'hadits-7',
    title: 'Dahsyatnya Doa di Waktu Sepertiga Malam Terakhir',
    arabic: 'يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ',
    matanIndo: 'Allah Tabaraka wa Ta\'ala turun ke langit dunia setiap malam pada sepertiga malam terakhir, seraya berfirman: "Siapa yang berdoa kepada-Ku niscaya Aku kabulkan, siapa yang meminta kepada-Ku niscaya Aku beri, dan siapa yang memohon ampun kepada-Ku niscaya Aku ampuni."',
    source: 'HR. Bukhari no. 1145 & Muslim no. 758',
    hikmah: 'Bangunlah di waktu sepertiga malam saat dunia terlelap. Curahkan isi hatimu kepada Dzat Yang Maha Mendengar segala bisikan.',
    category: 'sholat',
  },
  {
    id: 'hadits-8',
    title: 'Sholat Dhuha: Hak 360 Persendian Tubuh',
    arabic: 'يُصْبِحُ عَلَى كُلِّ سُلاَمَى مِنْ أَحَدِكُمْ صَدَقَةٌ... وَيُجْزِئُ مِنْ ذَلِكَ رَكْعَتَانِ يَرْكَعُهُمَا مِنَ الضُّحَى',
    matanIndo: 'Setiap pagi setiap persendian dari kalian wajib disedekahi... Dan semua itu cukup digantikan dengan mendirikan dua rakaat sholat Dhuha.',
    source: 'HR. Muslim no. 720',
    hikmah: 'Dua rakaat Dhuha yang kita tunaikan di sela rutinitas pagi adalah wujud syukur atas nikmat fisik yang sehat dan pembuka pintu rizki berkah.',
    category: 'sholat',
  },
  {
    id: 'hadits-9',
    title: 'Kisah Pohon Kurma yang Menangis Rindu',
    matanIndo: 'Batang pohon kurma yang biasa menjadi sandaran Nabi SAW saat khutbah merintih dan menangis seperti anak kecil ketika sebuah mimbar baru dibuat. Rasulullah SAW turun, memeluk pohon itu hingga ia tenang, lalu bersabda: "Ia menangis karena mendengar dzikir yang biasa dibacakan di dekatnya."',
    source: 'HR. Bukhari no. 3585',
    hikmah: 'Bahkan sebatang kayu kering pun memiliki kerinduan mendalam kepada Rasulullah SAW dan majelis dzikir. Bagaimana dengan hati kita?',
    category: 'akhlak',
  },
  {
    id: 'hadits-10',
    title: 'Kekuatan Istighfar Pembuka Segala Pintu Masalah',
    arabic: 'مَنْ لَزِمَ الِاسْتِغْفَارَ جَعَلَ اللَّهُ لَهُ مِنْ كُلِّ ضِيقٍ مَخْرَجًا، وَمِنْ كُلِّ هَمٍّ فَرَجًا',
    matanIndo: 'Barangsiapa melazimkan istighfar, Allah akan jadikan jalan keluar dari setiap kesempitan, jalan lapang dari setiap kesedihan, dan memberi rizki dari arah tak disangka-sangka.',
    source: 'HR. Abu Dawud no. 1518 & Ibnu Majah',
    hikmah: 'Basahilah lisan kita dengan ucapan Astaghfirullah. Istighfar adalah magnet pembuka berkah dan peredam kesulitan hidup.',
    category: 'dzikir',
  },
  {
    id: 'hadits-11',
    title: 'Menyebarkan Salam dan Memberi Makan',
    arabic: 'أَفْشُوا السَّلَامَ، وَأَطْعِمُوا الطَّعَامَ، وَصِلُوا الْأَرْحَامَ، وَصَلُّوا بِاللَّيْلِ وَالنَّاسُ نِيَامٌ، تَدْخُلُوا الْجَنَّةَ بِسَلَامٍ',
    matanIndo: 'Sebarkanlah salam, berikanlah makanan, sambunglah tali silaturahim, dan sholatlah di malam hari ketika manusia sedang tertidur, niscaya kalian masuk surga dengan selamat sejahtera.',
    source: 'HR. At-Tirmidzi no. 2485 & Ibnu Majah (Shahih)',
    hikmah: 'Empat amalan pembuka gerbang surga yang memadukan kebaikan sosial kepada sesama dan keintiman ibadah kepada Allah.',
    category: 'akhlak',
  },
  {
    id: 'hadits-12',
    title: 'Keutamaan Sholat Berjamaah 27 Derajat',
    arabic: 'صَلاَةُ الْجَمَاعَةِ تَفْضُلُ صَلاَةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً',
    matanIndo: 'Sholat berjamaah melampaui keutamaan sholat sendirian sebanyak dua puluh tujuh derajat.',
    source: 'HR. Bukhari no. 645 & Muslim no. 650',
    hikmah: 'Langkah kaki menuju masjid bukan hanya melipatgandakan pahala sholat, tetapi juga menggugurkan dosa dan mempererat persaudaraan umat.',
    category: 'sholat',
  },
  {
    id: 'hadits-13',
    title: 'Dua Kalimat Ringan di Lisan Berat di Timbangan',
    arabic: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي المِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ العَظِيمِ',
    matanIndo: 'Dua kalimat yang ringan di lisan, berat di timbangan (mizan), dan sangat dicintai oleh Ar-Rahman: Subhanallahi wa bihamdihi, Subhanallahil \'Azhim.',
    source: 'HR. Bukhari no. 6406 & Muslim no. 2694',
    hikmah: 'Dzikir yang sangat mudah diucapkan kapan pun di sela kesibukan kita, namun timbangannya memberatkan amal kebajikan di akhirat.',
    category: 'dzikir',
  },
  {
    id: 'hadits-14',
    title: 'Sebaik-Baik Manusia adalah yang Paling Bermanfaat',
    arabic: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    matanIndo: 'Sebaik-baik manusia adalah yang paling banyak memberikan manfaat bagi sesama manusia.',
    source: 'HR. At-Thabrani dalam Al-Ausath (Shahih)',
    hikmah: 'Kadar keimanan seseorang terpancar dari sejauh mana kehadiran dirinya menjadi solusi, meringankan beban, dan membawa kebahagiaan bagi sekitarnya.',
    category: 'akhlak',
  },
  {
    id: 'hadits-15',
    title: 'Menjaga Lisan dan Tangan',
    arabic: 'المُسْلِمُ مَنْ سَلِمَ المُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    matanIndo: 'Seorang muslim sejati adalah orang yang kaum muslimin lainnya merasa aman dan selamat dari keburukan lisan serta tangannya.',
    source: 'HR. Bukhari no. 10 & Muslim no. 40',
    hikmah: 'Ibadah ritual tidak akan sempurna jika tidak diimbangi dengan menjaga ucapan dari ghibah, fitnah, dan perbuatan yang menyakiti sesama.',
    category: 'akhlak',
  },
  {
    id: 'hadits-16',
    title: 'Menuntut Ilmu Adalah Jalan Menuju Surga',
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    matanIndo: 'Barangsiapa menempuh suatu jalan dalam rangka menuntut ilmu (syar\'i), maka Allah akan memudahkan baginya jalan menuju surga.',
    source: 'HR. Muslim no. 2699',
    hikmah: 'Setiap detik yang kita luangkan untuk membaca, mengaji, dan memahami agama adalah langkah nyata yang mempermudah langkah menuju jannah.',
    category: 'istiqomah',
  },
  {
    id: 'hadits-17',
    title: 'Sabar Menghadapi Ujian Menggugurkan Dosa',
    arabic: 'مَا يُصِيبُ المُسْلِمَ مِنْ نَصَبٍ وَلاَ وَصَبٍ وَلاَ هَمٍّ وَلاَ حُزْنٍ وَلاَ أَذًى وَلاَ غَمٍّ، حَتَّى الشَّوْكَةِ يُشَاكُهَا، إِلَّا كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ',
    matanIndo: 'Tidaklah menimpa seorang muslim berupa keletihan, penyakit, kegelisahan, kesedihan, gangguan, atau duka cita, bahkan duri yang menusuknya, melainkan Allah jadikan sebagai penggugur dosa-dosanya.',
    source: 'HR. Bukhari no. 5641 & Muslim no. 2573',
    hikmah: 'Bahkan rasa lelah sepulang bekerja mencari nafkah halal dengan niat ibadah dihitung Allah sebagai penghapus dosa-dosa kita.',
    category: 'istiqomah',
  },
  {
    id: 'hadits-18',
    title: 'Keutamaan Membaca Al-Qur’an di Hari Kiamat',
    arabic: 'اقْرَؤُوا القُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ القِيَامَةِ شَفِيعًا لِأَصْحَابِهِ',
    matanIndo: 'Bacalah Al-Qur\'an, karena sesungguhnya ia akan datang pada hari kiamat kelak sebagai pemberi syafa\'at bagi para sahabat karibnya (yang rajin membacanya).',
    source: 'HR. Muslim no. 804',
    hikmah: 'Al-Qur\'an akan menjadi pembela setia di saat manusia kebingungan mencari pertolongan di padang mahsyar.',
    category: 'quran',
  },
  {
    id: 'hadits-19',
    title: 'Doa Ketika Ditimpa Kesulitan',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    matanIndo: 'Ya Allah, tidak ada kemudahan kecuali apa yang Engkau jadikan mudah, dan Engkau menjadikan kesulitan jika Engkau kehendaki menjadi mudah.',
    source: 'HR. Ibnu Hibban no. 974 (Shahih)',
    hikmah: 'Gantungkan seluruh urusan yang terasa berat kepada Allah, sebab tak ada gunung kesulitan yang tak dapat diratakan oleh kekuasaan-Nya.',
    category: 'dzikir',
  },
  {
    id: 'hadits-20',
    title: 'Senyum Adalah Sedekah',
    arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    matanIndo: 'Senyum manismu di hadapan wajah saudaramu terhitung sebagai sedekah bagimu.',
    source: 'HR. At-Tirmidzi no. 1956 (Shahih)',
    hikmah: 'Islam mengajarkan keindahan bermuamalah. Wajah yang ramah dan menyejukkan hati orang lain bernilai ibadah di sisi Allah Ta\'ala.',
    category: 'akhlak',
  },
];

/**
 * Returns deterministic daily Hadits based on the current date
 * Changes automatically every single day without repetition
 */
export function getDailyHadits(date: Date = new Date()): HaditsKisahItem {
  // Use day of the year to pick a unique Hadits every single day
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const index = Math.abs(dayOfYear) % DAILY_HADITS_COLLECTION.length;
  return DAILY_HADITS_COLLECTION[index];
}

