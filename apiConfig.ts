
const API_BASES = {
  // New CVM backend (FastAPI). Server-side only; override per host via CVM_API_BASE.
  cvmApi: process.env.CVM_API_BASE || 'http://localhost:8000/api/v1',
  retention: 'http://10.200.36.58:8000/retention/strategies/',
  chartInsights: 'http://10.200.36.58:8000/all_chart_insight/',
  chartInsightsRetention: 'http://10.200.36.58:8000/insight/',
  gridCharts: 'http://10.200.36.58:8000/generate_segments_from_db/',
  personaGridInsight: 'http://10.200.36.58:8000/persona_Grid/insight/',
  persona360Insight: 'http://10.200.36.58:8000/persona_360/insight/',
  customerInsight: 'http://10.200.36.58:8000/customer_insight/',
  customerInsight360: 'http://10.200.36.58:8000/customer_story/',
  smartOfferX: 'http://10.200.36.58:8000/recommend_offers/',
  chatBotAPI: 'http://10.200.36.58:8000/faq/',
  explain: 'http://10.200.36.58:8000/explain/',
};



export default API_BASES;