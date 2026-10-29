export type MainCategory = 'agricultura' | 'calendario' | 'meteorologia' | 'ferramentas';

export type AgricultureSubMenu = 
  | 'deficiencias' 
  | 'pragas' 
  | 'knf_jadam' 
  | 'bioinsumos' 
  | 'analise_solo'
  | 'cultivo';

export type CultivoSubSection = 'madres' | 'cultivo_externo' | 'pasta_ciclos';

export interface CycleFolder {
  id: string;
  name: string;           // Ex: "3º Ciclo 2026 (Set – Dez)"
  periodLabel?: string;   // Ex: "Ciclo de 4 Meses"
  startDate: string;      // YYYY-MM-DD
  endDate: string;        // YYYY-MM-DD (+4 meses)
  notes?: string;         // Observações ou resumo do ciclo quadrimestral
  createdAt: string;
}

export interface MotherGenetics {
  id: string;
  genetica: string;           // Genética (Nome da cepa/genótipo)
  banco: string;              // Banco de sementes / Breeder
  porcentagemThcCbd: string;  // Porcentagem de CBD/THC (ex: "THC 22% / CBD <0.5%")
  diaInicio: string;          // Dia de inicio na casa de vegetação (YYYY-MM-DD)
  ultimoDia: string;          // Ultimo dia / Previsão término ciclo 6-8 meses (YYYY-MM-DD)
  dificuldadeCultivo: 'Fácil' | 'Média' | 'Difícil' | 'Especialista'; // Dificuldade em cultivar
  ataquePragas: string;       // Ataque de pragas (histórico/suscetibilidade/nível)
  clonesPorTemporada: number; // Quantos clones gerados por temporada
  saudeClones: 'Excelente' | 'Boa' | 'Regular' | 'Atenção'; // Saúde dos clones
  enraizamento: string;       // Taxa e tempo de enraizamento (ex: "95% em 8-10 dias")
  casaVegetacao?: string;     // Identificação da Estufa/Casa de Vegetação
  observacoes?: string;       // Notas gerais do administrador/agrônomo
  status?: 'Ativa' | 'Em Transição' | 'Arquivada';
  archived?: boolean;         // Indica se está arquivada na Pasta Organizadora de Ciclos
  cycleFolderId?: string;     // ID da pasta de ciclo onde foi arquivada
  cycleLabel?: string;        // Nome legível do ciclo quadrimestral
  archivedAt?: string;        // Data do arquivamento (YYYY-MM-DD)
  archiveNotes?: string;      // Notas de fechamento do ciclo para consulta futura
  imageUrl?: string;
  images?: string[];
}

export interface IndoorCropBatch {
  id: string;
  nomeSala: string; // Ex: "Sala Vega 1", "Flora LED A"
  genetica: string;
  quantidadePlantas: number;
  estagio: 'Mudas / Clones' | 'Vegetativo' | 'Floração' | 'Secagem / Cura';
  iluminacao: string; // Ex: "LED Samsung LM301H 600W (18/6)"
  tempUmidade: string; // Ex: "24°C / 60% UR (VPD 1.1 kPa)"
  dataInicio: string;
  previsaoColheita: string;
  observacoes: string;
  imageUrl?: string;
  images?: string[];
}

export interface OutdoorCropPlot {
  id: string;
  nomeCanteiro: string; // Ex: "Talhão Sol Pleno 1"
  genetica: string;
  quantidadePlantas: number;
  faseFotoperiodo: 'Crescimento Vegetativo (Dias Longos)' | 'Indução Floração Natural' | 'Maturação' | string;
  tipoSubstrato: string; // Ex: "Living Soil Orgânico + Cobertura KNF"
  protecaoClimatica: string; // Ex: "Sombrite 30% + Malha Anti-granizo"
  dataPlantio: string;
  previsaoColheita: string;
  observacoes: string;
  archived?: boolean;         // Indica se está arquivado na Pasta Organizadora de Ciclos
  cycleFolderId?: string;     // ID da pasta de ciclo onde foi arquivado
  cycleLabel?: string;        // Nome legível do ciclo quadrimestral
  archivedAt?: string;        // Data do arquivamento (YYYY-MM-DD)
  archiveNotes?: string;      // Notas de fechamento do ciclo para consulta futura
  imageUrl?: string;
  images?: string[];
}

