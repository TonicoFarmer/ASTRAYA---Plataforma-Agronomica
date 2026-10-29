import { BioInput } from '../types';

export const INITIAL_BIOINPUTS: BioInput[] = [
  {
    id: 'bio-1',
    productName: 'Trichoderma harzianum (Esmeralda Bio)',
    activeAgent: 'Fungo antagonista Trichoderma harzianum (CEPA 1306)',
    category: 'Biofungicida',
    dosage: '1.0 g a 2.0 g por Litro de água no solo ou substrato',
    targetPestOrDisease: 'Pythium, Fusarium, Rhizoctonia, Podridão de Raízes e Tombamento de Mudas (Damping-off)',
    astrayaNotes: 'Aplicar no transplante e quinzenalmente no vegetativo. Age por micoparasitismo, competição por espaço/nutrientes e indução de resistência sistêmica na cannabis.'
  },
  {
    id: 'bio-2',
    productName: 'Beauveria bassiana (Boveril WP)',
    activeAgent: 'Fungo entomopatogênico Beauveria bassiana',
    category: 'Bioinseticida',
    dosage: '2.0 g a 3.0 g por Litro de água (pulverização foliar à noite)',
    targetPestOrDisease: 'Ácaros, Mosca Branca, Trips, Pulgões e Broca do Caule',
    astrayaNotes: 'Os esporos germinam sobre a cutícula da praga, penetram o exoesqueleto e mumificam o inseto com micélio branco em 3 a 5 dias. Manter umidade foliar elevada logo após a aplicação para garantir a germinação.'
  },
  {
    id: 'bio-3',
    productName: 'Bacillus thuringiensis kurstaki (Dipel / Bt)',
    activeAgent: 'Bactéria sporing Bacillus thuringiensis var. kurstaki',
    category: 'Bioinseticida',
    dosage: '1.5 mL a 2.5 mL por Litro de água em pulverização foliar',
    targetPestOrDisease: 'Lagartas das folhas, Lagarta do Cartucho e Lagarta das Flores',
    astrayaNotes: 'Produz cristais de proteína endotoxina delta que paralisam o trato digestivo das lagartas ao serem ingeridos. Totalmente inócuo para seres humanos, abelhas e predadores benéficos.'
  },
  {
    id: 'bio-4',
    productName: 'Glomus intraradices (Micorriza Arbuscular Endomyco)',
    activeAgent: 'Fungos Micorrízicos Arbusculares (Rhizophagus irregularis / Glomus intraradices)',
    category: 'Inoculante',
    dosage: '5g por vaso na cova de transplante em contato direto com a raiz',
    targetPestOrDisease: 'Expansão da área de absorção radicular e estresse hídrico',
    astrayaNotes: 'As hifas do fungo aumentam a superfície efetiva de absorção da raiz em até 1000%, melhorando dramaticamente a captação de Fósforo e micronutrientes em solos vivos.'
  },
  {
    id: 'bio-5',
    productName: 'Bacillus subtilis / B. amyloliquefaciens (Serenade)',
    activeAgent: 'Bactéria Bacillus subtilis QST 713',
    category: 'Biofungicida',
    dosage: '3.0 mL a 5.0 mL por Litro de água (foliar preventiva)',
    targetPestOrDisease: 'Oídio (Powdery Mildew), Botrytis cinerea (Mofo Cinzento) e Macrophomina',
    astrayaNotes: 'Secreta lipopeptídeos naturais (iturinas e surfactinas) que rompem as membranas dos fungos patogênicos. Excelente protetor foliar e seguro para uso até a fase inicial de floração.'
  },
  {
    id: 'bio-6',
    productName: 'Metarhizium anisopliae (Metarril WP)',
    activeAgent: 'Fungo entomopatogênico Metarhizium anisopliae (IBCB 425)',
    category: 'Bioinseticida',
    dosage: '2.0 g a 3.0 g por Litro de água em pulverização foliar no início da noite',
    targetPestOrDisease: 'Cigarrinho-do-milho, Percevejos, Besouros e Larvas do solo',
    astrayaNotes: 'Penetra a cutícula do inseto infectando a hemolinfa ("doença do muscardine verde"). Atua em sinergia com Beauveria bassiana no controle de cigarrinhos e sugadores.'
  },
  {
    id: 'bio-7',
    productName: 'Isaria fumosorosea / Cordyceps fumosorosea (Octal WP)',
    activeAgent: 'Fungo entomopatogênico Cordyceps fumosorosea',
    category: 'Bioinseticida',
    dosage: '1.5 g a 2.5 g por Litro de água',
    targetPestOrDisease: 'Mosca-Branca (todas as fases), Ácaro Branco, Trips e Ácaro Vermelho',
    astrayaNotes: 'Excepcional controle para surtos de Mosca-Branca e Ácaro Branco. Ataca ovos, ninfas e adultos, germinando em condições de umidade foliar favorável.'
  },
  {
    id: 'bio-8',
    productName: 'Azospirillum brasilense (Inoculante Azos)',
    activeAgent: 'Bactéria diazotrófica e promotora de crescimento Azospirillum brasilense (Ab-V5 e Ab-V6)',
    category: 'Bioestimulante',
    dosage: '2.0 mL a 4.0 mL por Litro via fertirrigação ou banho de sementes/estacas',
    targetPestOrDisease: 'Fixação biológica de Nitrogênio e estímulo de fitohormônios (Auxinas)',
    astrayaNotes: 'Promove enraizamento explosivo em clones e estacas. Fixa o nitrogênio atmosférico e sintetiza ácido indolacético (AIA) nativo.'
  },
  {
    id: 'bio-9',
    productName: 'Extrato de Algas Marinhas (Ascophyllum nodosum)',
    activeAgent: 'Alga marinha concentrada rica em citoquininas, betaínas e manitol',
    category: 'Bioestimulante',
    dosage: '1.0 mL a 2.0 mL por Litro via foliar ou solo a cada 10 dias',
    targetPestOrDisease: 'Superação de estresse térmico, hídrico, fitotoxicidade e estímulo de ramificação',
    astrayaNotes: 'Aumenta a concentração de clorofila, ativa a síntese proteica e fortalece o sistema imunológico vegetal contra picos de calor e seca.'
  },
  {
    id: 'bio-10',
    productName: 'Purpureocillium lilacinum (NematWP / Nematocida Biológico)',
    activeAgent: 'Fungo nematófago Purpureocillium lilacinum (Paecilomyces lilacinus)',
    category: 'Bionematicida',
    dosage: '2.0 g a 4.0 g por Litro aplicado via drench (rega de solo)',
    targetPestOrDisease: 'Nematoide das Galhas (Meloidogyne spp.) e Nematoide das Lesões (Pratylenchus spp.)',
    astrayaNotes: 'Infecta ovos, fêmeas e juvenis de nematoides nocivos no solo, destruindo a casca lipídica dos ovos e limpando a zona radicular.'
  }
];
