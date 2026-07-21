'use server';

import { query } from '@/lib/db';

import { getCustomerNarrative } from './ml-apis';

export default async function getSegmentDataForSunburst() {
  const sql = `
    SELECT 
      total_data_used,
      total_sms_sent,
      total_minutes_used,
      (SELECT MAX(total_data_used) FROM staging.customer360) AS max_data_usage,
      (SELECT MAX(total_sms_sent) FROM staging.customer360) AS max_sms_usage,
      (SELECT MAX(total_minutes_used) FROM staging.customer360) AS max_voice_usage
    FROM staging.customer360;
  `;

  // Fetch data from the database
  const result = await query(sql);
  const data = result.rows;

  // Get the maximum limits for Data, SMS, and Voice usage
  const maxDataUsage = data[0].max_data_usage;
  const maxSmsUsage = data[0].max_sms_usage;
  const maxVoiceUsage = data[0].max_voice_usage;

  // Define thresholds for low, medium, and high categorization
  const categorizeUsage = (usage: number, maxLimit: number) => {
    const percentage = (usage / maxLimit) * 100;
    if (percentage < 20) return 'Low';
    else if (percentage >= 20 && percentage <= 80) return 'Medium';
    return 'High';
  };

  // Structure the data for Sunburst chart
  const formattedData = [
    {
      name: 'Data',
      children: [
        {
          name: 'Low',
          value: data.filter((row) => categorizeUsage(row.total_data_used, maxDataUsage) === 'Low').length,
        },
        {
          name: 'Medium',
          value: data.filter((row) => categorizeUsage(row.total_data_used, maxDataUsage) === 'Medium').length,
        },
        {
          name: 'High',
          value: data.filter((row) => categorizeUsage(row.total_data_used, maxDataUsage) === 'High').length,
        },
      ],
    },
    {
      name: 'SMS',
      children: [
        { name: 'Low', value: data.filter((row) => categorizeUsage(row.total_sms_sent, maxSmsUsage) === 'Low').length },
        {
          name: 'Medium',
          value: data.filter((row) => categorizeUsage(row.total_sms_sent, maxSmsUsage) === 'Medium').length,
        },
        {
          name: 'High',
          value: data.filter((row) => categorizeUsage(row.total_sms_sent, maxSmsUsage) === 'High').length,
        },
      ],
    },
    {
      name: 'Voice',
      children: [
        {
          name: 'Low',
          value: data.filter((row) => categorizeUsage(row.total_minutes_used, maxVoiceUsage) === 'Low').length,
        },
        {
          name: 'Medium',
          value: data.filter((row) => categorizeUsage(row.total_minutes_used, maxVoiceUsage) === 'Medium').length,
        },
        {
          name: 'High',
          value: data.filter((row) => categorizeUsage(row.total_minutes_used, maxVoiceUsage) === 'High').length,
        },
      ],
    },
  ];

  return formattedData;
}

export const getRevenueOnPlanType = async () => {
  const sql = `
        SELECT 
        plan_type,
        round ( avg(total_revenue_generated_2) , 2) avg_revenue
        FROM staging.customer360
        GROUP BY plan_type;
    `;
  const result = await query(sql);

  const funnelData = result?.rows?.map((row) => ({
    name: row.plan_type,
    value: row.avg_revenue,
  }));
  return funnelData;
};

export const getChurnRiskOnAgeGroup = async () => {
  const sql = `
            SELECT
            CASE
                WHEN age BETWEEN 18 AND 24 THEN 'Youth'
                WHEN age BETWEEN 25 AND 59 THEN 'Adult'
                WHEN age >= 60 THEN 'Senior'
                ELSE 'Unknown'
            END AS age_group,
            subscriber_type,
            COUNT(*) AS churn_count
            FROM staging.customer360
            WHERE churn IS NOT NULL
            GROUP BY subscriber_type, age_group; `;
  const result = await query(sql);

  return result?.rows;
};

export const getGenderDist = async () => {
  const sql = `
              SELECT 
                    gender as name ,
                    COUNT(*) AS value
                  FROM 
                    staging.customer360
                  GROUP BY 
                    gender `;
  const result = await query(sql);

  return result?.rows;
};

