'use server';

import { query } from '@/lib/db';

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
  const subscriber_Type = `SELECT count(*) value, subscriber_type name FROM staging.customer360 group by subscriber_type; `;
  const subscriber_Type_Retention = `SELECT
     CASE
       WHEN subscriber_type = 'Postpaid' AND churn = 'churn' THEN 'postpaid churners'
       WHEN subscriber_type = 'Postpaid' AND churn = 'normal' THEN 'postpaid non churners'
       WHEN subscriber_type = 'Prepaid' AND churn = 'churn' THEN 'prepaid churners'
       WHEN subscriber_type = 'Prepaid' AND churn = 'normal' THEN 'prepaid non churners'
       ELSE 'unknown'
      END AS name,
    COUNT(*) AS value
    FROM staging.customer360
    GROUP BY name Order BY name;`;

  let sql = `SELECT
          CASE 
            WHEN churn = 'churn' THEN 'Churners'
            ELSE 'Non-Churners'
          END AS status,
          COUNT(*) AS "Total Subscribers",
          ROUND(AVG(arpu), 2) AS "Average ARPU",
          ROUND(AVG(customer_satisfaction_rating), 2) AS "Average CSAT"
        FROM staging.customer360
        WHERE arpu IS NOT NULL AND customer_satisfaction_rating IS NOT NULL
        GROUP BY status
        ORDER BY status;
`;

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

  const metricsSql = `SELECT
              COUNT(*) AS subscriber_count,
              ROUND(AVG(arpu), 2) AS avg_arpu,
              ROUND(AVG(customer_satisfaction_rating), 2) AS avg_csat
              FROM staging.customer360
              WHERE arpu IS NOT NULL AND customer_satisfaction_rating IS NOT NULL;`;

  const commChannelSql = `
    SELECT
    preferred_communication_channel AS channel,
    CASE
    WHEN churn = 'churn' THEN 'Churners'
    ELSE 'Non-Churners'
    END AS status,
    COUNT(*) AS value
    FROM staging.customer360
    GROUP BY channel, status;`;

  const subTypeSql = `SELECT plan_type AS channel,
  CASE
    WHEN churn = 'churn' THEN 'Churners'
    ELSE 'Non-Churners'
  END AS status, COUNT(*) AS value FROM staging.customer360
  GROUP BY plan_type, status;
`;

  const [
    subscriber_Type_res,
    subscriber_Type_Retention_res,
    countRes,
    ageDistributionRes,
    tenureDistRes,
    momSubRes,
    metricsRes,
    res,
    subTypeRes,
  ] = await Promise.all([
    query(subscriber_Type),
    query(subscriber_Type_Retention),
    query(sql),
    query(sql2),
    query(sql3),
    query(sql4),
    query(metricsSql),
    query(commChannelSql),
    query(subTypeSql),
  ]);

  const ageDist = ageDistributionRes.rows.sort((a, b) => a.age - b.age);

  return {
    metrics: countRes.rows,
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
    genderPieData: subscriber_Type_res?.rows ?? [],
    subscriber_count: metricsRes.rows[0].subscriber_count,
    avg_arpu: metricsRes.rows[0].avg_arpu,
    avg_csat: metricsRes.rows[0].avg_csat,
    communicationChannels: res.rows,
    planType: subTypeRes.rows,
    subscriber_Type_Retention_data: {
      outerData: subscriber_Type_Retention_res.rows,
      innerData: subscriber_Type_res.rows,
    },
  };
}

