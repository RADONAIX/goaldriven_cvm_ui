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

export async function getBehaviourAnalysisCharts() {
  try {
    const response = await fetch(API_BASES.gridCharts, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error: any) {
    console.error('Retention strategy error:', error.message);
    throw new Error(`API error: ${error.message}`);
  }
}


export async function personaGridGetInsight() {
  try {
    const response = await fetch(API_BASES.personaGridInsight, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error: any) {
    console.error('Retention strategy error:', error.message);
    throw new Error(`API error: ${error.message}`);
  }
}

