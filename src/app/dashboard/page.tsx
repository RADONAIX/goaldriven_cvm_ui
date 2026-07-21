'use client';

import React from 'react';
import Link from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GridOnIcon from '@mui/icons-material/GridOn';
import GroupIcon from '@mui/icons-material/Group';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import InfoIcon from '@mui/icons-material/Info';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Avatar, Box, Button, Card, CardContent, Divider, Grid, IconButton, Typography } from '@mui/material';

import NavHeaders from '@/components/navHeaders';

const modules = [
  {
    title: 'PERSONA VISION',
    icon: <DashboardIcon fontSize="large" color="primary" />,
    description:
      'Guide strategic decisions by enabling goal-based workflow selection tailored to specific customer engagement and business use cases.',
  },
  {
    title: 'PERSONA 360',
    icon: <GroupIcon fontSize="large" color="success" />,
    description:
      'Automatically classify customers into meaningful segments to tailor marketing and engagement strategies.',
  },
  {
    title: 'PERSONA GRID',
    icon: <GridOnIcon fontSize="large" color="warning" />,
    description: 'Predict which customers are most at risk of leaving and plan proactive retention measures.',
  },
  {
    title: 'PERSONA RETAIN',
    icon: <HowToRegIcon fontSize="large" color="success" />,
    description:
      'Identify high-value customers at risk and trigger personalized retention journeys to maximize lifetime value.',
  },
  {
    title: 'PERSONA LIFT',
    icon: <TrendingUpIcon fontSize="large" color="secondary" />,
    description: 'Identify and recommend the most relevant product/service offer for each customer.',
  },
];

const insights = [
  {
    title: 'FAQ About Engage',
    description: 'Find answers to the most common questions about the Engage platform.',
    buttonText: 'FAQ Section',
    href: '/dashboard/faqSection',
  },
  {
    title: 'Model Insights: RETAIN',
    description: "Dive deep into the churn model's performance, prediction accuracy, and key retention insights.",
    buttonText: 'View Insights',
    href: '/dashboard/retainModelInsights',
  },
  {
    title: 'Model Insights: LIFT',
    description: 'Discover how the next-best-offer model increases conversions and boosts revenue intelligently.',
    buttonText: 'View Insights',
    href: '/dashboard/retainModelInsights',
  },
];

const Home = () => {
  return (
    <Box>
      <NavHeaders text="Home" />
      <Grid container alignItems="center" sx={{ mb: 1 }}>
        <Grid item xs={12} lg={4}>
          <Box sx={{ width: 300, mx: 'auto' }}>
            <DotLottieReact src="/assets/homeforward.lottie" loop autoplay />
          </Box>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Engage is an AI-driven customer experience management solution designed to help businesses understand their
            customers and take proactive steps to improve retention, satisfaction, and overall engagement.
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" fontWeight="bold" align="center" mb={3} color="primary">
        Key Modules
      </Typography>

      <Grid container spacing={2}>
        {modules.map((module, idx) => (
          <Grid item xs={12} sm={6} md={2.4} key={idx}>
            <Card
              sx={{
                position: 'relative',
                p: 0.5,
                height: '100%',
                borderRadius: 3,
                backgroundColor: '#fff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transformStyle: 'preserve-3d',
                perspective: 1000,
                transition: 'transform 0.6s ease, box-shadow 0.6s ease',
                '&:hover': {
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 168, 150, 0.2)',
                },
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background:
                    'radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(16, 134, 218, 0.12), transparent 60%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                  zIndex: 1,
                },
                '&:hover:before': {
                  opacity: 1, 
                },
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                  transform: 'rotateZ(25deg)',
                  animation: 'shineSweep 3s linear infinite',
                  zIndex: 0,
                },
                '@keyframes shineSweep': {
                  '0%': { transform: 'translateX(-100%) rotateZ(25deg)' },
                  '100%': { transform: 'translateX(100%) rotateZ(25deg)' },
                },
              }}
              onMouseMove={(e) => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--x', `${x}%`);
                card.style.setProperty('--y', `${y}%`);
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="center" mb={2}>
                  {module.icon}
                </Box>
                <Typography variant="h6" align="center" fontWeight="medium" gutterBottom>
                  {module.title}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  {module.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Box mb={5}>
        <Typography variant="h5" fontWeight="bold" align="center" mb={5} color="primary">
          Explore More
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {insights.map((insight, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Box>
                <Typography variant="h6" align="center" fontWeight="medium" gutterBottom>
                  {insight.title}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" mb={2}>
                  {insight.description}
                </Typography>
                <Box display="flex" justifyContent="center">
                  <Button variant="outlined" size="small" href={insight.href} component={Link}>
                    {insight.buttonText}
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
