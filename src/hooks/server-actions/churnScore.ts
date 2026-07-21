'use server';

import { query } from '@/lib/db';

export async function fetchChurnReportData() {
  const sql = `
        SELECT 
          *
        FROM staging.customer360
        WHERE churn IS NOT NULL;
      `;

  try {
    const result = await query(sql, []); // Executes the SQL query
    return result.rows; // Returns the rows from the database
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw new Error('Error fetching ticket data.');
  }
}