export async function getSubscriberMigrationAnalysis() {
  const sql = `
    SELECT msisdn, jan_arpu, feb_arpu
    FROM staging.arpu_decile_analysis
    WHERE jan_arpu IS NOT NULL AND feb_arpu IS NOT NULL
  `;
  const { rows } = await query(sql);

  const janValues = rows.map((r) => +r.jan_arpu);
  const febValues = rows.map((r) => +r.feb_arpu);

  const getDeciles = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    const deciles = [];

    for (let i = 0; i < 10; i++) {
      const start = Math.floor((i * n) / 10);
      const end = Math.floor(((i + 1) * n) / 10);
      const slice = sorted.slice(start, end);

      const avg = slice.length ? slice.reduce((a, b) => a + b, 0) / slice.length : 0;
      deciles.push(avg);
    }

    return deciles;
  };

  const findDecile = (value: number, deciles: number[]) => deciles.findIndex((d) => value <= d) + 1 || 10;

  const janDeciles = getDeciles(janValues);
  const febDeciles = getDeciles(febValues);

  const matrix = Array.from({ length: 10 }, () => Array(10).fill(0));

  for (const { jan_arpu, feb_arpu } of rows) {
    const janDecile = findDecile(+jan_arpu, janDeciles) - 1;
    const febDecile = findDecile(+feb_arpu, febDeciles) - 1;
    matrix[janDecile][febDecile]++;
  }

  return {
    deciles: {
      jan_deciles: janDeciles,
      feb_deciles: febDeciles,
    },
    migration_matrix: matrix,
  };
}

export async function getMSISDNInisghtGrid(msisdn: string) {
  try {
    const custRes = await query(
      `	select age , msisdn, full_name, gender , subscriber_type, arpu , retention_score , 
        promotion_score , stickness_score ,
        CASE 
          WHEN days_active >= 1095 THEN 'Long-term'      
          WHEN days_active >= 365 THEN 'Medium-term'     
          ELSE 'New'                                      
        END AS tenure_type
        FROM staging.customer360
        where msisdn = $1 `,
      [msisdn]
    );

    const decileRes = await query(
      `	WITH c AS (
        SELECT 
            msisdn,
            NTILE(10) OVER (ORDER BY jan_arpu) AS jan_decile,
            NTILE(10) OVER (ORDER BY feb_arpu) AS feb_decile
        FROM staging.arpu_decile_analysis
        )
        select jan_decile, feb_decile from c
        where msisdn = $1 `,
      [msisdn]
    );

    const usageRes = await query(
      `	
      WITH latest_usage AS (
        SELECT *
        FROM staging.datewise_usage_of_subscribers
        WHERE msisdn = $1
        ORDER BY date DESC
        LIMIT 1
      ),
      usage_ranges AS (
        SELECT
          MIN("data _usage") AS min_data,
          MAX("data _usage") AS max_data,
          MIN(sms_usage) AS min_sms,
          MAX(sms_usage) AS max_sms,
          MIN(voice_usage) AS min_voice,
          MAX(voice_usage) AS max_voice
        FROM staging.datewise_usage_of_subscribers
      ),
      tagged_usage AS (
        SELECT 
          msisdn,

          CASE 
            WHEN "data _usage" <= min_data + (max_data - min_data)/3 THEN 'Low'
            WHEN "data _usage" <= min_data + 2*(max_data - min_data)/3 THEN 'Medium'
            ELSE 'High'
          END AS data_bucket,

          CASE 
            WHEN sms_usage <= min_sms + (max_sms - min_sms)/3 THEN 'Low'
            WHEN sms_usage <= min_sms + 2*(max_sms - min_sms)/3 THEN 'Medium'
            ELSE 'High'
          END AS sms_bucket,

          CASE 
            WHEN voice_usage <= min_voice + (max_voice - min_voice)/3 THEN 'Low'
            WHEN voice_usage <= min_voice + 2*(max_voice - min_voice)/3 THEN 'Medium'
            ELSE 'High'
          END AS voice_bucket

        FROM latest_usage, usage_ranges
      )

      SELECT data_bucket data_usage, sms_bucket sms_usage, voice_bucket voice_usage FROM tagged_usage;`,
      [msisdn]
    );

    const profile = {
      ...custRes?.rows[0],
      ...decileRes?.rows[0],
      ...usageRes?.rows[0],
    };
    const ai = await getCustomerNarrative('persona_grid', msisdn, profile);
    return { ...ai, ...profile };
  } catch (error: any) {
    console.error('Grid customer search error:', error.message);
    throw new Error(`API error: ${error.message}`);
  }
}
