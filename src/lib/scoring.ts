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
  score?: number;
  maxScore?: number;
}

// Trait mapping: each question index (0-15) maps to cognitive traits with weights
const COGNITIVE_TRAIT_MAP: Record<string, number[]> = {
  'raciocinio_analitico':      [0, 1, 2, 10, 15],   // Q1,2,3,11,16
  'praticidade':               [0, 5, 8, 12],         // Q1,6,9,13
  'flexibilidade_mental':      [4, 11, 12],           // Q5,12,13
  'impulsividade_decisoria':   [12],                   // Q13 (high = more impulsive)
  'atencao_detalhes':          [2, 7, 15],             // Q3,8,16
  'organizacao_pensamento':    [0, 5, 8, 13],          // Q1,6,9,14
  'velocidade_decisao':        [12, 8],                // Q13,9
  'preferencia_estrutura':     [5, 13],                // Q6,14
  'adaptacao_novas_info':      [4, 11],                // Q5,12
  'logica_vs_intuicao':        [3, 14],                // Q4,15
};

const TRAIT_LABELS: Record<string, string> = {
  'raciocinio_analitico': 'Raciocínio Analítico',
  'praticidade': 'Praticidade',
  'flexibilidade_mental': 'Flexibilidade Mental',
  'impulsividade_decisoria': 'Velocidade Decisória',
  'atencao_detalhes': 'Atenção a Detalhes',
  'organizacao_pensamento': 'Organização do Pensamento',
  'velocidade_decisao': 'Velocidade de Decisão',
  'preferencia_estrutura': 'Preferência por Estrutura',
  'adaptacao_novas_info': 'Adaptação a Novas Informações',
  'logica_vs_intuicao': 'Lógica vs Intuição',
};

const PROFILE_COMBINATIONS: { traits: string[]; name: string }[] = [
  { traits: ['raciocinio_analitico', 'praticidade'], name: 'Analítico-Prático' },
  { traits: ['organizacao_pensamento', 'atencao_detalhes'], name: 'Estruturado-Detalhista' },
  { traits: ['flexibilidade_mental', 'raciocinio_analitico'], name: 'Flexível-Estratégico' },
  { traits: ['praticidade', 'velocidade_decisao'], name: 'Objetivo-Resolutivo' },
  { traits: ['flexibilidade_mental', 'adaptacao_novas_info'], name: 'Intuitivo-Adaptável' },
  { traits: ['atencao_detalhes', 'raciocinio_analitico'], name: 'Observador-Analítico' },
];

function computeTraitScores(responses: { score_value: number }[]): Record<string, { score: number; max: number; pct: number }> {
  const result: Record<string, { score: number; max: number; pct: number }> = {};
  for (const [trait, indices] of Object.entries(COGNITIVE_TRAIT_MAP)) {
    let score = 0, max = 0;
    for (const idx of indices) {
      score += responses[idx]?.score_value || 3;
      max += 5;
    }
    result[trait] = { score, max, pct: max > 0 ? (score / max) * 100 : 50 };
  }
  return result;
}

function determinePrimaryProfile(traitScores: Record<string, { score: number; max: number; pct: number }>): string {
  let bestMatch = PROFILE_COMBINATIONS[0].name;
  let bestScore = -1;
  for (const combo of PROFILE_COMBINATIONS) {
    const avg = combo.traits.reduce((sum, t) => sum + (traitScores[t]?.pct || 50), 0) / combo.traits.length;
    if (avg > bestScore) { bestScore = avg; bestMatch = combo.name; }
  }
  return bestMatch;
}

function computeConsistency(responses: { score_value: number }[]): number {
  if (responses.length < 2) return 5;
  const vals = responses.map(r => r.score_value);
  const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
  const variance = vals.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / vals.length;
  const sd = Math.sqrt(variance);
  // Lower SD = more consistent, map to 1-10
  return Math.max(1, Math.min(10, Math.round(10 - sd * 2)));
}

export function calculateScore(
  quizSlug: string,
  responses: { score_value: number }[],
  maxPossible: number
): ScoreResult {
  const totalScore = responses.reduce((sum, r) => sum + r.score_value, 0);
  const percentage = maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0;

  switch (quizSlug) {
    case 'perfil-de-raciocinio':
      return generateCognitiveProfileResult(totalScore, maxPossible, responses);
    case 'cerebro-acima-da-media':
      return generateCognitiveResult(totalScore, maxPossible, percentage);
    case 'personalidade-profunda':
      return generatePersonalityResult(totalScore, maxPossible, percentage, responses);
    case 'indicadores-de-tdah':
      return generateTDAHResult(totalScore, maxPossible, percentage);
    case 'perfil-psicologico-completo':
      return generatePsychologicalResult(totalScore, maxPossible, percentage, responses);
    default:
      return generateGenericResult(totalScore, maxPossible, percentage);
  }
}

