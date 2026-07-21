'use server';

import { query } from '@/lib/db';

export async function getNBOInsights() {
    const sql = `
                      WITH 
      -- Average revenue for old product mix
      old_revenue AS (
          SELECT ROUND(AVG(arpu), 2) AS avg_revenue_old
          FROM staging.customer360
          WHERE new_offer_provided IS NULL
      ),

      -- Average revenue for new product mix
      new_revenue AS (
          SELECT ROUND(AVG(arpu), 2) AS avg_revenue_new
          FROM staging.customer360
          WHERE new_offer_provided IS NOT NULL
      ),

      -- Estimated subscription probability (acceptance rate)
      probability AS (
          SELECT 
              ROUND(
                  COUNT(*) FILTER (WHERE offer_acceptance_rate = 'YES')::DECIMAL 
                  / NULLIF(COUNT(*), 0), 2
              ) AS acceptance_probability
          FROM staging.customer360
      ),

      -- Count of customers actively targeted for NBO
      nbo_targets AS (
          SELECT COUNT(*) AS targeted_customers
          FROM staging.customer360
          WHERE account_status = 'Active'
            AND arpu > 100
            AND revenue_margin_category ILIKE '%low%'
            AND offer_acceptance_rate = 'YES'
            AND upsell_or_crosssell IN ('crosssell', 'upsell')
            AND new_offer_provided IS NOT NULL
      )

  SELECT 
      -- Original metrics
      SUM(total_offer_sent) AS "Total Offers Delivered",
      COUNT(*) FILTER (WHERE offer_acceptance_rate = 'YES') AS "Total Offer Acceptance",
      ROUND(AVG(arpu), 2) AS "Average Revenue Per User",

      -- Expected Gain = NBO * Avg ARPU
      ROUND(SUM(total_offer_sent) * AVG(arpu), 2) AS "Expected Gain",

      -- Expected Impact = Probability * (Avg Revenue New - Avg Revenue Old)
      ROUND(
          (SELECT acceptance_probability FROM probability) * 
          ((SELECT avg_revenue_new FROM new_revenue) - (SELECT avg_revenue_old FROM old_revenue)), 
          2
      ) AS "Expected Impact",

      -- NBO Targeted Customers Count
      (SELECT targeted_customers FROM nbo_targets) AS "Targeted NBO Customers"

  FROM staging.customer360;
  -- WHERE account_status = 'Active'  

        `;
        
  const sql2 = ` SELECT
                    CASE
                        WHEN age < 25 THEN 'Young'
                        WHEN age BETWEEN 25 AND 50 THEN 'Adult'
                        ELSE 'Old'
                    END AS age_group,
                    COUNT(*) FILTER (WHERE offer_acceptance_rate = 'YES') AS offer_accepted,
                    COUNT(*) FILTER (WHERE offer_acceptance_rate = 'NO') AS offer_rejected,
                    COUNT(*) AS subscribers
                    FROM staging.customer360
                    GROUP BY age_group
                    ORDER BY age_group;`;

  const sql3 = `select 
                count(*) , pack_name
                FROM staging.customer360
                where offer_acceptance_rate = 'YES'
                group by pack_name
                order by count  ; `;
  const sql4 = `SELECT
    (SELECT COUNT(*) FROM staging.customer360) AS subscribers,
    (SELECT COUNT(*) FROM staging.customer360 WHERE offer_acceptance_rate = 'YES') AS accepted,
    (SELECT COUNT(*) FROM staging.customer360 WHERE offer_acceptance_rate = 'YES' AND new_offer_provided IS NOT NULL) AS converted_with_nbo; `;

  const sql5 = `SELECT 
                subscriber_type, 
                COUNT(total_offer_sent) AS total_offers_given, 
                SUM(CASE WHEN offer_acceptance_rate = 'YES' THEN 1 ELSE 0 END) AS total_offers_accepted
                FROM 
                staging.customer360
                GROUP BY 
                subscriber_type;`;
  const sql6 = `SELECT
                social_media_engagement,
                COUNT(*) AS total_customers,
                SUM(CASE WHEN offer_acceptance_rate = 'YES' THEN 1 ELSE 0 END) AS accepted_offers
                FROM staging.customer360
                GROUP BY social_media_engagement ;`;

  try {
    const result = await query(sql);
    const offerbyAgeRes = await query(sql2);
    const mostAcceptOffersRes = await query(sql3);
    const planConversionRes = await query(sql4);
    const offerSunburstRes = await query(sql5);
    const segHitRateRes = await query(sql6);
    return {
      metrics: result.rows[0],
      offerbyAge: offerbyAgeRes.rows,
      mostAcceptOffers: mostAcceptOffersRes.rows,
      planConversion: planConversionRes.rows[0],
      offerSunburst: offerSunburstRes.rows,
      segHitRate: segHitRateRes.rows.map((row) => ({
        segment: row.social_media_engagement,
        hitRate: Math.round((row.accepted_offers / row.total_customers) * 100),
      })),
    };
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw new Error('Error fetching ticket data.');
  }
}
