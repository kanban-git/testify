export interface ScoreResult {
  totalScore: number;
  maxScore: number;
  percentile: number;
  resultTitle: string;
  resultSummary: string;
  fullReport: FullReport;
}

export interface FullReport {
  sections: ReportSection[];
  disclaimer: string;
}

export interface ReportSection {
  title: string;
  content: string;
  type?: 'text' | 'traits' | 'list' | 'styles' | 'environments';
  items?: string[];
  traits?: { name: string; level: number }[];
  styles?: { name: string; level: number }[];
}

// ======================== TRAIT MAPS (question index → trait) ========================

const QUIZ_TRAITS: Record<string, { traits: Record<string, number[]>; profiles: { traits: string[]; name: string; desc: string }[] }> = {
  'perfil-de-raciocinio': {
    traits: {
      'Raciocínio analítico': [0, 7, 19],
      'Pensamento estratégico': [4, 2, 17],
      'Curiosidade intelectual': [9, 13, 15],
      'Flexibilidade mental': [1, 12, 11],
      'Atenção a detalhes': [7, 0, 5],
      'Organização do pensamento': [3, 16, 10],
      'Tomada de decisão': [2, 17, 18],
      'Pensamento abstrato': [1, 12, 14],
      'Capacidade de aprendizado': [13, 5, 9],
      'Criatividade cognitiva': [12, 11, 1],
    },
    profiles: [
      { traits: ['Raciocínio analítico', 'Pensamento estratégico'], name: 'Analítico Estratégico', desc: 'Você processa informações de forma metódica e estruturada, com forte capacidade de planejamento e análise sistemática. Seu estilo cognitivo combina precisão analítica com visão estratégica.' },
      { traits: ['Organização do pensamento', 'Atenção a detalhes'], name: 'Estruturado Observador', desc: 'Você possui um pensamento organizado e atento aos detalhes, com capacidade natural de identificar padrões e manter clareza em situações complexas.' },
      { traits: ['Flexibilidade mental', 'Criatividade cognitiva'], name: 'Criativo Adaptável', desc: 'Seu perfil demonstra grande flexibilidade mental e capacidade criativa, permitindo que você encontre soluções inovadoras e se adapte facilmente a novos contextos.' },
      { traits: ['Tomada de decisão', 'Raciocínio analítico'], name: 'Decisivo Analítico', desc: 'Você combina capacidade analítica com assertividade na tomada de decisão, processando informações com eficiência para chegar a conclusões fundamentadas.' },
      { traits: ['Curiosidade intelectual', 'Capacidade de aprendizado'], name: 'Explorador Intelectual', desc: 'Sua forte curiosidade intelectual aliada à capacidade de aprendizado faz de você alguém que busca constantemente expandir seus conhecimentos e compreender o mundo.' },
    ],
  },
  'cerebro-acima-da-media': {
    traits: {
      'Raciocínio analítico': [2, 11, 14],
      'Pensamento estratégico': [14, 8, 16],
      'Curiosidade intelectual': [0, 1, 19],
      'Flexibilidade mental': [7, 18, 5],
      'Atenção a detalhes': [11, 15, 16],
      'Organização do pensamento': [15, 3, 16],
      'Tomada de decisão': [2, 8, 14],
      'Pensamento abstrato': [12, 18, 7],
      'Capacidade de aprendizado': [0, 4, 10],
      'Criatividade cognitiva': [18, 7, 5],
    },
    profiles: [
      { traits: ['Curiosidade intelectual', 'Capacidade de aprendizado'], name: 'Mente Expansiva', desc: 'Você possui uma mente naturalmente curiosa e absorvente, com capacidade excepcional de processar e integrar novos conhecimentos de forma rápida e eficiente.' },
      { traits: ['Pensamento abstrato', 'Raciocínio analítico'], name: 'Pensador Profundo', desc: 'Seu perfil revela um processamento cognitivo profundo, com habilidade para lidar com conceitos abstratos e análises complexas que muitos não conseguem acompanhar.' },
      { traits: ['Flexibilidade mental', 'Criatividade cognitiva'], name: 'Inovador Versátil', desc: 'Sua mente funciona de forma não linear e criativa, conectando ideias de diferentes domínios para gerar insights originais e soluções inovadoras.' },
      { traits: ['Organização do pensamento', 'Atenção a detalhes'], name: 'Analista Preciso', desc: 'Você combina organização mental com atenção aos detalhes, processando informações com uma precisão que permite compreender nuances que passam despercebidas.' },
    ],
  },
  'personalidade-profunda': {
    traits: {
      'Raciocínio analítico': [2, 18, 11],
      'Pensamento estratégico': [11, 19, 5],
      'Curiosidade intelectual': [12, 14, 9],
      'Flexibilidade mental': [7, 10, 15],
      'Atenção a detalhes': [2, 8, 18],
      'Organização do pensamento': [15, 8, 11],
      'Tomada de decisão': [19, 11, 5],
      'Pensamento abstrato': [0, 14, 12],
      'Capacidade de aprendizado': [7, 10, 17],
      'Criatividade cognitiva': [0, 6, 14],
    },
    profiles: [
      { traits: ['Pensamento abstrato', 'Curiosidade intelectual'], name: 'Introspectivo Profundo', desc: 'Você possui uma rica vida interior e capacidade excepcional de autorreflexão. Seu perfil indica alguém que busca compreender as camadas mais profundas da experiência humana.' },
      { traits: ['Capacidade de aprendizado', 'Flexibilidade mental'], name: 'Evolutivo Consciente', desc: 'Seu perfil demonstra uma busca constante por crescimento pessoal, com flexibilidade para integrar novas perspectivas e evoluir continuamente.' },
      { traits: ['Atenção a detalhes', 'Raciocínio analítico'], name: 'Observador Analítico', desc: 'Você combina sensibilidade emocional com capacidade analítica, permitindo compreender tanto a si mesmo quanto os outros com profundidade incomum.' },
      { traits: ['Organização do pensamento', 'Tomada de decisão'], name: 'Equilibrado Estratégico', desc: 'Seu perfil revela equilíbrio entre razão e emoção, com capacidade de organizar pensamentos e tomar decisões alinhadas com seus valores mais profundos.' },
    ],
  },
  'indicadores-de-tdah': {
    traits: {
      'Raciocínio analítico': [3, 10, 14],
      'Pensamento estratégico': [10, 14, 3],
      'Curiosidade intelectual': [11, 15, 7],
      'Flexibilidade mental': [11, 6, 15],
      'Atenção a detalhes': [0, 5, 19],
      'Organização do pensamento': [3, 13, 14],
      'Tomada de decisão': [10, 14, 4],
      'Pensamento abstrato': [11, 15, 7],
      'Capacidade de aprendizado': [8, 1, 18],
      'Criatividade cognitiva': [11, 15, 6],
    },
    profiles: [
      { traits: ['Flexibilidade mental', 'Criatividade cognitiva'], name: 'Mente Dinâmica', desc: 'Seu perfil sugere uma mente altamente dinâmica, com pensamento rápido e capacidade de fazer múltiplas conexões simultaneamente. Esse padrão pode trazer tanto desafios de foco quanto vantagens criativas.' },
      { traits: ['Curiosidade intelectual', 'Pensamento abstrato'], name: 'Explorador Inquieto', desc: 'Você demonstra curiosidade intensa e pensamento divergente, com tendência a explorar múltiplas ideias simultaneamente. Esse padrão é comum em mentes altamente criativas.' },
      { traits: ['Atenção a detalhes', 'Organização do pensamento'], name: 'Focado Seletivo', desc: 'Seu perfil indica capacidade de foco intenso em temas de interesse, com dificuldade variável em tarefas rotineiras. Esse padrão sugere atenção seletiva.' },
    ],
  },
  'perfil-psicologico-completo': {
    traits: {
      'Raciocínio analítico': [4, 9, 3],
      'Pensamento estratégico': [3, 8, 14],
      'Curiosidade intelectual': [18, 19, 6],
      'Flexibilidade mental': [2, 13, 16],
      'Atenção a detalhes': [8, 12, 4],
      'Organização do pensamento': [8, 12, 14],
      'Tomada de decisão': [3, 11, 4],
      'Pensamento abstrato': [18, 6, 19],
      'Capacidade de aprendizado': [19, 16, 2],
      'Criatividade cognitiva': [2, 13, 6],
    },
    profiles: [
      { traits: ['Tomada de decisão', 'Flexibilidade mental'], name: 'Resiliente Adaptável', desc: 'Seu perfil demonstra alta capacidade de adaptação e resiliência emocional, com habilidade para tomar decisões assertivas mesmo sob pressão.' },
      { traits: ['Organização do pensamento', 'Atenção a detalhes'], name: 'Disciplinado Focado', desc: 'Você possui forte disciplina mental e capacidade de manter foco em objetivos de longo prazo, com organização que sustenta consistência nas suas ações.' },
      { traits: ['Curiosidade intelectual', 'Pensamento abstrato'], name: 'Visionário Empático', desc: 'Seu perfil combina visão de futuro com compreensão profunda do comportamento humano, permitindo que você navegue situações complexas com sabedoria.' },
      { traits: ['Raciocínio analítico', 'Pensamento estratégico'], name: 'Estrategista Equilibrado', desc: 'Você combina estabilidade emocional com pensamento estratégico, criando um perfil que se destaca em situações que exigem clareza e liderança.' },
    ],
  },
};

