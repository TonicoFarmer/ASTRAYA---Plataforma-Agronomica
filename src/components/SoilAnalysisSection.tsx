import React, { useState } from 'react';
import { 
  TestTube, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  BarChart2, 
  Calculator, 
  Layers, 
  Sparkles, 
  Info, 
  ArrowRight, 
  ShieldAlert, 
  Copy, 
  Check, 
  Beaker,
  ChevronDown
} from 'lucide-react';
import { SoilAnalysisData } from '../types';

export type CationUnit = 'cmolc' | 'mmolc';

interface InsumoOption {
  id: string;
  name: string;
  element: 'Ca' | 'Mg' | 'K';
  oxidePercentage: number;
  conversionFactor: number;
  oxideName: string;
  description: string;
  dosageTip: string;
}

const CALCIUM_INSUMOS: InsumoOption[] = [
  {
    id: 'wollastonita',
    name: 'Wollastonita (Silicato de Cálcio)',
    element: 'Ca',
    oxidePercentage: 43,
    conversionFactor: 1.397,
    oxideName: 'CaO (Óxido de Cálcio)',
    description: 'Fonte nobre de Cálcio e Silício solúvel (SiO₂). Melhora a estrutura celular e resistência a pragas sem elevar bruscamente o pH.',
    dosageTip: 'Ideal para living soil. Homogeneizar uniformemente em todo o volume do substrato.',
  },
  {
    id: 'gesso_agricola',
    name: 'Gesso Agrícola (Sulfato de Cálcio)',
    element: 'Ca',
    oxidePercentage: 28,
    conversionFactor: 1.397,
    oxideName: 'CaO (Sulfato de Ca ~18% S)',
    description: 'Fornece Cálcio e Enxofre sem alterar o pH do solo. Excelente mobilidade radicular em profundidade.',
    dosageTip: 'Excelente quando o pH já está em 6.2 - 6.8 e apenas o Cálcio precisa subir.',
  },
  {
    id: 'calcario_calcitico',
    name: 'Calcário Calcítico (PRNT 85%)',
    element: 'Ca',
    oxidePercentage: 50,
    conversionFactor: 1.397,
    oxideName: 'CaO (Carbonato de Cálcio)',
    description: 'Aumenta expressivamente o pH e fornece alto teor de Cálcio. Quase isento de Magnésio (< 5% MgO).',
    dosageTip: 'Usar apenas se o pH estiver ácido (< 5.8) e o Magnésio NÃO estiver deficiente.',
  },
  {
    id: 'farinha_conchas',
    name: 'Farinha de Ostras / Conchas Biogênica',
    element: 'Ca',
    oxidePercentage: 50,
    conversionFactor: 1.397,
    oxideName: 'CaO (CaCO₃ Biológico)',
    description: 'Carbonato orgânico de liberação lenta e constante, rico em oligoelementos marinhos benéficos à microbiota.',
    dosageTip: 'Incorporar no preparo inicial de solos reciclados e super solos.',
  },
];

const MAGNESIUM_INSUMOS: InsumoOption[] = [
  {
    id: 'carbonato_magnesio',
    name: 'Carbonato de Magnésio (MgCO₃)',
    element: 'Mg',
    oxidePercentage: 47,
    conversionFactor: 1.6595,
    oxideName: 'MgO (Óxido de Magnésio)',
    description: 'Fonte pura e altamente concentrada de Magnésio. Excelente corretivo para living soil orgânico.',
    dosageTip: 'Misturar bem ao solo seco antes de iniciar a maturação/rega.',
  },
  {
    id: 'sulfato_magnesio',
    name: 'Sulfato de Magnésio (Sal de Epsom)',
    element: 'Mg',
    oxidePercentage: 16.3,
    conversionFactor: 1.6595,
    oxideName: 'MgO (~9.8% Mg elementar + 13% S)',
    description: '100% solúvel em água. Liberação imediata para correções rápidas em rega ou fertirrigação.',
    dosageTip: 'Pode ser aplicado via rega semanal fracionada ou pulverização foliar emergencial.',
  },
  {
    id: 'calcario_dolomitico_insumo',
    name: 'Calcário Dolomítico (PRNT 85%)',
    element: 'Mg',
    oxidePercentage: 18,
    conversionFactor: 1.6595,
    oxideName: 'MgO (~18% MgO + ~30% CaO)',
    description: 'Fornece Magnésio e Cálcio ao mesmo tempo, elevando o pH e o V%. Perfeito quando o Mg estiver baixo.',
    dosageTip: 'Aplicar no preparo de solo 20 a 30 dias antes do transplante de mudas.',
  },
  {
    id: 'serpentinito',
    name: 'Serpentinito Moído (Pó de Rocha Magnesiana)',
    element: 'Mg',
    oxidePercentage: 20,
    conversionFactor: 1.6595,
    oxideName: 'MgO (Silicato de Mg)',
    description: 'Remineralizador de liberação lenta por intemperismo biológico. Enriquece a biologia do solo.',
    dosageTip: 'Ótimo para canteiros no-till e ciclos longos.',
  },
];

