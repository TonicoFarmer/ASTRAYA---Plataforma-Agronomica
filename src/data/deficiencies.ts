import { NutritionalDeficiency } from '../types';

export const DRIVE_DEFICIENCIES_PDF = "https://drive.google.com/file/d/11K2aByla0I_QXxh6COHBxyFLKKsgGqEC/view?usp=drive_link";

export const INITIAL_DEFICIENCIES: NutritionalDeficiency[] = [
  {
    id: 'def-n',
    element: 'Nitrogênio',
    symbol: 'N',
    type: 'Macro',
    mobility: 'Móvel',
    targetLeaves: 'Folhas Velhas (Inferiores)',
    symptoms: [
      'Amarelamento uniforme (clorose) começando pelas folhas mais velhas da base da planta.',
      'Sintoma progride para cima conforme o N é translocado para os brotos novos.',
      'Folhas afetadas amarelam completamente, secam e caem prematuramente.',
      'Crescimento lento, hastes finas e redução drástica do vigor geral.'
    ],
    causes: [
      'pH do substrato/solução abaixo de 5.5 ou acima de 7.0 (bloqueio de absorção).',
      'Substrato inerte com baixa fertilização ou lixiviação excessiva por regas volumosas.',
      'Atividade microbiológica reduzida em solos frios ou encharcados.'
    ],
    correctiveOrganic: [
      'Aplicação de FAA (Fish Amino Acid KNF) 1:1000 em fertirrigação.',
      'Torta de Mamona / Farinha de Sangue no solo (liberação gradual).',
      'Biofertilizante líquido de esterco curtido ou húmus de minhoca.'
    ],
    correctiveMineral: [
      'Nitrato de Amônio / Nitrato de Cálcio (150-200 PPM N em fertirrigação).',
      'Ureia agrícola de baixa biurete via foliar (1g a 2g por Litro).'
    ],
    solubilizingMicroorganisms: [
      'Azospirillum brasilense (Fixador bacteriano de Nitrogênio atmosférico)',
      'Rhizobium leguminosarum & Frankia spp.',
      'Bacillus subtilis e Micorrizas Arbusculares (Glomus intraradices)'
    ],
    companionPlants: [
      'Trevo-Branco (Trifolium repens) - Fixação simbiótica de N no solo',
      'Ervilhaca (Vicia sativa) - Cobertura viva de alta ciclagem nitrogenada',
      'Feijão-de-porco (Canavalia ensiformis) - Biomassa vegetal rica em amido e N'
    ],
    astrayaTips: 'A ASTRAYA recomenda manter N mais elevado no vegetativo (180-220 PPM) e reduzir gradualmente na floração avançada para permitir a maturação dos terpenos.',
    imageUrl: '/images/deficiencies/nitrogen.jpg',
    images: [
      '/images/deficiencies/nitrogen.jpg',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80'
    ],
    figures: [
      {
        figureNumber: 'Figura 3',
        title: 'Evolução do Amarelamento Foliar por Nitrogênio',
        description: 'Progressão da clorose devido à deficiência de nitrogênio das folhas jovens (esquerda) até as folhas maduras/velhas (direita).'
      },
      {
        figureNumber: 'Figura 4',
        title: 'Amarelamento e Perda de Vigor no Terço Inferior',
        description: 'Planta apresentando folhas maduras no terço inferior amarelas por translocação de N para o topo.'
      }
    ],
    pdfDriveUrl: DRIVE_DEFICIENCIES_PDF
  },
  {
    id: 'def-p',
    element: 'Fósforo',
    symbol: 'P',
    type: 'Macro',
    mobility: 'Móvel',
    targetLeaves: 'Folhas Velhas (Inferiores)',
    symptoms: [
      'Folhas verde-escuras, opacas ou com tons azulados/púrpuras.',
      'Surgimento de manchas necróticas escuras (marrom/bronze) nas folhas inferiores.',
      'Petíolos e hastes roxas intensas.',
      'Atraso no desenvolvimento de raízes e floração fraca com flores pequenas.'
    ],
    causes: [
      'pH do substrato desajustado (< 6.0 em solo bloqueia o P por fixação com Fe/Al).',
      'Temperaturas do solo abaixo de 15°C reduzem drasticamente a captação de Fósforo.',
      'Acúmulo excessivo de Zinco ou Ferro antagonizando o Fósforo.'
    ],
    correctiveOrganic: [
      'Farinha de Ossos calcinada ou Rocha Fosfática (Arad/Gafsa).',
      'WPA (Water Soluble Phosphoric Acid - KNF de ossos queimados em vinagre).',
      'Extrato de cinzas de madeira ou farinha de peixe.'
    ],
    correctiveMineral: [
      'MAP (Fosfato Monoamônico) ou MKP (Fosfato Monopotássico).',
      'Superfosfato Simples / Triplo em fertirrigação.'
    ],
    solubilizingMicroorganisms: [
      'Bacillus megaterium var. phosphaticum (Solubilizador ativo de P fixado)',
      'Pseudomonas fluorescens & Aspergillus niger',
      'Fungos Micorrizicos Arbusculares (Rhizophagus irregularis) - Extensão hifal'
    ],
    companionPlants: [
      'Trigo-Sarraceno (Fagopyrum esculentum) - Exsuda ácidos orgânicos que liberam Fósforo',
      'Lupino / Tremoço-Branco (Lupinus albus) - Raízes proteoides acumuladoras de P',
      'Girassol Anão (Helianthus annuus) - Extração profunda do perfil do solo'
    ],
    astrayaTips: 'P é crucial nas primeiras 3 semanas de floração para a diferenciação dos botões florais. Monitore a temperatura da raiz nas estações frias.',
    imageUrl: '/images/deficiencies/phosphorus.jpg',
    images: [
      '/images/deficiencies/phosphorus.jpg',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80'
    ],
    figures: [
      {
        figureNumber: 'Figura 5',
        title: 'Progressão de Sintomas de Fósforo',
        description: 'Progressão dos sintomas de deficiência de fósforo da folha mais jovem (esquerda) para a mais velha (direita).'
      },
      {
        figureNumber: 'Figura 6',
        title: 'Deficiência Severa e Nanismo Vegetal',
        description: 'Falta crítica de Fósforo resultando em atrofiamento das raízes e plantas nanificadas.'
      },
      {
        figureNumber: 'Figura 7',
        title: 'Coloração Verde-Escura Fosca',
        description: 'Folhas com tom verde-escuro opaco, sintoma comum do acúmulo de açúcares por escassez de Fósforo.'
      },
      {
        figureNumber: 'Figura 8',
        title: 'Arroxeamento de Caules e Petíolos',
        description: 'Pigmentação purpúrea intensa nas hastes e petíolos induzida pelo acúmulo de antocianinas por falta de Fósforo.'
      }
    ],
    pdfDriveUrl: DRIVE_DEFICIENCIES_PDF
  },
  {
    id: 'def-k',
    element: 'Potássio',
    symbol: 'K',
    type: 'Macro',
    mobility: 'Móvel',
    targetLeaves: 'Folhas Velhas (Inferiores)',
    symptoms: [
      'Bordas e pontas das folhas velhas queimadas e necrosadas (sintoma de "folha queimada por margens").',
      'Mosaico de manchas amarelas e necróticas nas margens serrilhadas.',
      'Folhas curvadas para cima, hastes fracas e quebradiças.',
      'Sensibilidade aumentada a pragas e estresse hídrico/térmico.'
    ],
    causes: [
      'Excessos de Cálcio (Ca) ou Magnésio (Mg) que competem com o Potássio pelas raízes.',
      'Acúmulo de sais solúveis no substrato (EC alto na zona de raiz).',
      'Substratos muito arenosos com baixa retenção de Cátions (CTC baixa).'
    ],
    correctiveOrganic: [
      'Cinza de madeira pura diluída (fonte rica de K biodisponível).',
      'Extrato fermentado de casca de banana ou vinhaça de cana.',
      'Sulfato de Potássio Orgânico (K-Mag / Langbeinita).'
    ],
    correctiveMineral: [
      'Nitrato de Potássio (KNO3) ou Sulfato de Potássio (K2SO4).',
      'Cloreto de Potássio purificado (recomenda-se cautela com salinidade).'
    ],
    solubilizingMicroorganisms: [
      'Bacillus mucilaginosus (Solubilizador de Potássio em minerais silicatos)',
      'Frateuria aurentia (Bactéria mobilizadora de K no complexo argilo-humico)',
      'Paenibacillus glucanolyticus'
    ],
    companionPlants: [
      'Confrei (Symphytum officinale) - Acumulador dinâmico de Potássio e minerais',
      'Dente-de-Leão (Taraxacum officinale) - Raiz pivô profunda bombeadora de K',
      'Capim-Limão / Capim-Cidreira - Biomassa de cobertura riquíssima em sílica e Potássio'
    ],
    astrayaTips: 'Na fase de engorda dos frutos/buds (semanas 4-7 de floração), a demanda por K dobra. Mantenha a relação K:N próxima de 2:1 nessa fase.',
    imageUrl: '/images/deficiencies/potassium.jpg',
    images: [
      '/images/deficiencies/potassium.jpg',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'
    ],
    figures: [
      {
        figureNumber: 'Figura 9',
        title: 'Evolução de Clorose e Necrose Marginal',
        description: 'Desenvolvimento de clorose e necrose nas margens serrilhadas das folhas, evoluindo de jovens para velhas.'
      },
      {
        figureNumber: 'Figura 10',
        title: 'Aglomerado Foliar com Margens Queimadas',
        description: 'Sintomas de clorose e necrose severa nas margens dos aglomerados foliares por deficiência de Potássio.'
      }
    ],
    pdfDriveUrl: DRIVE_DEFICIENCIES_PDF
  },
  {
    id: 'def-ca',
    element: 'Cálcio',
    symbol: 'Ca',
    type: 'Secundário',
    mobility: 'Imóvel',
    targetLeaves: 'Folhas Novas (Superiores)',
    symptoms: [
      'Pequenas manchas necróticas marrom-enferrujadas ou douradas em folhas novas.',
      'Deformação dos brotos novos (folhas gancho ou enrugadas).',
      'Pontas das raízes queimadas, atrofiadas e com podridão.',
      'Caules fracos e estrutura celular quebradiça.'
    ],
    causes: [
      'Transpiração baixa causada por Umidade Relativa (UR) muito alta ou falta de circulação de ar.',
      'Uso de água de osmose reversa (RO) sem suplementação prévia de Ca/Mg.',
      'Excesso de Potássio ou Sódio antagonizando a captação de Cálcio.'
    ],
    correctiveOrganic: [
      'WCA (Water Soluble Calcium KNF - casca de ovo tostada solubilizada em vinagre de maçã) 1:1000.',
      'Calcário Dolomítico ou Calcita no solo.',
      'Gesso Agrícola (Sulfato de Cálcio).'
    ],
    correctiveMineral: [
      'Nitrato de Cálcio comercial (15% N, 19% Ca) em fertirrigação (1.0 g/L).',
      'Cloreto de Cálcio para pulverização foliar de emergência (0.5 g/L).'
    ],
    solubilizingMicroorganisms: [
      'Bacillus licheniformis (Quelatação e liberação de carbonato de cálcio)',
      'Lactobacillus plantarum (LAB - Ácido lático que solubiliza pós de rocha calcária)',
      'Trichoderma harzianum (Estimulador de rigidez celular e absorção de Ca)'
    ],
    companionPlants: [
      'Manjericão (Ocimum basilicum) - Estimula a estrutura estrutural e microbiota do Ca',
      'Achillea millefolium (Mil-Folhas) - Acumuladora de cálcio e minerais secundários',
      'Agerato / Mentasto - Proteção do dossel e reciclagem profunda de Ca'
    ],
    astrayaTips: 'O Cálcio é transportado via xilema movido pela transpiração. Se o VPD for muito baixo (< 0.4 kPa), a planta para de transpirar e manifesta deficiência de Ca mesmo com Ca no solo!',
    imageUrl: '/images/deficiencies/calcium.jpg',
    images: [
      '/images/deficiencies/calcium.jpg',
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80'
    ],
    figures: [
      {
        figureNumber: 'Figura 11',
        title: 'Pontuação Necrótica em Folhas Jovens',
        description: 'Folhas jovens desenvolvendo pontos de necrose castanho-amarelados e curvatura marginal.'
      },
      {
        figureNumber: 'Figura 12',
        title: 'Deformação Severa das Folhas de Topo',
        description: 'Folhas assumindo formatos retorcidos e pontas em gancho após carência prolongada de Cálcio.'
      },
      {
        figureNumber: 'Figura 13',
        title: 'Necrose Extensiva no Limbo Foliar',
        description: 'Avanço das manchas necróticas amareladas cobrindo quase todo o tecido foliar.'
      }
    ],
    pdfDriveUrl: DRIVE_DEFICIENCIES_PDF
  },
  {
    id: 'def-mg',
    element: 'Magnésio',
    symbol: 'Mg',
    type: 'Secundário',
    mobility: 'Móvel',
    targetLeaves: 'Folhas Velhas (Inferiores)',
    symptoms: [
      'Clorose internerval marcante nas folhas inferiores (nervuras permanecem verdes e o espaço entre elas fica amarelo).',
      'Avança para manchas marrons/avermelhadas necróticas e bordas curvadas para cima.',
      'Diminuição da fotossíntese (o Mg é o átomo central da molécula de clorofila).'
    ],
    causes: [
      'pH do solo abaixo de 6.0 ou substrato coco/inerte abaixo de 5.5.',
      'Excesso de Cálcio ou Potássio na fertilização (competição catiônica).',
      'Temperaturas frias nas raízes dificultando a captação.'
    ],
    correctiveOrganic: [
      'Sal de Epsom (Sulfato de Magnésio) via foliar (2-5g por Litro de água morna).',
      'Calcário Dolomítico (fornece Ca e Mg equilibrados).',
      'Biofertilizante de cinzas com rocha magnesiana.'
    ],
    correctiveMineral: [
      'Sulfato de Magnésio Heptahidratado (Sal de Epsom) 2g/L foliar ou 1g/L solo.',
      'Nitrato de Magnésio via fertirrigação em fase vegetativa.'
    ],
    solubilizingMicroorganisms: [
      'Bacillus subtilis (Solubilização de silicatos magnesianos)',
      'Pseudomonas putida (Liberação de íons Mg2+ no rizoplano)',
      'Actinomicetos benéficos do solo (Streptomyces spp.)'
    ],
    companionPlants: [
      'Urtiga-Mão-Morta (Urtica dioica) - Biorecidora de ferro, nitrogênio e magnésio',
      'Camomila (Matricaria chamomilla) - Atrai polinizadores e acumula magnésio',
      'Sálvia (Salvia officinalis) - Bioestimulante e fixadora de minerais secundários'
    ],
    astrayaTips: 'Sprays foliares de Sal de Epsom antes do acendimento das luzes proporcionam rápida recuperação do Magnésio em 24 a 48 horas.',
    imageUrl: '/images/deficiencies/magnesium.jpg',
    images: [
      '/images/deficiencies/magnesium.jpg',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80'
    ],
    figures: [
      {
        figureNumber: 'Figura 14',
        title: 'Sintoma Inicial em Folhas Velhas',
        description: 'Primeiros sinais em folhas velhas com clorose interveinal verde-amarelada.'
      },
      {
        figureNumber: 'Figura 15',
        title: 'Estágio Intermediário e Quebra Celular',
        description: 'Colapso dos tecidos cloróticos avançando para necrose e manchas marrons mortas entre as nervuras.'
      },
      {
        figureNumber: 'Figura 16',
        title: 'Fase Avançada e Curvatura das Bordas',
        description: 'Progressão da clorose para morte celular com enrugamento e enrolamento característico das bordas.'
      },
      {
        figureNumber: 'Figura 17',
        title: 'Necrose Tardia no Terço Inferior',
        description: 'Desenvolvimento tardio com folhas inferiores totalmente necrosadas, secas e retorcidas.'
      }
    ],
    pdfDriveUrl: DRIVE_DEFICIENCIES_PDF
  },
  {
    id: 'def-s',
    element: 'Enxofre',
    symbol: 'S',
    type: 'Secundário',
    mobility: 'Parcialmente Móvel',
    targetLeaves: 'Folhas Novas (Superiores)',
    symptoms: [
      'Amarelamento uniforme em folhas novas e jovens, similar ao Nitrogênio mas no topo da planta.',
      'Parte inferior das folhas novas pode apresentar coloração purpúrea ou rosa.',
      'Desenvolvimento de terpenos e compostos aromáticos prejudicado.'
    ],
    causes: [
      'pH alcalino do solo.',
      'Lixiviação intensa de sulfatos.'
    ],
    correctiveOrganic: [
      'Gesso Agrícola (Sulfato de Cálcio).',
      'JADAM JS (Jadam Sulfur) em dosagens dilution recomendadas.',
      'Sal de Epsom (Sulfato de Magnésio).'
    ],
    correctiveMineral: [
      'Sulfato de Potássio ou Sulfato de Magnésio (Sal de Epsom) 1g/L em fertirrigação.',
      'Enxofre Elemental agrícola para correção gradual de pH e fonte de S.'
    ],
    solubilizingMicroorganisms: [
      'Thiobacillus ferrooxidans & Thiobacillus thiooxidans (Bactérias oxidantes de Enxofre elemental)',
      'Bacillus megaterium',
      'Aspergillus spp.'
    ],
    companionPlants: [
      'Alho / Cebolinha (Allium spp.) - Fonte natural de compostos sulfurados aromáticos',
      'Mostarda-Preta (Brassica nigra) - Biofumigação e acúmulo de sulfatos',
      'Capuchinha (Tropaeolum majus) - Repelente e acumuladora de enxofre'
    ],
    astrayaTips: 'O Enxofre é precursor essencial na biossíntese de tióis e compostos sulfurados voláteis responsáveis pelos aromas "skunky" e cítricos marcantes.',
    imageUrl: '/images/deficiencies/sulfur.jpg',
    images: [
      '/images/deficiencies/sulfur.jpg',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80'
    ],
    figures: [
      {
        figureNumber: 'Figura 18',
        title: 'Clorose Apical em Folhas Jovens',
        description: 'Folhas novas do topo com clorose amarelada uniforme por falta de Enxofre.'
      },
      {
        figureNumber: 'Figura 19',
        title: 'Lenhosidade e Enrijecimento da Haste',
        description: 'Aumento da rigidez e aspecto lenhoso no caule por deficiência de Enxofre.'
      },
      {
        figureNumber: 'Figura 20',
        title: 'Clorose nas Folhas Superiores e Brotos',
        description: 'Amarelamento nas folhas superiores (esquerda) e palidez nos brotos meristemáticos (direita).'
      },
      {
        figureNumber: 'Figura 21',
        title: 'Progressão da Clorose por Enxofre',
        description: 'Evolução da clorose de moderada (esquerda) para severa (direita) por falta de Enxofre.'
      }
    ],
    pdfDriveUrl: DRIVE_DEFICIENCIES_PDF
  },
  {
    id: 'def-b',
    element: 'Boro',
    symbol: 'B',
    type: 'Micro',
    mobility: 'Imóvel',
    targetLeaves: 'Folhas Novas (Superiores)',
    symptoms: [
      'Necrose do meristema apical (morte do broto principal de crescimento).',
      'Folhas novas deformadas, retorcidas e com coloração marrom escuro/bronze nas pontas.',
      'Caules e petíolos ocos, quebradiços e com rachaduras superficiais.',
      'Raízes curtas, grossas e com pontas entumescidas.'
    ],
    causes: [
      'pH do solo acima de 7.0 ou abaixo de 5.0.',
      'Seca prolongada no solo reduzindo o fluxo de massa do Boro.',
      'Substratos ultra-lixiviados com baixo teor de matéria orgânica.'
    ],
    correctiveOrganic: [
      'Aplicação de Ácido Bórico agrícola em dosagens de precisão via foliar (0.1 g/L).',
      'Composto orgânico maturado (matéria orgânica é o principal reservatório de Boro).',
      'Extrato de algas marinhas (Ascophyllum nodosum).'
    ],
    correctiveMineral: [
      'Ácido Bórico (H3BO3) ou Octaborato Disódico (Solubor) via foliar (0.05g a 0.1g por Litro).',
      'Borax / Tetraborato de Sódio no solo (0.5 kg/ha de B equivalente).'
    ],
    solubilizingMicroorganisms: [
      'Bacillus pumilus (Mobilizador de boratos minerais)',
      'Pseudomonas fluorescens (Produtor de sideróforos e quelatos organoborados)',
      'Glomus mosseae (Micorriza facilitadora de absorção micronutricional)'
    ],
    companionPlants: [
      'Girassol (Helianthus annuus) - Grande indicador ecológico e bioacumulador de Boro',
      'Trevo-Encarnado (Trifolium incarnatum) - Ciclagem de boratos na camada superficial',
      'Mostarda-Branca (Sinapis alba) - Descompactadora de solo e liberadora de micronutrientes'
    ],
    astrayaTips: 'O Boro possui margem muito estreita entre deficiência e toxicidade. Nunca exceda 0.5 PPM de B na solução nutritiva!',
    imageUrl: '/images/deficiencies/boron.jpg',
    images: [
      '/images/deficiencies/boron.jpg',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'
    ],
    figures: [
      {
        figureNumber: 'Figura 22',
        title: 'Clorose Interveinal e Engrossamento Apical',
        description: 'Sintomas nas folhas jovens do topo incluindo clorose interveinal, espessamento e manchas.'
      },
      {
        figureNumber: 'Figura 23',
        title: 'Distorção Severa das Folhas Jovens',
        description: 'Retorcimento acentuado e enrolamento em espiral dos brotos apicais por colapso do meristema.'
      }
    ],
    pdfDriveUrl: DRIVE_DEFICIENCIES_PDF
  },
  {
    id: 'def-cu',
    element: 'Cobre',
    symbol: 'Cu',
    type: 'Micro',
    mobility: 'Imóvel',
    targetLeaves: 'Folhas Novas (Superiores)',
    symptoms: [
      'Enrolamento pronunciado das margens das folhas novas para baixo/trás (formato de garra).',
      'Perda de turgidez e murchamento de brotos jovens mesmo com o solo úmido.',
      'Folhas novas com tonalidade verde-escura azulada e necrose nas pontas serrilhadas.',
      'Atraso na floração e ramos fracos e flexíveis sem rigidez.'
    ],
    causes: [
      'pH do substrato muito alto (> 7.0) ou excesso severo de matéria orgânica não curtida (complexa o Cu).',
      'Excesso de Nitrogênio, Fósforo ou Zinco bloqueando a captação de Cobre.'
    ],
    correctiveOrganic: [
      'Sulfato de Cobre em dosagem homeopática (0.05 g/L).',
      'Calda Bordalesa (para ação fungicida e suplementação foliar micronutricional).',
      'Biofertilizante enriquecido com pó de rocha basáltica.'
    ],
    correctiveMineral: [
      'Sulfato de Cobre Quelatado (Cu-EDTA) 0.05g por Litro via foliar.',
      'Sulfato de Cobre Pentahidratado (CuSO4·5H2O) em fertirrigação (0.02 to 0.05 PPM Cu).'
    ],
    solubilizingMicroorganisms: [
      'Trichoderma harzianum (Solubilização biológica de minerais cúpricos)',
      'Bacillus megaterium',
      'Aspergillus niger (Liberador de ácidos quelantes orgânicos)'
    ],
    companionPlants: [
      'Mostarda-Castanha (Brassica juncea) - Excelente acumuladora e recicladora de Cobre',
      'Facélia (Phacelia tanacetifolia) - Atrai polinizadores e descompacta micronutrientes',
      'Coentro (Coriandrum sativum) - Bioacumulador e repelente de pragas'
    ],
    astrayaTips: 'O Cobre é componente essencial da plastocianina na cadeia de transporte de elétrons da fotossíntese e ativa enzimas de lignificação dos caules.',
    imageUrl: '/images/deficiencies/copper.jpg',
    images: [
      '/images/deficiencies/copper.jpg',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'
    ],
    figures: [
      {
        figureNumber: 'Figura 26',
        title: 'Progressão de Clorose para Necrose',
        description: 'Mosaico de clorose evoluindo para manchas necróticas em folhas novas até folhas velhas por falta de Cobre.'
      },
      {
        figureNumber: 'Figura 27',
        title: 'Folhas Verde-Azuladas Curvadas',
        description: 'Folhas com tonalidade verde-azulada opaca e início de enrolamento longitudinal nas bordas.'
      },
      {
        figureNumber: 'Figura 28',
        title: 'Murchamento e Caimento Foliar',
        description: 'Folhas tombando e murchando por perda de sustentação mecânica e fraqueza na estrutura de lignina.'
      }
    ],
    pdfDriveUrl: DRIVE_DEFICIENCIES_PDF
  },
  {
    id: 'def-mn',
    element: 'Manganês',
    symbol: 'Mn',
    type: 'Micro',
    mobility: 'Imóvel',
    targetLeaves: 'Folhas Novas (Superiores)',
    symptoms: [
      'Clorose internerval em folhas novas com pequenas pontuações necróticas cinza/marrom salpicadas.',
      'Diferente do Ferro, as nervuras menores também permanecem verdes, criando um padrão xadrez/mosaico.',
      'Desenvolvimento necrótico avança cobrindo a folha e causando queima das bordas.'
    ],
    causes: [
      'pH do solo elevado (> 6.8).',
      'Solo excessivamente aerado e seco (promove oxidação do Mn2+ para formas insolúveis Mn4+).',
      'Excesso de Ferro solúvel criando antagonismo competitivo.'
    ],
    correctiveOrganic: [
      'Sulfato de Manganês via fertirrigação (1-2 PPM Mn).',
      'Farinha de rocha de Basalto granulometria fina.',
      'Bokashi com ácidos fúlvicos.'
    ],
    correctiveMineral: [
      'Sulfato de Manganês (MnSO4·H2O) ou Quelato Mn-EDTA (1 a 2 PPM Mn na solução).',
      'Pulverização foliar de Mn-EDTA 0.1g/L no início dos sintomas.'
    ],
    solubilizingMicroorganisms: [
      'Bacillus circulans (Redutor microbiológico de Manganês insolúvel)',
      'Rhizobium leguminosarum',
      'Pseudomonas putida (Mobilizador de íons Mn2+)'
    ],
    companionPlants: [
      'Confrei (Symphytum officinale) - Ciclador profundo de Manganês',
      'Dente-de-Leão - Bombeador de micronutrientes do subsolo',
      'Espinagora / Espinafre - Acumulador foliar de Manganês e Ferro'
    ],
    astrayaTips: 'O Manganês participa da fotólise da água na fotossíntese (Fotossistema II). A deficiência destrói a eficiência fotossintética rapidamente.',
    imageUrl: '/images/deficiencies/manganese.jpg',
    images: [
      '/images/deficiencies/manganese.jpg',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80'
    ],
    figures: [
      {
        figureNumber: 'Figura 33',
        title: 'Desenvolvimento Progressivo de Manganês',
        description: 'Folhas mais jovens exibindo bordas verde-escuras e clorose interveinal pontilhada com o envelhecimento.'
      },
      {
        figureNumber: 'Figura 34',
        title: 'Sintomas da Folha Jovem para a Velha',
        description: 'Gradação da deficiência de manganês da folha jovem (esquerda) até a folha mais velha com salpicado necrótico bronze (direita).'
      }
    ],
    pdfDriveUrl: DRIVE_DEFICIENCIES_PDF
  },
  {
    id: 'def-zn',
    element: 'Zinco',
    symbol: 'Zn',
    type: 'Micro',
    mobility: 'Imóvel',
    targetLeaves: 'Folhas Novas (Superiores)',
    symptoms: [
      'Sintoma clássico de "roseta" ou "folhas em miniatura" devido ao encurtamento severo dos internódios nos brotos novos.',
      'Clorose internerval intensa em folhas novas com pontas retorcidas e amareladas.',
      'Folhas novas nascem estreitas, finas e viradas 90 graus para o lado.'
    ],
    causes: [
      'pH alcalino do solo (> 7.0).',
      'Excessos maciços de Fósforo (P) na adubação de floração (precipita o Zinco como Fosfato de Zinco insolúvel).',
      'Solos frios, encharcados e sem microbiologia ativa.'
    ],
    correctiveOrganic: [
      'Sulfato de Zinco foliar (0.2 g/L) ou quelato de Zinco.',
      'Extrato fúlvico com minerais quelatados.',
      'Biofertilizante de esterco ovino ou caprino.'
    ],
    correctiveMineral: [
      'Sulfato de Zinco Monohidratado (ZnSO4·H2O) ou Quelato Zn-EDTA (0.1g a 0.2g por Litro via foliar).',
      'Zinco Quelatado via fertirrigação (0.5 a 1.0 PPM Zn).'
    ],
    solubilizingMicroorganisms: [
      'Bacillus aryabhattai (Solubilizador de Zinco em solos tropicais)',
      'Pseudomonas fluorescens (Solubilização de ZnO e ZnCO3)',
      'Rhizobium phaseoli'
    ],
    companionPlants: [
      'Trigo-Sarraceno (Fagopyrum esculentum) - Exsuda compostos quelantes de Zinco',
      'Trevo-Encarnado - Cobertura rica em micronutrientes',
      'Centeio (Secale cereale) - Raízes fasciculadas profundas extratoras de Zn'
    ],
    astrayaTips: 'O Zinco é vital para a síntese do triptofano, aminoácido precursor do Hormônio Auxina (Crescimento vegetativo e alongamento celular).',
    imageUrl: '/images/deficiencies/zinc.jpg',
    images: [
      '/images/deficiencies/zinc.jpg',
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'
    ],
    figures: [
      {
        figureNumber: 'Figura 39',
        title: 'Clorose Interveinal em Folhas Jovens',
        description: 'Clorose interveinal marcante nas folhas novas do topo do dossel por deficiência de Zinco.'
      },
      {
        figureNumber: 'Figura 40',
        title: 'Folhas Estreitas em Forma de Fita (Strappy Leaves)',
        description: 'Folhas novas extremamente finas, afiladas e deformadas por falta de Auxina devido à carência de Zinco.'
      },
      {
        figureNumber: 'Figura 41',
        title: 'Sintoma Apical por Nutriente Imóvel',
        description: 'Por ser imóvel, os sintomas primários de Zinco ocorrem estritamente no topo e meristemas apicais.'
      },
      {
        figureNumber: 'Figura 42',
        title: 'Clorose Interveinal na Metade Basal',
        description: 'Clorose interveinal iniciada na metade inferior/basal do limbo foliar.'
      }
    ],
    pdfDriveUrl: DRIVE_DEFICIENCIES_PDF
  },
  {
    id: 'def-fe',
    element: 'Ferro',
    symbol: 'Fe',
    type: 'Micro',
    mobility: 'Imóvel',
    targetLeaves: 'Folhas Novas (Superiores)',
    symptoms: [
      'Clorose internerval intensa e pálida em brotos e folhas novas.',
      'As folhas novas surgem amarelo-limão quase brancas, enquanto as nervuras principais continuam verdes.',
      'Folhas velhas mantêm aparência normal.'
    ],
    causes: [
      'pH alto no substrato (> 6.8 em coco/hidro ou > 7.2 em solo).',
      'Raízes encharcadas por sobre-rega (falta de oxigênio na zona radicular).',
      'Excesso de Fósforo bloqueando o Ferro.'
    ],
    correctiveOrganic: [
      'Bokashi fermentado rico em quelatos naturais.',
      'Composto orgânico rico em ácidos fúlvicos e húmicos para solubilizar o Fe.'
    ],
    correctiveMineral: [
      'Quelato de Ferro Fe-EDDHA (para solos com pH > 6.5) ou Fe-DTPA / Fe-EDTA.',
      'Sulfato Ferroso (FeSO4) via fertirrigação em solos ácidos.'
    ],
    solubilizingMicroorganisms: [
      'Pseudomonas putida & Pseudomonas fluorescens (Produtores de sideróforos de Fe3+)',
      'Bacillus subtilis',
      'Trichoderma harzianum (Aumenta a redutase de ferro nas raízes)'
    ],
    companionPlants: [
      'Urtiga-Mão-Morta (Urtica dioica) - Bioacumulador extraordinário de Ferro biodisponível',
      'Salsa (Petroselinum crispum) - Acumuladora de ferro e atratora de insetos benéficos',
      'Dente-de-Leão - Solubilização do ferro nativo no solo'
    ],
    astrayaTips: 'Deficiência de Ferro é quase sempre um sintoma de pH desajustado ou encharcamento de raízes, e raramente falta do elemento no solo.',
    imageUrl: '/images/deficiencies/iron.jpg',
    images: [
      '/images/deficiencies/iron.jpg',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80'
    ],
    figures: [
      {
        figureNumber: 'Figura 31',
        title: 'Clorose Apical Amarelo-Limão com Nervuras Verdes',
        description: 'Folhas apicais jovens extremamente amarelas com nervuras finas verdes intactas por imobilidade de Ferro.'
      }
    ],
    pdfDriveUrl: DRIVE_DEFICIENCIES_PDF
  }
];