// ======================== CORE SCORING ========================

function computeTraitLevels(responses: { score_value: number }[], traitMap: Record<string, number[]>): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [trait, indices] of Object.entries(traitMap)) {
    let total = 0;
    for (const idx of indices) {
      total += responses[idx]?.score_value || 3;
    }
    // Normalize to 0-100
    const max = indices.length * 5;
    result[trait] = Math.round((total / max) * 100);
  }
  return result;
}

function pickProfile(traitLevels: Record<string, number>, profiles: { traits: string[]; name: string; desc: string }[]): { name: string; desc: string } {
  let best = profiles[0];
  let bestScore = -1;
  for (const p of profiles) {
    const avg = p.traits.reduce((s, t) => s + (traitLevels[t] || 50), 0) / p.traits.length;
    if (avg > bestScore) { bestScore = avg; best = p; }
  }
  return best;
}

function generatePercentile(traitLevels: Record<string, number>): number {
  const avg = Object.values(traitLevels).reduce((s, v) => s + v, 0) / Object.values(traitLevels).length;
  // Map average (20-100) to percentile (45-97)
  return Math.min(97, Math.max(45, Math.round(avg * 0.65 + 30 + Math.random() * 8)));
}

// ======================== REPORT GENERATORS ========================

function getThinkingStyle(traitLevels: Record<string, number>): string {
  const analytical = traitLevels['Raciocínio analítico'] || 50;
  const strategic = traitLevels['Pensamento estratégico'] || 50;
  const abstract = traitLevels['Pensamento abstrato'] || 50;
  const creative = traitLevels['Criatividade cognitiva'] || 50;
  const flexibility = traitLevels['Flexibilidade mental'] || 50;

  if (analytical > 70 && strategic > 65) {
    return 'Você tende a abordar problemas de forma sistemática e estruturada, decomponho situações complexas em partes menores e analisando cada componente antes de formar uma conclusão. Seu estilo de pensamento privilegia a lógica e a evidência, buscando sempre fundamentar suas decisões em dados concretos. Em situações de pressão, você mantém a capacidade de raciocinar com clareza, o que lhe permite encontrar soluções eficientes mesmo em cenários desafiadores.';
  } else if (creative > 70 && flexibility > 65) {
    return 'Seu estilo de pensamento é predominantemente criativo e divergente. Você naturalmente faz conexões entre ideias de domínios diferentes, gerando insights que outros dificilmente perceberiam. Sua mente funciona de forma não linear, explorando múltiplas possibilidades antes de se comprometer com uma solução. Essa abordagem lhe confere uma vantagem significativa em situações que exigem inovação e adaptabilidade.';
  } else if (abstract > 70) {
    return 'Você possui um estilo de pensamento profundo e reflexivo, com facilidade para lidar com conceitos abstratos e teóricos. Sua mente busca naturalmente compreender os princípios subjacentes às situações, indo além da superfície para encontrar significados mais profundos. Esse padrão cognitivo permite que você desenvolva compreensões sofisticadas sobre temas complexos.';
  } else {
    return 'Seu estilo de pensamento é equilibrado, combinando elementos analíticos e intuitivos de forma flexível. Você adapta sua abordagem cognitiva de acordo com a situação, alternando entre análise detalhada e visão mais ampla conforme a necessidade. Essa versatilidade lhe permite lidar eficazmente com uma ampla variedade de desafios, tanto no âmbito pessoal quanto profissional.';
  }
}

