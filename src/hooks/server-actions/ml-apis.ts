'use server';

import API_BASES from '../../../apiConfig';

export async function generateRetentionStrategies({
  current_churn,
  target_churn,
  reduction_target,
  parameters,
}: {
  current_churn: number;
  target_churn: number;
  reduction_target: number;
  parameters: {
    customer_satisfaction_rating: Parameter;
    customer_service_calls: Parameter;
    days_active: Parameter;
    average_monthly_spending_2: Parameter;
    offer_acceptance_rate: Parameter;
    support_ticket: Parameter;
  };
}) {
  function transformParameters(input: any) {
    const transformed: any = {};
    for (const key in input) {
      const param = input[key];
      transformed[key] = {
        value: Number(param.current ?? 0),
        recommended: Number(param.expected ?? 0),
        min: Number(param.min ?? 0),
        max: Number(param.max ?? 0),
      };
    }
    return transformed;
  }

  const payload = {
    current_churn_probability: Number(current_churn),
    target_churn_probability: Number(target_churn),
    churn_reduction_target: Number(reduction_target),
    parameters: transformParameters(parameters),
  };

  try {
    const response = await fetch(API_BASES.retention, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload, null, 2),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error('Retention strategy error:', error, error.message);
    return { success: false, error: error.message };
  }
}