function generateCognitiveProfileResult(total: number, max: number, responses: { score_value: number }[]): ScoreResult {
  const traitScores = computeTraitScores(responses);
  const primaryProfile = determinePrimaryProfile(traitScores);
  const consistency = computeConsistency(responses);
  const percentile = Math.min(99, Math.max(10, Math.round(35 + (total / Math.max(max, 1)) * 55 + (consistency - 5) * 2)));

  // Top 3 traits
  const sortedTraits = Object.entries(traitScores).sort((a, b) => b[1].pct - a[1].pct);
  const topTraits = sortedTraits.slice(0, 3);
  const bottomTraits = sortedTraits.slice(-2);

  const summaryParts: string[] = [];
  if (topTraits[0][1].pct >= 70) summaryParts.push(`tendência forte a ${TRAIT_LABELS[topTraits[0][0]].toLowerCase()}`);
  else summaryParts.push(`tendência a ${TRAIT_LABELS[topTraits[0][0]].toLowerCase()}`);
  summaryParts.push(`${TRAIT_LABELS[topTraits[1][0]].toLowerCase()}`);

  return {
    totalScore: total,
    maxScore: max,
    percentile,
    resultTitle: primaryProfile,
    resultSummary: `Suas respostas indicam ${summaryParts.join(' e ')}, com estilo de tomada de decisão ${traitScores['logica_vs_intuicao'].pct >= 60 ? 'mais lógico' : 'equilibrado entre lógica e intuição'}.`,
    fullReport: {
      sections: [
        {
          title: 'Perfil Predominante',
          content: `Seu perfil cognitivo predominante é ${primaryProfile}. Isso indica que você tende a processar informações de forma ${primaryProfile.includes('Analítico') ? 'metódica e estruturada' : primaryProfile.includes('Flexível') ? 'adaptável e estratégica' : primaryProfile.includes('Objetivo') ? 'direta e prática' : 'observadora e detalhista'}.`,
        },
        {
          title: 'Consistência do Perfil',
          content: `Sua consistência de respostas é ${consistency}/10. ${consistency >= 7 ? 'Isso indica um padrão de pensamento bem definido e estável.' : consistency >= 5 ? 'Seu perfil mostra versatilidade, alternando entre estilos dependendo do contexto.' : 'Você demonstra grande flexibilidade cognitiva, com variações significativas em seu estilo de pensamento.'}`,
          score: consistency,
          maxScore: 10,
        },
        ...topTraits.map(([key, val]) => ({
          title: TRAIT_LABELS[key],
          content: `${val.pct >= 80 ? 'Pontuação muito alta' : val.pct >= 60 ? 'Pontuação alta' : val.pct >= 40 ? 'Pontuação moderada' : 'Pontuação baixa'}. ${getTraitDescription(key, val.pct)}`,
          score: val.score,
          maxScore: val.max,
        })),
        ...bottomTraits.map(([key, val]) => ({
          title: TRAIT_LABELS[key],
          content: `${val.pct >= 60 ? 'Pontuação adequada' : 'Área com potencial de desenvolvimento'}. ${getTraitDescription(key, val.pct)}`,
          score: val.score,
          maxScore: val.max,
        })),
        {
          title: 'Comparação com Outros Participantes',
          content: `Seu perfil mostrou maior consistência analítica do que ${percentile}% dos participantes que fizeram este teste.`,
          score: percentile,
          maxScore: 100,
        },
        {
          title: 'Análise Integrada',
          content: `Pessoas com perfil ${primaryProfile} tendem a se destacar em atividades que exigem ${primaryProfile.includes('Analítico') ? 'análise de dados, resolução de problemas complexos e pensamento estratégico' : primaryProfile.includes('Estruturado') ? 'planejamento detalhado, organização e controle de qualidade' : primaryProfile.includes('Flexível') ? 'adaptação rápida, inovação e gestão de mudanças' : primaryProfile.includes('Objetivo') ? 'execução ágil, pragmatismo e tomada de decisão rápida' : 'observação atenta, pesquisa e análise qualitativa'}. Seu estilo cognitivo pode ser um diferencial em ambientes que valorizam ${traitScores['logica_vs_intuicao'].pct >= 60 ? 'raciocínio lógico e objetividade' : 'equilíbrio entre análise e intuição'}.`,
        },
      ],
      disclaimer: 'Este teste é apenas para fins informativos e educacionais. Ele não constitui diagnóstico médico, psicológico ou psiquiátrico e não substitui avaliação profissional.',
    },
  };
}