function getPotentials(traitLevels: Record<string, number>): string[] {
  const sorted = Object.entries(traitLevels).sort((a, b) => b[1] - a[1]);
  const potentials: string[] = [];
  const mapping: Record<string, string> = {
    'Raciocínio analítico': 'Potencial analítico elevado',
    'Pensamento estratégico': 'Potencial estratégico e de planejamento',
    'Curiosidade intelectual': 'Curiosidade intelectual acima da média',
    'Flexibilidade mental': 'Alta adaptabilidade cognitiva',
    'Atenção a detalhes': 'Capacidade de observação refinada',
    'Organização do pensamento': 'Clareza e organização mental',
    'Tomada de decisão': 'Assertividade na tomada de decisão',
    'Pensamento abstrato': 'Pensamento conceitual avançado',
    'Capacidade de aprendizado': 'Capacidade de aprendizado acelerada',
    'Criatividade cognitiva': 'Potencial criativo e inovador',
  };
  for (const [trait] of sorted.slice(0, 5)) {
    potentials.push(mapping[trait] || trait);
  }
  return potentials;
}

function getRealLifeText(profileName: string, traitLevels: Record<string, number>): string {
  const high = Object.entries(traitLevels).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);

  return `No ambiente de **trabalho**, seu perfil ${profileName} tende a se manifestar como uma capacidade natural de ${high.includes('Raciocínio analítico') ? 'analisar dados e encontrar soluções baseadas em evidências' : high.includes('Criatividade cognitiva') ? 'propor abordagens inovadoras e soluções criativas' : 'organizar processos e manter a qualidade das entregas'}. Colegas provavelmente o reconhecem como alguém ${high.includes('Pensamento estratégico') ? 'estratégico e com visão de longo prazo' : 'confiável e consistente nas entregas'}.

Nos **estudos**, você provavelmente se destaca em ${high.includes('Capacidade de aprendizado') ? 'absorver novos conceitos rapidamente e fazer conexões interdisciplinares' : high.includes('Atenção a detalhes') ? 'compreender nuances e detalhes que outros ignoram' : 'manter consistência e disciplina no aprendizado'}. Seu estilo de aprendizado é mais eficiente quando ${high.includes('Pensamento abstrato') ? 'você tem liberdade para explorar conceitos teóricos' : 'o conteúdo é apresentado de forma estruturada e aplicável'}.

Na **resolução de problemas**, você tende a ${high.includes('Flexibilidade mental') ? 'considerar múltiplas perspectivas antes de agir, o que pode demorar mais mas gera soluções mais completas' : 'ir direto ao ponto com eficiência, priorizando soluções práticas e implementáveis'}. Nas **decisões** importantes, seu perfil indica ${high.includes('Tomada de decisão') ? 'confiança e assertividade, com capacidade de assumir riscos calculados' : 'reflexão cuidadosa, ponderando prós e contras antes de se comprometer'}.`;
}

