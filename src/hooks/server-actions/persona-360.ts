'use server';

import { query } from '@/lib/db';

import API_BASES from '../../../apiConfig';
import { getCustomerNarrative } from './ml-apis';

export async function getCustomersDrillBy(gender: string) {
  const result = await query(
    `select msisdn, full_name, gender, date_of_birth, age FROM staging.customer360 WHERE gender = $1`,
    [gender]
  );
  return result.rows;
}

export async function getLanguageStats() {
  const res = await query(`
    SELECT language_preference, COUNT(*) AS count
    FROM staging.customer360
    GROUP BY language_preference
  `);
  return res.rows;
}

export async function getLanguageRegionMap(language: string) {
  const res = await query(`SELECT nationality FROM staging.customer360 WHERE language_preference = $1`, [language]);

  const regions: Record<string, number> = {};

  res.rows.forEach((row) => {
    const country = row.nationality?.trim() || 'Unknown';
    regions[country] = (regions[country] || 0) + 1;
  });

  return Object.entries(regions).map(([name, value]) => ({ name, value }));
}

export async function getPreferredChannels() {
  const res = await query(`
    SELECT preferred_communication_channel name, COUNT(*) AS value
    FROM staging.customer360
    GROUP BY preferred_communication_channel
  `);

  const subTypeRes = await query(`SELECT plan_type name , count ( *) value
                                  FROM 
                                  staging.customer360
                                  group by plan_type
                                  order by value desc;`);
  return {
    communicationChannels: res.rows,
    planType: {
      xData: subTypeRes.rows.map((data) => data.name),
      yData: subTypeRes.rows.map((data) => data.value),
    },
  };
}

