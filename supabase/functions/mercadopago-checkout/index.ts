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

    const { session_id, quiz_id, amount, description, payer_email } = await req.json();

    if (!session_id || !amount) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Mercado Pago preference
    const preference = {
      items: [
        {
          title: description || 'Relatório Completo - NeuroTest',
          quantity: 1,
          unit_price: Number(amount),
          currency_id: 'BRL',
        },
      ],
      payer: payer_email ? { email: payer_email } : undefined,
      external_reference: session_id,
      payment_methods: {
        excluded_payment_types: [],
        installments: 1,
      },
      back_urls: {
        success: `${req.headers.get('origin') || 'https://localhost'}/quiz/payment-callback?status=approved&session_id=${session_id}&quiz_id=${quiz_id}`,
        failure: `${req.headers.get('origin') || 'https://localhost'}/quiz/payment-callback?status=failed&session_id=${session_id}&quiz_id=${quiz_id}`,
        pending: `${req.headers.get('origin') || 'https://localhost'}/quiz/payment-callback?status=pending&session_id=${session_id}&quiz_id=${quiz_id}`,
      },
      auto_return: 'approved',
      notification_url: undefined, // Set this to a webhook URL in production
    };

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('MP error:', mpData);
      return new Response(JSON.stringify({ error: 'Failed to create payment', details: mpData }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Store payment record
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    await fetch(`${supabaseUrl}/rest/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        session_id,
        provider: 'mercadopago',
        provider_payment_id: mpData.id,
        amount: Number(amount),
        currency: 'BRL',
        status: 'pending',
      }),
    });

    return new Response(JSON.stringify({
      init_point: mpData.sandbox_init_point || mpData.init_point,
      preference_id: mpData.id,
    }), {
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
