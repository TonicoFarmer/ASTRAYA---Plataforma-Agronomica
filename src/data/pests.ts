import { PestPois } from '../types';

export const DRIVE_PESTS_PDF = "https://drive.google.com/file/d/1DsLZM5eyHvKaQG7NOciRe1tCbT2RD6Tf/view?usp=drive_link";

export const INITIAL_PESTS: PestPois[] = [
  {
    id: 'pest-spidermite',
    name: 'Ácaro Vermelho / Ácaro do Teto (Spider Mites)',
    scientificName: 'Tetranychus urticae',
    category: 'Ácaro',
    identification: 'Pequenos aracnídeos (0.5mm) amarelos, avermelhados ou pretos localizados na página inferior (abaxial) das folhas. Tecem teias finas ao redor de buds e folhas em infestações severas.',
    damageSymptoms: [
      'Pequenos pontos brancos ou amarelados (prateamento) na superfície superior da folha.',
      'Perda de clorofila, amarelamento e secagem acelerada das folhas.',
      'Teias cobrindo as flores e reduzindo drasticamente o rendimento e qualidade dos óleos essenciais.'
    ],
    prevention: [
      'Manter umidade relativa acima de 55-60% no vegetativo (ácaros odeiam umidade alta).',
      'Limpeza rigorosa do ambiente com álcool 70% ou peróxido de hidrogênio entre ciclos.',
      'Instalar filtros HEPA nas entradas de ar do cultivo.'
    ],
    biologicalControl: [
      'Liberação de Ácaros Predadores: Phytoseiulus persimilis (faminto por T. urticae) e Neoseiulus californicus (resistente a temperaturas mais altas e baixas umidades).',
      'Aplicações do fungo entomopatogênico Beauveria bassiana.'
    ],
    organicRecipes: [
      'JWA (Jadam Wetting Agent / Sabão Potássico) a 10-15 mL/L + JHS (Extrato de Pimenta/Alho KNF/Jadam) 5 mL/L em pulverização foliar completa.',
      'Óleo de Neem emulsificado com sabão potássico (5 mL/L Óleo + 3 mL/L Sabão) aplicado à noite ou luzes apagadas.'
    ],
    chemicalOrMineral: [
      'Enxofre Molhável (Jadam JS) - ATENÇÃO: Nunca aplicar enxofre em até 14 dias após uso de óleos para evitar queima foliar.'
    ],
    severity: 'Alta',
    imageUrl: '/images/pests/spidermite.jpg',
    images: [
      '/images/pests/spidermite.jpg',
      'https://images.unsplash.com/photo-1599598425947-320f3299c853?auto=format&fit=crop&w=600&q=80'
    ],
    pdfDriveUrl: DRIVE_PESTS_PDF
  },
  {
    id: 'pest-thrips',
    name: 'Trips / Tripes',
    scientificName: 'Frankliniella occidentalis',
    category: 'Inseto Sugador',
    identification: 'Insetos delgados e minúsculos (1-1.5mm) de cor amarela, marrom ou preta que se movem rapidamente. Deixam pequenas gotas de dejetos pretos e prateados.',
    damageSymptoms: [
      'Manchas prateadas com aspecto metálico/molhado nas folhas.',
      'Pequenos pontos pretos (fezes do inseto) espalhados sobre as manchas prateadas.',
      'Deformação de brotos novos e transmissão de vírus de plantas.'
    ],
    prevention: [
      'Colocação de Armadilhas Adesivas Azuis e Amarelas no dossel das plantas para monitoramento precoce.',
      'Tratamento preventivo do solo/substrato com nematóides benéficos.'
    ],
    biologicalControl: [
      'Ácaros predadores: Amblyseius swirskii ou Neoseiulus cucumeris.',
      'Percevejo predador: Orius insidiosus.',
      'Fungos entomopatogênicos: Beauveria bassiana e Metarhizium anisopliae.'
    ],
    organicRecipes: [
      'Pulverização foliar de Extrato de Nim + Extrato de Piretro Natural.',
      'Extrato de Mamona e JWA (Sabão de Potássio 10 mL/L).'
    ],
    chemicalOrMineral: [
      'Spinosade (derivado bacteriano orgânico registrado para agricultura orgânica).'
    ],
    severity: 'Média',
    imageUrl: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600&q=80',
    pdfDriveUrl: DRIVE_PESTS_PDF
  },
  {
    id: 'pest-fungus-gnats',
    name: 'Mosca do Fungo / Fungus Gnats',
    scientificName: 'Bradysia spp.',
    category: 'Praga do Solo',
    identification: 'Pequenos mosquitos pretos (2-4mm) que voam desordenadamente na superfície do solo/substrato. As larvas são vermes translúcidos de cabeça preta que vivem no solo úmido.',
    damageSymptoms: [
      'Larvas alimentam-se dos pelos radiculares e raízes jovens, enfraquecendo a absorção de nutrientes.',
      'Abertura de portas de entrada para fungos patogênicos de solo (Pythium, Fusarium, Phytophthora).',
      'Planta amarelada com crescimento estagnado.'
    ],
    prevention: [
      'Evitar sobre-rega! Permitir que os primeiros 2-3 cm do substrato sequem entre as regas.',
      'Cama de cobertura (Mulching) ou camada de 2 cm de areia de quartzo/perlita na superfície dos vasos.'
    ],
    biologicalControl: [
      'Bacillus thuringiensis israelensis (BTI) aplicado via rega (mata as larvas de gnats seletivamente).',
      'Nematóides entomopatogênicos: Steinernema feltiae.',
      'Ácaros de solo predadores: Stratiolaelaps scimitus (Hypoaspis miles).'
    ],
    organicRecipes: [
      'Rega com extrato de fumo/neem diluído ou terra de diatomáceas polvilhada na superfície seca do vaso.'
    ],
    chemicalOrMineral: [
      'Armadilhas adesivas amarelas na altura do vaso para capturar adultos.'
    ],
    severity: 'Média',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    pdfDriveUrl: DRIVE_PESTS_PDF
  },
  {
    id: 'pest-botrytis',
    name: 'Mofo Cinzento / Podridão dos Buds (Botrytis)',
    scientificName: 'Botrytis cinerea',
    category: 'Fungo/Bactéria',
    identification: 'Fungo destrutivo que ataca os botões florais (buds) mais densos na florarão avançada. Começa internamente no caule do bud e se espalha para fora.',
    damageSymptoms: [
      'Abertura e secagem repentina das pequenas folhas de açúcar que saem do bud.',
      'Interior do bud fica marrom, cinzento, mole e recoberto por um mofo aveludado cinza/esbranquiçado.',
      'Destruição rápida da inflorescência em poucas horas sob alta umidade.'
    ],
    prevention: [
      'Manter UR na florarão avançada abaixo de 45-50% e VPD entre 1.2 e 1.5 kPa.',
      'Garantir forte circulação de ar interna com ventiladores oscilantes (sem criar túnel de vento direto).',
      'Desfolha estratégica para melhorar penetração de luz e ar no dossel.'
    ],
    biologicalControl: [
      'Pulverização preventiva no vegetativo/início de floração com Trichoderma harzianum e Bacillus subtilis.'
    ],
    organicRecipes: [
      'Pós de rocha, Silica potássica e regas biofortificadas para espessamento da parede celular vegetal.'
    ],
    chemicalOrMineral: [
      'Remoção cirúrgica imediata das flores afetadas cortando 5cm abaixo da área infectada com tesoura esterilizada em álcool.'
    ],
    severity: 'Alta',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    pdfDriveUrl: DRIVE_PESTS_PDF
  },
  {
    id: 'pest-oidio',
    name: 'Oídio / Powdery Mildew',
    scientificName: 'Podosphaera macularis / Erysiphe cichoracearum',
    category: 'Fungo/Bactéria',
    identification: 'Manchas brancas talco/pó de giz na superfície superior das folhas que parecem farinha polvilhada.',
    damageSymptoms: [
      'Cobertura branca farinácea que impede a fotossíntese.',
      'Deformação foliar, amarelamento e necrose.',
      'Contaminação total da colheita se atingir os buds.'
    ],
    prevention: [
      'Controle rigoroso de umidade relativa (evitar picos acima de 70% no escuro).',
      'Uso de lâmpadas UV-C ou geradores de ozônio controlados na drenagem de ar.'
    ],
    biologicalControl: [
      'Bacillus amyloliquefaciens ou Bacillus subtilis pulverizado preventivamente.'
    ],
    organicRecipes: [
      'Leite cru / Soro de leite diluído em água (1:9) pulverizado sob luz solar direta (a luz interage com proteínas gerando peróxido nativo).',
      'Bicarbonato de Potássio ou Bicarbonato de Sódio (5g/L) + Sabão potássico.'
    ],
    chemicalOrMineral: [
      'JADAM JS (Jadam Sulfur) 1-2 mL/L no vegetativo.'
    ],
    severity: 'Alta',
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80',
    pdfDriveUrl: DRIVE_PESTS_PDF
  },
  {
    id: 'pest-cigarrinho',
    name: 'Cigarrinho-do-Milho (Vetor de Viroses)',
    scientificName: 'Dalbulus maidis',
    category: 'Inseto Sugador',
    identification: 'Pequenos insetos hemípteros (3mm) de cor palha/amarelada com duas manchas escuras na cabeça, que saltam e voam rapidamente ao menor toque no dossel.',
    damageSymptoms: [
      'Sucção de seiva elaborada gerando enfraquecimento das hastes e redução do vigor.',
      'Vetor crítico de Molicutes (Enfezamento Pálido e Enfezamento Vermelho) e Vírus do Mosaico (Rayado Fino).',
      'Folhas com estrias avermelhadas/purpúreas e superbrotamento deformado do topo.'
    ],
    prevention: [
      'Eliminação de hospedeiros intermediários e milho voluntário próximo ao cultivo.',
      'Telas anti-afídeos de malha fina (50 mesh) nas entradas de ar de estufas e insufladores.',
      'Armadilhas amarelas adesivas instaladas na altura dos brotos para monitoramento contínuo.'
    ],
    biologicalControl: [
      'Fungo entomopatogênico Cordyceps fumosorosea (Isaria fumosorosea) ou Beauveria bassiana.',
      'Percevejos predadores da família Anthocoridae e Crisopídeos (Chrysoperla externa).'
    ],
    organicRecipes: [
      'JWA (Sabão Potássico 15 mL/L) + Extrato de Neem/Piretro natural em pulverizações crepusculares.',
      'JHS (Jadam Herbal Solution) concentrado de alho e pimenta malagueta.'
    ],
    chemicalOrMineral: [
      'Extrato de azadiractina concentrada (1.2%) e silício foliar para endurecimento da cutícula.'
    ],
    severity: 'Alta',
    imageUrl: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600&q=80',
    pdfDriveUrl: DRIVE_PESTS_PDF
  },
  {
    id: 'pest-mosca-branca',
    name: 'Mosca-Branca',
    scientificName: 'Bemisia tabaci',
    category: 'Inseto Sugador',
    identification: 'Pequenos insetos voadores (1mm) com asas cobertas por uma cera branca farinácea que voam em nuvens quando as plantas são agitadas. Ninfas fixas na página inferior da folha.',
    damageSymptoms: [
      'Clorose foliar, amarelamento e queda prematura das folhas devido à sucção contínua de seiva.',
      'Secreção de melada açucarada ("honeydew") que favorece o surgimento do fungo de cobertura preta (Fumagina).',
      'Transmissão perigosa de Geminivírus e Carlavírus fitopatogênicos.'
    ],
    prevention: [
      'Barreiras físicas com tela guazé fina e armadilhas amarelas adesivas.',
      'Inspeção frequente da página abaxial (inferior) das folhas da base e terço médio.'
    ],
    biologicalControl: [
      'Vespinha parasitoide: Encarsia formosa ou Eretmocerus eremicus.',
      'Fungos entomopatogênicos: Beauveria bassiana e Lecanicillium lecanii.'
    ],
    organicRecipes: [
      'Aplicação de sabão potássico (JWA 15 mL/L) combinado com óleo vegetal de mamona emulsificado.',
      'Extrato de cinzas de madeira para alteração do pH foliar e repelência.'
    ],
    chemicalOrMineral: [
      'Terra de Diatomáceas micronizada via foliar (10g/L) criando barreira mecânica abrasiva.'
    ],
    severity: 'Alta',
    imageUrl: 'https://images.unsplash.com/photo-1599598425947-320f3299c853?auto=format&fit=crop&w=600&q=80',
    pdfDriveUrl: DRIVE_PESTS_PDF
  },
  {
    id: 'pest-acaro-branco',
    name: 'Ácaro Branco / Broad Mite',
    scientificName: 'Polyphagotarsonemus latus',
    category: 'Ácaro',
    identification: 'Ácaros microscópicos (<0.2mm) completamente invisíveis a olho nu, transparentes/esverdeados. Habitam os meristemas e brotos novos em crescimento.',
    damageSymptoms: [
      'Injeção de toxinas salivares potentes que causam deformação severa dos brotos novos.',
      'Folhas novas nascem retorcidas, rígidas, viradas para baixo com aparência de couro, plástico ou vidro queimado.',
      'Estagnação imediata do crescimento do topo sem teias visíveis.'
    ],
    prevention: [
      'Higiene absoluta dos operadores (troca de roupas entre salas de cultivo).',
      'Manter ventilação constante e evitar zonas mortas com calor e umidade represados.'
    ],
    biologicalControl: [
      'Ácaros predadores de topo: Neoseiulus californicus e Amblyseius swirskii (altamente eficientes no controle de P. latus).'
    ],
    organicRecipes: [
      'Enxofre molhável JADAM JS (1.5 mL/L) pulverizado a cada 3 dias por 2 semanas (interromper no uso de óleos).',
      'Banhos fitoquímicos com óleo de neem de prensagem a frio emulsificado com sabão orgânico.'
    ],
    chemicalOrMineral: [
      'Tratamento térmico de imersão de estacas (43°C por 15 minutos) antes do plantio.'
    ],
    severity: 'Alta',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    pdfDriveUrl: DRIVE_PESTS_PDF
  },
  {
    id: 'pest-nematoide-galhas',
    name: 'Nematoide das Galhas',
    scientificName: 'Meloidogyne incognita / Meloidogyne javanica',
    category: 'Nematoide',
    identification: 'Vermes microscópicos de solo que penetram o sistema radicular e estabelecem sítios de alimentação fixos, induzindo a hipertrofia das células radiculares.',
    damageSymptoms: [
      'Formação de engrossamentos e nódulos nas raízes ("galhas" ou batatas radiculares).',
      'Incapacidade total da planta de absorver água e nutrientes, causando murchamento nas horas quentes.',
      'Nanismo severo, sintomas de deficiência nutricional múltipla e amarelecimento precoce.'
    ],
    prevention: [
      'Solarização do solo antes do cultivo ou pasteurização a vapor de substratos reutilizados.',
      'Uso de substrato limpo e inspecionado com adubação de matéria orgânica bem curada.'
    ],
    biologicalControl: [
      'Bactéria nematicida: Bacillus chitinosporus e Bacillus methylotrophicus.',
      'Fungos nematófagos: Purpureocillium lilacinum (Paecilomyces lilacinus) e Pochonia chlamydosporia.'
    ],
    organicRecipes: [
      'Torta de Neem / Farinha de Mamona incorporada ao substrato (libera compostos nematicidas bioativos durante a decomposição).',
      'Chá de composto rico em microbiologia antagônica e extrato fúlvico de rocha.'
    ],
    chemicalOrMineral: [
      'Inoculação de Micorrizas Arbusculares para competição por espaço nas raízes.'
    ],
    severity: 'Alta',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    pdfDriveUrl: DRIVE_PESTS_PDF
  },
  {
    id: 'pest-nematoide-lesoes',
    name: 'Nematoide das Lesões Radiculares',
    scientificName: 'Pratylenchus penetrans / Pratylenchus brachyurus',
    category: 'Nematoide',
    identification: 'Nematoides endoparasitas migratórios que se movem livremente por dentro e por fora das raízes, destruindo as células do córtex radicular.',
    damageSymptoms: [
      'Formação de lesões necróticas escuras e pálidas ao longo de toda a extensão das raízes finas.',
      'Destruição e apodrecimento das radicelas absorventes.',
      'Entrada aberta facilitada para fungos necrotróficos de solo (Fusarium oxysporum e Pythium ultimum).'
    ],
    prevention: [
      'Plantio de adubação verde de cobertura nematicida como Crotalária (Crotalaria spectabilis) ou Tagetes (Tagetes patula).',
      'Rotação de culturas e uso de biocarvão (Biochar) no solo.'
    ],
    biologicalControl: [
      'Fungos armadilha de nematoides: Arthrobotrys oligospora.',
      'Bactéria de rizosfera: Pasteuria penetrans e Bacillus firmus.'
    ],
    organicRecipes: [
      'Aplicação de JADAM JHS de alho/pimenta em drench no substrato (0.5%).',
      'Incorporação de palhada de brássicas (Mostarda/Nabo) para biofumigação orgânica do solo.'
    ],
    chemicalOrMineral: [
      'Aplicação de silício solúvel via rega para fortificação da epiderme radicular.'
    ],
    severity: 'Alta',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    pdfDriveUrl: DRIVE_PESTS_PDF
  }
];