export async function getSubscriberAnalysis() {
  let sql = `SELECT
  COUNT(*) AS "Total Subscriber",
  ROUND(AVG(arpu), 2) AS "Average ARPU",
  ROUND(AVG(customer_satisfaction_rating), 2) AS "Average CSAT"
  FROM staging.customer360
  WHERE arpu IS NOT NULL AND customer_satisfaction_rating IS NOT NULL;`;

  const sql2 = `SELECT age AS age, count(msisdn) AS count
      FROM (SELECT * FROM  staging.customer360) AS virtual_table 
      GROUP BY  age 
      ORDER BY count DESC LIMIT 10000;`;

  const sql3 = `WITH customer_bins AS (
      SELECT
        CASE 
          WHEN days_active / 30.0 BETWEEN 0 AND 4.99 THEN '0 - 4.99 months'
          WHEN days_active / 30.0 BETWEEN 5 AND 9.99 THEN '5 - 9.99 months'
          WHEN days_active / 30.0 BETWEEN 10 AND 14.99 THEN '10 - 14.99 months'
          WHEN days_active / 30.0 BETWEEN 15 AND 19.99 THEN '15 - 19.99 months'
          WHEN days_active / 30.0 BETWEEN 20 AND 24.99 THEN '20 - 24.99 months'
          WHEN days_active / 30.0 BETWEEN 25 AND 29.99 THEN '25 - 29.99 months'
          WHEN days_active / 30.0 BETWEEN 30 AND 34.99 THEN '30 - 34.99 months'
          WHEN days_active / 30.0 BETWEEN 35 AND 39.99 THEN '35 - 39.99 months'
          WHEN days_active / 30.0 BETWEEN 40 AND 44.99 THEN '40 - 44.99 months'
          WHEN days_active / 30.0 BETWEEN 45 AND 49.99 THEN '45 - 49.99 months'
          ELSE '50+ months'
        END AS tenure_bin
      FROM staging.customer360
    ),
    bin_order_map AS (
      SELECT * FROM (VALUES
        ('0 - 4.99 months', 1),
        ('5 - 9.99 months', 2),
        ('10 - 14.99 months', 3),
        ('15 - 19.99 months', 4),
        ('20 - 24.99 months', 5),
        ('25 - 29.99 months', 6),
        ('30 - 34.99 months', 7),
        ('35 - 39.99 months', 8),
        ('40 - 44.99 months', 9),
        ('45 - 49.99 months', 10),
        ('50+ months', 11)
      ) AS mapping(tenure_bin, bin_order)
    )

    SELECT 
      cb.tenure_bin, 
      COUNT(*) AS count
    FROM customer_bins cb
    JOIN bin_order_map bom ON cb.tenure_bin = bom.tenure_bin
    GROUP BY cb.tenure_bin, bom.bin_order
    ORDER BY bom.bin_order;
`;
  const sql4 = `SELECT TO_CHAR(a.date , 'Mon YYYY') as date, total_subscriber FROM staging.day_on_day_customer_360 a order by a.date;`;

  const sql5 = `SELECT count(*) value, subscriber_type name FROM staging.customer360 group by subscriber_type; `;

  const metricsSql = `SELECT
              COUNT(*) AS subscriber_count,
              ROUND(AVG(arpu), 2) AS avg_arpu,
              ROUND(AVG(customer_satisfaction_rating), 2) AS avg_csat
              FROM staging.customer360
              WHERE arpu IS NOT NULL AND customer_satisfaction_rating IS NOT NULL;`;

  const subscriberTypePiesql = `SELECT count(*) FROM staging.customer360 group by subscriber_type`;

  const commChannelSql = `
    SELECT preferred_communication_channel name, COUNT(*) AS value
    FROM staging.customer360
    GROUP BY preferred_communication_channel
  `;

  const subTypeSql = `SELECT plan_type name , count ( *) value
                                  FROM 
                                  staging.customer360
                                  group by plan_type
                                  order by value desc;`;

  const [
    countRes,
    ageDistributionRes,
    tenureDistRes,
    momSubRes,
    genderPieRes,
    metricsRes,
    subscriberTypePieRes,
    res,
    subTypeRes,
  ] = await Promise.all([
    query(sql),
    query(sql2),
    query(sql3),
    query(sql4),
    query(sql5),
    query(metricsSql),
    query(subscriberTypePiesql),
    query(commChannelSql),
    query(subTypeSql),
  ]);

  const ageDist = ageDistributionRes.rows.sort((a, b) => a.age - b.age);

  return {
    metrics: countRes.rows[0],
    data1: {
      xLabel: 'Months',
      yLabel: 'Total subscribers',
    },

    ageDist: {
      xData: ageDist.map((data) => data.age),
      yData: ageDist.map((data) => data.count),
    },
    tenureDist: {
      xData: tenureDistRes.rows.map((data) => data.tenure_bin),
      yData: tenureDistRes.rows.map((data) => data.count),
    },
    momSub: {
      xData: momSubRes.rows.map((data) => data.date),
      yData: momSubRes.rows.map((data) => data.total_subscriber),
    },
    genderPieData: genderPieRes?.rows ?? [],
    subscriber_count: metricsRes.rows[0].subscriber_count,
    avg_arpu: metricsRes.rows[0].avg_arpu,
    avg_csat: metricsRes.rows[0].avg_csat,
    subscriberTypePie: subscriberTypePieRes?.rows.map((row) => ({
      name: row.subscriber_type,
      value: row.subscriber_count,
    })),

    communicationChannels: res.rows,
    planType: {
      xData: subTypeRes.rows.map((data) => data.name),
      yData: subTypeRes.rows.map((data) => data.value),
    },
  };
}

export async function getRevenueAnaysis() {
  const revenueRes = await query(`SELECT 
                                      TO_CHAR(date_of_joining::DATE, 'Mon') AS months,
                                      TO_DATE( date_of_joining , 'YYYY-MM') as years,
                                      ROUND(SUM(total_revenue_generated_2), 2) AS monthly_revenue
                                  FROM 
                                      staging.customer360
                                  WHERE 
                                      date_of_joining::DATE >= CURRENT_DATE - INTERVAL '48 months'
                                  GROUP BY 
                                    months ,years
                                  ORDER BY years;`);

  const revenueTreeMap = await query(` SELECT 
                                        ROUND(SUM(total_revenue_generated_2), 2) AS total_revenue,
                                        subscriber_type,
                                        gender,
                                        plan_type,
                                        nationality
                                      FROM staging.customer360
                                      WHERE total_revenue_generated_2 IS NOT NULL
                                      GROUP BY subscriber_type, gender, plan_type, nationality
                                      ORDER BY total_revenue DESC;`);

  const revOnPrefComm = await query(`SELECT 
                                        TO_CHAR(date_of_joining::DATE, 'Mon') AS months,
                                        TO_DATE(date_of_joining, 'YYYY-MM') as years,
                                        preferred_communication_channel,
                                        ROUND(SUM(total_revenue_generated_2), 2) AS monthly_revenue
                                    FROM 
                                        staging.customer360
                                    WHERE 
                                        date_of_joining::DATE >= CURRENT_DATE - INTERVAL '48 months'
                                    GROUP BY 
                                        months, years, preferred_communication_channel
                                    ORDER BY 
                                        years, months;`);

  const data: any = {};

  revOnPrefComm.rows.forEach((row) => {
    if (!data[row.preferred_communication_channel]) {
      data[row.preferred_communication_channel] = {
        months: [],
        revenue: [],
      };
    }

    data[row.preferred_communication_channel].months.push(row.months);
    data[row.preferred_communication_channel].revenue.push(row.monthly_revenue);
  });

  const treeData = transformData(revenueTreeMap.rows);

  function transformData(rows: any[]) {
    const root: { name: string; value: number; children: any[] }[] = [
      {
        name: 'Subscriber Type',
        value: 0,
        children: [],
      },
    ];

    rows.forEach((row) => {
      let subscriberType = findOrCreate(root[0].children, row.subscriber_type);
      let gender = findOrCreate(subscriberType.children, row.gender);
      let planType = findOrCreate(gender.children, row.plan_type);
      let nationality = findOrCreate(planType.children, row.nationality);

      nationality.children.push({
        name: row.nationality,
        value: row.total_revenue,
      });
    });

    return root;
  }

  function findOrCreate(arr: { name: string; value: number; children: any[] }[], name: string) {
    let node = arr.find((item) => item.name === name);
    if (!node) {
      node = { name, value: 0, children: [] };
      arr.push(node);
    }
    return node;
  }

  return {
    revenueData: {
      xData: revenueRes.rows.map((data) => data.months),
      yData: revenueRes.rows.map((data) => data.monthly_revenue),
    },
    treeData: treeData,
    channelsData: data,
  };
}

