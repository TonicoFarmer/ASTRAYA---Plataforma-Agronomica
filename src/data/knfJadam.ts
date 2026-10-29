import { KnfJadamRecipe } from '../types';

export const INITIAL_KNF_JADAM_RECIPES: KnfJadamRecipe[] = [
  {
    id: 'knf-fpj',
    method: 'KNF',
    name: 'FPJ - Fermented Plant Juice (Suco Vegetal Fermentado)',
    description: 'Extrato fermentado de brotos jovens de crescimento rápido (ex: broto de bambu, tithonia, urtiga, broto de cannabis) rico em hormônios vegetais de crescimento (auxinas, giberelinas) e enzimas.',
    ingredients: [
      { name: 'Brotos verdes e tenros colhidos antes do nascer do sol', ratio: '1 parte em peso' },
      { name: 'Açúcar mascavo não refinado (Mascavo puro)', ratio: '1 parte em peso (Proporção 1:1)' }
    ],
    steps: [
      'Colha as pontas de broto vegetal fresco sem lavar para preservar os microorganismos nativos da superfície foliar.',
      'Pique o material vegetal em pedaços de 2 a 5 cm.',
      'Misture homogeneamente com a mesma quantidade em peso de açúcar mascavo.',
      'Coloque num pote de vidro ou cerâmica preenchendo até 2/3 da capacidade.',
      'Cubra com papel respirável (papel toalha ou pano de algodão) e amarre com elástico.',
      'Fermente em local fresco e escuro por 7 a 10 dias.',
      'Coe o líquido denso e escuro e armazene em frasco de vidro semi-aberto.'
    ],
    applicationDosage: '1 mL por Litro de água (1:1000) em rega ou foliar semanal durante a fase Vegetativa.',
    benefits: [
      'Estimula o enraizamento e alongamento celular saudável.',
      'Aumenta a imunidade da planta contra estresses térmicos.',
      'Fornece nitrogênio bio-assimilável e fitohormônios nativos.'
    ]
  },
  {
    id: 'knf-lab',
    method: 'KNF',
    name: 'LAB - Lactic Acid Bacteria (Bactérias do Ácido Láctico)',
    description: 'Cultura concentrada de Lactobacillus benéficos que solubilizam nutrientes, suprimem patógenos anaeróbicos de solo (Pythium/Fusarium) e aceleram a decomposição orgânica.',
    ingredients: [
      { name: 'Água de lavagem de arroz (rica em amido)', ratio: '1 Litro' },
      { name: 'Leite cru integral ou pasteurizado de boa qualidade', ratio: '10 Litros (Proporção 1:10)' },
      { name: 'Melaço de cana ou açúcar mascavo para conservação', ratio: '1 parte para 1 parte de LAB purificado' }
    ],
    steps: [
      'Lave o arroz em água não clorada e recolha o líquido turvo (água de arroz). Fermente em vidro por 3-5 dias até aroma levemente azedo.',
      'Misture 1 parte desse fermentado de arroz para 10 partes de leite fresco num recipiente coberto.',
      'Aguarde de 5 a 7 dias até que o leite coalhe e se separe em uma camada sólida superior (queijo/soro) e um líquido transparente amarelado inferior (soro de LAB).',
      'Filtre o soro amarelo transparente (este é o LAB concentrado).',
      'Misture em partes iguais com melaço de cana para estabilizar e guardar na geladeira por até 1 ano.'
    ],
    applicationDosage: '1 mL a 2 mL por Litro de água (1:1000 a 1:500) via solo/substrato ou pulverização de cobertura.',
    benefits: [
      'Elimina maus odores de compostagem e previne podridão radicular.',
      'Melhora a solubilidade de Cálcio e Fósforo no solo.',
      'Fortalece a microbiologia da rizosfera.'
    ]
  },
  {
    id: 'jadam-jms',
    method: 'JADAM',
    name: 'JMS - Jadam Microorganism Solution (Solução de Microorganismos Jadam)',
    description: 'Cultivo de baixo custo de microorganismos nativos diversificados do solo florestal (humus de mata) multiplicado com batata cozida e sal marinho.',
    ingredients: [
      { name: 'Água sem cloro (de chuva, poço ou desclorada)', ratio: '500 Litros (ou escala para 20L)' },
      { name: 'Solo de floresta/Mata nativa ou Húmus de minhoca maduro', ratio: '500g em saquinho de pano' },
      { name: 'Batata inglesa cozida com casca e amassada', ratio: '500g' },
      { name: 'Sal marinho grosso sem iodo ou água de mar', ratio: '500g de sal marinho' }
    ],
    steps: [
      'Cozinhe as batatas até ficarem bem macias e amasse-as dentro de um saco de pano fino com o sal marinho.',
      'Mergulhe o saco de batata e o saco com solo de floresta num tambor com água sem cloro.',
      'Massageie ambos os sacos dentro da água por 5 minutos para liberar a amido e os microorganismos nativos.',
      'Tampe o recipiente sem vedar hermeticamente e deixe em temperatura ambiente (20-30°C).',
      'Em 24 a 72 horas, formará uma densa espuma na superfície com aroma agradável de fermento. É o ponto máximo de multiplicação!'
    ],
    applicationDosage: 'Usar puro ou diluído em até 1:10 em regas abundantes no solo antes e durante o cultivo.',
    benefits: [
      'Restaura a biodiversidade do microbioma do solo.',
      'Previne o surgimento de patógenos por exclusão competitiva.',
      'Totalmente gratuito, utilizando matérias-primas locais.'
    ]
  },
  {
    id: 'jadam-jwa',
    method: 'JADAM',
    name: 'JWA - Jadam Wetting Agent (Espalhante Adesivo / Sabão Potássico Jadam)',
    description: 'Sabão biodegradável de óleo vegetal e hidróxido de potássio (KOH) que atua como surfactante natural, biodegradável e defensivo contra ácaros, pulgões e moscas.',
    ingredients: [
      { name: 'Óleo vegetal de canola, girassol ou soja', ratio: '1.8 Litros' },
      { name: 'Hidróxido de Potássio (KOH 90% em escamas)', ratio: '320 gramas' },
      { name: 'Água macia (água de chuva ou osmose reversa)', ratio: '1.2 Litros + 10 Litros' }
    ],
    steps: [
      'Em recipiente resistente ao calor, dissolva o KOH em 1.2L de água macia (reação exotérmica - use EPIs: luvas e óculos).',
      'Adicione o óleo vegetal e bata com mixer industrial/doméstico por 10-15 minutos até formar uma emulsão espessa parecida com maionese/manteiga.',
      'Deixe descansar fechado por 3 dias para saponificação completa.',
      'Adicione os 10L de água macia restantes em etapas, misturando para dissolver a pasta sólida até formar um líquido viscoso âmbar dourado.'
    ],
    applicationDosage: '10 a 15 mL por Litro de água como espalhante adesivo para bioinsumos e controle de insetos de corpo mole.',
    benefits: [
      'Dissolve a camada cerosa protetora de pragas sem danificar a folha.',
      'Melhora a cobertura foliar de biocontroles e fertilizantes foliares.',
      '100% ecológico e livre de surfactantes sintéticos de petróleo.'
    ]
  },
  {
    id: 'kyusei-em1',
    method: 'KYUSEI EM',
    name: 'EM-1 / Bokashi Ativado (Microorganismos Eficientes Kyusei)',
    description: 'Inóculo formulado pelo Prof. Teruo Higa contendo bactérias fototróficas, bactérias do ácido láctico e leveduras em equilíbrio para revitalização do solo e fertilização orgânica.',
    ingredients: [
      { name: 'Inóculo EM-1 Mãe', ratio: '50 mL' },
      { name: 'Melaço de cana não sulfurado', ratio: '50 mL' },
      { name: 'Água sem cloro morna (30°C)', ratio: '1 Litro' }
    ],
    steps: [
      'Misture o melaço na água morna sem cloro até dissolver completamente.',
      'Adicione o inóculo EM-1 e misture suavemente.',
      'Despeje em garrafa PET escura deixando 2 cm de câmara de ar.',
      'Feche a tampa e deixe fermentar por 7 dias em ambiente morno (25-30°C), aliviando o gás acumulado a cada 2 dias.',
      'Quando o pH atingir valor abaixo de 3.8 com aroma agridoce característico, o EM Ativado está pronto.'
    ],
    applicationDosage: '2 mL a 5 mL por Litro em regas de solo ou 1 mL/L em pulverização foliar.',
    benefits: [
      'Acelera a humificação de matéria orgânica no solo.',
      'Aumenta a disponibilidade de micro e macronutrientes complexados.',
      'Proporciona maior resistência a patógenos de solo.'
    ]
  },
  {
    id: 'kyusei-em5',
    method: 'KYUSEI EM',
    name: 'EM5 - Defensivo Repelente Kyusei EM',
    description: 'Extrato natural repelente e preventivo fito-sanitário obtido através da fermentação anaeróbica do EM-1 com cachaça/aguardente, vinagre orgânico e melaço.',
    ingredients: [
      { name: 'Inóculo EM-1 Ativado ou Mãe', ratio: '100 mL' },
      { name: 'Melaço de cana-de-açúcar puro', ratio: '100 mL' },
      { name: 'Aguardente de cana / Cachaça (35-40% álcool)', ratio: '100 mL' },
      { name: 'Vinagre de maçã natural (ácido acético 5%)', ratio: '100 mL' },
      { name: 'Água desclorada / sem cloro', ratio: '600 mL (Total 1 Litro)' },
      { name: 'Opcional: Alho, Pimenta Malagueta ou Ervas Medicinais picadas', ratio: '50g' }
    ],
    steps: [
      'Dissolva o melaço de cana na água sem cloro morna em uma garrafa limpa.',
      'Adicione o vinagre, a cachaça e o inóculo EM-1, misturando delicadamente.',
      'Adicione os botânicos picados (alho e pimenta) se desejar ação inseticida turbinada.',
      'Sela a garrafa hermeticamente e fermente por 7 a 10 dias em local escuro e morno (25-30°C).',
      'Abra a garrafa diariamente nos primeiros 4 dias para liberar o gás acumulado.',
      'O EM5 está pronto quando cessar a produção de gás, com aroma alcoólico-agridoce e pH < 3.5.'
    ],
    applicationDosage: '2 mL a 5 mL por Litro de água (1:500 a 1:200) em pulverização foliar crepuscular a cada 7 a 14 dias.',
    benefits: [
      'Cria uma película biológica protetora na cutícula da folha impedindo a germinação de esporos de fungos.',
      'Ação repelente eficaz contra moscas, tripes, pulgões e lagartas.',
      'Estimula o fortalecimento dos tecidos epidérmicos da planta.'
    ]
  },
  {
    id: 'knf-faa',
    method: 'KNF',
    name: 'FAA - Fish Amino Acid (Aminoácidos de Peixe KNF)',
    description: 'Extrato líquido fermentado de peixe rico em Nitrogênio orgânico de rápida absorção, aminoácidos essenciais (ácido glutâmico, glicina) e oligoelementos marinhas.',
    ingredients: [
      { name: 'Resíduos frescos de peixe (cabeças, vísceras, espinhas e pele)', ratio: '1 parte em peso (1 kg)' },
      { name: 'Açúcar mascavo puro ou rapadura moída', ratio: '1 parte em peso (1 kg)' },
      { name: 'Opcional: Microorganismos de solo (IMO-3 ou LAB)', ratio: '10 mL para acelerar' }
    ],
    steps: [
      'Pique o material de peixe fresco em pedaços pequenos com faca limpa.',
      'Misture o peixe com a mesma quantidade exata de açúcar mascavo em um balde plástico.',
      'Pressione o material para o fundo e cubra a superfície com mais 1 cm de açúcar mascavo seco.',
      'Cubra o balde com pano ou papel poroso preso com elástico (processo com oxigenação inicial).',
      'Deixe fermentar por 3 a 6 meses em local fresco. O açúcar desidrata o peixe osmoticamente, liquazendo o tecido sem maus odores.',
      'Coe o líquido denso amarronzado escuro. Armazene o FAA em frascos de vidro ou PET.'
    ],
    applicationDosage: '1 mL por Litro de água (1:1000) em regas de solo ou via foliar no crescimento Vegetativo.',
    benefits: [
      'Acelera o crescimento vegetativo de caules e folhas com Nitrogênio bio-assimilável.',
      'Alimenta e multiplica os fungos e bactérias benéficas da rizosfera.',
      'Promove folhas verdes escuras espessas e de alta eficiência fotossintética.'
    ]
  },
  {
    id: 'knf-ffj',
    method: 'KNF',
    name: 'FFJ - Fermented Fruit Juice (Suco de Frutas Fermentado KNF)',
    description: 'Elixir fermentado de frutas doces maduras (mamão, banana, abóbora, melão) riquíssimo em Potássio bio-disponível, açúcares complexos e hormônios de floração.',
    ingredients: [
      { name: 'Frutas doces e bem maduras (banana com casca, mamão, abóbora)', ratio: '1 parte em peso' },
      { name: 'Açúcar mascavo não refinado', ratio: '1 parte em peso (Proporção 1:1)' }
    ],
    steps: [
      'Pique as frutas bem maduras com casca e sementes em fatias finas.',
      'Misture as frutas fatiadas homogeneamente com o açúcar mascavo.',
      'Preencha 2/3 de um pote de fermentação e cubra a parte superior com papel respirável.',
      'Deixe fermentar em local escuro por 7 a 10 dias.',
      'Filtre o xarope dourado perfumado e guarde em recipientes respiráveis.'
    ],
    applicationDosage: '1 mL a 2 mL por Litro de água (1:1000 a 1:500) aplicado do início até a metade da Fase de Floração.',
    benefits: [
      'Potencializa o engorda, densidade e aroma dos frutos/flores medicinais.',
      'Fornece Potássio e Boro biodisponíveis para translocação de açúcares.',
      'Melhora a síntese e perfil aromático de terpenos.'
    ]
  },
  {
    id: 'jadam-biopesticide',
    name: 'JADAM Biopesticide - Sistema Defensivo Completo (JWA + JS + JHS)',
    method: 'JADAM',
    description: 'Formulação ecológica de altíssima eficiência sinérgica combinando o espalhante adhesivo JWA, o fungicida enxofre JS e o extrato herbal inseticida JHS.',
    ingredients: [
      { name: 'JWA (Jadam Wetting Agent - Sabão Potássico)', ratio: '10 a 15 mL/L' },
      { name: 'JS (Jadam Sulfur - Enxofre Solúvel Jadam)', ratio: '1.2 a 2 mL/L' },
      { name: 'JHS (Jadam Herbal Solution - Extrato de Alho/Pimenta)', ratio: '5 a 10 mL/L' },
      { name: 'Água macia sem sais de cálcio (de chuva ou RO)', ratio: '1 Litro' }
    ],
    steps: [
      'Meça a água macia limpa no tanque do pulverizador.',
      'Adicione primeiro o JWA (Sabão) e misture energicamente para condicionar a água.',
      'Adicione o JHS (Extrato de Pimenta/Alho/Quina) e continue agitando.',
      'Por último, adicione o JS (Enxofre) e misture até homogeneização completa.',
      'Pulverize em névoa fina cobrindo a página superior e inferior de todas as folhas no crepúsculo.'
    ],
    applicationDosage: 'Pulverização foliar completa no vegetativo a cada 7-10 dias (Nunca aplicar JS em flores formadas ou sob sol forte).',
    benefits: [
      'Controle de espectro total contra Ácaros, Trips, Lagartas, Moscas e Cochonilhas.',
      'Eliminação instantânea de fungos foliares como Oídio e Ferrugem.',
      'Custo centagioso por litro comparado a defensivos sintéticos comerciais.'
    ]
  }
];