function getStrengths(traitLevels: Record<string, number>): string[] {
  const sorted = Object.entries(traitLevels).sort((a, b) => b[1] - a[1]);
  const strengths: Record<string, string[]> = {
    'Raciocínio analítico': ['Análise lógica e fundamentada', 'Capacidade de decompor problemas complexos'],
    'Pensamento estratégico': ['Visão de longo prazo', 'Planejamento eficaz'],
    'Curiosidade intelectual': ['Busca constante por conhecimento', 'Mente aberta a novas ideias'],
    'Flexibilidade mental': ['Adaptação rápida a mudanças', 'Pensamento divergente'],
    'Atenção a detalhes': ['Percepção aguçada', 'Precisão nas análises'],
    'Organização do pensamento': ['Clareza na comunicação', 'Estruturação eficiente de ideias'],
    'Tomada de decisão': ['Assertividade', 'Confiança sob pressão'],
    'Pensamento abstrato': ['Compreensão de conceitos complexos', 'Pensamento teórico avançado'],
    'Capacidade de aprendizado': ['Aprendizado rápido', 'Integração de conhecimentos diversos'],
    'Criatividade cognitiva': ['Geração de ideias originais', 'Conexões interdisciplinares'],
  };
  const result: string[] = [];
  for (const [trait] of sorted.slice(0, 5)) {
    result.push(...(strengths[trait] || [trait]));
  }
  return result.slice(0, 7);
}

