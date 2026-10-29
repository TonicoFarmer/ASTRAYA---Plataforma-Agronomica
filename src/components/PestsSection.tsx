import React, { useState } from 'react';
import { PestPois } from '../types';
import { Search, ExternalLink, Bug, Plus, Edit2, AlertOctagon, ChevronLeft, ChevronRight, Maximize2, X, Upload, ImagePlus, Trash2, Check, Link } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { formatImageUrl, FALLBACK_PEST_IMAGE } from '../utils/imageUtils';

interface PestsSectionProps {
  pests: PestPois[];
  isAdmin: boolean;
  onEditItem: (item: PestPois) => void;
  onAddNew: () => void;
  pdfUrl: string;
  onSavePest?: (pest: PestPois) => void;
}

export const PestsSection: React.FC<PestsSectionProps> = ({
  pests,
  isAdmin,
  onEditItem,
  onAddNew,
  pdfUrl,
  onSavePest,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(pests[0]?.id || null);

  // Carousel & Fullscreen Image Viewer State
  const [imageIndexes, setImageIndexes] = useState<{ [id: string]: number }>({});
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState<string | null>(null);

  // Feedback Notification Banner State
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Section Batch Upload Modal State
  const [isSectionUploadModalOpen, setIsSectionUploadModalOpen] = useState(false);
  const [selectedPestForUpload, setSelectedPestForUpload] = useState<string>(pests[0]?.id || '');
  const [modalPendingImages, setModalPendingImages] = useState<string[]>([]);
  const [modalUrlInput, setModalUrlInput] = useState<string>('');

  // State for direct URL image inputs per pest card
  const [showUrlInputMap, setShowUrlInputMap] = useState<{ [id: string]: boolean }>({});
  const [urlInputValueMap, setUrlInputValueMap] = useState<{ [id: string]: string }>({});

  // Helper function to compress and resize images via HTML5 Canvas before adding to state
  const compressImage = (file: File, maxWidth = 500, quality = 0.65): Promise<string> => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onerror = () => resolve('');
      reader.onload = (event) => {
        const img = new Image();
        img.onerror = () => resolve('');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string || '');
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Image Upload Handler for individual pest card
  const handleImageUpload = (pestId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const compressPromises = fileArray.map((file) => compressImage(file, 500, 0.65));

    Promise.all(compressPromises).then((newImageUrls) => {
      const validImageUrls = newImageUrls.filter(Boolean);
      if (validImageUrls.length === 0) return;

      const targetPest = pests.find((p) => p.id === pestId);
      if (!targetPest) return;

      const existingImages = targetPest.images && targetPest.images.length > 0
        ? targetPest.images
        : [targetPest.imageUrl || 'https://images.unsplash.com/photo-1599598425947-320f3299c853?auto=format&fit=crop&w=600&q=80'];

      const updatedImages = [...existingImages, ...validImageUrls];

      const updatedPest: PestPois = {
        ...targetPest,
        imageUrl: targetPest.imageUrl || validImageUrls[0],
        images: updatedImages,
      };

      if (onSavePest) {
        onSavePest(updatedPest);
      }

      setImageIndexes((prev) => ({
        ...prev,
        [pestId]: updatedImages.length - 1,
      }));

      setUploadSuccessMsg(`🎉 ${validImageUrls.length} foto(s) comprimida(s) e salva(s) com sucesso em ${targetPest.name}!`);
      setTimeout(() => setUploadSuccessMsg(null), 4000);
    });
  };

  // Handler for adding an image via direct Web URL / Google Drive link
  const handleAddDirectUrl = (pestId: string, rawUrl: string) => {
    const formatted = formatImageUrl(rawUrl);
    if (!formatted) return;

    const targetPest = pests.find((p) => p.id === pestId);
    if (!targetPest) return;

    const existingImages = targetPest.images && targetPest.images.length > 0
      ? targetPest.images
      : [targetPest.imageUrl || 'https://images.unsplash.com/photo-1599598425947-320f3299c853?auto=format&fit=crop&w=600&q=80'];

    const updatedImages = [...existingImages, formatted];

    const updatedPest: PestPois = {
      ...targetPest,
      imageUrl: targetPest.imageUrl || formatted,
      images: updatedImages,
    };

    if (onSavePest) {
      onSavePest(updatedPest);
    }

    setImageIndexes((prev) => ({
      ...prev,
      [pestId]: updatedImages.length - 1,
    }));

    setUrlInputValueMap((prev) => ({ ...prev, [pestId]: '' }));
    setShowUrlInputMap((prev) => ({ ...prev, [pestId]: false }));

    setUploadSuccessMsg(`🎉 Foto via Link/URL adicionada com sucesso em ${targetPest.name}!`);
    setTimeout(() => setUploadSuccessMsg(null), 4000);
  };

  // Remove uploaded photo handler
  const handleRemovePhoto = (pestId: string, photoIdx: number) => {
    const targetPest = pests.find((p) => p.id === pestId);
    if (!targetPest) return;

    const currentImages = targetPest.images && targetPest.images.length > 0
      ? targetPest.images
      : [targetPest.imageUrl];

    if (currentImages.length <= 1) {
      alert("Cada praga deve manter pelo menos uma foto principal.");
      return;
    }

    const updatedImages = currentImages.filter((_, idx) => idx !== photoIdx);
    const updatedPest: PestPois = {
      ...targetPest,
      imageUrl: updatedImages[0] || '',
      images: updatedImages,
    };

    if (onSavePest) {
      onSavePest(updatedPest);
    }

    setImageIndexes((prev) => ({
      ...prev,
      [pestId]: Math.max(0, photoIdx - 1),
    }));

    setUploadSuccessMsg(`Foto removida de ${targetPest.name}.`);
    setTimeout(() => setUploadSuccessMsg(null), 3000);
  };

  // Modal batch file selector
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
    if (!selectedPestForUpload) {
      alert('Selecione uma praga na lista.');
      return;
    }
    if (modalPendingImages.length === 0) {
      alert('Selecione ou cole pelo menos uma imagem para adicionar.');
      return;
    }

    const targetPest = pests.find((p) => p.id === selectedPestForUpload);
    if (!targetPest) return;

    const existingImages = targetPest.images && targetPest.images.length > 0
      ? targetPest.images
      : [targetPest.imageUrl || 'https://images.unsplash.com/photo-1599598425947-320f3299c853?auto=format&fit=crop&w=600&q=80'];

    const updatedImages = [...existingImages, ...modalPendingImages];

    const updatedPest: PestPois = {
      ...targetPest,
      imageUrl: targetPest.imageUrl || modalPendingImages[0],
      images: updatedImages,
    };

    if (onSavePest) {
      onSavePest(updatedPest);
    }

    setImageIndexes((prev) => ({
      ...prev,
      [selectedPestForUpload]: updatedImages.length - 1,
    }));

    setIsSectionUploadModalOpen(false);
    setModalPendingImages([]);

    setUploadSuccessMsg(`🎉 ${modalPendingImages.length} foto(s) adicionada(s) a ${targetPest.name}!`);
    setTimeout(() => setUploadSuccessMsg(null), 4000);
  };

  const filtered = pests.filter((pest) => {
    const matchesSearch =
      pest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pest.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pest.identification.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || pest.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Success Notification Toast Banner */}
      {uploadSuccessMsg && (
        <div className="bg-emerald-900/90 border border-emerald-500 text-emerald-100 p-3.5 rounded-xl shadow-xl flex items-center justify-between gap-3 text-xs font-semibold animate-bounce">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{uploadSuccessMsg}</span>
          </div>
          <button
            onClick={() => setUploadSuccessMsg(null)}
            className="text-emerald-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top PDF Drive Banner & Batch Upload Button */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-950 p-4 rounded-2xl border border-emerald-700/60 shadow-md text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-800/80 rounded-xl border border-emerald-600/40 text-emerald-300 shrink-0">
              <Bug className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-emerald-100 flex items-center gap-2">
                1.2 Identificação e Controle de Pragas Agrícolas
              </h2>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Manual de identificação, bioprotetores e defensivos orgânicos hospedado no Google Drive da ASTRAYA.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl shadow-sm transition border border-emerald-400/30"
            >
              <span>Abrir PDF no Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar praga, inseto, sintoma ou nome científico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Todas as Categorias</option>
            <option value="Ácaro">Ácaros</option>
            <option value="Inseto Sugador">Sugadores (Trips, Pulgões...)</option>
            <option value="Praga do Solo">Pragas de Solo (Gnats...)</option>
            <option value="Fungo/Bactéria">Fungos / Mofo (Botrytis, Oídio)</option>
            <option value="Lagarta/Broca">Lagartas e Brocas</option>
            <option value="Nematoide">Nematoides</option>
          </select>

          {isAdmin && (
            <button
              onClick={onAddNew}
              className="flex items-center gap-1 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Praga</span>
            </button>
          )}
        </div>
      </div>

      {/* List of Pests */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((pest) => {
          const isExpanded = expandedId === pest.id;

          const severityColor =
            pest.severity === 'Alta'
              ? 'bg-rose-950/80 text-rose-300 border-rose-800'
              : pest.severity === 'Média'
              ? 'bg-amber-950/80 text-amber-300 border-amber-800'
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800';

          const imageList = pest.images && pest.images.length > 0 ? pest.images : [pest.imageUrl];
          const currentImgIdx = imageIndexes[pest.id] || 0;
          const activeImageUrl = imageList[currentImgIdx] || pest.imageUrl;

          return (
            <div
              key={pest.id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm ${
                isExpanded ? 'border-emerald-500 ring-1 ring-emerald-500/40' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : pest.id)}
                className="p-4 bg-slate-900 cursor-pointer flex items-center justify-between gap-3 select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-emerald-400 overflow-hidden">
                    <SafeImage
                      src={activeImageUrl}
                      fallbackSrc={FALLBACK_PEST_IMAGE}
                      alt={pest.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-100">{pest.name}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${severityColor}`}>
                        Gravidade: {pest.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 italic">
                      {pest.scientificName} • <span className="text-emerald-300 not-italic font-medium">{pest.category}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditItem(pest);
                      }}
                      className="p-1.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <span className="text-xs text-emerald-400 font-semibold px-2 py-1 bg-emerald-950 rounded-lg border border-emerald-800">
                    {isExpanded ? 'Recolher' : 'MIP e Protocolos'}
                  </span>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-4 bg-slate-950/90 border-t border-slate-800 text-xs space-y-4">
                  {/* Photo & Identification */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="relative rounded-xl overflow-hidden border border-slate-800 h-52 bg-slate-900 group">
                        <SafeImage
                          src={activeImageUrl}
                          fallbackSrc={FALLBACK_PEST_IMAGE}
                          alt={pest.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Top Overlay Badge & Fullscreen Toggle */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
                          <span className="bg-slate-950/85 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
                            Foto {currentImgIdx + 1} de {imageList.length}
                          </span>
                          <button
                            onClick={() => setFullscreenImageUrl(activeImageUrl)}
                            className="pointer-events-auto p-1 bg-slate-950/80 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-md border border-slate-700 transition"
                            title="Ampliar Imagem"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Image Carousel Navigation Controls */}
                        {imageList.length > 1 && (
                          <>
                            <button
                              onClick={() =>
                                setImageIndexes((prev) => ({
                                  ...prev,
                                  [pest.id]: (currentImgIdx - 1 + imageList.length) % imageList.length,
                                }))
                              }
                              className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1 bg-slate-950/80 hover:bg-slate-800 text-white rounded-full border border-slate-700 transition"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setImageIndexes((prev) => ({
                                  ...prev,
                                  [pest.id]: (currentImgIdx + 1) % imageList.length,
                                }))
                              }
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 bg-slate-950/80 hover:bg-slate-800 text-white rounded-full border border-slate-700 transition"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-sm p-1.5 rounded-lg text-[10px] text-emerald-200 border border-slate-700 truncate">
                          {pest.name}
                        </div>
                      </div>

                      {/* Independent Photo Controls Bar with Direct URL Link - ADMIN ONLY */}
                      {isAdmin && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setShowUrlInputMap((prev) => ({ ...prev, [pest.id]: !prev[pest.id] }))}
                              className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-700/60 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                              title="Adicionar imagem via Link URL"
                            >
                              <Link className="w-3.5 h-3.5" />
                              <span>Link URL</span>
                            </button>

                            {imageList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(pest.id, currentImgIdx)}
                                className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 rounded-xl border border-red-800/80 transition"
                                title="Remover foto atual"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {showUrlInputMap[pest.id] && (
                            <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-emerald-700/80 rounded-xl text-xs animate-fadeIn">
                              <input
                                type="url"
                                value={urlInputValueMap[pest.id] || ''}
                                onChange={(e) => setUrlInputValueMap((prev) => ({ ...prev, [pest.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddDirectUrl(pest.id, urlInputValueMap[pest.id] || '');
                                  }
                                }}
                                placeholder="Cole o link (Google Drive / Imgur / Web)..."
                                className="flex-1 bg-slate-950 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddDirectUrl(pest.id, urlInputValueMap[pest.id] || '')}
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
                        <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-1">
                          Identificação Visual
                        </h4>
                        <p className="text-slate-300 leading-relaxed">{pest.identification}</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                          <AlertOctagon className="w-3.5 h-3.5" />
                          Sintomas de Dano na Planta
                        </h4>
                        <ul className="list-disc pl-4 space-y-1 text-slate-300">
                          {pest.damageSymptoms.map((ds, idx) => (
                            <li key={idx}>{ds}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Prevention & Biological Control */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                      <h4 className="font-bold text-emerald-300 text-xs mb-1.5 flex items-center gap-1">
                        🛡️ Prevenção & Manejo de Ambiente
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-200">
                        {pest.prevention.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-emerald-950/60 border border-emerald-800/80 p-3 rounded-xl">
                      <h4 className="font-bold text-emerald-400 text-xs mb-1.5 flex items-center gap-1">
                        🐞 Controle Biológico (Predadores / Fungos)
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-200">
                        {pest.biologicalControl.map((bc, idx) => (
                          <li key={idx}>{bc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Organic Recipes */}
                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                    <h4 className="font-bold text-amber-300 text-xs mb-1.5 flex items-center gap-1">
                      🌿 Receita Orgânica / JADAM JWA / Neem
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-200">
                      {pest.organicRecipes.map((or, idx) => (
                        <li key={idx}>{or}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Section-Level Batch Upload Modal */}
      {isSectionUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-800/80 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Upload className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-100">Adicionar Fotos de Pragas Agrícolas</h3>
              </div>
              <button
                onClick={() => {
                  setIsSectionUploadModalOpen(false);
                  setModalPendingImages([]);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Pest Selector */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                1. Selecione a Praga Alvo:
              </label>
              <select
                value={selectedPestForUpload}
                onChange={(e) => setSelectedPestForUpload(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-300 font-medium focus:outline-none focus:border-emerald-500"
              >
                {pests.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.scientificName})
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
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-300">
                  Imagens selecionadas para inclusão ({modalPendingImages.length}):
                </span>
                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {modalPendingImages.map((img, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden h-16 border border-slate-700 group">
                      <SafeImage src={img} fallbackSrc={FALLBACK_PEST_IMAGE} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => setModalPendingImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-red-950/90 text-red-300 p-0.5 rounded-full hover:bg-red-800 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsSectionUploadModalOpen(false);
                  setModalPendingImages([]);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSectionUpload}
                disabled={modalPendingImages.length === 0}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Confirmar e Salvar Fotos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {fullscreenImageUrl && (
        <div
          onClick={() => setFullscreenImageUrl(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <SafeImage
              src={fullscreenImageUrl}
              fallbackSrc={FALLBACK_PEST_IMAGE}
              alt="Ampliada"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-700 shadow-2xl"
            />
            <button
              onClick={() => setFullscreenImageUrl(null)}
              className="absolute top-2 right-2 p-2 bg-slate-900/90 text-slate-200 hover:text-white rounded-full border border-slate-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
