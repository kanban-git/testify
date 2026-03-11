import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = 'quiz_session_id';

export function useQuizSession() {
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem(SESSION_KEY);
  });

  const createSession = useCallback(async (quizId: string, source?: string, campaign?: string) => {
    const params = new URLSearchParams(window.location.search);
    const { data, error } = await (supabase.from('quiz_sessions').insert as any)({
      quiz_id: quizId,
      source: source || params.get('utm_source') || null,
      campaign: campaign || params.get('utm_campaign') || null,
    }).select('id').single();

    if (error) throw error;
    const id = data.id as string;
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
    const { error } = await (supabase.from('responses').insert as any)({
      session_id: currentSessionId,
      question_id: questionId,
      answer_id: answerId,
      score_value: scoreValue,
    });
    if (error) throw error;
  }, []);

  const completeSession = useCallback(async (currentSessionId: string) => {
    await (supabase.from('quiz_sessions').update as any)({ completed_at: new Date().toISOString() })
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
    const { data, error } = await (supabase.from('results').insert as any)({
      session_id: currentSessionId,
      quiz_id: quizId,
      total_score: result.totalScore,
      max_score: result.maxScore,
      percentile: result.percentile,
      result_title: result.resultTitle,
      result_summary: result.resultSummary,
      full_report: result.fullReport,
      unlocked: false,
    }).select('id').single();
    if (error) throw error;
    return data.id as string;
  }, []);

  const updateEmail = useCallback(async (currentSessionId: string, email: string) => {
    await (supabase.from('quiz_sessions').update as any)({ email })
      .eq('id', currentSessionId);
  }, []);

  const unlockResult = useCallback(async (currentSessionId: string) => {
    await (supabase.from('results').update as any)({ unlocked: true })
      .eq('session_id', currentSessionId);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSessionId(null);
  }, []);

  return {
    sessionId, createSession, saveResponse, completeSession,
    saveResult, updateEmail, unlockResult, clearSession,
  };
}