const POTASSIUM_INSUMOS: InsumoOption[] = [
  {
    id: 'greensand',
    name: 'Greensand (Glauconita)',
    element: 'K',
    oxidePercentage: 10,
    conversionFactor: 1.205,
    oxideName: 'K₂O (Óxido de Potássio)',
    description: 'Mineral de origem marinha rica em Potássio, Ferro e mais de 30 micronutrientes com liberação suave sem queimar raízes.',
    dosageTip: 'Aumenta a retenção de água e a CTC do substrato com liberação gradual.',
  },
  {
    id: 'leonardita',
    name: 'Leonardita Potássica (Humato de Potássio)',
    element: 'K',
    oxidePercentage: 12,
    conversionFactor: 1.205,
    oxideName: 'K₂O + Ácidos Húmicos e Fúlvicos',
    description: 'Fonte orgânica premium de Potássio combinada com alta carga de substâncias húmicas para estimular raízes e micorrizas.',
    dosageTip: 'Melhora a eficiência de absorção dos cátions e estrutura do solo.',
  },
  {
    id: 'sulfato_potassio_org',
    name: 'Sulfato de Potássio Orgânico (K₂SO₄)',
    element: 'K',
    oxidePercentage: 50,
    conversionFactor: 1.205,
    oxideName: 'K₂O (~41% K + 17% S)',
    description: 'Fonte concentrada natural para suprir alta demanda de floração sem elevar o pH nem adicionar cloreto prejudicial.',
    dosageTip: 'Aplicar fracionado durante a pré-flora e pico de floração.',
  },
  {
    id: 'cinza_casca',
    name: 'Cinza de Casca / Biomassa Tratada',
    element: 'K',
    oxidePercentage: 12,
    conversionFactor: 1.205,
    oxideName: 'K₂O alcalinizante',
    description: 'Resíduo agroecológico calcinado rico em K, Ca e P. Possui efeito corretivo no pH.',
    dosageTip: 'Monitorar o pH do solo após aplicação para evitar subidas bruscas.',
  },
];

