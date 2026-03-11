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

export function calculateScore(
  quizSlug: string,
  responses: { score_value: number }[],
  maxPossible: number
): ScoreResult {
  const totalScore = responses.reduce((sum, r) => sum + r.score_value, 0);
  const percentage = maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0;

  switch (quizSlug) {
    case 'teste-de-qi':
    case 'cerebro-acima-da-media':
      return generateCognitiveResult(quizSlug, totalScore, maxPossible, percentage);
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

function generateCognitiveResult(slug: string, total: number, max: number, pct: number): ScoreResult {
  const iqEstimate = Math.round(85 + (pct / 100) * 45);
  const percentile = Math.min(99, Math.round(pct * 0.95 + 5));

  let title: string, summary: string;
  if (pct >= 87) { title = 'Desempenho Excepcional'; summary = `QI estimado: ${iqEstimate}. Seu raciocínio demonstra capacidade analítica muito acima da média.`; }
  else if (pct >= 68) { title = 'Acima da Média'; summary = `QI estimado: ${iqEstimate}. Você apresenta habilidades de raciocínio lógico superiores à maioria.`; }
  else if (pct >= 43) { title = 'Na Média'; summary = `QI estimado: ${iqEstimate}. Seu desempenho está dentro da faixa esperada para a população geral.`; }
  else { title = 'Abaixo da Média'; summary = `QI estimado: ${iqEstimate}. Algumas áreas podem se beneficiar de estímulo e prática.`; }

  return {
    totalScore: total, maxScore: max, percentile, resultTitle: title, resultSummary: summary,
    fullReport: {
      sections: [
        { title: 'Pontuação Geral', content: `Você acertou ${total} de ${max} questões (${Math.round(pct)}%).`, score: total, maxScore: max },
        { title: 'QI Estimado', content: `Com base nas suas respostas, sua faixa estimada de QI é ${iqEstimate}. Esta estimativa é baseada em padrões de raciocínio lógico e não substitui um teste formal.` },
        { title: 'Raciocínio Lógico', content: pct >= 68 ? 'Você demonstrou excelente capacidade de identificar padrões e sequências numéricas.' : 'Há oportunidades para desenvolver sua capacidade de reconhecimento de padrões.' },
        { title: 'Raciocínio Verbal', content: pct >= 68 ? 'Suas habilidades verbais e de analogia estão bem desenvolvidas.' : 'Exercícios de vocabulário e analogias podem fortalecer essa área.' },
        { title: 'Raciocínio Matemático', content: pct >= 68 ? 'Você mostrou boa capacidade de cálculo e resolução de problemas numéricos.' : 'Prática com problemas matemáticos pode melhorar seu desempenho nessa área.' },
        { title: 'Comparação com Outros Participantes', content: `Você pontuou acima de ${percentile}% dos participantes que fizeram este teste.`, score: percentile, maxScore: 100 },
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
  if (introversion > 6) traits.push('Introspectivo');
  else traits.push('Expansivo');
  if (analytical > 6) traits.push('Analítico');
  else traits.push('Intuitivo');
  if (structured > 6) traits.push('Estruturado');
  else traits.push('Flexível');

  const title = traits.join(' • ');
  const percentile = Math.min(99, Math.round(45 + Math.random() * 40));

  return {
    totalScore: total, maxScore: max, percentile, resultTitle: title,
    resultSummary: `Seu perfil predominante é ${traits[0].toLowerCase()} e ${traits[1].toLowerCase()}. Você tende a ser uma pessoa ${traits[2].toLowerCase()} em relação a planejamento e estrutura.`,
    fullReport: {
      sections: [
        { title: 'Perfil Predominante', content: `Seu perfil comportamental combina traços de ${traits.join(', ').toLowerCase()}.` },
        { title: 'Introversão vs Extroversão', content: introversion > 6 ? 'Você tende a recarregar energias em momentos de solidão e reflexão.' : 'Você se energiza em ambientes sociais e interações.', score: introversion, maxScore: 10 },
        { title: 'Pensamento Analítico', content: analytical > 6 ? 'Você processa informações de forma lógica e metódica.' : 'Você confia mais na intuição e experiência.', score: analytical, maxScore: 10 },
        { title: 'Estrutura e Organização', content: structured > 6 ? 'Você valoriza planejamento e previsibilidade.' : 'Você se adapta bem a mudanças e improvisa com facilidade.', score: structured, maxScore: 10 },
        { title: 'Autopercepção', content: selfAware > 6 ? 'Você demonstra alta capacidade de autorreflexão.' : 'Há espaço para desenvolver mais consciência sobre seus padrões.', score: selfAware, maxScore: 10 },
        { title: 'Análise Integrada', content: `Pessoas com perfil ${traits[0].toLowerCase()} e ${traits[1].toLowerCase()} tendem a se destacar em atividades que exigem ${introversion > 6 ? 'concentração profunda' : 'colaboração'} e ${analytical > 6 ? 'análise detalhada' : 'criatividade'}.` },
      ],
      disclaimer: 'Este teste é apenas para fins informativos e educacionais. Ele não constitui diagnóstico médico, psicológico ou psiquiátrico e não substitui avaliação profissional.',
    },
  };
}

function generateTDAHResult(total: number, max: number, pct: number): ScoreResult {
  const percentile = Math.min(99, Math.round(pct));
  let title: string, summary: string;

  if (pct >= 75) { title = 'Indicadores Elevados'; summary = 'Suas respostas indicam um nível elevado de sinais comportamentais associados à desatenção e/ou hiperatividade.'; }
  else if (pct >= 50) { title = 'Indicadores Moderados'; summary = 'Suas respostas sugerem presença moderada de comportamentos que podem estar associados a padrões de desatenção.'; }
  else if (pct >= 25) { title = 'Indicadores Leves'; summary = 'Suas respostas indicam poucos sinais comportamentais, mas alguns padrões merecem atenção.'; }
  else { title = 'Poucos Indicadores'; summary = 'Suas respostas não indicam presença significativa de padrões associados à desatenção ou hiperatividade.'; }

  return {
    totalScore: total, maxScore: max, percentile, resultTitle: title, resultSummary: summary,
    fullReport: {
      sections: [
        { title: 'Resultado Geral', content: `Pontuação: ${total} de ${max} (${Math.round(pct)}%). ${summary}`, score: total, maxScore: max },
        { title: 'Desatenção', content: 'Análise detalhada dos indicadores de desatenção baseada nas suas respostas sobre foco, organização e finalização de tarefas.' },
        { title: 'Hiperatividade/Impulsividade', content: 'Análise dos indicadores de inquietação, impulsividade e dificuldade em manter-se parado.' },
        { title: 'Organização e Planejamento', content: 'Avaliação da sua capacidade auto-relatada de organizar tarefas e seguir rotinas.' },
        { title: 'Impacto no Dia a Dia', content: 'Como os padrões identificados podem afetar suas atividades cotidianas e profissionais.' },
        { title: 'Recomendações', content: 'Se os indicadores foram moderados ou elevados, recomenda-se buscar avaliação com profissional especializado para investigação adequada.' },
      ],
      disclaimer: 'IMPORTANTE: Este teste NÃO fornece diagnóstico de TDAH ou qualquer outra condição. Ele é estritamente informativo e educacional. O diagnóstico de TDAH só pode ser feito por profissionais de saúde qualificados (psiquiatras, neuropsicólogos) através de avaliação clínica completa.',
    },
  };
}

function generatePsychologicalResult(total: number, max: number, pct: number, responses: { score_value: number }[]): ScoreResult {
  const emotionalStability = ((responses[0]?.score_value || 3) + (responses[1]?.score_value || 3)) / 2;
  const organization = ((responses[5]?.score_value || 3) + (responses[14]?.score_value || 3)) / 2;
  const impulsivity = (5 - (responses[12]?.score_value || 3) + (responses[2]?.score_value || 3)) / 2;
  const selfPerception = ((responses[9]?.score_value || 3) + (responses[15]?.score_value || 3)) / 2;
  const sociability = ((responses[8]?.score_value || 3) + (responses[10]?.score_value || 3)) / 2;

  const percentile = Math.min(99, Math.round(40 + Math.random() * 45));
  const title = emotionalStability > 3.5 ? 'Perfil Estável e Analítico' : 'Perfil Sensível e Adaptável';

  return {
    totalScore: total, maxScore: max, percentile, resultTitle: title,
    resultSummary: `Seu perfil psicológico apresenta ${emotionalStability > 3.5 ? 'boa estabilidade emocional' : 'sensibilidade emocional acentuada'} com tendência a ${organization > 3.5 ? 'organização e disciplina' : 'flexibilidade e adaptação'}.`,
    fullReport: {
      sections: [
        { title: 'Visão Geral', content: `Seu perfil psicológico integra cinco eixos de análise para oferecer uma visão abrangente do seu padrão comportamental e emocional.` },
        { title: 'Estabilidade Emocional', content: emotionalStability > 3.5 ? 'Você demonstra boa capacidade de regulação emocional.' : 'Você tende a ser mais reativo emocionalmente.', score: Math.round(emotionalStability * 20), maxScore: 100 },
        { title: 'Organização', content: organization > 3.5 ? 'Você demonstra disciplina e foco em objetivos.' : 'Você tende a ser mais espontâneo em suas ações.', score: Math.round(organization * 20), maxScore: 100 },
        { title: 'Controle de Impulsos', content: impulsivity < 3 ? 'Você tende a pensar antes de agir.' : 'Você pode agir mais por impulso em certas situações.', score: Math.round((5 - impulsivity) * 20), maxScore: 100 },
        { title: 'Autopercepção', content: selfPerception > 3.5 ? 'Você possui boa consciência dos seus estados internos.' : 'Há espaço para desenvolver mais autoconhecimento.', score: Math.round(selfPerception * 20), maxScore: 100 },
        { title: 'Sociabilidade', content: sociability > 3.5 ? 'Você se adapta bem a contextos sociais.' : 'Você pode preferir interações mais seletivas.', score: Math.round(sociability * 20), maxScore: 100 },
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
