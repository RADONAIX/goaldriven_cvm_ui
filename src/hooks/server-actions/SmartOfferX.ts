// app/actions/fetchSmartOfferXData.ts (adjust path as needed)
'use server';

import { query } from '@/lib/db';

import API_BASES from '../../../apiConfig';

export async function fetchSmartOfferXData(msisdn: number) {
  const sql = `
    SELECT 
      msisdn,
      full_name,
      last_top_up_amount,
      pack_name,
      current_plan_validity,
      churn_probability,
      churn_risk,
      total_offer_sent,
      mom_voice_usage,
      mom_data_usage,
      mom_sms_usage
    FROM staging.customer360
    WHERE msisdn = $1
    LIMIT 1;
  `;
  const result = await query(sql, [msisdn]);
  try {
    
    // CVM backend: GET /api/v1/nbo/smart-offer/{msisdn} → { data: { offers: [...] } }
    // Offer shape (title/reason/agent_pitch/acceptance_rate/arpu_increase) already
    // matches what the SmartOfferX page renders.
    const response = await fetch(`${API_BASES.cvmApi}/nbo/smart-offer/${msisdn}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const body = await response.json();

    return {
      error: null,
      data: result.rows,
      smartOffer: body?.data?.offers ?? null,
    };
  } catch (error) {
    console.error('Error fetching smart offer data:', error);
    return {
      data: result.rows,
      smartOffer: null,
      error: 'Failed to fetch smart offer data',
    };
  }
}