export const SoilAnalysisSection: React.FC = () => {
  // Unit toggle state: global default and per-element dropdowns
  const [unit, setUnit] = useState<CationUnit>('cmolc');
  const [caUnit, setCaUnit] = useState<CationUnit>('cmolc');
  const [mgUnit, setMgUnit] = useState<CationUnit>('cmolc');
  const [kUnit, setKUnit] = useState<CationUnit>('cmolc');
  const [ctcUnit, setCtcUnit] = useState<CationUnit>('cmolc');

  // Soil analysis inputs (stored in the chosen unit for each field)
  const [data, setData] = useState<SoilAnalysisData>({
    ph: 6.2,
    organicMatter: 4.5,
    nitrogen: 120,
    phosphorus: 45,
    potassium: 0.6, // in cmolc or 6 in mmolc
    calcium: 5.2,   // in cmolc or 52 in mmolc
    magnesium: 1.4, // in cmolc or 14 in mmolc
    ctc: 12.0,      // in cmolc or 120 in mmolc
  });

  // Total Soil / Substrate Volume to calculate total grams needed
  const [soilVolume, setSoilVolume] = useState<number>(100); // Litros (default 100L de substrato)

  // Manual Override / Fine Tuning of recommended grams
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [customGramsCa, setCustomGramsCa] = useState<number>(120);
  const [customGramsMg, setCustomGramsMg] = useState<number>(35);
  const [customGramsK, setCustomGramsK] = useState<number>(30);

  // Selected Insumos state
  const [selectedCaInsumoId, setSelectedCaInsumoId] = useState<string>('wollastonita');
  const [customCaOPercent, setCustomCaOPercent] = useState<number>(43);

  const [selectedMgInsumoId, setSelectedMgInsumoId] = useState<string>('carbonato_magnesio');
  const [customMgOPercent, setCustomMgOPercent] = useState<number>(47);

  const [selectedKInsumoId, setSelectedKInsumoId] = useState<string>('greensand');
  const [customK2OPercent, setCustomK2OPercent] = useState<number>(10);

  // Copy notification state
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Helper to handle global unit change across all fields with automatic conversion
  const handleUnitChange = (newUnit: CationUnit) => {
    if (newUnit === unit) return;
    setData((prev) => ({
      ...prev,
      calcium: caUnit !== newUnit ? (newUnit === 'mmolc' ? Number((prev.calcium * 10).toFixed(1)) : Number((prev.calcium / 10).toFixed(2))) : prev.calcium,
      magnesium: mgUnit !== newUnit ? (newUnit === 'mmolc' ? Number((prev.magnesium * 10).toFixed(1)) : Number((prev.magnesium / 10).toFixed(2))) : prev.magnesium,
      potassium: kUnit !== newUnit ? (newUnit === 'mmolc' ? Number((prev.potassium * 10).toFixed(1)) : Number((prev.potassium / 10).toFixed(2))) : prev.potassium,
      ctc: ctcUnit !== newUnit ? (newUnit === 'mmolc' ? Number((prev.ctc * 10).toFixed(1)) : Number((prev.ctc / 10).toFixed(2))) : prev.ctc,
    }));
    setCaUnit(newUnit);
    setMgUnit(newUnit);
    setKUnit(newUnit);
    setCtcUnit(newUnit);
    setUnit(newUnit);
  };

  // Helper to handle per-element unit change with conversion
  const handleElementUnitChange = (element: 'calcium' | 'magnesium' | 'potassium' | 'ctc', newUnit: CationUnit) => {
    const currentUnit = element === 'calcium' ? caUnit : element === 'magnesium' ? mgUnit : element === 'potassium' ? kUnit : ctcUnit;
    if (newUnit === currentUnit) return;

    setData((prev) => ({
      ...prev,
      [element]: newUnit === 'mmolc' ? Number((prev[element] * 10).toFixed(1)) : Number((prev[element] / 10).toFixed(2)),
    }));

    if (element === 'calcium') setCaUnit(newUnit);
    else if (element === 'magnesium') setMgUnit(newUnit);
    else if (element === 'potassium') setKUnit(newUnit);
    else if (element === 'ctc') setCtcUnit(newUnit);
  };

  // Convert inputs to standard normalized cmolc/dm³ for internal agronomic calculations
  const caCmol = caUnit === 'mmolc' ? data.calcium / 10 : data.calcium;
  const mgCmol = mgUnit === 'mmolc' ? data.magnesium / 10 : data.magnesium;
  const kCmol = kUnit === 'mmolc' ? data.potassium / 10 : data.potassium;
  const ctcCmol = ctcUnit === 'mmolc' ? data.ctc / 10 : data.ctc;

  // Calculate cation ratios (dimensionless, valid in both units)
  const sumCations = caCmol + mgCmol + kCmol;
  const caRatio = mgCmol > 0 ? (caCmol / mgCmol).toFixed(1) : '0';
  const caKRatio = kCmol > 0 ? (caCmol / kCmol).toFixed(1) : '0';
  const mgKRatio = kCmol > 0 ? (mgCmol / kCmol).toFixed(1) : '0';

  const baseSatV = ctcCmol > 0 ? ((sumCations / ctcCmol) * 100).toFixed(1) : '0';

  // Base saturation breakdown (% of CTC)
  const caSatPct = ctcCmol > 0 ? (caCmol / ctcCmol) * 100 : 0;
  const mgSatPct = ctcCmol > 0 ? (mgCmol / ctcCmol) * 100 : 0;
  const kSatPct = ctcCmol > 0 ? (kCmol / ctcCmol) * 100 : 0;

  // Target values for Cannabis living soil / mineral balance:
  // Ca target: ~65% of CTC
  // Mg target: ~15% of CTC
  // K target: ~4.5% of CTC
  const targetCaSat = 65; // %
  const targetMgSat = 15; // %
  const targetKSat = 4.5; // %

  const targetCaCmol = (targetCaSat / 100) * ctcCmol;
  const targetMgCmol = (targetMgSat / 100) * ctcCmol;
  const targetKCmol = (targetKSat / 100) * ctcCmol;

  // Deficits in cmolc/dm³ (0 if current already exceeds target)
  const defCaCmol = Math.max(0, targetCaCmol - caCmol);
  const defMgCmol = Math.max(0, targetMgCmol - mgCmol);
  const defKCmol = Math.max(0, targetKCmol - kCmol);

  // Elementary conversion factor from cmolc/dm³ to grams per liter of soil:
  // Atomic mass / valence / 100:
  // Ca: 40.08 / 2 / 100 = 0.2004 g/dm³ por cmolc
  // Mg: 24.31 / 2 / 100 = 0.1215 g/dm³ por cmolc
  // K:  39.10 / 1 / 100 = 0.3910 g/dm³ por cmolc
  const gCaPerLiter = defCaCmol * 0.2004;
  const gMgPerLiter = defMgCmol * 0.1215;
  const gKPerLiter = defKCmol * 0.3910;

  const autoGramsCa = Number((gCaPerLiter * soilVolume).toFixed(2));
  const autoGramsMg = Number((gMgPerLiter * soilVolume).toFixed(2));
  const autoGramsK = Number((gKPerLiter * soilVolume).toFixed(2));

  // Active grams used in insumo calculation:
  const activeGramsCa = manualMode ? customGramsCa : autoGramsCa;
  const activeGramsMg = manualMode ? customGramsMg : autoGramsMg;
  const activeGramsK = manualMode ? customGramsK : autoGramsK;

  // Selected Insumos objects
  const selectedCaInsumo = CALCIUM_INSUMOS.find((i) => i.id === selectedCaInsumoId) || CALCIUM_INSUMOS[0];
  const selectedMgInsumo = MAGNESIUM_INSUMOS.find((i) => i.id === selectedMgInsumoId) || MAGNESIUM_INSUMOS[0];
  const selectedKInsumo = POTASSIUM_INSUMOS.find((i) => i.id === selectedKInsumoId) || POTASSIUM_INSUMOS[0];

  // Specific formulas requested by the user:
  // 1. Cálcio:
  // FC = 1.397 (Ca -> CaO)
  // Quantidade = (Gramas_Ca * 1.397) * 100 / %CaO
  const caFC = 1.397;
  const effectiveCaOPercent = customCaOPercent > 0 ? customCaOPercent : selectedCaInsumo.oxidePercentage;
  const insumoCaGrams = effectiveCaOPercent > 0 
    ? ((activeGramsCa * caFC) * 100) / effectiveCaOPercent 
    : 0;

  // 2. Magnésio:
  // FC = 1.6595 (Mg -> MgO)
  // Quantidade = (Gramas_Mg * 1.6595) * 100 / %MgO
  const mgFC = 1.6595;
  const effectiveMgOPercent = customMgOPercent > 0 ? customMgOPercent : selectedMgInsumo.oxidePercentage;
  const insumoMgGrams = effectiveMgOPercent > 0 
    ? ((activeGramsMg * mgFC) * 100) / effectiveMgOPercent 
    : 0;

  // 3. Potássio:
  // FC = 1.205 (K -> K2O)
  // Quantidade = (Gramas_K * 1.205) * 100 / %K2O
  const kFC = 1.205;
  const effectiveK2OPercent = customK2OPercent > 0 ? customK2OPercent : selectedKInsumo.oxidePercentage;
  const insumoKGrams = effectiveK2OPercent > 0 
    ? ((activeGramsK * kFC) * 100) / effectiveK2OPercent 
    : 0;

  // Diagnostic conditions
  const caMgVal = parseFloat(caRatio);
  const mgKVal = parseFloat(mgKRatio);

  // Is Magnesium critically low?
  // Criterion: Mg < 0.8 cmolc (ou < 8 mmolc) OU %Mg na CTC < 10% OU Ca:Mg > 5.5 OU Mg:K < 2.0
  const isMgCriticallyLow = mgCmol < 0.8 || mgSatPct < 10 || caMgVal > 5.5 || (mgKVal < 2.0 && kCmol > 0.2);

  // Status flags
  let statusCaMg = 'ideal';
  if (caMgVal < 3.0) statusCaMg = 'low_ca';
  else if (caMgVal > 5.5) statusCaMg = 'high_ca';

  let statusPh = 'ideal';
  if (data.ph < 5.8) statusPh = 'acidic';
  else if (data.ph > 7.0) statusPh = 'alkaline';

  // Preset soil volumes
  const volumePresets = [50, 100, 300, 500, 1000];

  // Copy complete recommendation summary
  const handleCopySummary = () => {
    const text = `ASTRAYA - Recomendação de Remineralização & Cátions
Volume de Solo / Substrato: ${soilVolume} Litros
Unidade Padrão: ${unit === 'cmolc' ? 'cmolc/dm³' : 'mmolc/dm³'}
Valores Informados:
• pH: ${data.ph} | M.O.: ${data.organicMatter}%
• Cálcio (Ca): ${data.calcium} ${caUnit}/dm³ (${caSatPct.toFixed(1)}% CTC)
• Magnésio (Mg): ${data.magnesium} ${mgUnit}/dm³ (${mgSatPct.toFixed(1)}% CTC)
• Potássio (K): ${data.potassium} ${kUnit}/dm³ (${kSatPct.toFixed(1)}% CTC)
• CTC: ${data.ctc} ${ctcUnit}/dm³ | V%: ${baseSatV}%

Relações:
• Ca:Mg: ${caRatio}:1 (Ideal Cannabis: 3:1 a 5:1)
• Ca:K: ${caKRatio}:1 (Ideal: 10:1 a 15:1)
• Mg:K: ${mgKRatio}:1 (Ideal: 3:1 a 4:1)

Recomendação de Nutrientes Puros:
• Cálcio puro: ${activeGramsCa.toFixed(1)} g Ca
• Magnésio puro: ${activeGramsMg.toFixed(1)} g Mg
• Potássio puro: ${activeGramsK.toFixed(1)} g K

Recomendação de Insumos Agrícolas:
1. Cálcio: ${selectedCaInsumo.name} (${effectiveCaOPercent}% CaO) = ${insumoCaGrams.toFixed(2)} g (${(insumoCaGrams / soilVolume).toFixed(2)} g/L)
   Fórmula: (${activeGramsCa.toFixed(1)} * 1.397) * 100 / ${effectiveCaOPercent}
2. Magnésio: ${selectedMgInsumo.name} (${effectiveMgOPercent}% MgO) = ${insumoMgGrams.toFixed(2)} g (${(insumoMgGrams / soilVolume).toFixed(2)} g/L)
   Fórmula: (${activeGramsMg.toFixed(1)} * 1.6595) * 100 / ${effectiveMgOPercent}
3. Potássio: ${selectedKInsumo.name} (${effectiveK2OPercent}% K₂O) = ${insumoKGrams.toFixed(2)} g (${(insumoKGrams / soilVolume).toFixed(2)} g/L)
   Fórmula: (${activeGramsK.toFixed(1)} * 1.205) * 100 / ${effectiveK2OPercent}
${isMgCriticallyLow ? '\n⚠️ ALERTA MAGNÉSIO MUITO BAIXO: Recomendado uso de Calcário Dolomítico ao invés de Calcítico para reequilibrar Ca e Mg juntos!' : ''}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-green-950 p-4 sm:p-5 rounded-2xl border border-emerald-800/80 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-800/80 rounded-xl text-emerald-300 shrink-0 shadow-inner">
              <TestTube className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-emerald-100">
                1.5 Calculadora e Interpretador de Laudos de Solo & Substrato
              </h2>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Avaliação do equilíbrio de Cátions (Ca:Mg:K), Saturação por Bases (V%) e conversão matemática direta para Insumos Agrícolas.
              </p>
            </div>
          </div>

          {/* Unit Switcher & Quick Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="bg-slate-950/90 border border-emerald-700/60 rounded-xl p-1 flex items-center shadow-sm">
              <span className="text-[11px] font-semibold text-emerald-300 px-2 flex items-center gap-1">
                <Beaker className="w-3.5 h-3.5 text-emerald-400" />
                Unidade:
              </span>
              <select
                id="select-cation-unit"
                aria-label="Unidade de medida dos cátions"
                value={unit}
                onChange={(e) => handleUnitChange(e.target.value as CationUnit)}
                className="bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 text-xs font-bold rounded-lg px-2.5 py-1.5 border border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
              >
                <option value="cmolc">cmolc / dm³ (Centimol)</option>
                <option value="mmolc">mmolc / dm³ (Milimol)</option>
              </select>
            </div>

            <button
              onClick={handleCopySummary}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              title="Copiar relatório completo"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copiedSummary ? 'Copiado!' : 'Copiar Laudo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Inputs + Relações */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Entrada de Dados do Laudo Laboratorial
            </h3>
            <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
              Unidade atual: <strong className="text-emerald-300">{unit}/dm³</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">pH em Água / CaCl₂</label>
              <input
                id="input-ph"
                type="number"
                step="0.1"
                value={data.ph}
                onChange={(e) => setData({ ...data, ph: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400">Faixa ideal: 6.0 a 6.8</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Matéria Orgânica (%)</label>
              <input
                id="input-mo"
                type="number"
                step="0.1"
                value={data.organicMatter}
                onChange={(e) => setData({ ...data, organicMatter: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400">Ideal Living Soil: &gt; 4.0%</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">Cálcio - Ca</label>
                <select
                  id="select-unit-ca"
                  aria-label="Unidade do Cálcio"
                  value={caUnit}
                  onChange={(e) => handleElementUnitChange('calcium', e.target.value as CationUnit)}
                  className="text-[10px] font-bold bg-slate-950 border border-emerald-700/80 text-emerald-300 rounded-md px-1.5 py-0.5 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm hover:bg-slate-900"
                >
                  <option value="cmolc">cmol/dm³</option>
                  <option value="mmolc">mmol/dm³</option>
                </select>
              </div>
              <input
                id="input-calcium"
                type="number"
                step="0.01"
                value={data.calcium}
                onChange={(e) => setData({ ...data, calcium: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400">Meta: ~65% da CTC</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">Magnésio - Mg</label>
                <select
                  id="select-unit-mg"
                  aria-label="Unidade do Magnésio"
                  value={mgUnit}
                  onChange={(e) => handleElementUnitChange('magnesium', e.target.value as CationUnit)}
                  className="text-[10px] font-bold bg-slate-950 border border-emerald-700/80 text-emerald-300 rounded-md px-1.5 py-0.5 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm hover:bg-slate-900"
                >
                  <option value="cmolc">cmol/dm³</option>
                  <option value="mmolc">mmol/dm³</option>
                </select>
              </div>
              <input
                id="input-magnesium"
                type="number"
                step="0.01"
                value={data.magnesium}
                onChange={(e) => setData({ ...data, magnesium: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400">Meta: ~15% da CTC</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">Potássio - K</label>
                <select
                  id="select-unit-k"
                  aria-label="Unidade do Potássio"
                  value={kUnit}
                  onChange={(e) => handleElementUnitChange('potassium', e.target.value as CationUnit)}
                  className="text-[10px] font-bold bg-slate-950 border border-emerald-700/80 text-emerald-300 rounded-md px-1.5 py-0.5 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm hover:bg-slate-900"
                >
                  <option value="cmolc">cmol/dm³</option>
                  <option value="mmolc">mmol/dm³</option>
                </select>
              </div>
              <input
                id="input-potassium"
                type="number"
                step="0.01"
                value={data.potassium}
                onChange={(e) => setData({ ...data, potassium: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400">Meta: ~3% a 5% da CTC</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">CTC pH 7.0</label>
                <select
                  id="select-unit-ctc"
                  aria-label="Unidade da CTC"
                  value={ctcUnit}
                  onChange={(e) => handleElementUnitChange('ctc', e.target.value as CationUnit)}
                  className="text-[10px] font-bold bg-slate-950 border border-emerald-700/80 text-emerald-300 rounded-md px-1.5 py-0.5 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm hover:bg-slate-900"
                >
                  <option value="cmolc">cmol/dm³</option>
                  <option value="mmolc">mmol/dm³</option>
                </select>
              </div>
              <input
                id="input-ctc"
                type="number"
                step="0.1"
                value={data.ctc}
                onChange={(e) => setData({ ...data, ctc: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400">Capacidade de Troca Catiônica</span>
            </div>
          </div>

          {/* Volume de Solo / Substrato Input */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Volume Total de Solo / Substrato (Litros):
              </label>
              <span className="text-xs font-bold text-emerald-400">{soilVolume} Litros</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="input-soil-volume"
                type="number"
                min="1"
                step="5"
                value={soilVolume}
                onChange={(e) => setSoilVolume(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-28 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
              />
              <div className="flex flex-wrap gap-1">
                {volumePresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setSoilVolume(preset)}
                    className={`text-[11px] font-semibold px-2 py-1 rounded-lg border transition-colors ${
                      soilVolume === preset
                        ? 'bg-emerald-800 text-emerald-100 border-emerald-600'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {preset === 1000 ? '1 m³ (1.000L)' : `${preset}L`}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              O volume define a quantidade exata de insumo a incorporar no vaso ou canteiro.
            </p>
          </div>
        </div>

        {/* Right Column: Relações Catiônicas & Diagnóstico (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                Relações Catiônicas & Saturação por Bases (V%)
              </h3>
              <span className="text-[10px] text-slate-400">
                Padrão Agronômico ASTRAYA para Cannabis
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Relação Ca : Mg</span>
                <span className={`text-xl font-black block mt-0.5 ${
                  caMgVal >= 3 && caMgVal <= 5 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {caRatio} : 1
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Alvo: 3:1 a 5:1</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Saturação Bases V%</span>
                <span className={`text-xl font-black block mt-0.5 ${
                  parseFloat(baseSatV) >= 65 && parseFloat(baseSatV) <= 75 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {baseSatV}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Alvo: 65% a 75%</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Relação Ca : K</span>
                <span className="text-lg font-bold text-slate-200 block mt-0.5">{caKRatio} : 1</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Alvo: 10:1 a 15:1</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Relação Mg : K</span>
                <span className="text-lg font-bold text-slate-200 block mt-0.5">{mgKRatio} : 1</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Alvo: 3:1 a 4:1</span>
              </div>
            </div>

            {/* Saturation Breakdown Visual Progress Bars */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="text-slate-300 font-semibold block text-[11px]">
                Distribuição dos Cátions na CTC do Solo:
              </span>
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-300">Cálcio (Ca): {caSatPct.toFixed(1)}%</span>
                    <span className="text-slate-400">Meta: 65%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (caSatPct / 65) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-300">Magnésio (Mg): {mgSatPct.toFixed(1)}%</span>
                    <span className="text-slate-400">Meta: 15%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        mgSatPct < 10 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (mgSatPct / 15) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-300">Potássio (K): {kSatPct.toFixed(1)}%</span>
                    <span className="text-slate-400">Meta: 4.5%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div 
                      className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (kSatPct / 4.5) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agroecological Diagnostic Box */}
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl space-y-1.5 text-xs">
            <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              Diagnóstico Agroecológico da Amostra:
            </h4>

            {statusPh === 'acidic' && (
              <p className="text-slate-200">
                • <strong>pH Ácido ({data.ph}):</strong> Recomenda-se calagem prévia com calcário para elevar o pH para 6.2 - 6.5 e melhorar a disponibilidade de micronutrientes e Ca/Mg.
              </p>
            )}

            {statusCaMg === 'low_ca' && (
              <p className="text-slate-200">
                • <strong>Relação Ca:Mg Baixa ({caRatio}:1):</strong> O Cálcio está abaixo da proporção ideal frente ao Magnésio. Aplicar <strong>Wollastonita</strong> ou <strong>Gesso Agrícola</strong> para elevar o Cálcio sem agravar o Mg.
              </p>
            )}

            {statusCaMg === 'high_ca' && (
              <p className="text-slate-200">
                • <strong>Relação Ca:Mg Elevada ({caRatio}:1):</strong> Excesso de Cálcio em relação ao Magnésio. Pode induzir deficiência induzida de Mg nas folhas mais velhas. Priorizar reposição de Magnésio com Carbonato ou Sulfato de Mg.
              </p>
            )}

            {statusCaMg === 'ideal' && statusPh === 'ideal' && (
              <p className="text-slate-200">
                • <strong>Solo com excelente equilíbrio catiônico!</strong> Manter a ciclagem biológica com bioinsumos, cobertura vegetal e inoculação micorrízica.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SPECIAL ALERT CARD: Calcário Calcítico vs Dolomítico (Triggered when Magnesium is very low) */}
      {isMgCriticallyLow && (
        <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-2 border-amber-500/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-md animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl shrink-0 mt-0.5 border border-amber-500/40">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="font-bold text-sm sm:text-base text-amber-200 flex items-center gap-1.5">
                  Atenção Agronômica: Magnésio Crítico no Laudo ({mgSatPct.toFixed(1)}% CTC / {mgCmol.toFixed(2)} {unit}/dm³)
                </h3>
                <span className="text-[11px] font-semibold text-amber-300 bg-amber-900/60 border border-amber-600/60 px-2.5 py-0.5 rounded-full w-fit">
                  Indicação de Calcário Dolomítico
                </span>
              </div>
              <p className="text-xs text-amber-100/90 leading-relaxed">
                Quando o Magnésio está muito baixo e há necessidade de calagem ou elevação de bases, a escolha do corretivo é determinante:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-slate-950/80 border border-emerald-600/70 p-3 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    RECOMENDADO: Calcário Dolomítico
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Contém alto teor de Magnésio (<strong>~18% a 22% de MgO</strong>) combinado com Cálcio (~30% CaO). 
                    Restaura a relação Ca:Mg simultaneamente, corrige a acidez e previne clorose foliar severa por falta de Mg.
                  </p>
                  <span className="inline-block text-[10px] bg-emerald-950 text-emerald-200 border border-emerald-700/60 px-2 py-0.5 rounded">
                    Ideal para solos deficientes em Mg
                  </span>
                </div>

                <div className="bg-slate-950/80 border border-rose-600/70 p-3 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-300 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    EVITAR AGORA: Calcário Calcítico
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    O Calcário Calcítico possui quase zero magnésio (&lt; 5% MgO) e até 54% CaO. Se aplicado nesta amostra, 
                    o excesso unilateral de Cálcio causaria <em>antagonismo de absorção radicular</em>, agravando ainda mais a deficiência de Magnésio.
                  </p>
                  <span className="inline-block text-[10px] bg-rose-950 text-rose-200 border border-rose-700/60 px-2 py-0.5 rounded">
                    Usar Calcítico apenas quando Mg já estiver alto
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO DE RECOMENDAÇÃO AUTOMÁTICA EM GRAMAS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Recomendação Automática de Nutrientes Puros (Relação Ca : Mg : K)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Necessidade calculada para atingir o equilíbrio de bases da Cannabis (65% Ca, 15% Mg, 4.5% K) no volume de <strong>{soilVolume} Litros</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setManualMode(!manualMode);
                if (!manualMode) {
                  setCustomGramsCa(autoGramsCa);
                  setCustomGramsMg(autoGramsMg);
                  setCustomGramsK(autoGramsK);
                }
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                manualMode
                  ? 'bg-amber-600/30 text-amber-200 border-amber-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {manualMode ? '✏️ Modo Manual Ativo' : 'Ajustar Gramas Manualmente'}
            </button>
            {manualMode && (
              <button
                onClick={() => {
                  setCustomGramsCa(autoGramsCa);
                  setCustomGramsMg(autoGramsMg);
                  setCustomGramsK(autoGramsK);
                }}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-emerald-900/60 text-emerald-200 border border-emerald-700 hover:bg-emerald-800"
                title="Sincronizar de volta com o cálculo automático"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Display of pure element recommendation cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Pure Calcium */}
          <div className="bg-slate-950 border border-blue-900/50 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-300">Cálcio Puro (Ca)</span>
              <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                Alvo 65% CTC
              </span>
            </div>

            {manualMode ? (
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 block">Gramas de Ca a aplicar:</label>
                <input
                  type="number"
                  step="1"
                  value={customGramsCa}
                  onChange={(e) => setCustomGramsCa(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-blue-700 rounded-lg px-2.5 py-1 text-base font-bold text-blue-200 focus:outline-none focus:border-blue-400"
                />
              </div>
            ) : (
              <div>
                <div className="text-2xl font-black text-blue-300">
                  {autoGramsCa.toFixed(1)} <span className="text-sm font-normal text-slate-400">gramas</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  ({(autoGramsCa / soilVolume).toFixed(2)} g/L de solo) • Déficit: {defCaCmol.toFixed(2)} cmolc/dm³
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Pure Magnesium */}
          <div className="bg-slate-950 border border-emerald-900/50 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-300">Magnésio Puro (Mg)</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                Alvo 15% CTC
              </span>
            </div>

            {manualMode ? (
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 block">Gramas de Mg a aplicar:</label>
                <input
                  type="number"
                  step="1"
                  value={customGramsMg}
                  onChange={(e) => setCustomGramsMg(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-emerald-700 rounded-lg px-2.5 py-1 text-base font-bold text-emerald-200 focus:outline-none focus:border-emerald-400"
                />
              </div>
            ) : (
              <div>
                <div className="text-2xl font-black text-emerald-300">
                  {autoGramsMg.toFixed(1)} <span className="text-sm font-normal text-slate-400">gramas</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  ({(autoGramsMg / soilVolume).toFixed(2)} g/L de solo) • Déficit: {defMgCmol.toFixed(2)} cmolc/dm³
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Pure Potassium */}
          <div className="bg-slate-950 border border-amber-900/50 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-300">Potássio Puro (K)</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                Alvo 4.5% CTC
              </span>
            </div>

            {manualMode ? (
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 block">Gramas de K a aplicar:</label>
                <input
                  type="number"
                  step="1"
                  value={customGramsK}
                  onChange={(e) => setCustomGramsK(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-amber-700 rounded-lg px-2.5 py-1 text-base font-bold text-amber-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            ) : (
              <div>
                <div className="text-2xl font-black text-amber-300">
                  {autoGramsK.toFixed(1)} <span className="text-sm font-normal text-slate-400">gramas</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  ({(autoGramsK / soilVolume).toFixed(2)} g/L de solo) • Déficit: {defKCmol.toFixed(2)} cmolc/dm³
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 JANELAS DISTINTAS DE CONVERSÃO EM INSUMO AGRÍCOLA */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Conversão da Recomendação em Insumos Agrícolas (3 Janelas Especializadas)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Fórmula estequiométrica: <strong>Quantidade de Insumo = (Gramas do Elemento × Fator de Conversão) × 100 ÷ % de Óxido do Insumo</strong>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ============================================================== */}
          {/* JANELA 1: CÁLCIO (Ca) */}
          {/* ============================================================== */}
          <div className="bg-slate-900 border-2 border-blue-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-md space-y-4 relative">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-900/60 border border-blue-700 flex items-center justify-center font-bold text-blue-300 text-xs">
                    Ca
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-blue-100">Janela 1: Insumo de Cálcio</h4>
                    <span className="text-[11px] text-blue-400/90 font-medium">
                      Fator de Conversão Ca → CaO = <strong>1,397</strong>
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-300 bg-blue-950 px-2 py-1 rounded-md border border-blue-800">
                  {activeGramsCa.toFixed(1)} g Ca
                </span>
              </div>

              {/* Insumo Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="block text-slate-300 font-semibold">Escolha o Insumo de Cálcio:</label>
                <select
                  id="select-calcium-insumo"
                  aria-label="Insumo de Cálcio"
                  value={selectedCaInsumoId}
                  onChange={(e) => {
                    const found = CALCIUM_INSUMOS.find((i) => i.id === e.target.value);
                    setSelectedCaInsumoId(e.target.value);
                    if (found) setCustomCaOPercent(found.oxidePercentage);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {CALCIUM_INSUMOS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.oxidePercentage}% CaO)
                    </option>
                  ))}
                </select>
              </div>

              {/* Editable oxide percentage */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Teor de CaO (%) no laudo:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      value={customCaOPercent}
                      onChange={(e) => setCustomCaOPercent(Math.max(1, parseFloat(e.target.value) || 1))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400 font-bold">%</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Necessidade de CaO puro:</label>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-blue-300 font-bold">
                    {(activeGramsCa * caFC).toFixed(2)} g CaO
                  </div>
                </div>
              </div>

              {/* Description & Agronomic tip */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] space-y-1 text-slate-300">
                <p className="leading-relaxed">{selectedCaInsumo.description}</p>
                <p className="text-blue-400/90 font-medium">💡 {selectedCaInsumo.dosageTip}</p>
              </div>

              {/* Calculation Formula Display */}
              <div className="p-3 bg-blue-950/40 border border-blue-900/60 rounded-xl text-[11px] space-y-1 font-mono text-blue-200">
                <div className="text-[10px] text-blue-400 uppercase tracking-wider font-sans font-bold">
                  Memória de Cálculo:
                </div>
                <div>
                  ({activeGramsCa.toFixed(1)} g Ca × 1,397) × 100 ÷ {effectiveCaOPercent}% =
                </div>
                <div className="font-bold text-blue-300">
                  ({(activeGramsCa * caFC).toFixed(2)} g CaO) ÷ {(effectiveCaOPercent / 100).toFixed(2)} = <strong>{insumoCaGrams.toFixed(2)} g</strong>
                </div>
              </div>
            </div>

            {/* Bottom Result Box */}
            <div className="p-4 bg-gradient-to-br from-blue-950 via-slate-950 to-blue-950/90 border border-blue-700/80 rounded-xl space-y-1 shadow-inner">
              <span className="text-[10px] text-blue-300 uppercase font-bold tracking-wider block">
                Dosagem Total Recomendada:
              </span>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black text-blue-100">
                  {insumoCaGrams.toFixed(2)} <span className="text-sm font-medium text-blue-300">gramas</span>
                </div>
                <div className="text-xs font-bold text-blue-300 bg-blue-900/70 px-2 py-0.5 rounded">
                  {(insumoCaGrams / soilVolume).toFixed(2)} g / Litro
                </div>
              </div>
              <p className="text-[11px] text-blue-200/80">
                de <strong>{selectedCaInsumo.name.split('(')[0]}</strong> para os {soilVolume} Litros.
              </p>
            </div>
          </div>

          {/* ============================================================== */}
          {/* JANELA 2: MAGNÉSIO (Mg) */}
          {/* ============================================================== */}
          <div className="bg-slate-900 border-2 border-emerald-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-md space-y-4 relative">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-900/60 border border-emerald-700 flex items-center justify-center font-bold text-emerald-300 text-xs">
                    Mg
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-100">Janela 2: Insumo de Magnésio</h4>
                    <span className="text-[11px] text-emerald-400/90 font-medium">
                      Fator de Conversão Mg → MgO = <strong>1,6595</strong>
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-2 py-1 rounded-md border border-emerald-800">
                  {activeGramsMg.toFixed(1)} g Mg
                </span>
              </div>

              {/* Insumo Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="block text-slate-300 font-semibold">Escolha o Insumo de Magnésio:</label>
                <select
                  id="select-magnesium-insumo"
                  aria-label="Insumo de Magnésio"
                  value={selectedMgInsumoId}
                  onChange={(e) => {
                    const found = MAGNESIUM_INSUMOS.find((i) => i.id === e.target.value);
                    setSelectedMgInsumoId(e.target.value);
                    if (found) setCustomMgOPercent(found.oxidePercentage);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {MAGNESIUM_INSUMOS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.oxidePercentage}% MgO)
                    </option>
                  ))}
                </select>
              </div>

              {/* Editable oxide percentage */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Teor de MgO (%) no laudo:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      value={customMgOPercent}
                      onChange={(e) => setCustomMgOPercent(Math.max(1, parseFloat(e.target.value) || 1))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-slate-400 font-bold">%</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Necessidade de MgO puro:</label>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-emerald-300 font-bold">
                    {(activeGramsMg * mgFC).toFixed(2)} g MgO
                  </div>
                </div>
              </div>

              {/* Description & Agronomic tip */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] space-y-1 text-slate-300">
                <p className="leading-relaxed">{selectedMgInsumo.description}</p>
                <p className="text-emerald-400/90 font-medium">💡 {selectedMgInsumo.dosageTip}</p>
              </div>

              {/* Calculation Formula Display */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-[11px] space-y-1 font-mono text-emerald-200">
                <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-sans font-bold">
                  Memória de Cálculo:
                </div>
                <div>
                  ({activeGramsMg.toFixed(1)} g Mg × 1,6595) × 100 ÷ {effectiveMgOPercent}% =
                </div>
                <div className="font-bold text-emerald-300">
                  ({(activeGramsMg * mgFC).toFixed(2)} g MgO) ÷ {(effectiveMgOPercent / 100).toFixed(2)} = <strong>{insumoMgGrams.toFixed(2)} g</strong>
                </div>
              </div>
            </div>

            {/* Bottom Result Box */}
            <div className="p-4 bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-950/90 border border-emerald-700/80 rounded-xl space-y-1 shadow-inner">
              <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">
                Dosagem Total Recomendada:
              </span>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black text-emerald-100">
                  {insumoMgGrams.toFixed(2)} <span className="text-sm font-medium text-emerald-300">gramas</span>
                </div>
                <div className="text-xs font-bold text-emerald-300 bg-emerald-900/70 px-2 py-0.5 rounded">
                  {(insumoMgGrams / soilVolume).toFixed(2)} g / Litro
                </div>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                de <strong>{selectedMgInsumo.name.split('(')[0]}</strong> para os {soilVolume} Litros.
              </p>
            </div>
          </div>

          {/* ============================================================== */}
          {/* JANELA 3: POTÁSSIO (K) */}
          {/* ============================================================== */}
          <div className="bg-slate-900 border-2 border-amber-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-md space-y-4 relative">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-900/60 border border-amber-700 flex items-center justify-center font-bold text-amber-300 text-xs">
                    K
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-amber-100">Janela 3: Insumo de Potássio</h4>
                    <span className="text-[11px] text-amber-400/90 font-medium">
                      Fator de Conversão K → K₂O = <strong>1,205</strong>
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-300 bg-amber-950 px-2 py-1 rounded-md border border-amber-800">
                  {activeGramsK.toFixed(1)} g K
                </span>
              </div>

              {/* Insumo Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="block text-slate-300 font-semibold">Escolha o Insumo de Potássio:</label>
                <select
                  id="select-potassium-insumo"
                  aria-label="Insumo de Potássio"
                  value={selectedKInsumoId}
                  onChange={(e) => {
                    const found = POTASSIUM_INSUMOS.find((i) => i.id === e.target.value);
                    setSelectedKInsumoId(e.target.value);
                    if (found) setCustomK2OPercent(found.oxidePercentage);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {POTASSIUM_INSUMOS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.oxidePercentage}% K₂O)
                    </option>
                  ))}
                </select>
              </div>

              {/* Editable oxide percentage */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Teor de K₂O (%) no laudo:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      value={customK2OPercent}
                      onChange={(e) => setCustomK2OPercent(Math.max(1, parseFloat(e.target.value) || 1))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-slate-400 font-bold">%</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Necessidade de K₂O puro:</label>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold">
                    {(activeGramsK * kFC).toFixed(2)} g K₂O
                  </div>
                </div>
              </div>

              {/* Description & Agronomic tip */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] space-y-1 text-slate-300">
                <p className="leading-relaxed">{selectedKInsumo.description}</p>
                <p className="text-amber-400/90 font-medium">💡 {selectedKInsumo.dosageTip}</p>
              </div>

              {/* Calculation Formula Display */}
              <div className="p-3 bg-amber-950/40 border border-amber-900/60 rounded-xl text-[11px] space-y-1 font-mono text-amber-200">
                <div className="text-[10px] text-amber-400 uppercase tracking-wider font-sans font-bold">
                  Memória de Cálculo:
                </div>
                <div>
                  ({activeGramsK.toFixed(1)} g K × 1,205) × 100 ÷ {effectiveK2OPercent}% =
                </div>
                <div className="font-bold text-amber-300">
                  ({(activeGramsK * kFC).toFixed(2)} g K₂O) ÷ {(effectiveK2OPercent / 100).toFixed(2)} = <strong>{insumoKGrams.toFixed(2)} g</strong>
                </div>
              </div>
            </div>

            {/* Bottom Result Box */}
            <div className="p-4 bg-gradient-to-br from-amber-950 via-slate-950 to-amber-950/90 border border-amber-700/80 rounded-xl space-y-1 shadow-inner">
              <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider block">
                Dosagem Total Recomendada:
              </span>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black text-amber-100">
                  {insumoKGrams.toFixed(2)} <span className="text-sm font-medium text-amber-300">gramas</span>
                </div>
                <div className="text-xs font-bold text-amber-300 bg-amber-900/70 px-2 py-0.5 rounded">
                  {(insumoKGrams / soilVolume).toFixed(2)} g / Litro
                </div>
              </div>
              <p className="text-[11px] text-amber-200/80">
                de <strong>{selectedKInsumo.name.split('(')[0]}</strong> para os {soilVolume} Litros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

