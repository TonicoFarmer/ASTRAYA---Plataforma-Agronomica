import React, { useState, useEffect } from 'react';
import { 
  MainCategory, 
  AgricultureSubMenu, 
  CalendarSubMenu, 
  WeatherSubMenu, 
  ToolsSubMenu,
  NutritionalDeficiency,
  PestPois,
  BioInput,
  DriveDocument,
  CalendarEvent,
  MipLogEntry,
  MotherGenetics,
  IndoorCropBatch,
  OutdoorCropPlot,
  CycleFolder
} from './types';

import { INITIAL_DEFICIENCIES, DRIVE_DEFICIENCIES_PDF } from './data/deficiencies';
import { INITIAL_PESTS, DRIVE_PESTS_PDF } from './data/pests';
import { INITIAL_KNF_JADAM_RECIPES } from './data/knfJadam';
import { INITIAL_BIOINPUTS } from './data/bioinputs';
import { INITIAL_DRIVE_DOCUMENTS } from './data/documents';
import { INITIAL_MADRES_GENETICS, INITIAL_INDOOR_BATCHES, INITIAL_OUTDOOR_PLOTS, INITIAL_CYCLE_FOLDERS } from './data/madres';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SubMenu } from './components/SubMenu';

import { DeficienciesSection } from './components/DeficienciesSection';
import { PestsSection } from './components/PestsSection';
import { KnfJadamSection } from './components/KnfJadamSection';
import { BioinputsSection } from './components/BioinputsSection';
import { SoilAnalysisSection } from './components/SoilAnalysisSection';
import { CultivoSection } from './components/CultivoSection';

import { CalendarView } from './components/CalendarView';
import { WeatherView } from './components/WeatherView';
import { ToolsView } from './components/ToolsView';

import { AiAssistantModal } from './components/AiAssistantModal';
import { AdminManagerModal } from './components/AdminManagerModal';

import { ErrorBoundary } from './components/ErrorBoundary';
import { getIdbItem, setIdbItem } from './utils/idbStorage';

function mergeDeficiencies(parsed: NutritionalDeficiency[]): NutritionalDeficiency[] {
  const initialMap = new Map(INITIAL_DEFICIENCIES.map((d) => [d.id, d]));
  const merged = INITIAL_DEFICIENCIES.map((initial) => {
    const found = parsed.find((p) => p.id === initial.id);
    if (!found) return initial;
    const isBundledAsset = initial.imageUrl?.startsWith('/images/');
    const mergedFigures = (found.figures && found.figures.length > 0) ? found.figures : initial.figures;
    let mergedImages: string[];
    if (isBundledAsset) {
      mergedImages = [initial.imageUrl, ...(found.images || []).filter((img) => img !== initial.imageUrl)];
    } else {
      mergedImages = (found.images && found.images.length > 0) ? found.images : (initial.images || [initial.imageUrl]);
    }
    const mergedImageUrl = isBundledAsset ? initial.imageUrl : (found.imageUrl || initial.imageUrl);
    const mergedCorrectiveMineral = (found.correctiveMineral && found.correctiveMineral.length > 0) ? found.correctiveMineral : initial.correctiveMineral;

    return {
      ...initial,
      ...found,
      imageUrl: mergedImageUrl,
      images: mergedImages,
      figures: mergedFigures,
      correctiveMineral: mergedCorrectiveMineral
    };
  });
  const custom = parsed.filter((p) => !initialMap.has(p.id));
  return [...merged, ...custom];
}

function mergePests(parsed: PestPois[]): PestPois[] {
  const initialMap = new Map(INITIAL_PESTS.map((p) => [p.id, p]));
  const merged = INITIAL_PESTS.map((initial) => {
    const found = parsed.find((p) => p.id === initial.id);
    if (!found) return initial;
    const isBundledAsset = initial.imageUrl?.startsWith('/images/');
    let mergedImages: string[];
    if (isBundledAsset) {
      mergedImages = [initial.imageUrl, ...(found.images || []).filter((img) => img !== initial.imageUrl)];
    } else {
      mergedImages = (found.images && found.images.length > 0) ? found.images : (initial.images || [initial.imageUrl]);
    }
    const mergedImageUrl = isBundledAsset ? initial.imageUrl : (found.imageUrl || initial.imageUrl);

    return {
      ...initial,
      ...found,
      imageUrl: mergedImageUrl,
      images: mergedImages,
    };
  });
  const custom = parsed.filter((p) => !initialMap.has(p.id));
  return [...merged, ...custom];
}

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (!item || !item.id) continue;
    if (!seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}

