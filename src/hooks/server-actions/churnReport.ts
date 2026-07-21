'use server';

import { ChurnReport } from '@/types/nav';
import API_BASES from '../../../apiConfig';

export async function getChurnReportXAI(data: ChurnReport) {
  const payload = {
    msisdn: data.msisdn,
    full_name: data.full_name,
    gender: data.gender,
    age: data.age,
    nationality: data.nationality,
    marital_status: data.marital_status,
    date_of_joining: data.date_of_joining,
    days_active: data.days_active,
    customer_type: data.subscriber_type,
    total_revenue_generated_2: data.total_revenue_generated_2,
    average_monthly_spending_2: data.average_monthly_spending_2,
    churn_probability: data.churn_probability,
    churn_risk: data.churn_risk,
    revenue_margin_category: data.revenue_margin_category,
    data_price: data.data_price,
    sms_price: data.sms_price,
    voice_price: data.voice_price,
    current_pack_price: data.current_pack_price,
    new_offer_provided: data.new_offer_provided,
    new_offer_price: data.new_offer_price,
  };

  
    const response = await fetch(API_BASES.explain, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const res = await response.json();

    return { success: true, data : res };
 
}
