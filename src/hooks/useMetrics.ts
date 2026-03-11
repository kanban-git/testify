import { supabase } from "@/integrations/supabase/client";

type EventType = 
  | 'page_view' | 'quiz_started' | 'question_answered' | 'quiz_completed'
  | 'paywall_viewed' | 'payment_initiated' | 'payment_approved'
  | 'report_unlocked' | 'email_submitted' | 'user_info_submitted';

export function useMetrics() {
  const trackEvent = async (
    eventType: EventType,
    quizId?: string,
    sessionId?: string,
    metadata?: Record<string, unknown>
  ) => {
    try {
      await (supabase.from('metrics_events').insert as any)({
        event_type: eventType,
        quiz_id: quizId || null,
        session_id: sessionId || null,
        metadata: metadata || null,
      });
    } catch (e) {
      console.error('Failed to track event:', e);
    }
  };

  return { trackEvent };
}
