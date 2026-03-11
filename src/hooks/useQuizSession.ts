import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = 'quiz_session_id';

export function useQuizSession() {
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem(SESSION_KEY);
  });

  const createSession = useCallback(async (quizId: string, source?: string, campaign?: string) => {
    const params = new URLSearchParams(window.location.search);
    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert({
        quiz_id: quizId,
        source: source || params.get('utm_source') || null,
        campaign: campaign || params.get('utm_campaign') || null,
      } as Record<string, unknown>)
      .select('id')
      .single();

    if (error) throw error;
    const id = (data as { id: string }).id;
    localStorage.setItem(SESSION_KEY, id);
    setSessionId(id);
    return id;
  }, []);

  const saveResponse = useCallback(async (
    currentSessionId: string,
    questionId: string,
    answerId: string,
    scoreValue: number
  ) => {
    const { error } = await supabase.from('responses').insert({
      session_id: currentSessionId,
      question_id: questionId,
      answer_id: answerId,
      score_value: scoreValue,
    } as Record<string, unknown>);
    if (error) throw error;
  }, []);

  const completeSession = useCallback(async (currentSessionId: string) => {
    await supabase
      .from('quiz_sessions')
      .update({ completed_at: new Date().toISOString() } as Record<string, unknown>)
      .eq('id', currentSessionId);
  }, []);

  const saveResult = useCallback(async (
    currentSessionId: string,
    quizId: string,
    result: {
      totalScore: number;
      maxScore: number;
      percentile: number;
      resultTitle: string;
      resultSummary: string;
      fullReport: unknown;
    }
  ) => {
    const { data, error } = await supabase.from('results').insert({
      session_id: currentSessionId,
      quiz_id: quizId,
      total_score: result.totalScore,
      max_score: result.maxScore,
      percentile: result.percentile,
      result_title: result.resultTitle,
      result_summary: result.resultSummary,
      full_report: result.fullReport,
      unlocked: false,
    } as Record<string, unknown>).select('id').single();
    if (error) throw error;
    return (data as { id: string }).id;
  }, []);

  const updateEmail = useCallback(async (currentSessionId: string, email: string) => {
    await supabase
      .from('quiz_sessions')
      .update({ email } as Record<string, unknown>)
      .eq('id', currentSessionId);
  }, []);

  const unlockResult = useCallback(async (currentSessionId: string) => {
    await supabase
      .from('results')
      .update({ unlocked: true } as Record<string, unknown>)
      .eq('session_id', currentSessionId);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSessionId(null);
  }, []);

  return {
    sessionId,
    createSession,
    saveResponse,
    completeSession,
    saveResult,
    updateEmail,
    unlockResult,
    clearSession,
  };
}