function normalizeMadres(parsed: MotherGenetics[]): MotherGenetics[] {
  const deduped = dedupeById(parsed);
  return deduped.map((item) => {
    const fallbackImg = '/images/cultivo/mother_plant.jpg';
    const images = (item.images && item.images.length > 0)
      ? item.images.filter(Boolean)
      : [item.imageUrl || fallbackImg];
    return {
      ...item,
      imageUrl: images[0] || fallbackImg,
      images,
    };
  });
}

function normalizeOutdoorPlots(parsed: OutdoorCropPlot[]): OutdoorCropPlot[] {
  const deduped = dedupeById(parsed);
  return deduped.map((item) => {
    const fallbackImg = '/images/cultivo/outdoor_crop.jpg';
    const images = (item.images && item.images.length > 0)
      ? item.images.filter(Boolean)
      : [item.imageUrl || fallbackImg];
    return {
      ...item,
      imageUrl: images[0] || fallbackImg,
      images,
    };
  });
}

export default function App() {
  // Navigation State
  const [activeCategory, setActiveCategory] = useState<MainCategory>('agricultura');
  const [agriSub, setAgriSub] = useState<AgricultureSubMenu>('deficiencias');
  const [calSub, setCalSub] = useState<CalendarSubMenu>('manutencao');
  const [weatSub, setWeatSub] = useState<WeatherSubMenu>('estacao_inmet');
  const [toolSub, setToolSub] = useState<ToolsSubMenu>('substrato');

  // Admin Mode State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('astraya_is_admin') === 'true';
  });

  // Theme State (Dark / Light)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('astraya_theme') as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('astraya_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('astraya_is_admin', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  // Persistent Data Collections
  const [deficiencies, setDeficiencies] = useState<NutritionalDeficiency[]>(() => {
    const saved = localStorage.getItem('astraya_deficiencies_v6');
    if (saved) {
      try {
        const parsed: NutritionalDeficiency[] = JSON.parse(saved);
        return mergeDeficiencies(parsed);
      } catch (e) {
        return INITIAL_DEFICIENCIES;
      }
    }
    return INITIAL_DEFICIENCIES;
  });

  // persistent load flag to avoid overwriting IndexedDB before initial load
  const [isIdbLoaded, setIsIdbLoaded] = useState(false);

  // Load from IndexedDB (higher capacity storage) on mount
  useEffect(() => {
    getIdbItem<NutritionalDeficiency[]>('astraya_deficiencies_v6').then((idbDeficiencies) => {
      if (idbDeficiencies && Array.isArray(idbDeficiencies) && idbDeficiencies.length > 0) {
        setDeficiencies(mergeDeficiencies(idbDeficiencies));
      }
    }).catch((err) => {
      console.warn("Erro ao ler IndexedDB deficiências:", err);
    });

    getIdbItem<PestPois[]>('astraya_pests_v5').then((idbPests) => {
      if (idbPests && Array.isArray(idbPests) && idbPests.length > 0) {
        setPests(mergePests(idbPests));
      }
      setIsIdbLoaded(true);
    }).catch((err) => {
      console.warn("Erro ao ler IndexedDB pragas:", err);
      setIsIdbLoaded(true);
    });
  }, []);

  const [pests, setPests] = useState<PestPois[]>(() => {
    const saved = localStorage.getItem('astraya_pests_v5');
    if (saved) {
      try {
        const parsed: PestPois[] = JSON.parse(saved);
        return mergePests(parsed);
      } catch (e) {
        return INITIAL_PESTS;
      }
    }
    return INITIAL_PESTS;
  });

  const [recipes] = useState(INITIAL_KNF_JADAM_RECIPES);

  const [bioinputs, setBioinputs] = useState<BioInput[]>(() => {
    const saved = localStorage.getItem('astraya_bioinputs_v5');
    if (saved) {
      try {
        const parsed: BioInput[] = JSON.parse(saved);
        const initialMap = new Map(INITIAL_BIOINPUTS.map((b) => [b.id, b]));
        const merged = INITIAL_BIOINPUTS.map((initial) => {
          const found = parsed.find((b) => b.id === initial.id);
          return found ? { ...initial, ...found } : initial;
        });
        const custom = parsed.filter((b) => !initialMap.has(b.id));
        return [...merged, ...custom];
      } catch (e) {
        return INITIAL_BIOINPUTS;
      }
    }
    return INITIAL_BIOINPUTS;
  });

  const [documents, setDocuments] = useState<DriveDocument[]>(() => {
    const saved = localStorage.getItem('astraya_documents_v5');
    if (saved) {
      try {
        const parsed: DriveDocument[] = JSON.parse(saved);
        const initialMap = new Map(INITIAL_DRIVE_DOCUMENTS.map((d) => [d.id, d]));
        const merged = INITIAL_DRIVE_DOCUMENTS.map((initial) => {
          const found = parsed.find((d) => d.id === initial.id);
          return found ? { ...initial, ...found } : initial;
        });
        const custom = parsed.filter((d) => !initialMap.has(d.id));
        return [...merged, ...custom];
      } catch (e) {
        return INITIAL_DRIVE_DOCUMENTS;
      }
    }
    return INITIAL_DRIVE_DOCUMENTS;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('astraya_events');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ev-1',
        date: new Date().toISOString().split('T')[0],
        type: 'Adubação',
        title: 'Fertirrigação com FPJ (KNF) + Cal-Mag',
        notes: 'Dosagem 1 mL/L FPJ + 1.5 mL/L Cal-Mag. Meta EC: 1.4 / pH 6.2.',
        completed: false,
        dosageOrVolume: '20 Litros no canteiro A'
      },
      {
        id: 'ev-2',
        date: new Date().toISOString().split('T')[0],
        type: 'MIP_Aplicacao',
        title: 'Pulverização Preventiva com Beauveria + JWA',
        notes: 'Aplicar ao pôr do sol ou luzes apagadas para proteger os esporos do fungo.',
        completed: true,
        dosageOrVolume: '10 Litros em pulverizador de costas'
      }
    ];
  });

  const [mipLogs, setMipLogs] = useState<MipLogEntry[]>(() => {
    const saved = localStorage.getItem('astraya_mip_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'mip-1',
        date: new Date().toISOString().split('T')[0],
        zone: 'Estufa A - Flora 1',
        pestObserved: 'Ácaro do Teto (Tetranychus urticae)',
        severityLevel: 2,
        actionTaken: 'Liberação de Phytoseiulus persimilis + Pulverização de Sabão Potássico JWA 10mL/L.',
        responsible: 'Agrônomo ASTRAYA'
      }
    ];
  });

  // Cultivo Collections & Persistence
  const [madresList, setMadresList] = useState<MotherGenetics[]>(() => {
    const saved = localStorage.getItem('astraya_madres_v1');
    if (saved) {
      try {
        const parsed: MotherGenetics[] = JSON.parse(saved);
        if (Array.isArray(parsed)) return normalizeMadres(parsed);
      } catch (e) {
        return INITIAL_MADRES_GENETICS;
      }
    }
    return INITIAL_MADRES_GENETICS;
  });

  const [indoorBatches, setIndoorBatches] = useState<IndoorCropBatch[]>(() => {
    const saved = localStorage.getItem('astraya_indoor_batches_v1');
    if (saved) {
      try {
        const parsed: IndoorCropBatch[] = JSON.parse(saved);
        if (Array.isArray(parsed)) return dedupeById(parsed);
      } catch (e) {
        return INITIAL_INDOOR_BATCHES;
      }
    }
    return INITIAL_INDOOR_BATCHES;
  });

  const [outdoorPlots, setOutdoorPlots] = useState<OutdoorCropPlot[]>(() => {
    const saved = localStorage.getItem('astraya_outdoor_plots_v1');
    if (saved) {
      try {
        const parsed: OutdoorCropPlot[] = JSON.parse(saved);
        if (Array.isArray(parsed)) return normalizeOutdoorPlots(parsed);
      } catch (e) {
        return INITIAL_OUTDOOR_PLOTS;
      }
    }
    return INITIAL_OUTDOOR_PLOTS;
  });

  const [cycleFolders, setCycleFolders] = useState<CycleFolder[]>(() => {
    const saved = localStorage.getItem('astraya_cycle_folders_v1');
    if (saved) {
      try {
        const parsed: CycleFolder[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return dedupeById(parsed);
      } catch (e) {
        return INITIAL_CYCLE_FOLDERS;
      }
    }
    return INITIAL_CYCLE_FOLDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('astraya_madres_v1', JSON.stringify(madresList));
      setIdbItem('astraya_madres_v1', madresList);
    } catch (e) {
      console.warn("Erro ao salvar madres:", e);
    }
  }, [madresList]);

  useEffect(() => {
    try {
      localStorage.setItem('astraya_indoor_batches_v1', JSON.stringify(indoorBatches));
    } catch (e) {
      console.warn("Erro ao salvar cultivo interno:", e);
    }
  }, [indoorBatches]);

  useEffect(() => {
    try {
      localStorage.setItem('astraya_outdoor_plots_v1', JSON.stringify(outdoorPlots));
      setIdbItem('astraya_outdoor_plots_v1', outdoorPlots);
    } catch (e) {
      console.warn("Erro ao salvar cultivo externo:", e);
    }
  }, [outdoorPlots]);

  useEffect(() => {
    try {
      localStorage.setItem('astraya_cycle_folders_v1', JSON.stringify(cycleFolders));
      setIdbItem('astraya_cycle_folders_v1', cycleFolders);
    } catch (e) {
      console.warn("Erro ao salvar pastas de ciclos:", e);
    }
  }, [cycleFolders]);

  const handleSaveMadre = (item: MotherGenetics) => {
    setMadresList((prev) => {
      const deduped = dedupeById(prev);
      const exists = deduped.some((m) => m.id === item.id);
      if (exists) return deduped.map((m) => (m.id === item.id ? item : m));
      return [item, ...deduped];
    });
  };

  const handleDeleteMadre = (id: string) => {
    setMadresList((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSaveIndoorBatch = (batch: IndoorCropBatch) => {
    setIndoorBatches((prev) => {
      const deduped = dedupeById(prev);
      const exists = deduped.some((b) => b.id === batch.id);
      if (exists) return deduped.map((b) => (b.id === batch.id ? batch : b));
      return [batch, ...deduped];
    });
  };

  const handleDeleteIndoorBatch = (id: string) => {
    setIndoorBatches((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSaveOutdoorPlot = (plot: OutdoorCropPlot) => {
    setOutdoorPlots((prev) => {
      const deduped = dedupeById(prev);
      const exists = deduped.some((p) => p.id === plot.id);
      if (exists) return deduped.map((p) => (p.id === plot.id ? plot : p));
      return [plot, ...deduped];
    });
  };

  const handleDeleteOutdoorPlot = (id: string) => {
    setOutdoorPlots((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveCycleFolder = (folder: CycleFolder) => {
    setCycleFolders((prev) => {
      const deduped = dedupeById(prev);
      const exists = deduped.some((f) => f.id === folder.id);
      if (exists) return deduped.map((f) => (f.id === folder.id ? folder : f));
      return [folder, ...deduped];
    });
  };

  const handleDeleteCycleFolder = (id: string) => {
    setCycleFolders((prev) => prev.filter((f) => f.id !== id));
  };

  // Sync to IndexedDB and localStorage safely
  useEffect(() => {
    if (!isIdbLoaded) return;
    setIdbItem('astraya_deficiencies_v6', deficiencies);
    try {
      localStorage.setItem('astraya_deficiencies_v6', JSON.stringify(deficiencies));
    } catch (e) {
      console.warn("Armazenamento local cheio para deficiências (salvo com sucesso no IndexedDB):", e);
    }
  }, [deficiencies, isIdbLoaded]);

  useEffect(() => {
    if (!isIdbLoaded) return;
    setIdbItem('astraya_pests_v5', pests);
    try {
      localStorage.setItem('astraya_pests_v5', JSON.stringify(pests));
    } catch (e) {
      console.warn("Armazenamento local cheio para pragas (salvo no IndexedDB):", e);
    }
  }, [pests, isIdbLoaded]);

  useEffect(() => {
    try {
      localStorage.setItem('astraya_bioinputs_v5', JSON.stringify(bioinputs));
    } catch (e) {
      console.warn("Armazenamento local cheio para bioinsumos:", e);
    }
  }, [bioinputs]);

  useEffect(() => {
    try {
      localStorage.setItem('astraya_documents_v5', JSON.stringify(documents));
    } catch (e) {
      console.warn("Armazenamento local cheio para documentos:", e);
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem('astraya_events', JSON.stringify(events));
    } catch (e) {
      console.warn("Armazenamento local cheio para eventos:", e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('astraya_mip_logs', JSON.stringify(mipLogs));
    } catch (e) {
      console.warn("Armazenamento local cheio para registros MIP:", e);
    }
  }, [mipLogs]);

  // Modal Control States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminModeType, setAdminModeType] = useState<'deficiency' | 'pest' | 'bioinput'>('deficiency');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Admin Actions
  const handleOpenEditDeficiency = (item?: NutritionalDeficiency) => {
    setAdminModeType('deficiency');
    setEditingItem(item || null);
    setIsAdminModalOpen(true);
  };

  const handleOpenEditPest = (item?: PestPois) => {
    setAdminModeType('pest');
    setEditingItem(item || null);
    setIsAdminModalOpen(true);
  };

  const handleOpenEditBioinput = (item?: BioInput) => {
    setAdminModeType('bioinput');
    setEditingItem(item || null);
    setIsAdminModalOpen(true);
  };

  const handleSaveDeficiency = (item: NutritionalDeficiency) => {
    setDeficiencies((prev) => {
      const exists = prev.some((d) => d.id === item.id);
      if (exists) return prev.map((d) => (d.id === item.id ? item : d));
      return [item, ...prev];
    });
  };

  const handleSavePest = (item: PestPois) => {
    setPests((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      if (exists) return prev.map((p) => (p.id === item.id ? item : p));
      return [item, ...prev];
    });
  };

  const handleSaveBioinput = (item: BioInput) => {
    setBioinputs((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      if (exists) return prev.map((b) => (b.id === item.id ? item : b));
      return [item, ...prev];
    });
  };

  return (
    <ErrorBoundary>
      <div className={`min-h-screen flex flex-col font-sans pb-24 selection:bg-emerald-500 selection:text-slate-950 ${
        theme === 'light' ? 'bg-slate-50 text-slate-900 light-theme' : 'bg-slate-950 text-slate-100'
      }`}>
      {/* Top Main Banner Header */}
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        activeCategoryName={activeCategory}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Sub-menu Bar for Current Category */}
      <SubMenu
        activeCategory={activeCategory}
        agriSub={agriSub}
        setAgriSub={setAgriSub}
        calSub={calSub}
        setCalSub={setCalSub}
        weatSub={weatSub}
        setWeatSub={setWeatSub}
        toolSub={toolSub}
        setToolSub={setToolSub}
        theme={theme}
      />

      {/* Main Active View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* CATEGORY 1: AGRICULTURA */}
        {activeCategory === 'agricultura' && (
          <>
            {agriSub === 'deficiencias' && (
              <DeficienciesSection
                deficiencies={deficiencies}
                isAdmin={isAdmin}
                onEditItem={(item) => handleOpenEditDeficiency(item)}
                onAddNew={() => handleOpenEditDeficiency()}
                pdfUrl={DRIVE_DEFICIENCIES_PDF}
                onSaveDeficiency={handleSaveDeficiency}
              />
            )}

            {agriSub === 'pragas' && (
              <PestsSection
                pests={pests}
                isAdmin={isAdmin}
                onEditItem={(item) => handleOpenEditPest(item)}
                onAddNew={() => handleOpenEditPest()}
                pdfUrl={DRIVE_PESTS_PDF}
                onSavePest={handleSavePest}
              />
            )}

            {agriSub === 'knf_jadam' && (
              <KnfJadamSection recipes={recipes} />
            )}

            {agriSub === 'bioinsumos' && (
              <BioinputsSection
                bioinputs={bioinputs}
                isAdmin={isAdmin}
                onAddNew={() => handleOpenEditBioinput()}
              />
            )}

            {agriSub === 'analise_solo' && (
              <SoilAnalysisSection />
            )}

            {agriSub === 'cultivo' && (
              <CultivoSection
                madresList={madresList}
                outdoorPlots={outdoorPlots}
                cycleFolders={cycleFolders}
                isAdmin={isAdmin}
                onSaveMadre={handleSaveMadre}
                onDeleteMadre={handleDeleteMadre}
                onSaveOutdoorPlot={handleSaveOutdoorPlot}
                onDeleteOutdoorPlot={handleDeleteOutdoorPlot}
                onSaveCycleFolder={handleSaveCycleFolder}
                onDeleteCycleFolder={handleDeleteCycleFolder}
              />
            )}
          </>
        )}

        {/* CATEGORY 2: CALENDÁRIO */}
        {activeCategory === 'calendario' && (
          <CalendarView
            subCategory={calSub}
            events={events}
            setEvents={setEvents}
            mipLogs={mipLogs}
            setMipLogs={setMipLogs}
            isAdmin={isAdmin}
          />
        )}

        {/* CATEGORY 3: METEOROLOGIA */}
        {activeCategory === 'meteorologia' && (
          <WeatherView
            subCategory={weatSub}
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
          />
        )}

        {/* CATEGORY 4: FERRAMENTAS */}
        {activeCategory === 'ferramentas' && (
          <ToolsView
            subCategory={toolSub}
            documents={documents}
            setDocuments={setDocuments}
            isAdmin={isAdmin}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar (Mobile & Tablet) */}
      <BottomNav
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        theme={theme}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Admin Item Manager Modal */}
      <AdminManagerModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        editingItem={editingItem}
        mode={adminModeType}
        onSaveDeficiency={handleSaveDeficiency}
        onSavePest={handleSavePest}
        onSaveBioInput={handleSaveBioinput}
      />
    </div>
    </ErrorBoundary>
  );
}
