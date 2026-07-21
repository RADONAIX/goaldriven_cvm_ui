'use server';

import { query } from '@/lib/db';

export async function getChurnData() {
  let sql = `SELECT
                COUNT( CASE WHEN churn = 'churn' THEN msisdn END) AS "Total Churns",

                ROUND(
                    (COUNT(DISTINCT CASE WHEN churn = 'churn' THEN msisdn END) * 100.0) / 
                    COUNT(*),
                    0
                ) AS "Predicted Churn (%)",

               
                    ROUND(
                        SUM(CASE WHEN churn = 'churn' THEN total_revenue_generated_2 ELSE 0 END) + 
                        SUM(CASE WHEN churn_probability > 0.5 THEN total_revenue_generated_2 ELSE 0 END),
                        0
                    ) AS "Revenue at Risk ($)"

            FROM 
                staging.customer360 `;

  const sql3 = `SELECT 
                        churn_risk name,
                        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2)::Int AS value
                      FROM staging.customer360
                      GROUP BY churn_risk;`;

  const sql4 = `SELECT 
                          date,
                        TO_CHAR(date , 'Mon YYYY') as months ,
                          total_subscriber,
                          predicted_churner,
                          actual_churner,
                          retained_customer,
                          ROUND((actual_churner::decimal / NULLIF(total_subscriber, 0)) * 100, 2) AS churn_rate,
                          ROUND((retained_customer::decimal / NULLIF(total_subscriber, 0)) * 100, 2) AS retention_rate
                      FROM 
                          staging.day_on_day_customer_360
                      ORDER BY 
                          date; `;

  const sql5 = `SELECT 
                        subscriber_type,
                        COUNT(*) FILTER (WHERE churn = 'churn')::Int AS churners,
                        COUNT(*) FILTER (WHERE churn != 'churn')::Int AS non_churners
                      FROM staging.customer360
                      GROUP BY subscriber_type;`;

  const sql6 = `SELECT 
                        nationality as name, 
                        ROUND(COUNT(*) FILTER (WHERE churn = 'churn') * 100.0 / COUNT(*), 2) AS value
                      FROM 
                        staging.customer360
                      WHERE 
                        nationality IS NOT NULL
                      GROUP BY 
                        nationality;`;

  const sql7 = `SELECT 
                      customer_lifecycle_phase,
                      COUNT(*) AS total_subscribers,
                      SUM(CASE WHEN churn = 'churn' THEN 1 ELSE 0 END) AS churn_subscribers,
                      COUNT(*) - SUM(CASE WHEN churn = 'churn' THEN 1 ELSE 0 END) AS not_churn_subscribers
                    FROM (
                      SELECT *,
                        CASE
                          WHEN days_active < 30 THEN 'New'
                          WHEN days_active >= 30 AND days_active < 190 THEN 'Early stage'
                          WHEN days_active >= 190 AND days_active < 731 THEN 'Mid stage'
                          WHEN days_active >= 731 AND days_active < 1460 THEN 'Established'
                          ELSE 'Long term'
                        END AS customer_lifecycle_phase
                      FROM staging.customer360
                      WHERE days_active IS NOT NULL
                    ) AS derived
                    GROUP BY customer_lifecycle_phase
                    ORDER BY 
                      CASE customer_lifecycle_phase
                        WHEN 'New' THEN 1
                        WHEN 'Early stage' THEN 2
                        WHEN 'Mid stage' THEN 3
                        WHEN 'Established' THEN 4
                        WHEN 'Long term' THEN 5
                        ELSE 6
                      END`;
  const sql8 = `SELECT
                        CASE
                          WHEN arpu <= 500 THEN 'Low'
                          WHEN arpu <= 1000 THEN 'Medium'
                          WHEN arpu <= 2000 THEN 'High'
                          ELSE 'Premium'
                        END AS arpu_segment,
                        LOWER(churn_risk) AS churn_risk_raw,
                        COUNT(msisdn) AS customer_count
                      FROM staging.customer360
                      WHERE churn_risk IS NOT NULL
                      GROUP BY arpu_segment, churn_risk_raw
                      ORDER BY customer_count desc; `;

  const [
    metricsRes,
    churnRiskRes,
    curveDataRes,
    churnTypeRes,
    mapDataRes,
    churnSubLifespanRes,
    arpuSegmentsRes,
  ] = await Promise.all([
    query(sql),
    query(sql3),
    query(sql4),
    query(sql5),
    query(sql6),
    query(sql7),
    query(sql8),
  ]);

  const riskMap: Record<string, string> = {
    low: 'low risk',
    medium: 'medium risk',
    high: 'high risk',
  };
  const grouped: Record<string, any> = {};

  arpuSegmentsRes.rows.forEach(({ arpu_segment, churn_risk_raw, customer_count }) => {
    const risk = riskMap[churn_risk_raw];
    if (!grouped[arpu_segment]) grouped[arpu_segment] = { name: arpu_segment };
    grouped[arpu_segment][risk] = customer_count;
  });

  const chartData = Object.values(grouped);

  const churnPercRes = await query(`
                                SELECT
                                      TO_CHAR(date_of_joining::DATE, 'Mon') AS month,
                                      TO_DATE( date_of_joining , 'YYYY-MM') as years,
                                round(  COUNT(CASE WHEN churn = 'churn' THEN 1 END) * 100.0 / COUNT(*) , 0) AS churn_percentage
                                FROM 
                                    staging.customer360
                                WHERE 
                                    date_of_joining::DATE >= CURRENT_DATE - INTERVAL '24 months'
                                GROUP BY
                                   month, years
                                ORDER BY
                                    years;`);
  return {
    metrics : metricsRes.rows[0],
    churnRisk: churnRiskRes?.rows,
    curveData: curveDataRes?.rows,
    churnType: churnTypeRes?.rows,
    mapData: mapDataRes?.rows,
    churnSubLifespan: churnSubLifespanRes.rows,
    arpuSegments: chartData,
    churnPercentage: {
      xData: churnPercRes.rows.map((data) => data.month),
      yData: churnPercRes.rows.map((data) => data.churn_percentage),
    },
  };
}