export async function getCSATAnalysis() {
  let sql = `SELECT ARRAY[
                    AVG(promotion_score), 
                    AVG(stickness_score)
                ] AS score_array
                FROM staging.customer360;`;

  const sql2 = `SELECT promotion_score AS promotion_score, count(msisdn) AS "subscriber" 
                    FROM  staging.customer360 AS virtual_table 
                    GROUP BY promotion_score `;

  const sql3 = `
                    SELECT stickness_score AS stickness_score, count(msisdn) AS "subscriber" 
                    FROM  staging.customer360 AS virtual_table 
                    GROUP BY stickness_score `;

  const sql4 = `SELECT ROUND(AVG(customer_satisfaction_rating)::numeric, 1) AS value FROM staging.customer360; `;

  const sql5 = ` 
                    SELECT customer_satisfaction_rating AS customer_satisfaction_rating, count(customer_satisfaction_rating) AS "satisfaction_rating" 
                    FROM staging.customer360 AS virtual_table 
                    GROUP BY customer_satisfaction_rating 
                    ORDER BY "satisfaction_rating" DESC`;

  const [polarRes, promotionRes, stickinessres, gaugeValue, custSatisRes] = await Promise.all([
    query(sql),
    query(sql2),
    query(sql3),
    query(sql4),
    query(sql5),
  ]);

  return {
    polarData: polarRes.rows[0].score_array,
    gaugeValue: gaugeValue.rows[0].value,
    custSatisData: {
      xData: custSatisRes.rows.map((data) => data.satisfaction_rating),
      yData: custSatisRes.rows.map((data) => data.customer_satisfaction_rating),
    },
    doubleLineChart: {
      promotion_score: promotionRes.rows,
      stickness_score: stickinessres.rows,
    },
  };
}

