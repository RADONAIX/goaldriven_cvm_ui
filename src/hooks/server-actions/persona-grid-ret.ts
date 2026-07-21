'use server';

import { query } from '@/lib/db';

export default async function getSegmentDataForSunburstRet() {
  const sql = `
    SELECT 
      churn,
      total_data_used,
      total_sms_sent,
      total_minutes_used,
      MAX(total_data_used) OVER () AS max_data_usage,
      MAX(total_sms_sent) OVER () AS max_sms_usage,
      MAX(total_minutes_used) OVER () AS max_voice_usage
    FROM staging.customer360;
  `;

  const result = await query(sql);
  const data = result.rows;

  if (!data.length) return { name: 'Users', children: [] };

  // Since max usages are same for all rows (window function), pick from first row
  const maxDataUsage = data[0]?.max_data_usage || 1;
  const maxSmsUsage = data[0]?.max_sms_usage || 1;
  const maxVoiceUsage = data[0]?.max_voice_usage || 1;

  const categorizeUsage = (usage: number, maxLimit: number) => {
    if (maxLimit === 0) return 'Low';
    const percentage = (usage / maxLimit) * 100;
    if (percentage < 20) return 'Low';
    if (percentage <= 80) return 'Medium';
    return 'High';
  };

  const sumChildrenValues = (children: any[]) => children.reduce((acc, c) => acc + (c.value || 0), 0);

  // churnFlag will be "normal" or "churn"
  const buildSegment = (churnFlag: string) => {
    const filtered = data.filter((r) => r.churn === churnFlag);

    const usageCategories = ['Data', 'SMS', 'Voice'] as const;
    const children = usageCategories.map((usageType) => {
      const levels = ['Low', 'Medium', 'High'];

      const levelCounts = levels.map((level) => {
        let count = 0;
        if (usageType === 'Data') {
          count = filtered.filter((r) => categorizeUsage(r.total_data_used, maxDataUsage) === level).length;
        } else if (usageType === 'SMS') {
          count = filtered.filter((r) => categorizeUsage(r.total_sms_sent, maxSmsUsage) === level).length;
        } else if (usageType === 'Voice') {
          count = filtered.filter((r) => categorizeUsage(r.total_minutes_used, maxVoiceUsage) === level).length;
        }
        return { name: level, value: count };
      });

      const totalValue = sumChildrenValues(levelCounts);

      return {
        name: usageType,
        value: totalValue,
        children: levelCounts,
      };
    });

    const totalSegmentValue = sumChildrenValues(children);

    return {
      name: churnFlag === 'churn' ? 'Churned' : 'Not Churned',
      value: totalSegmentValue,
      children,
    };
  };

  return [buildSegment('normal'), buildSegment('churn')];
}

export const getRevenueOnPlanTypeRet = async () => {
    const sql = `
    SELECT 
      churn,
      plan_type,
      ROUND(AVG(total_revenue_generated_2), 2) AS avg_revenue
    FROM staging.customer360
    GROUP BY churn, plan_type
    ORDER BY churn, plan_type;
  `;
  const result = await query(sql);

  // Separate data by churn status
  const churnedData = [];
  const notChurnedData = [];

  result.rows.forEach(row => {
    const item = { name: row.plan_type, value: row.avg_revenue };
    if (row.churn === 'churn') {
      churnedData.push(item);
    } else {
      notChurnedData.push(item);
    }
  });

  return { churnedData, notChurnedData };
};

export const getChurnRiskOnAgeGroupRet = async () => {
  const sql = `
    SELECT
      CASE
        WHEN age BETWEEN 18 AND 24 THEN 'Youth'
        WHEN age BETWEEN 25 AND 59 THEN 'Adult'
        WHEN age >= 60 THEN 'Senior'
        ELSE 'Unknown'
      END AS age_group,
      subscriber_type,
      CASE
        WHEN churn = 'churn' THEN 'Churner'
        ELSE 'Non-Churner'
      END AS churn_status,
      COUNT(*) AS count
    FROM staging.customer360
    WHERE churn IS NOT NULL
    GROUP BY subscriber_type, age_group, churn_status;
  `;

  const result = await query(sql);
  return result?.rows;
};

export const getGenderChurnSunburst = async () => {
  const sql = `
    SELECT 
      COALESCE(gender, 'Unknown') AS gender,
      CASE 
        WHEN churn ='churn' THEN 'Churner'
        ELSE 'Non-Churner'
      END AS churn_status,
      COUNT(*) AS value
    FROM 
      staging.customer360
    GROUP BY 
      gender, churn_status
  `;
  const result = await query(sql);
  return result?.rows;
};