export async function getRevenueAnaysis() {
  const revenueRes = await query(`SELECT 
                                TO_CHAR(date_of_joining::date, 'Mon') AS channel,
                                TO_CHAR(date_of_joining::date, 'YYYY-MM') AS year_month,
                                CASE 
                                  WHEN  churn = 'churn' THEN 'Churners'
                                  ELSE 'Non-Churners'
                                END AS status,
                                ROUND(SUM(total_revenue_generated_2), 2) AS value
                              FROM staging.customer360
                              --WHERE 
                                --date_of_joining::date >= CURRENT_DATE - INTERVAL '48 months'
                              GROUP BY 
                                year_month, channel, status
                              ORDER BY 
                                year_month, status;
                                `);

  const revenueTreeMap = await query(` SELECT 
                                ROUND(SUM(total_revenue_generated_2), 2) AS total_revenue,
                                CASE 
                                  WHEN churn = 'churn' THEN 'Churners'
                                  ELSE 'Non-Churners'
                                END AS churn_status,
                                subscriber_type,
                                gender,
                                plan_type,
                                nationality
                              FROM staging.customer360
                              WHERE total_revenue_generated_2 IS NOT NULL
                              GROUP BY churn_status, subscriber_type, gender, plan_type, nationality
                              ORDER BY total_revenue DESC;`);

  const revOnPrefComm = await query(`SELECT 
                                      TO_CHAR(date_of_joining::date, 'Mon') AS months,
                                      TO_CHAR(date_of_joining::date, 'YYYY-MM') AS year_month,
                                      preferred_communication_channel,
                                      CASE 
                                        WHEN churn = 'churn' THEN 'Churners'
                                        ELSE 'Non-Churners'
                                      END AS status,
                                      ROUND(SUM(total_revenue_generated_2), 2) AS monthly_revenue
                                    FROM staging.customer360
                                    --WHERE 
                                    --  date_of_joining::date >= CURRENT_DATE - INTERVAL '48 months'
                                    GROUP BY 
                                      year_month, months, preferred_communication_channel, status
                                    ORDER BY 
                                      year_month, preferred_communication_channel, status`);

  const transformed: Record<string, { months: string[]; revenue: number[] }> = {};

  revOnPrefComm.rows.forEach(({ months, preferred_communication_channel, status, monthly_revenue }) => {
    const key = `${preferred_communication_channel} ${status}`;

    if (!transformed[key]) {
      transformed[key] = { months: [], revenue: [] };
    }

    if (!transformed[key].months.includes(months)) {
      transformed[key].months.push(months);
      transformed[key].revenue.push(parseFloat(monthly_revenue));
    } else {
      const idx = transformed[key].months.indexOf(months);
      transformed[key].revenue[idx] += parseFloat(monthly_revenue);
    }
  });

  const treeData = transformData(revenueTreeMap.rows);

  function transformData(rows: any[]) {
    const root: { name: string; value: number; children: any[] }[] = [
      {
        name: 'Churn Status',
        value: 0,
        children: [],
      },
    ];

    rows.forEach((row) => {
      const churnStatus = findOrCreate(root[0].children, row.churn_status);
      const subscriberType = findOrCreate(churnStatus.children, row.subscriber_type);
      const gender = findOrCreate(subscriberType.children, row.gender);
      const planType = findOrCreate(gender.children, row.plan_type);
      const nationality = findOrCreate(planType.children, row.nationality);

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
    revenueData: revenueRes.rows,
    treeData: treeData,
    channelsData: transformed,
  };
}

export async function getCSATAnalysis() {
  let sql = `SELECT ARRAY[
                    AVG(promotion_score), 
                    AVG(stickness_score)
                ] AS score_array
                FROM staging.customer360;`;

  const sql2 = `-- Promotion Score vs Churn
                  SELECT 
                    promotion_score AS score,
                    CASE 
                      WHEN churn = 'churn' THEN 'Churners'
                      ELSE 'NonChurners'
                    END AS status,
                    COUNT(msisdn) AS subscriber,
                    'promotion_score' AS score_type
                  FROM staging.customer360
                  WHERE promotion_score IS NOT NULL
                  GROUP BY promotion_score, status

                  UNION ALL

                  -- Stickness Score vs Churn
                  SELECT 
                    stickness_score AS score,
                    CASE 
                      WHEN churn = 'churn' THEN 'Churners'
                      ELSE 'NonChurners'
                    END AS status,
                    COUNT(msisdn) AS subscriber,
                    'stickness_score' AS score_type
                  FROM staging.customer360
                  WHERE stickness_score IS NOT NULL
                  GROUP BY stickness_score, status;
                  `;

  const sql4 = `SELECT
                  CASE
                    WHEN churn = 'churn' THEN 'Churners'
                    ELSE 'Non-Churners'
                  END AS status,
                  ROUND(AVG(customer_satisfaction_rating)::numeric, 1) AS value
                FROM staging.customer360
                WHERE customer_satisfaction_rating IS NOT NULL
                GROUP BY status;
 `;

  const sql5 = ` SELECT 
                  customer_satisfaction_rating AS channel,
                  CASE 
                    WHEN churn = 'churn' THEN 'Churners'
                    ELSE 'Non-Churners'
                  END AS status,
                  COUNT(*) AS value
                FROM staging.customer360
                WHERE customer_satisfaction_rating IS NOT NULL
                GROUP BY customer_satisfaction_rating, status
                ORDER BY channel, status;
                `;

  const [polarRes, scoreRes, gaugeValue, custSatisRes] = await Promise.all([
    query(sql),
    query(sql2),
    query(sql4),
    query(sql5),
  ]);

  interface Row {
    score: number;
    status: 'Churners' | 'NonChurners';
    subscriber: number;
    score_type: 'promotion_score' | 'stickness_score';
  }

  function transformChurnScoreData(rows: Row[]) {
    const result: {
      [scoreType: string]: {
        Churners: { score: number; subscriber: number }[];
        NonChurners: { score: number; subscriber: number }[];
      };
    } = {};

    rows.forEach(({ score, status, subscriber, score_type }) => {
      if (!result[score_type]) {
        result[score_type] = { Churners: [], NonChurners: [] };
      }

      result[score_type][status].push({ score, subscriber });
    });

    return result;
  }
  return {
    polarData: polarRes.rows[0].score_array,
    gaugeValue: gaugeValue.rows,
    custSatisData: custSatisRes.rows,
    doubleLineChart: transformChurnScoreData(scoreRes.rows),
  };
}

export async function getUsageAnalysis() {
  let sql = `SELECT
          CASE 
            WHEN churn = 'churn' THEN 'Churners'
            ELSE 'Non-Churners'
          END AS status,
          ROUND(AVG(current_sms_plan_usage), 2) AS "Avg Monthly SMS Sent",
          ROUND(AVG(current_voice_plan_usage), 2) AS "Avg Monthly Voice Usage (Hrs)",
          ROUND(AVG(current_data_plan_usage), 2) AS "Avg Monthly Data Usage (GB)",
          ROUND(AVG(total_minutes_used), 2) AS "Avg Voice Usage (Hrs)",
          ROUND(AVG(total_data_used), 2) AS "Avg Data Usage (GB)",
          ROUND(AVG(total_sms_sent), 2) AS "Avg SMS Sent"
        FROM staging.customer360
        GROUP BY status
        ORDER BY status; `;

  const sql2 = `SELECT 
          CONCAT(bucket * 10, ' - ', bucket * 10 + 9) AS channel,
          CASE 
            WHEN churn = 'churn' THEN 'Churners'
      ELSE 'Non-Churners'
          END AS status,
          COUNT(*) AS value
        FROM (
          SELECT
            FLOOR(current_sms_plan_usage / 10) AS bucket,
            churn
          FROM staging.customer360
          WHERE current_sms_plan_usage IS NOT NULL
          LIMIT 10000
        ) AS bucketed
        GROUP BY bucket, status
        ORDER BY bucket;
        `;
  const sql3 = `SELECT CONCAT(bucket * 10, ' - ', bucket * 10 + 9) AS channel,
                CASE 
                WHEN churn = 'churn' THEN 'Churners' ELSE 'Non-Churners'
                END AS status,
              COUNT(*) AS value
            FROM (
              SELECT
                FLOOR(current_voice_plan_usage / 10) AS bucket,
                churn
              FROM staging.customer360
              WHERE current_voice_plan_usage IS NOT NULL
              LIMIT 10000
            ) AS bucketed
            GROUP BY bucket, status
            ORDER BY bucket;
            `;
  const sql4 = `SELECT 
        CONCAT(bucket * 1, ' - ', bucket * 1 + 0.9) AS channel,
        CASE 
          WHEN churn = 'churn' THEN 'Churners'
          ELSE 'Non-Churners'
        END AS status,
        COUNT(*) AS value
      FROM (
        SELECT
          FLOOR(current_data_plan_usage / 1) AS bucket,
          churn
        FROM staging.customer360
        WHERE current_data_plan_usage IS NOT NULL
        LIMIT 10000
      ) AS bucketed
      GROUP BY bucket, status
      ORDER BY bucket;
      `;

  const [countRes, smsUsageRes, voiceUsageRes, dataUsageRes] = await Promise.all([
    query(sql),
    query(sql2),
    query(sql3),
    query(sql4),
  ]);

  return {
    metrics: countRes.rows,
    smsUsage: smsUsageRes.rows,
    voiceUsage: voiceUsageRes.rows,
    dataUsage: dataUsageRes.rows,
  };
}
