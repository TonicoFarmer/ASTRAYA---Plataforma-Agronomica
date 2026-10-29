import { MotherGenetics, IndoorCropBatch, OutdoorCropPlot, CycleFolder } from '../types';

export const INITIAL_CYCLE_FOLDERS: CycleFolder[] = [
  {
    id: 'ciclo-2026-q1',
    name: '1º Ciclo 2026 (Jan – Abr)',
    periodLabel: 'Ciclo de 4 Meses • 1º Quadrimestre',
    startDate: '2026-01-01',
    endDate: '2026-04-30',
    notes: 'Pasta organizadora referente ao 1º ciclo quadrimestral (Janeiro a Abril de 2026).',
    createdAt: '2026-01-01',
  },
  {
    id: 'ciclo-2026-q2',
    name: '2º Ciclo 2026 (Mai – Ago)',
    periodLabel: 'Ciclo de 4 Meses • 2º Quadrimestre',
    startDate: '2026-05-01',
    endDate: '2026-08-31',
    notes: 'Pasta organizadora referente ao 2º ciclo quadrimestral (Maio a Agosto de 2026).',
    createdAt: '2026-05-01',
  },
  {
    id: 'ciclo-2026-q3',
    name: '3º Ciclo 2026 (Set – Dez)',
    periodLabel: 'Ciclo de 4 Meses • 3º Quadrimestre',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    notes: 'Pasta organizadora referente ao 3º ciclo quadrimestral (Setembro a Dezembro de 2026).',
    createdAt: '2026-09-01',
  },
];