export async function getUsageAnalysis() {
  let sql = `SELECT ROUND(AVG(current_sms_plan_usage) , 2) AS "Avg Monthly SMS Sent" ,
                ROUND(AVG(current_voice_plan_usage) , 2) as "Avg Monthly Voice Usage (Hrs)",
                ROUND(AVG(current_data_plan_usage) , 2)  as "Avg Monthly Data Usage (GB)",
                ROUND(AVG(total_minutes_used) , 2) as "Avg Voice Usage (Hrs)",
                ROUND( AVG(total_data_used) , 2) as "Avg Data Usage (GB)",
                ROUND( AVG(total_sms_sent) , 2) as "Avg SMS Sent"
                FROM staging.customer360 `;

  const sql2 = `SELECT 
                    CONCAT(bucket * 10, ' - ', bucket * 10 + 9) AS x_axis,
                    COUNT(*) AS y_axis
                  FROM (
                    SELECT FLOOR(current_sms_plan_usage / 10) AS bucket
                    FROM staging.customer360
                    WHERE current_sms_plan_usage IS NOT NULL
                    LIMIT 10000
                  ) AS bucketed
                  GROUP BY bucket
                  ORDER BY bucket;`;
  const sql3 = `SELECT 
                    CONCAT(bucket * 10, ' - ', bucket * 10 + 9) AS x_axis,
                    COUNT(*) AS y_axis
                  FROM (
                    SELECT FLOOR(current_voice_plan_usage / 10) AS bucket
                    FROM staging.customer360
                    WHERE current_voice_plan_usage IS NOT NULL
                    LIMIT 10000
                  ) AS bucketed
                  GROUP BY bucket
                  ORDER BY bucket;`;
  const sql4 = `SELECT 
                    CONCAT(bucket * 1, ' - ', bucket * 1 + 0.9) AS x_axis,
                    COUNT(*) AS y_axis
                  FROM (
                    SELECT FLOOR(current_data_plan_usage / 1) AS bucket
                    FROM staging.customer360
                    WHERE current_data_plan_usage IS NOT NULL
                    LIMIT 10000
                  ) AS bucketed
                  GROUP BY bucket
                  ORDER BY bucket`;

  const [countRes, smsUsageRes, voiceUsageRes, dataUsageRes] = await Promise.all([
    query(sql),
    query(sql2),
    query(sql3),
    query(sql4),
  ]);

  return {
    metrics: countRes.rows[0],
    smsUsage: {
      xData: smsUsageRes.rows.map((data) => data.x_axis),
      yData: smsUsageRes.rows.map((data) => data.y_axis),
    },
    voiceUsage: {
      xData: voiceUsageRes.rows.map((data) => data.x_axis),
      yData: voiceUsageRes.rows.map((data) => data.y_axis),
    },
    dataUsage: {
      xData: dataUsageRes.rows.map((data) => data.x_axis),
      yData: dataUsageRes.rows.map((data) => data.y_axis),
    },
  };
}

export async function getMSISDNInisght(msisdn: string) {
  try {
    const custRes = await query(
      `select age , msisdn, full_name, gender , days_active , subscriber_type,
      social_media_engagement , total_revenue_generated_2 , average_monthly_spending_2 , arpu , customer_lifetime_value ,
      promotion_score , stickness_score , customer_satisfaction_rating
      FROM staging.customer360
      where msisdn = $1 `,
      [msisdn]
    );

    const usageRes = await query(
      `SELECT
      ROUND(AVG(monthly_data_usage), 2) AS data_usage,
      ROUND(AVG(monthly_sms_usage), 2) AS sms_usage,
      ROUND(AVG(monthly_voice_usage), 2) AS voice_usage
    FROM (
      SELECT
        DATE_TRUNC('month', date) AS usage_month,
        SUM("data _usage") AS monthly_data_usage,
        SUM(sms_usage) AS monthly_sms_usage,
        SUM(voice_usage) AS monthly_voice_usage
      FROM
        staging.datewise_usage_of_subscribers
      WHERE
        msisdn = $1
      GROUP BY
        usage_month
    ) monthly_usage; `,
      [msisdn]
    );

    const profile = {
      ...custRes?.rows[0],
      ...usageRes?.rows[0],
    };
    // AI narrative from the CVM backend (non-fatal — search still works if it fails).
    const ai = await getCustomerNarrative('persona_360', msisdn, profile);

    return { ...ai, ...profile };
  } catch (error: any) {
    console.error('360 customer search error:', error.message);
    throw new Error(`API error: ${error.message}`);
  }
}


export async function persona360GetInsight() {
  try {
    // Pull the 360 overview data from the CVM backend, then summarise it.
    const dashRes = await fetch(`${API_BASES.cvmApi}/persona-360/overview`);
    const dashboard = dashRes.ok ? ((await dashRes.json())?.data ?? {}) : {};

    const r = await fetch(`${API_BASES.cvmApi}/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'persona_360',
        visualization: 'Persona 360 portfolio overview',
        chart_description: 'Subscriber, usage, revenue and CSAT KPIs',
        data_summary: dashboard,
      }),
    });
    if (!r.ok) {
      throw new Error(`API error: ${r.statusText}`);
    }
    const d = (await r.json())?.data ?? {};
    // 360 dialog maps over key_insights, so it must be an ARRAY.
    return {
      success: true,
      data: {
        overview: d.summary ?? '',
        key_insights: d.key_points ?? [],
        strategic_takeaway: (d.recommended_actions ?? []).join(' '),
      },
    };
  } catch (error: any) {
    console.error('360 module insight error:', error.message);
    throw new Error(`API error: ${error.message}`);
  }
}