function getDevelopmentAreas(traitLevels: Record<string, number>): string[] {
  const sorted = Object.entries(traitLevels).sort((a, b) => a[1] - b[1]);
  const areas: Record<string, string> = {
    'Raciocínio analítico': 'Exercitar mais a análise sistemática de problemas, buscando decompor situações complexas em componentes menores.',
    'Pensamento estratégico': 'Desenvolver o hábito de planejar com antecedência e considerar consequências de longo prazo.',
    'Curiosidade intelectual': 'Cultivar o hábito de questionar e explorar novos temas fora da sua zona de conforto.',
    'Flexibilidade mental': 'Praticar a consideração de perspectivas alternativas e abraçar mudanças como oportunidades.',
    'Atenção a detalhes': 'Desenvolver técnicas de revisão e checagem para capturar nuances importantes.',
    'Organização do pensamento': 'Implementar métodos de organização mental como mapas conceituais ou listas estruturadas.',
    'Tomada de decisão': 'Praticar decisões mais rápidas em situações de baixo risco para desenvolver confiança.',
    'Pensamento abstrato': 'Exercitar o pensamento conceitual através de leitura reflexiva e discussões filosóficas.',
    'Capacidade de aprendizado': 'Experimentar diferentes métodos de aprendizado para descobrir os mais eficientes para você.',
    'Criatividade cognitiva': 'Reservar tempo para brainstorming livre e exploração de ideias sem julgamento.',
  };
  const result: string[] = [];
  for (const [trait] of sorted.slice(0, 3)) {
    if (areas[trait]) result.push(areas[trait]);
  }
  return result;
}

function getProblemSolvingStyles(traitLevels: Record<string, number>): { name: string; level: number }[] {
  return [
    { name: 'Analítico', level: Math.round(((traitLevels['Raciocínio analítico'] || 50) + (traitLevels['Atenção a detalhes'] || 50)) / 2) },
    { name: 'Intuitivo', level: Math.round(((traitLevels['Pensamento abstrato'] || 50) + (traitLevels['Criatividade cognitiva'] || 50)) / 2) },
    { name: 'Estratégico', level: Math.round(((traitLevels['Pensamento estratégico'] || 50) + (traitLevels['Tomada de decisão'] || 50)) / 2) },
    { name: 'Exploratório', level: Math.round(((traitLevels['Curiosidade intelectual'] || 50) + (traitLevels['Flexibilidade mental'] || 50)) / 2) },
  ];
}

function getLearningStyles(traitLevels: Record<string, number>): { name: string; level: number }[] {
  return [
    { name: 'Visual', level: Math.round(((traitLevels['Atenção a detalhes'] || 50) + (traitLevels['Organização do pensamento'] || 50)) / 2) },
    { name: 'Analítico', level: Math.round(((traitLevels['Raciocínio analítico'] || 50) + (traitLevels['Pensamento estratégico'] || 50)) / 2) },
    { name: 'Exploratório', level: Math.round(((traitLevels['Curiosidade intelectual'] || 50) + (traitLevels['Criatividade cognitiva'] || 50)) / 2) },
    { name: 'Estruturado', level: Math.round(((traitLevels['Organização do pensamento'] || 50) + (traitLevels['Atenção a detalhes'] || 50)) / 2) },
  ];
}

function getEnvironments(traitLevels: Record<string, number>): string[] {
  const envs: string[] = [];
  const sorted = Object.entries(traitLevels).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 4).map(e => e[0]);
  if (top.includes('Raciocínio analítico')) envs.push('Ambientes que exigem análise de dados e resolução de problemas');
  if (top.includes('Pensamento estratégico')) envs.push('Situações que demandam planejamento e visão de longo prazo');
  if (top.includes('Curiosidade intelectual')) envs.push('Contextos de aprendizado contínuo e inovação');
  if (top.includes('Flexibilidade mental')) envs.push('Ambientes dinâmicos com mudanças frequentes');
  if (top.includes('Criatividade cognitiva')) envs.push('Projetos criativos e desenvolvimento de novas soluções');
  if (top.includes('Organização do pensamento')) envs.push('Funções que exigem estruturação e gestão de processos');
  if (top.includes('Tomada de decisão')) envs.push('Posições de liderança e gestão de equipes');
  if (top.includes('Capacidade de aprendizado')) envs.push('Áreas de pesquisa e desenvolvimento intelectual');
  return envs.slice(0, 5);
}