export const INITIAL_MADRES_GENETICS: MotherGenetics[] = [
  {
    id: 'madre-1',
    genetica: 'Amnesia Haze #3',
    banco: 'Royal Queen Seeds',
    porcentagemThcCbd: 'THC: 22% / CBD: <0.5%',
    diaInicio: '2026-02-01',
    ultimoDia: '2026-09-30', // ~8 meses de manutenção em casa de vegetação
    dificuldadeCultivo: 'Média',
    ataquePragas: 'Resistência média; monitorar preventivamente contra Óidio em períodos chuvosos.',
    clonesPorTemporada: 140,
    saudeClones: 'Excelente',
    enraizamento: '95% em 8-10 dias (alta taxa com gel KNF/IBA)',
    casaVegetacao: 'Casa de Vegetação #1 - Módulo A',
    observacoes: 'Excelente vigor vegetativo. Aceita bem podas FIM e LST para otimizar gemas laterais.',
    status: 'Ativa',
    imageUrl: '/images/cultivo/mother_plant.jpg',
    images: [
      '/images/cultivo/mother_plant.jpg',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'madre-2',
    genetica: 'Gorilla Glue #4 (GG4)',
    banco: 'GG Strains / Cut Elite',
    porcentagemThcCbd: 'THC: 26% / CBD: 0.1%',
    diaInicio: '2026-01-15',
    ultimoDia: '2026-08-15', // ~7 meses
    dificuldadeCultivo: 'Fácil',
    ataquePragas: 'Baixa vulnerabilidade a ácaros; boa tolerância a oscilações térmicas.',
    clonesPorTemporada: 180,
    saudeClones: 'Excelente',
    enraizamento: '98% em 6-8 dias (desenvolvimento radicular acelerado)',
    casaVegetacao: 'Casa de Vegetação #1 - Módulo B',
    observacoes: 'Matriz principal de alto rendimento de clones. Ramos grossos e tolerantes a podas severas.',
    status: 'Ativa',
    imageUrl: '/images/cultivo/mother_plant.jpg',
    images: [
      '/images/cultivo/mother_plant.jpg',
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'madre-3',
    genetica: "Charlotte's Web (Rica em CBD)",
    banco: 'CW Botanicals',
    porcentagemThcCbd: 'THC: <0.3% / CBD: 18%',
    diaInicio: '2026-03-10',
    ultimoDia: '2026-10-10', // ~7 meses
    dificuldadeCultivo: 'Fácil',
    ataquePragas: 'Excelente resistência a trips e moscas brancas; sensível a encharcamento de solo.',
    clonesPorTemporada: 120,
    saudeClones: 'Boa',
    enraizamento: '92% em 10-12 dias',
    casaVegetacao: 'Casa de Vegetação #2 - Seção Medicinal',
    observacoes: 'Cepa medicinal fitoterápica com foco em extração de óleo de CBD de espectro completo.',
    status: 'Ativa',
    imageUrl: '/images/cultivo/mother_plant.jpg',
    images: [
      '/images/cultivo/mother_plant.jpg',
      'https://images.unsplash.com/photo-1599598425947-320f3299c853?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'madre-4',
    genetica: 'OG Kush Pheno #7',
    banco: 'Humboldt Seed Organization',
    porcentagemThcCbd: 'THC: 24% / CBD: 0.2%',
    diaInicio: '2026-02-20',
    ultimoDia: '2026-08-20', // 6 meses
    dificuldadeCultivo: 'Difícil',
    ataquePragas: 'Requer atenção frequente com Beauveria bassiana por atração moderada a ácaro do teto.',
    clonesPorTemporada: 95,
    saudeClones: 'Regular',
    enraizamento: '88% em 12-14 dias (exige aquecimento de sub-base a 24°C no enraizamento)',
    casaVegetacao: 'Casa de Vegetação #1 - Módulo C',
    observacoes: 'Exige suplementação contínua de Cálcio e Magnésio via foliar na estufa de madres.',
    status: 'Ativa',
    imageUrl: '/images/cultivo/mother_plant.jpg',
    images: [
      '/images/cultivo/mother_plant.jpg',
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80'
    ]
  }
];

export const INITIAL_INDOOR_BATCHES: IndoorCropBatch[] = [
  {
    id: 'ind-1',
    nomeSala: 'Sala Vega 01 - Lote A',
    genetica: 'Amnesia Haze #3 / GG4',
    quantidadePlantas: 48,
    estagio: 'Vegetativo',
    iluminacao: 'Quantum Board LED Samsung LM301H 600W (18/6 - PPFD 450 µmol/m²/s)',
    tempUmidade: '24.5°C / 62% UR (VPD: 1.15 kPa)',
    dataInicio: '2026-07-01',
    previsaoColheita: '2026-10-15',
    observacoes: 'Fertirrigação com biocompostagem aquosa + extrato de algas a cada 3 dias.'
  },
  {
    id: 'ind-2',
    nomeSala: 'Sala Flora 02 - Tenda LED',
    genetica: "Charlotte's Web",
    quantidadePlantas: 32,
    estagio: 'Floração',
    iluminacao: 'Barra LED 800W Full Spectrum (12/12 - PPFD 850 µmol/m²/s)',
    tempUmidade: '22.0°C / 48% UR (VPD: 1.40 kPa)',
    dataInicio: '2026-06-10',
    previsaoColheita: '2026-08-25',
    observacoes: 'Semana 7 de floração. Aplicação de chás aerados de Húmus com guano para engorda de flores.'
  }
];

export const INITIAL_OUTDOOR_PLOTS: OutdoorCropPlot[] = [
  {
    id: 'out-1',
    nomeCanteiro: 'Talhão Organico Sol Pleno #1',
    genetica: 'Amnesia Haze / Charlotte\'s Web',
    quantidadePlantas: 120,
    faseFotoperiodo: 'Crescimento Vegetativo (Dias Longos)',
    tipoSubstrato: 'Living Soil Orgânico com Torta de Mamona, Farinha de Ossos e Cobertura de Palhada KNF',
    protecaoClimatica: 'Estufa com Sombrite 30% + Malha Anti-granizo + Pulverização MIP preventiva JWA/JHS',
    dataPlantio: '2026-05-15',
    previsaoColheita: '2026-11-20',
    observacoes: 'Aproveitamento do fotoperíodo solar de primavera/verão com rega automatizada por gotejamento.',
    imageUrl: '/images/cultivo/outdoor_crop.jpg',
    images: [
      '/images/cultivo/outdoor_crop.jpg',
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80'
    ]
  }
];
