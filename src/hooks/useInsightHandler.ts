import { useState } from 'react';
import { getChartInsights, getChartInsightsRetention } from '@/hooks/server-actions/ml-apis'; // Adjust path

export function useInsightHandler() {
  const [openInsightModal, setOpenInsightModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiInsightData, setAiInsightData] = useState<any>(null);

  const handleInsightClick = async (payload: any) => {
    setOpenInsightModal(true);
    setLoading(true);

    try {
      const res = await getChartInsights(payload);
      setAiInsightData(res?.data);
    } catch (err) {
      console.error('Insight fetch error:', err);
      setOpenInsightModal(false); // close on error if needed
    } finally {
      setLoading(false);
    }
  };

  const handleInsightClickRetention = async (payload: any) => {
    setOpenInsightModal(true);
    setLoading(true);

    try {
      const res = await getChartInsightsRetention(payload);
      console.log('Retention Insight Response:', res);
      setAiInsightData(res?.data);
    } catch (err) {
      console.error('Insight fetch error:', err);
      setOpenInsightModal(false); // close on error if needed
    } finally {
      setLoading(false);
    }
  };

  const handleCloseInsightModal = () => {
    setOpenInsightModal(false);
    setAiInsightData(null);
  };

  return {
    openInsightModal,
    loading,
    aiInsightData,
    handleInsightClick,
    handleCloseInsightModal,
    handleInsightClickRetention,
  };
}