export async function generateRevenueStrategies({
  revenue_growth_target,
  parameters,
}: {
  revenue_growth_target: number;
  parameters: {
    average_monthly_spending_2: Parameter;
    total_minutes_used: Parameter;
    total_data_used: Parameter;
    offer_acceptance_rate: Parameter;
    current_plan_price: Parameter;
    last_top_up_amount: Parameter;
    promotion_score: Parameter;
  };
}) {
  const payload = {
    revenue_growth_target: revenue_growth_target,
    parameters: parameters,
  };
  console.log(payload, 'generateRevenueStrategies');
  try {
    const response = await fetch('http://10.200.36.113:8099/generate_revenue_strategies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data, 'data generateRevenueStrategies');
    return { success: true, data };
  } catch (error: any) {
    console.error('Retention strategy error:', error.message);
    return { success: false, error: error.message };
  }
}

export async function generateSatsficationStrategies({
  current_satisfaction_rating,
  target_satisfaction_rating,
  satisfaction_improvement_target,
  parameters,
}: {
  current_satisfaction_rating: number;
  target_satisfaction_rating: number;
  satisfaction_improvement_target: number;
  parameters: {
    support_ticket: Parameter;
    customer_service_calls: Parameter;
    offer_acceptance_rate: Parameter;
    promotion_score: Parameter;
    stickness_score: Parameter;
    days_active: Parameter;
    current_plan_price: Parameter;
  };
}) {
  const payload = {
    current_satisfaction_rating: current_satisfaction_rating,
    target_satisfaction_rating: target_satisfaction_rating,
    satisfaction_improvement_target: satisfaction_improvement_target,
    parameters: parameters,
  };
  console.log(payload, 'generateSatsficationStrategies');
  try {
    const response = await fetch('http://10.200.36.113:8099/generate_satisfaction_strategies/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data, 'data generateSatsficationStrategies');

    return { success: true, data };
  } catch (error: any) {
    console.error('Retention strategy error:', error.message);
    return { success: false, error: error.message };
  }
}

type Parameter = {
  current: number;
  expected: number;
  min: number;
  max: number;
  label: string;
};

export async function getChartInsights({ title, desc, data }: { title: string; desc: string; data: any }) {
  const payload = {
    module: 'persona_360',
    visualization: title,
    chart_description: desc,
    data_summary: data,
  };
  try {
    const response = await fetch(`${API_BASES.cvmApi}/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    // CVM backend returns an envelope: { data: { insight_title, summary, key_points, recommended_actions } }
    const body = await response.json();
    const d = body?.data ?? {};
    return {
      success: true,
      data: {
        insight_title: d.insight_title,
        summary: d.summary,
        insight_summary: d.key_points ?? [], // <AiInsight> reads `insight_summary`
        recommended_actions: d.recommended_actions ?? [],
      },
    };
  } catch (error: any) {
    console.error('Chart insights error:', error.message);
    throw new Error(`API error: ${error.message}`);
  }
}

export async function getChartInsightsRetention({ title, desc, data }: { title: string; desc: string; data: any }) {
  const payload = {
    module: 'persona_churn',
    visualization: title,
    chart_description: desc,
    data_summary: data,
  };
  try {
    const response = await fetch(`${API_BASES.cvmApi}/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    // CVM backend returns an envelope: { data: { insight_title, summary, key_points, recommended_actions } }
    const body = await response.json();
    const d = body?.data ?? {};
    return {
      success: true,
      data: {
        insight_title: d.insight_title,
        summary: d.summary,
        key_points: d.key_points ?? [], // <AiInsightRetention> reads `key_points`
        recommended_actions: d.recommended_actions ?? [],
      },
    };
  } catch (error: any) {
    console.error('Chart insights (retention) error:', error.message);
    throw new Error(`API error: ${error.message}`);
  }
}

// Per-customer AI narrative from the CVM backend's /api/v1/insights.
// NON-FATAL: returns {} on any failure so MSISDN search still shows SQL data.
// Maps the insight envelope to the { short_story, highlight } the dialogs render.
export async function getCustomerNarrative(
  module: string,
  msisdn: string | number,
  profile: any
): Promise<{
  short_story?: string;
  highlight?: string;
  customer_story?: string;
  key_insight?: string;
}> {
  try {
    const r = await fetch(`${API_BASES.cvmApi}/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module,
        visualization: `Customer ${msisdn} profile`,
        chart_description: 'Single-customer profile narrative',
        data_summary: profile,
      }),
    });
    if (!r.ok) return {};
    const d = (await r.json())?.data ?? {};
    // The two search dialogs use different field names for the same content:
    //   grid → short_story / highlight,  360 → customer_story / key_insight.
    return {
      short_story: d.summary,
      customer_story: d.summary,
      highlight: d.insight_title,
      key_insight: d.insight_title,
    };
  } catch (error: any) {
    console.error('Customer narrative failed (non-fatal):', error?.message);
    return {};
  }
}

export async function getBehaviourAnalysisCharts() {
  try {
    // CVM backend: GET /api/v1/persona-grid/segments → { data: [{segment_id,
    // segment_name, promotion_score, stickiness_score, arpu, customer_count}] }
    const response = await fetch(`${API_BASES.cvmApi}/persona-grid/segments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const body = await response.json();
    const data = (body?.data ?? []).map((s: any) => ({
      ...s,
      promotion_score: Number(s.promotion_score),
      stickiness_score: Number(s.stickiness_score),
      arpu: Number(s.arpu),
    }));
    return { success: true, data };
  } catch (error: any) {
    console.error('Behaviour analysis charts error:', error.message);
    throw new Error(`API error: ${error.message}`);
  }
}


export async function personaGridGetInsight() {
  try {
    // Pull the grid dashboard data from the CVM backend, then summarise it.
    const dashRes = await fetch(`${API_BASES.cvmApi}/persona-grid/global`);
    const dashboard = dashRes.ok ? ((await dashRes.json())?.data ?? {}) : {};

    const r = await fetch(`${API_BASES.cvmApi}/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'persona_grid',
        visualization: 'Persona Grid segmentation overview',
        chart_description: 'Segmentation KPIs, lifecycle, ARPU segmentation, sunburst',
        data_summary: dashboard,
      }),
    });
    if (!r.ok) {
      throw new Error(`API error: ${r.statusText}`);
    }
    const d = (await r.json())?.data ?? {};
    // Grid dialog renders key_insights as a STRING.
    return {
      success: true,
      data: {
        overview: d.summary ?? '',
        key_insights: (d.key_points ?? []).map((p: string) => `• ${p}`).join('\n'),
        strategic_takeaway: (d.recommended_actions ?? []).join(' '),
      },
    };
  } catch (error: any) {
    console.error('Grid module insight error:', error.message);
    throw new Error(`API error: ${error.message}`);
  }
}

