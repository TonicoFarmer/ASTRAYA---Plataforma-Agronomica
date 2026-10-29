import React from 'react';
import { 
  MainCategory, 
  AgricultureSubMenu, 
  CalendarSubMenu, 
  WeatherSubMenu, 
  ToolsSubMenu 
} from '../types';

interface SubMenuProps {
  activeCategory: MainCategory;
  agriSub: AgricultureSubMenu;
  setAgriSub: (sub: AgricultureSubMenu) => void;
  calSub: CalendarSubMenu;
  setCalSub: (sub: CalendarSubMenu) => void;
  weatSub: WeatherSubMenu;
  setWeatSub: (sub: WeatherSubMenu) => void;
  toolSub: ToolsSubMenu;
  setToolSub: (sub: ToolsSubMenu) => void;
  theme?: 'dark' | 'light';
}

export const SubMenu: React.FC<SubMenuProps> = ({
  activeCategory,
  agriSub,
  setAgriSub,
  calSub,
  setCalSub,
  weatSub,
  setWeatSub,
  toolSub,
  setToolSub,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  const getButtonClass = (isSelected: boolean) => {
    if (isSelected) {
      return isLight
        ? 'bg-emerald-600 text-white font-bold shadow-md border border-emerald-500 scale-[1.02]'
        : 'bg-emerald-500 text-slate-950 font-bold shadow-md border border-emerald-400 scale-[1.02]';
    }
    return isLight
      ? 'bg-white text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-300 font-semibold shadow-sm'
      : 'bg-emerald-950/80 text-emerald-100 hover:bg-emerald-800 hover:text-white border border-emerald-700/60 font-semibold';
  };

  const renderAgriSubMenu = () => {
    const items: { id: AgricultureSubMenu; label: string }[] = [
      { id: 'deficiencias', label: '1.1 Deficiências' },
      { id: 'pragas', label: '1.2 Pragas & MIP' },
      { id: 'knf_jadam', label: '1.3 KNF / JADAM' },
      { id: 'bioinsumos', label: '1.4 Bioinsumos' },
      { id: 'analise_solo', label: '1.5 Análise de Solo' },
      { id: 'cultivo', label: '1.6 Cultivo' },
    ];
    return items.map((item) => (
      <button
        key={item.id}
        onClick={() => setAgriSub(item.id)}
        className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${getButtonClass(
          agriSub === item.id
        )}`}
      >
        {item.label}
      </button>
    ));
  };

  const renderCalSubMenu = () => {
    const items: { id: CalendarSubMenu; label: string }[] = [
      { id: 'manutencao', label: '2.1 Manutenção do Cultivo' },
      { id: 'mip_log', label: '2.2 Registro MIP' },
    ];
    return items.map((item) => (
      <button
        key={item.id}
        onClick={() => setCalSub(item.id)}
        className={`px-3.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${getButtonClass(
          calSub === item.id
        )}`}
      >
        {item.label}
      </button>
    ));
  };

  const renderWeatSubMenu = () => {
    const items: { id: WeatherSubMenu; label: string }[] = [
      { id: 'estacao_inmet', label: '3.1 Estação Meteorológica Outdoor' },
      { id: 'ia_assistente', label: 'IA Clima & Diagnóstico' },
    ];
    return items.map((item) => (
      <button
        key={item.id}
        onClick={() => setWeatSub(item.id)}
        className={`px-3.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${getButtonClass(
          weatSub === item.id
        )}`}
      >
        {item.label}
      </button>
    ));
  };

  const renderToolSubMenu = () => {
    const items: { id: ToolsSubMenu; label: string }[] = [
      { id: 'substrato', label: 'Calculadora de Substrato & Solo' },
      { id: 'biblioteca_drive', label: 'PDFs & Drive ASTRAYA' },
    ];
    return items.map((item) => (
      <button
        key={item.id}
        onClick={() => setToolSub(item.id)}
        className={`px-3.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${getButtonClass(
          toolSub === item.id
        )}`}
      >
        {item.label}
      </button>
    ));
  };

  return (
    <div
      className={`px-3 py-2 overflow-x-auto no-scrollbar transition-colors ${
        isLight
          ? 'bg-slate-100 border-b border-slate-300 shadow-sm'
          : 'bg-emerald-950/90 border-b border-emerald-800/80 shadow-inner'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 min-w-max">
        {activeCategory === 'agricultura' && renderAgriSubMenu()}
        {activeCategory === 'calendario' && renderCalSubMenu()}
        {activeCategory === 'meteorologia' && renderWeatSubMenu()}
        {activeCategory === 'ferramentas' && renderToolSubMenu()}
      </div>
    </div>
  );
};

