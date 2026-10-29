import React, { useState } from 'react';
import { Leaf, Shield, UserCheck, Sparkles, ExternalLink, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  onOpenAiAssistant: () => void;
  activeCategoryName: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const ASTRAYA_LOGO_DRIVE_FOLDER = 'https://drive.google.com/drive/folders/1qdzL8WJWk7dIzMO2lzlsruX6qgCvpKm8';
export const ASTRAYA_LOGO_IMAGE_PRIMARY = 'https://lh3.googleusercontent.com/d/1qdzL8WJWk7dIzMO2lzlsruX6qgCvpKm8';
export const ASTRAYA_LOGO_IMAGE_SECONDARY = 'https://drive.google.com/thumbnail?id=1qdzL8WJWk7dIzMO2lzlsruX6qgCvpKm8&sz=w500';

export const Header: React.FC<HeaderProps> = ({
  isAdmin,
  setIsAdmin,
  onOpenAiAssistant,
  activeCategoryName,
  theme,
  onToggleTheme,
}) => {
  const [logoSrc, setLogoSrc] = useState<string>(ASTRAYA_LOGO_IMAGE_PRIMARY);
  const [logoFailed, setLogoFailed] = useState<boolean>(false);

  const handleLogoError = () => {
    if (logoSrc === ASTRAYA_LOGO_IMAGE_PRIMARY) {
      setLogoSrc(ASTRAYA_LOGO_IMAGE_SECONDARY);
    } else {
      setLogoFailed(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Logo & Title linked to Google Drive Folder */}
        <a
          href={ASTRAYA_LOGO_DRIVE_FOLDER}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 group cursor-pointer"
          title="Abrir pasta de logos e arquivos oficiais no Google Drive"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-green-400 to-emerald-300 p-0.5 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden relative">
              {!logoFailed ? (
                <img
                  src={logoSrc}
                  alt="ASTRAYA Logo Oficial"
                  referrerPolicy="no-referrer"
                  onError={handleLogoError}
                  className="w-full h-full object-contain p-0.5"
                />
              ) : (
                <Leaf className="w-5 h-5 text-emerald-400" />
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base tracking-tight leading-tight text-white group-hover:text-emerald-200 transition-colors flex items-center gap-1">
                <span>ASTRAYA</span>
                <ExternalLink className="w-3 h-3 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-800 text-white rounded border border-emerald-600/80 uppercase tracking-wider shadow-sm">
                Cannabis & Fitoterápicos
              </span>
            </div>
            <p className="text-xs text-emerald-100 font-medium line-clamp-1">
              Associação de Desenvolvimento e Pesquisa
            </p>
          </div>
        </a>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* AI Agronomic Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100 rounded-lg text-xs font-medium transition shadow-sm border border-emerald-500/30 active:scale-95"
            title="Diagnóstico via IA Agronômica ASTRAYA"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">IA Agronômica</span>
            <span className="sm:hidden">IA</span>
          </button>

          {/* Theme Toggle Button (Claro/Escuro) */}
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border ${
              theme === 'light'
                ? 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200 shadow-sm'
                : 'bg-emerald-950/60 text-emerald-200 border-emerald-700/60 hover:bg-emerald-800/60'
            }`}
            title={theme === 'light' ? 'Mudar para Tema Escuro' : 'Mudar para Tema Claro'}
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-800" />
                <span className="hidden xs:inline">ESCURO</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden xs:inline">CLARO</span>
              </>
            )}
          </button>

          {/* Admin / User Toggle */}
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border ${
              isAdmin
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                : 'bg-emerald-950/60 text-emerald-200 border-emerald-700/60 hover:bg-emerald-800/60'
            }`}
            title="Alternar entre Modo Administrador e Modo Cultivador"
          >
            {isAdmin ? (
              <>
                <Shield className="w-3.5 h-3.5 text-slate-900" />
                <span>ADMIN</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xs:inline">CULTIVADOR</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
