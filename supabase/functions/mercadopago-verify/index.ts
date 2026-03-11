const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Mercado Pago not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { session_id } = await req.json();

    if (!session_id) {
      return new Response(JSON.stringify({ error: 'Missing session_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Get payment record for this session
    const paymentRes = await fetch(
      `${supabaseUrl}/rest/v1/payments?session_id=eq.${session_id}&order=created_at.desc&limit=1`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );
    const payments = await paymentRes.json();

    if (!payments || payments.length === 0) {
      return new Response(JSON.stringify({ status: 'not_found', approved: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payment = payments[0];

    // If already approved in our DB, return immediately
    if (payment.status === 'approved') {
      return new Response(JSON.stringify({ status: 'approved', approved: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Search payment on Mercado Pago by external_reference (session_id)
    const searchRes = await fetch(
      `https://api.mercadopago.com/v1/payments/search?external_reference=${session_id}&sort=date_created&criteria=desc`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      }
    );
    const searchData = await searchRes.json();

    if (!searchRes.ok || !searchData.results || searchData.results.length === 0) {
      return new Response(JSON.stringify({ status: 'pending', approved: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const mpPayment = searchData.results[0];
    const mpStatus = mpPayment.status; // approved, pending, rejected, etc.

    // Update our payment record
    await fetch(
      `${supabaseUrl}/rest/v1/payments?session_id=eq.${session_id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          status: mpStatus,
          provider_payment_id: String(mpPayment.id),
        }),
      }
    );

    if (mpStatus === 'approved') {
      // Update quiz_sessions
      await fetch(
        `${supabaseUrl}/rest/v1/quiz_sessions?id=eq.${session_id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            payment_status: 'approved',
            payment_provider: 'mercadopago',
            amount_paid: mpPayment.transaction_amount || 7.90,
          }),
        }
      );

      // Unlock result
      await fetch(
        `${supabaseUrl}/rest/v1/results?session_id=eq.${session_id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ unlocked: true }),
        }
      );
    }

    return new Response(JSON.stringify({ status: mpStatus, approved: mpStatus === 'approved' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