export type CalendarSubMenu = 'manutencao' | 'mip_log';

export type WeatherSubMenu = 'estacao_inmet' | 'ia_assistente';

export type ToolsSubMenu = 'substrato' | 'biblioteca_drive';

export interface NutritionalDeficiency {
  id: string;
  element: string; // e.g. "Nitrogênio (N)"
  symbol: string;  // e.g. "N"
  type: 'Macro' | 'Secundário' | 'Micro';
  mobility: 'Móvel' | 'Imóvel' | 'Parcialmente Móvel';
  targetLeaves: 'Folhas Velhas (Inferiores)' | 'Folhas Novas (Superiores)' | 'Toda a Planta';
  symptoms: string[];
  causes: string[];
  correctiveOrganic: string[];
  correctiveMineral?: string[];
  solubilizingMicroorganisms?: string[]; // Solubilizing microbes (e.g. Bacillus megaterium, Pseudomonas)
  companionPlants?: string[]; // Recycler companion plants (e.g. Trifolium, Symphytum, Lupinus)
  astrayaTips: string;
  imageUrl: string;
  images?: string[]; // Multiple illustrative photos for slideshow
  figures?: {
    figureNumber: string;
    title: string;
    description: string;
    imageUrl?: string;
  }[];
  pdfDriveUrl?: string;
}

export interface PestPois {
  id: string;
  name: string;
  scientificName: string;
  category: 'Ácaro' | 'Inseto Sugador' | 'Lagarta/Broca' | 'Fungo/Bactéria' | 'Praga do Solo' | 'Nematoide';
  identification: string;
  damageSymptoms: string[];
  prevention: string[];
  biologicalControl: string[]; // Predators / Microbial (Beauveria, Trichoderma, etc.)
  organicRecipes: string[]; // JWA, JHS, Neem, Potassium Soap
  chemicalOrMineral: string[];
  severity: 'Alta' | 'Média' | 'Baixa';
  imageUrl: string;
  images?: string[];
  pdfDriveUrl?: string;
}

export interface KnfJadamRecipe {
  id: string;
  method: 'KNF' | 'JADAM' | 'KYUSEI EM';
  name: string;
  description: string;
  ingredients: { name: string; ratio: string }[];
  steps: string[];
  applicationDosage: string; // e.g., "1:1000 em foliar"
  benefits: string[];
}

export interface BioInput {
  id: string;
  productName: string;
  activeAgent: string; // e.g., "Trichoderma harzianum", "Bacillus thuringiensis"
  category: 'Biofungicida' | 'Bioinseticida' | 'Inoculante' | 'Bioestimulante' | 'Bionematicida';
  dosage: string;
  targetPestOrDisease: string;
  astrayaNotes: string;
}

export interface SoilAnalysisData {
  ph: number;
  organicMatter: number; // %
  nitrogen: number; // ppm or mg/dm³
  phosphorus: number; // mg/dm³
  potassium: number; // mmolc/dm³
  calcium: number; // mmolc/dm³
  magnesium: number; // mmolc/dm³
  ctc: number; // mmolc/dm³
}

export interface CalendarEvent {
  id: string;
  date: string;
  type: 'Rega' | 'Adubação' | 'Poda' | 'MIP_Aplicacao' | 'Muda_Estagio' | 'Manutencao';
  title: string;
  notes: string;
  completed: boolean;
  dosageOrVolume?: string;
}

export interface MipLogEntry {
  id: string;
  date: string;
  zone: string; // e.g., "Estufa A", "Canteiro 2", "Vegetativo 1"
  pestObserved: string;
  severityLevel: 1 | 2 | 3 | 4 | 5; // 1 = minimal, 5 = infestation
  actionTaken: string;
  responsible: string;
}

export interface DriveDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  updatedAt: string;
}
