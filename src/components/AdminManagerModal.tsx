import React, { useState, useEffect } from 'react';
import { X, Save, Shield, Plus } from 'lucide-react';
import { NutritionalDeficiency, PestPois, BioInput } from '../types';

interface AdminManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: NutritionalDeficiency | PestPois | BioInput | null;
  onSaveDeficiency?: (item: NutritionalDeficiency) => void;
  onSavePest?: (item: PestPois) => void;
  onSaveBioInput?: (item: BioInput) => void;
  mode: 'deficiency' | 'pest' | 'bioinput';
}

export const AdminManagerModal: React.FC<AdminManagerModalProps> = ({
  isOpen,
  onClose,
  editingItem,
  onSaveDeficiency,
  onSavePest,
  onSaveBioInput,
  mode,
}) => {
  if (!isOpen) return null;

  // Form states depending on mode
  const [element, setElement] = useState('');
  const [symbol, setSymbol] = useState('');
  const [type, setType] = useState<'Macro' | 'Secundário' | 'Micro'>('Macro');
  const [mobility, setMobility] = useState<'Móvel' | 'Imóvel' | 'Parcialmente Móvel'>('Móvel');
  const [targetLeaves, setTargetLeaves] = useState<'Folhas Velhas (Inferiores)' | 'Folhas Novas (Superiores)' | 'Toda a Planta'>('Folhas Velhas (Inferiores)');
  const [symptomsText, setSymptomsText] = useState('');
  const [causesText, setCausesText] = useState('');
  const [organicText, setOrganicText] = useState('');
  const [mineralText, setMineralText] = useState('');
  const [astrayaTips, setAstrayaTips] = useState('');

  // Pest state
  const [pestName, setPestName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [category, setCategory] = useState<'Ácaro' | 'Inseto Sugador' | 'Lagarta/Broca' | 'Fungo/Bactéria' | 'Praga do Solo' | 'Nematoide'>('Ácaro');
  const [identification, setIdentification] = useState('');
  const [damageSymptomsText, setDamageSymptomsText] = useState('');
  const [preventionText, setPreventionText] = useState('');
  const [bioControlText, setBioControlText] = useState('');
  const [organicRecipesText, setOrganicRecipesText] = useState('');
  const [severity, setSeverity] = useState<'Alta' | 'Média' | 'Baixa'>('Média');

  // Bioinput state
  const [prodName, setProdName] = useState('');
  const [activeAgent, setActiveAgent] = useState('');
  const [bioCat, setBioCat] = useState<'Biofungicida' | 'Bioinseticida' | 'Inoculante' | 'Bioestimulante' | 'Bionematicida'>('Biofungicida');
  const [dosage, setDosage] = useState('');
  const [targetPest, setTargetPest] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingItem) {
      if (mode === 'deficiency') {
        const d = editingItem as NutritionalDeficiency;
        setElement(d.element || '');
        setSymbol(d.symbol || '');
        setType(d.type || 'Macro');
        setMobility(d.mobility || 'Móvel');
        setTargetLeaves(d.targetLeaves || 'Folhas Velhas (Inferiores)');
        setSymptomsText((d.symptoms || []).join('\n'));
        setCausesText((d.causes || []).join('\n'));
        setOrganicText((d.correctiveOrganic || []).join('\n'));
        setMineralText((d.correctiveMineral || []).join('\n'));
        setAstrayaTips(d.astrayaTips || '');
      } else if (mode === 'pest') {
        const p = editingItem as PestPois;
        setPestName(p.name || '');
        setScientificName(p.scientificName || '');
        setCategory(p.category || 'Ácaro');
        setIdentification(p.identification || '');
        setDamageSymptomsText((p.damageSymptoms || []).join('\n'));
        setPreventionText((p.prevention || []).join('\n'));
        setBioControlText((p.biologicalControl || []).join('\n'));
        setOrganicRecipesText((p.organicRecipes || []).join('\n'));
        setSeverity(p.severity || 'Média');
      } else if (mode === 'bioinput') {
        const b = editingItem as BioInput;
        setProdName(b.productName || '');
        setActiveAgent(b.activeAgent || '');
        setBioCat(b.category || 'Biofungicida');
        setDosage(b.dosage || '');
        setTargetPest(b.targetPestOrDisease || '');
        setNotes(b.astrayaNotes || '');
      }
    }
  }, [editingItem, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'deficiency' && onSaveDeficiency) {
      const updated: NutritionalDeficiency = {
        id: editingItem ? editingItem.id : 'def-' + Date.now(),
        element,
        symbol,
        type,
        mobility,
        targetLeaves,
        symptoms: symptomsText.split('\n').filter(Boolean),
        causes: causesText.split('\n').filter(Boolean),
        correctiveOrganic: organicText.split('\n').filter(Boolean),
        correctiveMineral: mineralText.split('\n').filter(Boolean),
        astrayaTips,
        imageUrl: (editingItem as NutritionalDeficiency)?.imageUrl || 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80',
        images: (editingItem as NutritionalDeficiency)?.images || [],
        figures: (editingItem as NutritionalDeficiency)?.figures || [],
        pdfDriveUrl: "https://drive.google.com/file/d/11K2aByla0I_QXxh6COHBxyFLKKsgGqEC/view?usp=drive_link"
      };
      onSaveDeficiency(updated);
    } else if (mode === 'pest' && onSavePest) {
      const updated: PestPois = {
        id: editingItem ? editingItem.id : 'pest-' + Date.now(),
        name: pestName,
        scientificName,
        category,
        identification,
        damageSymptoms: damageSymptomsText.split('\n').filter(Boolean),
        prevention: preventionText.split('\n').filter(Boolean),
        biologicalControl: bioControlText.split('\n').filter(Boolean),
        organicRecipes: organicRecipesText.split('\n').filter(Boolean),
        chemicalOrMineral: [],
        severity,
        imageUrl: (editingItem as PestPois)?.imageUrl || 'https://images.unsplash.com/photo-1599598425947-320f3299c853?auto=format&fit=crop&w=600&q=80',
        images: (editingItem as PestPois)?.images || [],
        pdfDriveUrl: "https://drive.google.com/file/d/1DsLZM5eyHvKaQG7NOciRe1tCbT2RD6Tf/view?usp=drive_link"
      };
      onSavePest(updated);
    } else if (mode === 'bioinput' && onSaveBioInput) {
      const updated: BioInput = {
        id: editingItem ? editingItem.id : 'bio-' + Date.now(),
        productName: prodName,
        activeAgent,
        category: bioCat,
        dosage,
        targetPestOrDisease: targetPest,
        astrayaNotes: notes,
      };
      onSaveBioInput(updated);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 text-slate-100">
        <div className="p-4 bg-amber-500 text-slate-950 flex items-center justify-between font-bold text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>
              {editingItem ? 'Editar Parâmetro ASTRAYA' : 'Novo Parâmetro - Modo Admin'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-900 hover:bg-amber-400 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {mode === 'deficiency' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nutriente (ex: Nitrogênio)</label>
                  <input
                    type="text"
                    required
                    value={element}
                    onChange={(e) => setElement(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Símbolo (ex: N)</label>
                  <input
                    type="text"
                    required
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tipo</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  >
                    <option value="Macro">Macro</option>
                    <option value="Secundário">Secundário</option>
                    <option value="Micro">Micro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Mobilidade</label>
                  <select
                    value={mobility}
                    onChange={(e) => setMobility(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  >
                    <option value="Móvel">Móvel</option>
                    <option value="Imóvel">Imóvel</option>
                    <option value="Parcialmente Móvel">Parcialmente Móvel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Região da Folha</label>
                  <select
                    value={targetLeaves}
                    onChange={(e) => setTargetLeaves(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  >
                    <option value="Folhas Velhas (Inferiores)">Folhas Velhas</option>
                    <option value="Folhas Novas (Superiores)">Folhas Novas</option>
                    <option value="Toda a Planta">Toda a Planta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Sintomas (1 por linha)</label>
                <textarea
                  rows={3}
                  value={symptomsText}
                  onChange={(e) => setSymptomsText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Causas e Bloqueios (1 por linha)</label>
                <textarea
                  rows={2}
                  value={causesText}
                  onChange={(e) => setCausesText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Correção Orgânica & KNF (1 por linha)</label>
                <textarea
                  rows={2}
                  value={organicText}
                  onChange={(e) => setOrganicText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Dica Técnica ASTRAYA</label>
                <textarea
                  rows={2}
                  value={astrayaTips}
                  onChange={(e) => setAstrayaTips(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                />
              </div>
            </>
          )}

          {mode === 'bioinput' && (
            <>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nome do Produto</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Agente Ativo (ex: Trichoderma harzianum)</label>
                <input
                  type="text"
                  required
                  value={activeAgent}
                  onChange={(e) => setActiveAgent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Categoria</label>
                  <select
                    value={bioCat}
                    onChange={(e) => setBioCat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  >
                    <option value="Biofungicida">Biofungicida</option>
                    <option value="Bioinseticida">Bioinseticida</option>
                    <option value="Inoculante">Inoculante</option>
                    <option value="Bioestimulante">Bioestimulante</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Dosagem Recomendada</label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Alvo Principal (Praga / Fungo)</label>
                <input
                  type="text"
                  required
                  value={targetPest}
                  onChange={(e) => setTargetPest(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Nota da ASTRAYA</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl shadow flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