function getComparisonText(percentile: number, profileName: string): string {
  if (percentile >= 85) {
    return `Suas respostas posicionam seu perfil entre os mais diferenciados da nossa base de participantes. O perfil ${profileName} na intensidade demonstrada nas suas respostas aparece em menos de ${100 - percentile}% dos respondentes. Isso não indica superioridade, mas sim um padrão cognitivo bem definido e consistente, que pode ser um diferencial significativo quando aplicado nos contextos certos.`;
  } else if (percentile >= 65) {
    return `Seu perfil ${profileName} demonstra características que se destacam em relação à maioria dos participantes. Aproximadamente ${percentile}% dos respondentes apresentaram padrões menos definidos nas áreas em que você se sobressai. Esse nível de clareza no perfil cognitivo indica autoconhecimento e consistência nos seus padrões de pensamento.`;
  } else {
    return `Seu perfil ${profileName} apresenta uma distribuição equilibrada de traços cognitivos, o que indica versatilidade. Aproximadamente ${percentile}% dos participantes mostraram padrões similares. Essa distribuição sugere que você consegue transitar entre diferentes estilos de pensamento conforme a situação exige, o que é uma habilidade valiosa em ambientes diversos.`;
  }
}

function getFinalInterpretation(profileName: string, traitLevels: Record<string, number>, quizSlug: string): string {
  const sorted = Object.entries(traitLevels).sort((a, b) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3).map(e => e[0]);
  const lowest = sorted.slice(-2).map(e => e[0]);

  const isTDAH = quizSlug === 'indicadores-de-tdah';

  if (isTDAH) {
    return `A análise das suas respostas revela um padrão comportamental do tipo ${profileName}. É importante compreender que os traços identificados não representam necessariamente um diagnóstico, mas sim tendências comportamentais que podem ser trabalhadas e compreendidas.

Seus resultados indicam que suas características predominantes estão nas áreas de ${top3.join(', ').toLowerCase()}, enquanto ${lowest.join(' e ').toLowerCase()} representam áreas com menor expressão no momento. Esse padrão é relativamente comum e pode se manifestar de formas diferentes dependendo do contexto e do momento de vida.

Recomendamos que, caso os resultados tenham ressonado com suas experiências diárias, você considere consultar um profissional de saúde mental para uma avaliação mais aprofundada. Profissionais qualificados podem oferecer orientação personalizada e, se necessário, estratégias específicas para melhorar sua qualidade de vida.

Lembre-se: este teste é uma ferramenta informativa e não substitui avaliação clínica profissional.`;
  }

  return `A análise integrada das suas respostas revela um perfil cognitivo predominantemente ${profileName}. Este padrão indica que seu processamento mental privilegia ${top3[0].toLowerCase()} e ${top3[1].toLowerCase()}, criando uma base sólida para atividades que exigem essas competências.

Seus traços mais pronunciados — ${top3.join(', ')} — formam uma combinação que se complementa, permitindo que você aborde desafios de múltiplas perspectivas. Esta configuração cognitiva é particularmente valiosa em contextos que exigem tanto profundidade de análise quanto capacidade de adaptação.

As áreas de ${lowest.join(' e ').toLowerCase()} representam oportunidades de crescimento. Desenvolver essas dimensões pode ampliar significativamente sua versatilidade cognitiva e abrir novas possibilidades em sua vida pessoal e profissional.

Seu perfil sugere que você se beneficia de ambientes que valorizam ${top3.includes('Raciocínio analítico') || top3.includes('Pensamento estratégico') ? 'pensamento estruturado e análise fundamentada' : top3.includes('Criatividade cognitiva') || top3.includes('Flexibilidade mental') ? 'inovação, criatividade e adaptabilidade' : 'aprendizado contínuo e desenvolvimento intelectual'}. Buscar oportunidades alinhadas com essas tendências pode potencializar significativamente sua satisfação e desempenho.

Este relatório representa uma fotografia do seu perfil cognitivo no momento atual. O cérebro humano é altamente adaptável, e com estímulo adequado, todas as dimensões analisadas podem ser desenvolvidas ao longo do tempo.`;
}