function getTraitDescription(trait: string, pct: number): string {
  const high = pct >= 60;
  const descriptions: Record<string, [string, string]> = {
    'raciocinio_analitico': ['Você demonstra forte capacidade de decompor problemas e analisar situações de forma lógica.', 'Há espaço para desenvolver mais a análise sistemática de problemas.'],
    'praticidade': ['Você tende a buscar soluções objetivas e aplicáveis.', 'Você pode se beneficiar de abordagens mais práticas e diretas.'],
    'flexibilidade_mental': ['Você se adapta bem a mudanças e novas perspectivas.', 'Você pode preferir estabilidade e consistência em seus métodos.'],
    'impulsividade_decisoria': ['Você tende a decidir com agilidade quando se sente preparado.', 'Você tende a ponderar mais antes de tomar decisões.'],
    'atencao_detalhes': ['Você possui aguçada percepção de detalhes e padrões.', 'Você tende a focar mais no panorama geral do que em detalhes específicos.'],
    'organizacao_pensamento': ['Seu pensamento tende a ser organizado e estruturado.', 'Você pode se beneficiar de mais estrutura na organização de ideias.'],
    'velocidade_decisao': ['Você tende a processar informações e decidir com rapidez.', 'Você prefere dedicar mais tempo à análise antes de decidir.'],
    'preferencia_estrutura': ['Você funciona melhor com clareza, ordem e estrutura.', 'Você lida bem com ambiguidade e situações menos estruturadas.'],
    'adaptacao_novas_info': ['Você integra novas informações com facilidade ao seu raciocínio.', 'Você pode levar mais tempo para ajustar suas opiniões com base em novos dados.'],
    'logica_vs_intuicao': ['Você privilegia argumentos lógicos e racionais.', 'Você equilibra lógica e intuição em suas decisões.'],
  };
  return (descriptions[trait] || ['', ''])[high ? 0 : 1];
}

// ============= Existing functions for other quizzes =============

function generateCognitiveResult(total: number, max: number, pct: number): ScoreResult {
  const percentile = Math.min(99, Math.round(pct * 0.95 + 5));
  let title: string, summary: string;
  if (pct >= 87) { title = 'Desempenho Excepcional'; summary = `Seu raciocínio demonstra capacidade analítica muito acima da média.`; }
  else if (pct >= 68) { title = 'Acima da Média'; summary = `Você apresenta habilidades de raciocínio lógico superiores à maioria.`; }
  else if (pct >= 43) { title = 'Na Média'; summary = `Seu desempenho está dentro da faixa esperada para a população geral.`; }
  else { title = 'Abaixo da Média'; summary = `Algumas áreas podem se beneficiar de estímulo e prática.`; }

  return {
    totalScore: total, maxScore: max, percentile, resultTitle: title, resultSummary: summary,
    fullReport: {
      sections: [
        { title: 'Pontuação Geral', content: `Você acertou ${total} de ${max} questões (${Math.round(pct)}%).`, score: total, maxScore: max },
        { title: 'Raciocínio Lógico', content: pct >= 68 ? 'Você demonstrou excelente capacidade de identificar padrões e sequências.' : 'Há oportunidades para desenvolver sua capacidade de reconhecimento de padrões.' },
        { title: 'Raciocínio Verbal', content: pct >= 68 ? 'Suas habilidades verbais e de analogia estão bem desenvolvidas.' : 'Exercícios de vocabulário e analogias podem fortalecer essa área.' },
        { title: 'Comparação com Outros Participantes', content: `Você pontuou acima de ${percentile}% dos participantes.`, score: percentile, maxScore: 100 },
      ],
      disclaimer: 'Este teste é apenas para fins informativos e educacionais. Ele não constitui diagnóstico médico, psicológico ou psiquiátrico e não substitui avaliação profissional.',
    },
  };
}

function generatePersonalityResult(total: number, max: number, pct: number, responses: { score_value: number }[]): ScoreResult {
  const introversion = (responses[0]?.score_value || 3) + (5 - (responses[2]?.score_value || 3));
  const analytical = (responses[1]?.score_value || 3) + (responses[6]?.score_value || 3);
  const structured = (responses[4]?.score_value || 3) + (responses[11]?.score_value || 3);
  const selfAware = (responses[8]?.score_value || 3) + (responses[15]?.score_value || 3);

  const traits: string[] = [];
  if (introversion > 6) traits.push('Introspectivo'); else traits.push('Expansivo');
  if (analytical > 6) traits.push('Analítico'); else traits.push('Intuitivo');
  if (structured > 6) traits.push('Estruturado'); else traits.push('Flexível');

  const title = traits.join(' • ');
  const percentile = Math.min(99, Math.round(45 + Math.random() * 40));

  return {
    totalScore: total, maxScore: max, percentile, resultTitle: title,
    resultSummary: `Seu perfil predominante é ${traits[0].toLowerCase()} e ${traits[1].toLowerCase()}.`,
    fullReport: {
      sections: [
        { title: 'Perfil Predominante', content: `Seu perfil combina traços de ${traits.join(', ').toLowerCase()}.` },
        { title: 'Introversão vs Extroversão', content: introversion > 6 ? 'Você recarrega energias em solidão.' : 'Você se energiza em ambientes sociais.', score: introversion, maxScore: 10 },
        { title: 'Pensamento Analítico', content: analytical > 6 ? 'Você processa informações de forma lógica.' : 'Você confia mais na intuição.', score: analytical, maxScore: 10 },
        { title: 'Estrutura e Organização', content: structured > 6 ? 'Você valoriza planejamento.' : 'Você se adapta bem a mudanças.', score: structured, maxScore: 10 },
        { title: 'Autopercepção', content: selfAware > 6 ? 'Alta capacidade de autorreflexão.' : 'Há espaço para mais autoconhecimento.', score: selfAware, maxScore: 10 },
      ],
      disclaimer: 'Este teste é apenas para fins informativos e educacionais. Ele não constitui diagnóstico médico, psicológico ou psiquiátrico e não substitui avaliação profissional.',
    },
  };
}

