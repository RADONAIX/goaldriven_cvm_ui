'use server';

import { query } from '@/lib/db';

export async function saveVision({
  userId,
  vision,
  aiRecommendation,
  selectedStrategy,
  expectedChurnRate,
}: {
  userId: number | string;
  vision: string  | null;
  aiRecommendation: any | null;
  selectedStrategy: any | null ;
  expectedChurnRate: string | number| null;
}) {
  const result = await query(
    `
  INSERT INTO admin_schema.goal_selection (
    gs_user_id, gs_vision, gs_ai_recommendation, gs_selected_strategy, gs_expected_churn_rate
  )
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (gs_user_id)
  DO UPDATE SET
    gs_vision = EXCLUDED.gs_vision,
    gs_ai_recommendation = EXCLUDED.gs_ai_recommendation,
    gs_selected_strategy = EXCLUDED.gs_selected_strategy,
    gs_expected_churn_rate = EXCLUDED.gs_expected_churn_rate
  RETURNING gs_vision vision, gs_ai_recommendation as aiRecommendation, gs_selected_strategy as selectedStrategy , gs_expected_churn_rate as expectedChurnRate
  `,
    [userId, vision, aiRecommendation, selectedStrategy, expectedChurnRate]
  );

  return result.rows[0];
}

// hooks/server-actions/persona-vision.ts
export async function getVision(userId: string) {
  const result = await query(
    `
    SELECT gs_vision vision, gs_ai_recommendation aiRecommendation, gs_selected_strategy selectedStrategy , gs_expected_churn_rate as expectedChurnRate
    FROM admin_schema.goal_selection
    WHERE gs_user_id = $1
    ORDER BY gs_id DESC
    LIMIT 1
  `,
    [userId]
  );

  return result.rows[0];
}
