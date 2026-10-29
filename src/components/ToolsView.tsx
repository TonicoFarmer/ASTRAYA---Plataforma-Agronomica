import React, { useState } from 'react';
import { ToolsSubMenu, DriveDocument } from '../types';
import { Wrench, ExternalLink, Plus, BookOpen, Layers, Trash2, Mountain, Sparkles } from 'lucide-react';

interface ToolsViewProps {
  subCategory: ToolsSubMenu;
  documents: DriveDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<DriveDocument[]>>;
  isAdmin: boolean;
}

export const ToolsView: React.FC<ToolsViewProps> = ({
  subCategory,
  documents,
  setDocuments,
  isAdmin,
}) => {
  // Substrate Volume & Recipe State
  const [numPots, setNumPots] = useState<number>(12);
  const [potSizeLiters, setPotSizeLiters] = useState<number>(11);
  const [rockallDoseGramsPerLiter, setRockallDoseGramsPerLiter] = useState<number>(10); // 10g per Liter of substrate

  // Drive Doc Form State
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Geral');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');

  // Substrate Proportions (33% Turfa, 33% Perlita, 30% Húmus, 3% Biochar)
  const totalSubstrateLiters = numPots * potSizeLiters;
  const peatVolume = (totalSubstrateLiters * 0.33).toFixed(1);
  const perliteVolume = (totalSubstrateLiters * 0.33).toFixed(1);
  const humusVolume = (totalSubstrateLiters * 0.30).toFixed(1);
  const biocharVolume = (totalSubstrateLiters * 0.03).toFixed(1);

  // Rockall Rock Dust calculation
  const totalRockallGrams = Math.round(totalSubstrateLiters * rockallDoseGramsPerLiter);
  const rockallFormatted = totalRockallGrams >= 1000 
    ? `${(totalRockallGrams / 1000).toFixed(2)} kg` 
    : `${totalRockallGrams} g`;

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle || !newDocUrl) return;
    const doc: DriveDocument = {
      id: 'doc-' + Date.now(),
      title: newDocTitle,
      category: newDocCategory,
      description: newDocDesc,
      url: newDocUrl,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setDocuments([doc, ...documents]);
    setNewDocTitle('');
    setNewDocDesc('');
    setNewDocUrl('');
    setShowAddDoc(false);
  };

  const handleDeleteDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-green-950 p-4 rounded-2xl border border-emerald-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-800/80 rounded-xl text-emerald-300 shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-base text-emerald-100">
              {subCategory === 'substrato' && '4.3 Calculadora de Substrato & Receita de Solo'}
              {subCategory === 'biblioteca_drive' && '4.4 Biblioteca de Documentos & PDFs Drive ASTRAYA'}
            </h2>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Ferramentas agronômicas de precisão para montagem de solo orgânico vivo e gestão de documentos.
            </p>
          </div>
        </div>
      </div>

      {/* 4.3 SUBSTRATO & RECEITA DE SOLO */}
      {subCategory === 'substrato' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-5 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Calculadora de Substrato & Receita de Solo Vivo
            </h3>
            <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-800 font-semibold">
              Fórmula ASTRAYA Orgânica
            </span>
          </div>

          {/* Volume Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Quantidade de Vasos:</label>
              <input
                type="number"
                min="1"
                value={numPots}
                onChange={(e) => setNumPots(Math.max(1, Number(e.target.value) || 1))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold text-base focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Volume de Cada Vaso (Litros):</label>
              <input
                type="number"
                min="1"
                value={potSizeLiters}
                onChange={(e) => setPotSizeLiters(Math.max(1, Number(e.target.value) || 1))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold text-base focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                <span>Pós de Rocha Rockall (g/L):</span>
                <span className="text-emerald-400 font-bold text-[11px]">{rockallDoseGramsPerLiter} g/L</span>
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={rockallDoseGramsPerLiter}
                  onChange={(e) => setRockallDoseGramsPerLiter(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold text-base focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Rockall Preset Quick Buttons */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-amber-400" />
              <span>Proporção Recomendada de Rockall:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setRockallDoseGramsPerLiter(5)}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                  rockallDoseGramsPerLiter === 5
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                5 g/L (Suave)
              </button>
              <button
                type="button"
                onClick={() => setRockallDoseGramsPerLiter(10)}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                  rockallDoseGramsPerLiter === 10
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                10 g/L (Recomendado)
              </button>
              <button
                type="button"
                onClick={() => setRockallDoseGramsPerLiter(15)}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                  rockallDoseGramsPerLiter === 15
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                15 g/L (Intenso)
              </button>
              <button
                type="button"
                onClick={() => setRockallDoseGramsPerLiter(20)}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                  rockallDoseGramsPerLiter === 20
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                20 g/L (Solo Vivo Reforçado)
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
            <div className="flex justify-between items-center text-sm font-bold text-emerald-300 border-b border-slate-800 pb-2">
              <span>Volume Total de Substrato a Preparar:</span>
              <span className="text-lg text-emerald-400">{totalSubstrateLiters} Litros</span>
            </div>

            {/* Component Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/90 space-y-1">
                <span className="text-slate-400 block font-medium">Turfa de Esfagno (33%)</span>
                <span className="font-bold text-emerald-400 text-xl block">{peatVolume} L</span>
                <span className="text-[10px] text-slate-400 block">Retenção de umidade e porosidade</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/90 space-y-1">
                <span className="text-slate-400 block font-medium">Perlita Expandida (33%)</span>
                <span className="font-bold text-emerald-400 text-xl block">{perliteVolume} L</span>
                <span className="text-[10px] text-slate-400 block">Aeração e drenagem radicular</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/90 space-y-1">
                <span className="text-slate-400 block font-medium">Húmus de Minhoca (30%)</span>
                <span className="font-bold text-emerald-400 text-xl block">{humusVolume} L</span>
                <span className="text-[10px] text-slate-400 block">Matéria orgânica e microbiologia</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/90 space-y-1">
                <span className="text-slate-400 block font-medium">Biochar (3%)</span>
                <span className="font-bold text-emerald-400 text-xl block">{biocharVolume} L</span>
                <span className="text-[10px] text-slate-400 block">Habitat microbiano e CTC</span>
              </div>
            </div>

            {/* Mineral Additive - Rockall Rock Dust Banner */}
            <div className="p-3.5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 rounded-xl border border-amber-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-900/50 rounded-lg text-amber-300 shrink-0">
                  <Mountain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                    <span>Pós de Rocha Rockall</span>
                    <span className="text-[10px] text-amber-300 font-normal">({rockallDoseGramsPerLiter} g por Litro)</span>
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Remineralizador de solo rico em Silício (SiO₂), Cálcio, Magnésio e micronutrientes essenciais.
                  </p>
                </div>
              </div>
              <div className="bg-amber-950/80 px-4 py-2 rounded-xl border border-amber-700/80 shrink-0 self-end sm:self-auto text-right">
                <span className="text-[10px] text-amber-200/80 block uppercase font-medium">Quantidade de Rockall:</span>
                <span className="text-xl font-extrabold text-amber-300 block">{rockallFormatted}</span>
              </div>
            </div>
          </div>

          {/* Dicas de Mistura e Homogeneização */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-900/70 rounded-xl space-y-2">
            <h4 className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Instruções de Preparo do Solo Vivo ASTRAYA:</span>
            </h4>
            <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1 leading-relaxed">
              <li>Misture a <strong>Turfa (33%)</strong> e a <strong>Perlita (33%)</strong> secas em uma lona limpa até obter aeração uniforme.</li>
              <li>Adicione o <strong>Húmus de Minhoca (30%)</strong> e o <strong>Biochar (3%)</strong> devidamente ativado ou inoculado.</li>
              <li>Polvilhe uniformemente os <strong>{rockallFormatted} de Pó de Rocha Rockall</strong> sobre a mistura e homogeneie completamente.</li>
              <li>Umedeça levemente o substrato com chá compostado ou inoculante microbiano (KNF / JADAM) e deixe descansar por 7 a 14 dias antes do plantio.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 4.4 BIBLIOTECA DE DOCUMENTOS DRIVE */}
      {subCategory === 'biblioteca_drive' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Documentos & Links do Google Drive
            </h3>

            {isAdmin && (
              <button
                onClick={() => setShowAddDoc(!showAddDoc)}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Link Drive</span>
              </button>
            )}
          </div>

          {/* Add Doc Form */}
          {showAddDoc && (
            <form
              onSubmit={handleAddDoc}
              className="bg-slate-900 border border-emerald-600/80 rounded-2xl p-4 text-xs space-y-3 shadow-lg"
            >
              <h4 className="font-bold text-sm text-emerald-400">Adicionar Novo PDF / Documento no Drive</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Título do Documento</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Laudo Científico de Terpenos"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Categoria</label>
                  <input
                    type="text"
                    required
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Link do Google Drive (URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/..."
                  value={newDocUrl}
                  onChange={(e) => setNewDocUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={newDocDesc}
                  onChange={(e) => setNewDocDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoc(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-xl"
                >
                  Salvar
                </button>
              </div>
            </form>
          )}

          {/* List of Drive Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-sm hover:border-slate-700 transition"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800 uppercase">
                    {doc.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-100 mt-1">{doc.title}</h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{doc.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400">Atualizado: {doc.updatedAt}</span>
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                        title="Excluir Link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition"
                    >
                      <span>Abrir no Drive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