// ======================== MAIN FUNCTION ========================

export function calculateScore(
  quizSlug: string,
  responses: { score_value: number }[],
  maxPossible: number
): ScoreResult {
  const totalScore = responses.reduce((sum, r) => sum + r.score_value, 0);

  const quizConfig = QUIZ_TRAITS[quizSlug];
  if (!quizConfig) {
    return generateGenericResult(quizSlug, responses, totalScore, maxPossible);
  }

  const traitLevels = computeTraitLevels(responses, quizConfig.traits);
  const profile = pickProfile(traitLevels, quizConfig.profiles);
  const percentile = generatePercentile(traitLevels);

  const isTDAH = quizSlug === 'indicadores-de-tdah';
  const disclaimer = isTDAH
    ? 'IMPORTANTE: Este teste é apenas informativo e NÃO fornece diagnóstico de TDAH. O diagnóstico só pode ser feito por profissionais qualificados de saúde mental. Se você se identificou com os resultados, procure um psicólogo ou psiquiatra para uma avaliação completa.'
    : 'Este teste é apenas para fins informativos e educacionais. Ele não constitui diagnóstico médico, psicológico ou psiquiátrico e não substitui avaliação profissional.';

  const sections: ReportSection[] = [
    {
      title: 'Perfil Predominante',
      content: profile.desc,
      type: 'text',
    },
    {
      title: 'Mapa de Traços Cognitivos',
      content: 'Distribuição dos seus traços cognitivos identificados a partir das suas respostas.',
      type: 'traits',
      traits: Object.entries(traitLevels).map(([name, level]) => ({ name, level })),
    },
    {
      title: 'Estilo de Pensamento',
      content: getThinkingStyle(traitLevels),
      type: 'text',
    },
    {
      title: 'Potenciais Identificados',
      content: 'Com base na análise das suas respostas, os seguintes potenciais foram identificados:',
      type: 'list',
      items: getPotentials(traitLevels),
    },
    {
      title: 'Como Esse Perfil Aparece na Vida Real',
      content: getRealLifeText(profile.name, traitLevels),
      type: 'text',
    },
    {
      title: 'Pontos Fortes',
      content: 'Características positivas mais marcantes do seu perfil:',
      type: 'list',
      items: getStrengths(traitLevels),
    },
    {
      title: 'Áreas de Desenvolvimento',
      content: 'Sugestões construtivas para expandir suas capacidades cognitivas:',
      type: 'list',
      items: getDevelopmentAreas(traitLevels),
    },
    {
      title: 'Estilo de Resolução de Problemas',
      content: 'Análise do seu estilo predominante de resolução de problemas:',
      type: 'styles',
      styles: getProblemSolvingStyles(traitLevels),
    },
    {
      title: 'Comparação com Outros Participantes',
      content: getComparisonText(percentile, profile.name),
      type: 'text',
    },
    {
      title: 'Ambientes Onde Esse Perfil se Destaca',
      content: 'Contextos e situações onde seu perfil tende a brilhar:',
      type: 'environments',
      items: getEnvironments(traitLevels),
    },
    {
      title: 'Estilo de Aprendizado',
      content: 'Mapeamento do seu estilo de aprendizado predominante:',
      type: 'styles',
      styles: getLearningStyles(traitLevels),
    },
    {
      title: 'Interpretação Final',
      content: getFinalInterpretation(profile.name, traitLevels, quizSlug),
      type: 'text',
    },
  ];

  return {
    totalScore,
    maxScore: maxPossible,
    percentile,
    resultTitle: profile.name,
    resultSummary: profile.desc.split('.').slice(0, 2).join('.') + '.',
    fullReport: { sections, disclaimer },
  };
}

function generateGenericResult(slug: string, responses: { score_value: number }[], total: number, max: number): ScoreResult {
  return calculateScore('perfil-de-raciocinio', responses, max);
}