function generateTDAHResult(total: number, max: number, pct: number): ScoreResult {
  const percentile = Math.min(99, Math.round(pct));
  let title: string, summary: string;
  if (pct >= 75) { title = 'Indicadores Elevados'; summary = 'Nível elevado de sinais comportamentais associados à desatenção e/ou hiperatividade.'; }
  else if (pct >= 50) { title = 'Indicadores Moderados'; summary = 'Presença moderada de comportamentos associados a padrões de desatenção.'; }
  else if (pct >= 25) { title = 'Indicadores Leves'; summary = 'Poucos sinais comportamentais, mas alguns padrões merecem atenção.'; }
  else { title = 'Poucos Indicadores'; summary = 'Não há presença significativa de padrões associados à desatenção ou hiperatividade.'; }

  return {
    totalScore: total, maxScore: max, percentile, resultTitle: title, resultSummary: summary,
    fullReport: {
      sections: [
        { title: 'Resultado Geral', content: `Pontuação: ${total} de ${max} (${Math.round(pct)}%). ${summary}`, score: total, maxScore: max },
        { title: 'Desatenção', content: 'Análise dos indicadores de desatenção.' },
        { title: 'Hiperatividade/Impulsividade', content: 'Análise dos indicadores de inquietação e impulsividade.' },
        { title: 'Recomendações', content: 'Se os indicadores foram moderados ou elevados, busque avaliação profissional.' },
      ],
      disclaimer: 'IMPORTANTE: Este teste NÃO fornece diagnóstico de TDAH. O diagnóstico só pode ser feito por profissionais qualificados.',
    },
  };
}

function generatePsychologicalResult(total: number, max: number, pct: number, responses: { score_value: number }[]): ScoreResult {
  const emotionalStability = ((responses[0]?.score_value || 3) + (responses[1]?.score_value || 3)) / 2;
  const organization = ((responses[5]?.score_value || 3) + (responses[14]?.score_value || 3)) / 2;
  const percentile = Math.min(99, Math.round(40 + Math.random() * 45));
  const title = emotionalStability > 3.5 ? 'Perfil Estável e Analítico' : 'Perfil Sensível e Adaptável';

  return {
    totalScore: total, maxScore: max, percentile, resultTitle: title,
    resultSummary: `Seu perfil apresenta ${emotionalStability > 3.5 ? 'boa estabilidade emocional' : 'sensibilidade emocional acentuada'}.`,
    fullReport: {
      sections: [
        { title: 'Visão Geral', content: 'Análise integrada do seu perfil psicológico.' },
        { title: 'Estabilidade Emocional', content: emotionalStability > 3.5 ? 'Boa regulação emocional.' : 'Mais reativo emocionalmente.', score: Math.round(emotionalStability * 20), maxScore: 100 },
        { title: 'Organização', content: organization > 3.5 ? 'Disciplina e foco.' : 'Mais espontâneo.', score: Math.round(organization * 20), maxScore: 100 },
      ],
      disclaimer: 'Este teste é apenas para fins informativos e educacionais. Ele não constitui diagnóstico médico, psicológico ou psiquiátrico e não substitui avaliação profissional.',
    },
  };
}

function generateGenericResult(total: number, max: number, pct: number): ScoreResult {
  return {
    totalScore: total, maxScore: max, percentile: Math.round(pct),
    resultTitle: pct >= 70 ? 'Resultado Positivo' : 'Resultado na Média',
    resultSummary: `Você pontuou ${total} de ${max} (${Math.round(pct)}%).`,
    fullReport: {
      sections: [{ title: 'Resultado', content: `Pontuação: ${total}/${max}`, score: total, maxScore: max }],
      disclaimer: 'Este teste é apenas para fins informativos e educacionais.',
    },
  };
}
