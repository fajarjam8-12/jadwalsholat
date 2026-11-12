import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Quote,
  Copy,
  Check,
  Search,
  ChevronRight,
  Heart,
  Share2,
  Bookmark,
  X,
  ScrollText,
  UserCheck,
  Star,
} from 'lucide-react';
import {
  IslamicStory,
  ISLAMIC_STORIES_COLLECTION,
  getDailyFeaturedStory,
} from '../data/islamicStories';
import { IslamicStarPattern, RubElHizbIcon } from './IslamicOrnaments';
import { audioEngine } from '../utils/audioEngine';

interface IslamicStoriesViewProps {
  currentDate?: Date;
}

export const IslamicStoriesView: React.FC<IslamicStoriesViewProps> = ({
  currentDate = new Date(),
}) => {
  const [selectedCategory, setSelectedCategory] = useState<IslamicStory['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStory, setActiveStory] = useState<IslamicStory | null>(() => getDailyFeaturedStory(currentDate));
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const featuredStory = getDailyFeaturedStory(currentDate);

  const categories = [
    { id: 'all', label: 'Semua Kisah', icon: <ScrollText className="w-3.5 h-3.5" /> },
    { id: 'nabi', label: 'Kisah 25 Nabi', icon: <Star className="w-3.5 h-3.5" /> },
    { id: 'sahabat', label: 'Sahabat Nabi', icon: <UserCheck className="w-3.5 h-3.5" /> },
    { id: 'teladan', label: 'Teladan Salaf', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'hikmah', label: '1001 Hikmah', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ] as const;

  const filteredStories = ISLAMIC_STORIES_COLLECTION.filter((story) => {
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.moralLesson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenDetail = (story: IslamicStory) => {
    audioEngine.triggerVibration([30]);
    setActiveStory(story);
    setIsDetailModalOpen(true);
  };

  const handleCopyStory = (story: IslamicStory, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `📖 ${story.title}\n${story.subtitle}\n\n${story.content}\n\n💡 Hikmah & Pelajaran:\n${story.moralLesson}\n\n📚 Sumber: ${story.source}\n— Dibagikan via Aplikasi Demi Waktu`;
    navigator.clipboard.writeText(text);
    setCopiedId(story.id);
    audioEngine.triggerVibration([50]);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-3 max-w-md mx-auto pb-6">
      {/* 1. HERO FEATURED STORY CARD */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 border border-emerald-500/50 p-3.5 shadow-md text-white">
        <IslamicStarPattern opacity={0.06} />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Kisah Hari ke-{featuredStory.day} (Pilihan Hari Ini)
              </span>
            </div>
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 capitalize">
              {featuredStory.category}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-white leading-tight flex items-center gap-1.5">
              <RubElHizbIcon size={14} className="text-emerald-400 flex-shrink-0" />
              <span>{featuredStory.title}</span>
            </h3>
            <p className="text-[11px] text-emerald-300/90 font-medium mt-0.5">
              {featuredStory.subtitle}
            </p>
          </div>

          <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed bg-black/40 p-2 rounded-xl border border-emerald-900/40">
            {featuredStory.content.split('\n\n')[0]}
          </p>

          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              onClick={() => handleCopyStory(featuredStory)}
              className="flex items-center gap-1 text-[11px] text-stone-300 hover:text-white"
            >
              {copiedId === featuredStory.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Kisah</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleOpenDetail(featuredStory)}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold text-[11px] active:scale-95 transition shadow-sm border border-emerald-400/30"
            >
              <span>Baca Lengkap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & CATEGORY CHIPS */}
      <div className="space-y-1.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari dari 365 kisah nabi, sahabat, atau hikmah..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-stone-900/90 border border-stone-800 text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Categories scrollable row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition active:scale-95 border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                    : 'bg-stone-900/80 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. STORIES LIST */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Koleksi 365 Kisah Inspiratif ({filteredStories.length})
          </span>
          <span className="text-[10px] text-stone-400">Sentuh untuk membaca</span>
        </div>

        {filteredStories.map((story) => (
          <div
            key={story.id}
            onClick={() => handleOpenDetail(story)}
            className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800/80 hover:border-emerald-500/50 cursor-pointer active:scale-[0.99] transition shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/40 text-emerald-300">
                    Hari ke-{story.day} • {story.category === 'nabi'
                      ? 'Nabi & Rasul'
                      : story.category === 'sahabat'
                      ? 'Sahabat'
                      : story.category === 'teladan'
                      ? 'Teladan'
                      : 'Hikmah'}
                  </span>
                  <span className="text-[10px] text-stone-400 truncate">{story.source}</span>
                </div>

                <h4 className="text-xs font-bold text-white truncate">{story.title}</h4>
                <p className="text-[11px] text-emerald-300/80 font-medium truncate">{story.subtitle}</p>

                <p className="text-[10px] text-stone-300 mt-1.5 line-clamp-2 leading-relaxed">
                  {story.moralLesson}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0 mt-2" />
            </div>

            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-800/60 text-[10px] text-stone-400">
              <div className="flex items-center gap-1">
                {story.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-1.5 py-0.2 bg-stone-950 rounded text-stone-400 text-[9px]">
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-emerald-400 font-semibold">Baca Selengkapnya ➔</span>
            </div>
          </div>
        ))}
      </div>

      {/* 4. DETAIL MODAL */}
      {isDetailModalOpen && activeStory && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-stone-900 border border-emerald-500/50 shadow-2xl overflow-hidden text-stone-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-stone-800 bg-emerald-950/40">
              <div className="flex items-center gap-2">
                <RubElHizbIcon size={16} className="text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                  Hari ke-{activeStory.day} • {activeStory.category === 'nabi'
                    ? 'Kisah Nabi & Rasul'
                    : activeStory.category === 'sahabat'
                    ? 'Kisah Sahabat Nabi'
                    : activeStory.category === 'teladan'
                    ? 'Teladan Ulama & Salaf'
                    : '1001 Hikmah Islami'}
                </span>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs leading-relaxed no-scrollbar">
              <div>
                <h2 className="text-base font-extrabold text-white leading-tight">
                  {activeStory.title}
                </h2>
                <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                  {activeStory.subtitle}
                </p>
                <span className="inline-block text-[10px] text-stone-400 mt-1 bg-stone-950 px-2 py-0.5 rounded-full border border-stone-800">
                  Sumber: {activeStory.source}
                </span>
              </div>

              {/* Story Content Paragraphs */}
              <div className="space-y-2.5 text-stone-200 text-xs leading-relaxed bg-black/40 p-3 rounded-2xl border border-stone-800/80">
                {activeStory.content.split('\n\n').map((para, i) => (
                  <p key={i} className="text-justify indent-3">
                    {para}
                  </p>
                ))}
              </div>

              {/* Moral Lesson Box */}
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-teal-950/80 border border-emerald-500/50 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Hikmah &amp; Pelajaran Hidup:</span>
                </div>
                <p className="text-stone-100 text-[11px] leading-relaxed">
                  {activeStory.moralLesson}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-stone-800 flex items-center justify-between bg-stone-950/80">
              <button
                onClick={() => handleCopyStory(activeStory)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs active:scale-95 transition"
              >
                {copiedId === activeStory.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kisah</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs active:scale-95 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
