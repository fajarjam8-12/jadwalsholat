import React from 'react';
import { Calendar, BookOpen, Settings, Moon, Award } from 'lucide-react';

export type ActiveTab = 'schedule' | 'calendar' | 'istiqomah' | 'stories' | 'settings';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'schedule',
      label: 'Waktu',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'calendar',
      label: 'Kalender',
      icon: <Moon className="w-5 h-5" />,
    },
    {
      id: 'istiqomah',
      label: 'Istiqomah',
      icon: <Award className="w-5 h-5" />,
    },
    {
      id: 'stories',
      label: 'Kisah',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Setelan',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-stone-950/95 dark:bg-black/95 border-t border-emerald-950/80 backdrop-blur-lg safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around px-1 py-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition ${
                  isActive
                    ? 'bg-gradient-to-br from-emerald-500/25 to-teal-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : ''
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
