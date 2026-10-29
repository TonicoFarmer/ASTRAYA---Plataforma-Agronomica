import React, { useState } from 'react';
import { NutritionalDeficiency } from '../types';
import { Search, ExternalLink, AlertTriangle, Plus, Edit2, ShieldAlert, CheckCircle2, FileText, ChevronLeft, ChevronRight, Maximize2, X, Sprout, Bug, Upload, Camera, ImagePlus, Trash2, Check, Link } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { formatImageUrl, FALLBACK_DEFICIENCY_IMAGE } from '../utils/imageUtils';

interface DeficienciesSectionProps {
  deficiencies: NutritionalDeficiency[];
  isAdmin: boolean;
  onEditItem: (item: NutritionalDeficiency) => void;
  onAddNew: () => void;
  pdfUrl: string;
  onSaveDeficiency?: (item: NutritionalDeficiency) => void;
}

const DRIVE_PHOTOS_FOLDER = "https://drive.google.com/drive/folders/15ReClacvJPG3ikjiW1gT6tFbPz0qXv74?usp=sharing";

export const DeficienciesSection: React.FC<DeficienciesSectionProps> = ({
  deficiencies,
  isAdmin,
  onEditItem,
  onAddNew,
  pdfUrl,
  onSaveDeficiency,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeafZone, setSelectedLeafZone] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(deficiencies[0]?.id || null);

  // Slide state per deficiency ID
  const [imageIndexes, setImageIndexes] = useState<{ [id: string]: number }>({});
  // Zoom Modal state
  const [zoomedImage, setZoomedImage] = useState<{ url: string; title: string } | null>(null);

  // Section Photo Upload Modal state
  const [isSectionUploadOpen, setIsSectionUploadOpen] = useState(false);
  const [selectedDeficiencyForUpload, setSelectedDeficiencyForUpload] = useState<string>('');
  const [modalPendingImages, setModalPendingImages] = useState<string[]>([]);
  const [modalCaption, setModalCaption] = useState<string>('');

  // Drag-and-drop state per deficiency ID
  const [draggingMap, setDraggingMap] = useState<{ [id: string]: boolean }>({});

  // Success Toast notification
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Quick diagnostic wizard state
  const [wizardLocation, setWizardLocation] = useState<string>('');
  const [wizardSymptom, setWizardSymptom] = useState<string>('');

  // State for direct URL image inputs per deficiency
  const [showUrlInputMap, setShowUrlInputMap] = useState<{ [id: string]: boolean }>({});
  const [urlInputValueMap, setUrlInputValueMap] = useState<{ [id: string]: string }>({});
  const [modalUrlInput, setModalUrlInput] = useState<string>('');

  // Helper function to compress and resize images via HTML5 Canvas before adding to state
  const compressImage = (file: File, maxWidth = 500, quality = 0.65): Promise<string> => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onerror = () => resolve('');
      reader.onload = (e) => {
        const src = e.target?.result as string;
        if (!src) {
          resolve('');
          return;
        }
        const img = new Image();
        img.onerror = () => resolve(src);
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxWidth) {
              if (width > height) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxWidth) / height);
                height = maxWidth;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL('image/jpeg', quality);
              resolve(compressed);
            } else {
              resolve(src);
            }
          } catch (err) {
            resolve(src);
          }
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload handler for single or multiple files
  const handleImageUpload = (defId: string, files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const compressPromises = fileArray.map((file) => compressImage(file, 500, 0.65));

    Promise.all(compressPromises).then((newImageUrls) => {
      const validImageUrls = newImageUrls.filter(Boolean);
      if (validImageUrls.length === 0) return;

      const targetDef = deficiencies.find((d) => d.id === defId);
      if (!targetDef) return;

      const existingImages = targetDef.images && targetDef.images.length > 0
        ? targetDef.images
        : [targetDef.imageUrl || 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'];

      const updatedImages = [...existingImages, ...validImageUrls];

      const updatedDef: NutritionalDeficiency = {
        ...targetDef,
        imageUrl: targetDef.imageUrl || validImageUrls[0],
        images: updatedImages,
      };

      if (onSaveDeficiency) {
        onSaveDeficiency(updatedDef);
      }

      // Automatically move slide index to newly uploaded photo
      setImageIndexes((prev) => ({
        ...prev,
        [defId]: updatedImages.length - 1,
      }));

      setUploadSuccessMsg(`🎉 Upload de ${validImageUrls.length} foto(s) otimizada(s) concluído com sucesso em ${targetDef.element}!`);
      setTimeout(() => setUploadSuccessMsg(null), 4000);
    });
  };

  // Handler for adding an image via direct Web URL / Google Drive link
  const handleAddDirectUrl = (defId: string, rawUrl: string) => {
    const formatted = formatImageUrl(rawUrl);
    if (!formatted) return;

    const targetDef = deficiencies.find((d) => d.id === defId);
    if (!targetDef) return;

    const existingImages = targetDef.images && targetDef.images.length > 0
      ? targetDef.images
      : [targetDef.imageUrl || 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'];

    const updatedImages = [...existingImages, formatted];

    const updatedDef: NutritionalDeficiency = {
      ...targetDef,
      imageUrl: targetDef.imageUrl || formatted,
      images: updatedImages,
    };

    if (onSaveDeficiency) {
      onSaveDeficiency(updatedDef);
    }

    setImageIndexes((prev) => ({
      ...prev,
      [defId]: updatedImages.length - 1,
    }));

    setUrlInputValueMap((prev) => ({ ...prev, [defId]: '' }));
    setShowUrlInputMap((prev) => ({ ...prev, [defId]: false }));

    setUploadSuccessMsg(`🎉 Foto via Link/URL adicionada com sucesso em ${targetDef.element}!`);
    setTimeout(() => setUploadSuccessMsg(null), 4000);
  };

  // Remove uploaded photo handler
  const handleRemovePhoto = (defId: string, photoIdx: number) => {
    const targetDef = deficiencies.find((d) => d.id === defId);
    if (!targetDef) return;

    const existingImages = targetDef.images && targetDef.images.length > 0
      ? targetDef.images
      : [targetDef.imageUrl];

    if (existingImages.length <= 1) {
      alert("Cada elemento deve manter ao menos uma foto na galeria.");
      return;
    }

    const updatedImages = existingImages.filter((_, idx) => idx !== photoIdx);
    const newActiveIdx = Math.min(photoIdx, updatedImages.length - 1);

    const updatedDef: NutritionalDeficiency = {
      ...targetDef,
      imageUrl: updatedImages[0],
      images: updatedImages,
    };

    if (onSaveDeficiency) {
      onSaveDeficiency(updatedDef);
    }

    setImageIndexes((prev) => ({
      ...prev,
      [defId]: newActiveIdx,
    }));

    setUploadSuccessMsg(`Foto removida da galeria de ${targetDef.element}.`);
    setTimeout(() => setUploadSuccessMsg(null), 3000);
  };

  // Modal file selection handler
  const handleModalFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const compressPromises = fileArray.map((file) => compressImage(file, 500, 0.65));

    Promise.all(compressPromises).then((newImageUrls) => {
      const validImageUrls = newImageUrls.filter(Boolean);
      setModalPendingImages((prev) => [...prev, ...validImageUrls]);
    });
  };

  // Add URL to modal pending images
  const handleModalAddUrl = () => {
    if (!modalUrlInput.trim()) return;
    const formatted = formatImageUrl(modalUrlInput.trim());
    if (formatted) {
      setModalPendingImages((prev) => [...prev, formatted]);
      setModalUrlInput('');
    }
  };

  // Confirm section upload modal
  const handleConfirmSectionUpload = () => {
    if (!selectedDeficiencyForUpload) {
      alert("Por favor, selecione para qual deficiência deseja enviar a foto.");
      return;
    }
    if (modalPendingImages.length === 0) {
      alert("Por favor, selecione ao menos uma foto para enviar.");
      return;
    }

    const targetDef = deficiencies.find((d) => d.id === selectedDeficiencyForUpload);
    if (!targetDef) return;

    const existingImages = targetDef.images && targetDef.images.length > 0
      ? targetDef.images
      : [targetDef.imageUrl];

    const updatedImages = [...existingImages, ...modalPendingImages];

    let updatedFigures = targetDef.figures || [];
    if (modalCaption.trim()) {
      updatedFigures = [
        ...updatedFigures,
        {
          figureNumber: `Figura ${updatedFigures.length + 1}`,
          title: 'Foto de Campo Enviada pelo Cultivador',
          description: modalCaption.trim(),
        },
      ];
    }

    const updatedDef: NutritionalDeficiency = {
      ...targetDef,
      imageUrl: targetDef.imageUrl || modalPendingImages[0],
      images: updatedImages,
      figures: updatedFigures,
    };

    if (onSaveDeficiency) {
      onSaveDeficiency(updatedDef);
    }

    setImageIndexes((prev) => ({
      ...prev,
      [selectedDeficiencyForUpload]: updatedImages.length - 1,
    }));

    setExpandedId(selectedDeficiencyForUpload);

    setUploadSuccessMsg(`🎉 ${modalPendingImages.length} foto(s) vinculada(s) à galeria de ${targetDef.element}!`);
    setTimeout(() => setUploadSuccessMsg(null), 4000);

    // Reset modal state
    setModalPendingImages([]);
    setModalCaption('');
    setIsSectionUploadOpen(false);
  };

  const filtered = deficiencies.filter((def) => {
    const matchesSearch =
      def.element.toLowerCase().includes(searchTerm.toLowerCase()) ||
      def.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      def.symptoms.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesZone =
      selectedLeafZone === 'all' ||
      (selectedLeafZone === 'velhas' && def.targetLeaves.includes('Velhas')) ||
      (selectedLeafZone === 'novas' && def.targetLeaves.includes('Novas'));

    const matchesType = selectedType === 'all' || def.type === selectedType;

    return matchesSearch && matchesZone && matchesType;
  });

  // Diagnostic wizard match calculation
  const getWizardMatches = () => {
    if (!wizardLocation && !wizardSymptom) return [];
    return deficiencies.filter((d) => {
      let matchLoc = true;
      let matchSymp = true;

      if (wizardLocation === 'velhas') matchLoc = d.targetLeaves.includes('Velhas');
      if (wizardLocation === 'novas') matchLoc = d.targetLeaves.includes('Novas');

      if (wizardSymptom === 'amarelo') {
        matchSymp = d.symptoms.some((s) => s.toLowerCase().includes('amarel') || s.toLowerCase().includes('clorose'));
      } else if (wizardSymptom === 'manchas') {
        matchSymp = d.symptoms.some((s) => s.toLowerCase().includes('mancha') || s.toLowerCase().includes('necrót'));
      } else if (wizardSymptom === 'queimada') {
        matchSymp = d.symptoms.some((s) => s.toLowerCase().includes('queimad') || s.toLowerCase().includes('borda'));
      } else if (wizardSymptom === 'deformada') {
        matchSymp = d.symptoms.some((s) => s.toLowerCase().includes('deform') || s.toLowerCase().includes('gancho'));
      }

      return matchLoc && matchSymp;
    });
  };

  const wizardMatches = getWizardMatches();

  const handleNextImage = (defId: string, totalImages: number) => {
    setImageIndexes((prev) => ({
      ...prev,
      [defId]: ((prev[defId] || 0) + 1) % totalImages,
    }));
  };

  const handlePrevImage = (defId: string, totalImages: number) => {
    setImageIndexes((prev) => ({
      ...prev,
      [defId]: ((prev[defId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {uploadSuccessMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-900 border border-emerald-500 text-emerald-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{uploadSuccessMsg}</span>
        </div>
      )}

      {/* Top PDF & Photos Drive Banner with Section Upload Button */}
      <div className="bg-gradient-to-r from-emerald-900 via-green-950 to-slate-900 p-4 rounded-2xl border border-emerald-700/60 shadow-md text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-800/80 rounded-xl border border-emerald-600/40 text-emerald-300 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-emerald-100 flex items-center gap-2">
                1.1 Deficiências Nutricionais na Cannabis & Fitoterápicos
              </h2>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Consulte o PDF ASTRAYA, a galeria de imagens no Drive ou envie suas próprias fotos de campo.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
            <a
              href={DRIVE_PHOTOS_FOLDER}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 font-medium text-xs rounded-xl shadow-sm transition border border-emerald-700/50"
            >
              <span>Galeria Fotos Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl shadow-sm transition border border-emerald-400/30"
            >
              <span>Abrir PDF no Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Quick Interactive Symptom Diagnostic Wizard */}
      <div className="bg-slate-900/90 border border-emerald-800/80 rounded-2xl p-4 shadow-sm text-slate-100">
        <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          Diagnóstico Rápido por Sintoma Visível
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              1. Onde os sintomas começaram?
            </label>
            <select
              value={wizardLocation}
              onChange={(e) => setWizardLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">Selecione a região da folha...</option>
              <option value="velhas">Folhas Velhas (Base / Inferiores) - Elementos Móveis</option>
              <option value="novas">Folhas Novas (Topo / Superiores) - Elementos Imóveis</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              2. Qual a aparência das folhas afetadas?
            </label>
            <select
              value={wizardSymptom}
              onChange={(e) => setWizardSymptom(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">Selecione o sintoma visual...</option>
              <option value="amarelo">Amarelamento Geral (Clorose)</option>
              <option value="manchas">Manchas Castanhas / Necróticas</option>
              <option value="queimada">Bordas / Margens Queimadas</option>
              <option value="deformada">Folhas Enrugadas ou Deformadas</option>
            </select>
          </div>
        </div>

        {/* Wizard result output */}
        {wizardMatches.length > 0 && (
          <div className="mt-3 p-3 bg-emerald-950/80 border border-emerald-600/60 rounded-xl text-xs space-y-2">
            <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Possível Causa Identificada:
            </span>
            <div className="flex flex-wrap gap-2">
              {wizardMatches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setExpandedId(m.id)}
                  className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs transition"
                >
                  {m.element} ({m.symbol}) - Ver Detalhes
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nutriente, sintoma (ex: Boro, Zinco, amarelamento)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <select
              value={selectedLeafZone}
              onChange={(e) => setSelectedLeafZone(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">Todas as Posições</option>
              <option value="velhas">Folhas Velhas (Inferiores)</option>
              <option value="novas">Folhas Novas (Superiores)</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">Todos os Tipos</option>
              <option value="Macro">Macronutrientes (N, P, K)</option>
              <option value="Secundário">Secundários (Ca, Mg, S)</option>
              <option value="Micro">Micronutrientes (B, Cu, Fe, Mn, Zn...)</option>
            </select>

            {isAdmin && (
              <button
                onClick={onAddNew}
                className="flex items-center gap-1 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Parâmetro</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List of Nutritional Deficiencies */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((def) => {
          const isExpanded = expandedId === def.id;
          const imageList = (def.images && Array.isArray(def.images) && def.images.length > 0)
            ? def.images
            : [def.imageUrl || 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'];
          const currentImgIdx = Math.min(imageIndexes[def.id] || 0, Math.max(0, imageList.length - 1));
          const activeImgUrl = imageList[currentImgIdx] || imageList[0] || def.imageUrl;

          return (
            <div
              key={def.id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm ${
                isExpanded ? 'border-emerald-500 ring-1 ring-emerald-500/40' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : def.id)}
                className="p-4 bg-slate-900 cursor-pointer flex items-center justify-between gap-3 select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-green-950 border border-emerald-600/50 flex flex-col items-center justify-center shrink-0">
                    <span className="font-bold text-base text-emerald-200 leading-none">{def.symbol}</span>
                    <span className="text-[9px] uppercase font-semibold text-emerald-400 mt-0.5">{def.type}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-100">{def.element}</h3>
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-800 text-emerald-300 rounded-full border border-slate-700">
                        {def.mobility}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      Local Principal: <span className="text-emerald-300 font-medium">{def.targetLeaves}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditItem(def);
                      }}
                      className="p-1.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <span className="text-xs text-emerald-400 font-semibold px-2 py-1 bg-emerald-950 rounded-lg border border-emerald-800">
                    {isExpanded ? 'Recolher' : 'Detalhes'}
                  </span>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-4 bg-slate-950/90 border-t border-slate-800 text-xs space-y-4">
                  {/* Photo Gallery Slider & Symptoms */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Interactive Image Gallery / Slideshow with Independent Upload */}
                    <div className="space-y-2">
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDraggingMap((prev) => ({ ...prev, [def.id]: true }));
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          setDraggingMap((prev) => ({ ...prev, [def.id]: false }));
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDraggingMap((prev) => ({ ...prev, [def.id]: false }));
                          handleImageUpload(def.id, e.dataTransfer.files);
                        }}
                        className={`relative rounded-xl overflow-hidden border transition-all bg-slate-900 group h-52 flex items-center justify-center ${
                          draggingMap[def.id]
                            ? 'border-emerald-400 ring-2 ring-emerald-400/60 bg-emerald-950/40'
                            : 'border-slate-800'
                        }`}
                      >
                        <SafeImage
                          src={activeImgUrl}
                          fallbackSrc={FALLBACK_DEFICIENCY_IMAGE}
                          alt={`${def.element} foto ${currentImgIdx + 1}`}
                          className="w-full h-full object-cover cursor-pointer transition hover:scale-105"
                          onClick={() => setZoomedImage({ url: formatImageUrl(activeImgUrl, FALLBACK_DEFICIENCY_IMAGE), title: `${def.element} (${def.symbol})` })}
                        />

                        {/* Drag-and-drop indicator */}
                        {draggingMap[def.id] && (
                          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center text-emerald-200 z-20">
                            <Upload className="w-8 h-8 text-emerald-400 animate-bounce mb-1" />
                            <span className="font-bold text-xs">Solte a imagem aqui para enviar!</span>
                          </div>
                        )}

                        {/* Zoom Button Overlay */}
                        <button
                          onClick={() => setZoomedImage({ url: activeImgUrl, title: `${def.element} (${def.symbol})` })}
                          className="absolute top-2 right-2 p-1.5 bg-slate-950/80 hover:bg-slate-900 text-emerald-300 rounded-lg border border-slate-700 shadow backdrop-blur-sm transition z-10"
                          title="Ampliar Foto"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Slide navigation controls */}
                        {imageList.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrevImage(def.id, imageList.length);
                              }}
                              className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-slate-950/80 hover:bg-emerald-900 text-white rounded-full border border-slate-700 shadow backdrop-blur-sm transition z-10"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNextImage(def.id, imageList.length);
                              }}
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-slate-950/80 hover:bg-emerald-900 text-white rounded-full border border-slate-700 shadow backdrop-blur-sm transition z-10"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>

                            {/* Dots / Indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-700 backdrop-blur-sm text-[10px] text-emerald-300 font-mono z-10">
                              {currentImgIdx + 1} / {imageList.length}
                            </div>
                          </>
                        )}

                        <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] text-emerald-200 border border-slate-700">
                          🔍 Clique p/ Ampliar
                        </div>
                      </div>

                      {/* Independent Photo Controls Bar with Direct URL Link - ADMIN ONLY */}
                      {isAdmin && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setShowUrlInputMap((prev) => ({ ...prev, [def.id]: !prev[def.id] }))}
                              className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-700/60 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                              title="Adicionar imagem via Link URL"
                            >
                              <Link className="w-3.5 h-3.5" />
                              <span>Link URL</span>
                            </button>

                            {imageList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(def.id, currentImgIdx)}
                                className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 rounded-xl border border-red-800/80 transition"
                                title="Remover foto atual"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {showUrlInputMap[def.id] && (
                            <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-emerald-700/80 rounded-xl text-xs animate-fadeIn">
                              <input
                                type="url"
                                value={urlInputValueMap[def.id] || ''}
                                onChange={(e) => setUrlInputValueMap((prev) => ({ ...prev, [def.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddDirectUrl(def.id, urlInputValueMap[def.id] || '');
                                  }
                                }}
                                placeholder="Cole o link (Google Drive / Imgur / Web)..."
                                className="flex-1 bg-slate-950 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddDirectUrl(def.id, urlInputValueMap[def.id] || '')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition"
                              >
                                Salvar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider text-emerald-400 mb-1">
                          Sintomas Principais
                        </h4>
                        <ul className="list-disc pl-4 space-y-1 text-slate-300">
                          {def.symptoms.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Causas & Bloqueios (Lockout)
                        </h4>
                        <ul className="list-disc pl-4 space-y-1 text-slate-300">
                          {def.causes.map((c, idx) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Atlas de Figuras Técnicas de Campo */}
                  {def.figures && def.figures.length > 0 && (
                    <div className="bg-slate-900/90 border border-emerald-900/80 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-emerald-400" />
                          🔬 Atlas Científico de Sintomas de Campo
                        </h4>
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                          {def.figures.length} Sintomas Mapeados
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {def.figures.map((fig, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-950/80 border border-slate-800/90 hover:border-emerald-700/60 p-2.5 rounded-xl transition text-xs space-y-1 shadow-inner"
                          >
                            <h5 className="font-bold text-emerald-300 text-xs">{fig.title}</h5>
                            <p className="text-slate-300 text-[11px] leading-relaxed">
                              {fig.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Organic, Microbe & Companion Plant Corrections */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div className="bg-emerald-950/50 border border-emerald-800/80 p-3 rounded-xl">
                      <h4 className="font-bold text-emerald-300 text-xs mb-1.5 flex items-center gap-1">
                        <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                        🌱 Correção Orgânica & KNF / JADAM
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-200">
                        {def.correctiveOrganic.map((co, idx) => (
                          <li key={idx}>{co}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900 border border-emerald-800/60 p-3 rounded-xl">
                      <h4 className="font-bold text-teal-300 text-xs mb-1.5 flex items-center gap-1">
                        <Bug className="w-3.5 h-3.5 text-teal-400" />
                        🦠 Microrganismos Solubilizadores
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-200">
                        {(def.solubilizingMicroorganisms || []).map((micro, idx) => (
                          <li key={idx}>{micro}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900 border border-amber-800/60 p-3 rounded-xl">
                      <h4 className="font-bold text-amber-300 text-xs mb-1.5 flex items-center gap-1">
                        <Sprout className="w-3.5 h-3.5 text-amber-400" />
                        🌿 Plantas Companheiras Recicladoras
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-200">
                        {(def.companionPlants || []).map((cp, idx) => (
                          <li key={idx}>{cp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ASTRAYA Field Note */}
                  <div className="bg-gradient-to-r from-emerald-900/40 to-green-900/30 border border-emerald-700/50 p-3 rounded-xl text-slate-200">
                    <span className="font-bold text-emerald-400 block mb-0.5">
                      💡 Nota Técnica ASTRAYA:
                    </span>
                    <p>{def.astrayaTips}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fullscreen Photo Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-emerald-600 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 text-white">
              <span className="font-bold text-sm text-emerald-400">{zoomedImage.title} - Foto Ilustrativa de Campo</span>
              <button
                onClick={() => setZoomedImage(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 flex-1 flex items-center justify-center bg-black overflow-auto">
              <SafeImage
                src={zoomedImage.url}
                fallbackSrc={FALLBACK_DEFICIENCY_IMAGE}
                alt={zoomedImage.title}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </div>
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Imagem em alta resolução do acervo da Associação ASTRAYA</span>
              <a
                href={DRIVE_PHOTOS_FOLDER}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1"
              >
                Ver pasta completa no Drive <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal Independente de Upload de Fotos da Seção 1.1 */}
      {isSectionUploadOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsSectionUploadOpen(false)}
        >
          <div
            className="relative max-w-xl w-full bg-slate-900 border border-emerald-600/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col p-5 space-y-4 text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-950 border border-emerald-700/80 rounded-xl text-emerald-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-emerald-100">Upload Independente de Fotos - Seção 1.1</h3>
                  <p className="text-[11px] text-slate-400">Anexe imagens de campo às deficiências nutricionais da cannabis</p>
                </div>
              </div>
              <button
                onClick={() => setIsSectionUploadOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Deficiency Selector */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                1. Selecione a Deficiência Nutricional Alvo:
              </label>
              <select
                value={selectedDeficiencyForUpload}
                onChange={(e) => setSelectedDeficiencyForUpload(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
              >
                {deficiencies.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.element} ({d.symbol}) - {d.type} ({d.targetLeaves})
                  </option>
                ))}
              </select>
            </div>

            {/* File Dropzone / Selector / Direct URL */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                2. Selecione a(s) Foto(s) de Campo (Arquivo Local ou Link URL Web):
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* File Upload Box */}
                <label className="border border-dashed border-emerald-700/60 hover:border-emerald-500 bg-slate-950/80 rounded-xl p-3 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition group">
                  <ImagePlus className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition" />
                  <span className="text-xs font-semibold text-slate-200">Escolher arquivo(s) local(is)</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG, WEBP</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleModalFileSelect(e.target.files)}
                    className="hidden"
                  />
                </label>

                {/* Direct Link URL Box */}
                <div className="border border-slate-800 bg-slate-950/80 rounded-xl p-3 flex flex-col justify-between space-y-1">
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                    <Link className="w-3.5 h-3.5" />
                    <span>Ou Cole o Link / URL da Imagem:</span>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="url"
                      value={modalUrlInput}
                      onChange={(e) => setModalUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleModalAddUrl();
                        }
                      }}
                      placeholder="Google Drive, Imgur, Unsplash..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleModalAddUrl}
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Preview Grid */}
            {modalPendingImages.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span>Fotos Selecionadas para Upload ({modalPendingImages.length}):</span>
                  <button
                    onClick={() => setModalPendingImages([])}
                    className="text-[10px] text-red-400 hover:underline"
                  >
                    Limpar Seleção
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1.5 bg-slate-950 rounded-xl border border-slate-800">
                  {modalPendingImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 group">
                      <SafeImage src={img} fallbackSrc={FALLBACK_DEFICIENCY_IMAGE} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => setModalPendingImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-0.5 bg-black/80 text-red-400 hover:text-white rounded-md opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Caption/Notes */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                3. Observação Técnica ou Legenda da Foto (Opcional):
              </label>
              <textarea
                value={modalCaption}
                onChange={(e) => setModalCaption(e.target.value)}
                placeholder="Ex: Foto tirada no dia 35 de floração. Folhas inferiores com clorose acentuada entre as nervuras..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsSectionUploadOpen(false);
                  setModalPendingImages([]);
                  setModalCaption('');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSectionUpload}
                disabled={modalPendingImages.length === 0}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 text-slate-950" />
                <span>Confirmar Upload na Seção 1.1</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

