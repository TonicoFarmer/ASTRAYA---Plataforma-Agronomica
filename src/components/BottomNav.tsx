import React from 'react';
import { Sprout, Calendar, CloudSun, Wrench } from 'lucide-react';
import { MainCategory } from '../types';

interface BottomNavProps {
  activeCategory: MainCategory;
  setActiveCategory: (cat: MainCategory) => void;
  theme?: 'dark' | 'light';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeCategory,
  setActiveCategory,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  const navItems: { id: MainCategory; label: string; icon: React.ReactNode }[] = [
    {
      id: 'agricultura',
      label: 'Agricultura',
      icon: <Sprout className="w-5 h-5" />,
    },
    {
      id: 'calendario',
      label: 'Calendário',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'meteorologia',
      label: 'Meteorologia',
      icon: <CloudSun className="w-5 h-5" />,
    },
    {
      id: 'ferramentas',
      label: 'Ferramentas',
      icon: <Wrench className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 px-2 py-1.5 pb-safe transition-colors shadow-2xl backdrop-blur-md ${
        isLight
          ? 'bg-white/95 border-t border-slate-300'
          : 'bg-emerald-950/95 border-t border-emerald-800/80'
      }`}
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const isActive = activeCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? isLight
                    ? 'bg-emerald-600 text-white font-bold shadow-md'
                    : 'bg-emerald-700 text-white font-bold shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100 font-medium'
                  : 'text-emerald-200/70 hover:text-white hover:bg-emerald-900/60 font-medium'
              }`}
            >
              <div
                className={`transition-transform duration-200 ${
                  isActive ? 'scale-110 text-white' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[11px] tracking-tight mt-0.5 line-clamp-1 font-sans">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

