'use client';
 
import * as React from 'react';
import { useSnackbar } from '@/app/snack';
import { zodResolver } from '@hookform/resolvers/zod';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
 
import { UserProvider } from '@/contexts/user-context';
import {
  generateRetentionStrategies,
  generateRevenueStrategies,
  generateSatsficationStrategies,
} from '@/hooks/server-actions/ml-apis';
import { saveVision } from '@/hooks/server-actions/persona-vision';
import { useVision } from '@/hooks/use-vision';
import ConfirmDialog from '@/components/ConfirmDialog';
import NavHeaders from '@/components/navHeaders';
 
// import RetentionParameterSlider from './slider';
import RetentionParameterChart from './slider';
 
type GoalType = 'retention' | 'revenue' | 'satisfaction' | 'global';
 
const churnSchema = z.object({
  expectedChurnRate: z
    .string()
    .nonempty('Expected churn rate is required')
    .regex(/^\d+%?$/, 'Enter a valid percentage (e.g., 15%)'),
  currentChurnRate: z
    .string()
    .nonempty('Current churn rate is required')
    .regex(/^\d+%?$/, 'Enter a valid percentage (e.g., 10%)'),
});
 
type ChurnFormData = z.infer<typeof churnSchema>;
 
type Parameter = {
  label: string;
  min: number;
  max: number;
  current: number;
  expected: number;
};
 
// Temporary fallback data used while the ML strategy APIs are unavailable.
// Each goal returns three strategy tiers matching the card render shape.
const dummyStrategies = {
  retention: [
    {
      strategy_level: 'Conservative',
      expected_churn_after: 18,
      expected_profit_uplift_pct: 6,
      description:
        'Low-risk retention play focused on proactive service outreach and light incentives for at-risk customers.',
      parameter_tuning: [
        {
          parameter: 'Customer Satisfaction Rating',
          current: 6,
          target: 7,
          rationale: 'Nudge satisfaction up with faster first-response times on support channels.',
        },
        {
          parameter: 'Customer Service Calls (Monthly Avg)',
          current: 5,
          target: 4,
          rationale: 'Deflect repeat calls via self-serve guides to reduce friction.',
        },
        {
          parameter: 'Offer Acceptance Rate (%)',
          current: 30,
          target: 40,
          rationale: 'Small targeted loyalty offers to nudge acceptance without eroding margin.',
        },
      ],
    },
    {
      strategy_level: 'Balanced',
      expected_churn_after: 14,
      expected_profit_uplift_pct: 11,
      description:
        'Blended approach combining personalized retention offers with engagement campaigns for medium-risk segments.',
      parameter_tuning: [
        {
          parameter: 'Customer Satisfaction Rating',
          current: 6,
          target: 8,
          rationale: 'Structured feedback loops and issue resolution SLAs lift satisfaction meaningfully.',
        },
        {
          parameter: 'Days Active',
          current: 200,
          target: 450,
          rationale: 'Re-engagement pushes and usage nudges increase active days.',
        },
        {
          parameter: 'Offer Acceptance Rate (%)',
          current: 30,
          target: 55,
          rationale: 'Personalized offers based on usage patterns drive higher acceptance.',
        },
      ],
    },
    {
      strategy_level: 'Aggressive',
      expected_churn_after: 9,
      expected_profit_uplift_pct: 18,
      description:
        'High-touch retention program with premium concierge support and strong win-back incentives for high-value customers.',
      parameter_tuning: [
        {
          parameter: 'Customer Satisfaction Rating',
          current: 6,
          target: 9,
          rationale: 'Dedicated relationship managers and priority support maximize satisfaction.',
        },
        {
          parameter: 'Support Tickets Raised (Monthly Avg)',
          current: 3,
          target: 1,
          rationale: 'Proactive issue detection sharply reduces raised tickets.',
        },
        {
          parameter: 'Average Monthly Spending (₹)',
          current: 500,
          target: 2500,
          rationale: 'Upsell bundles and loyalty tiers grow wallet share.',
        },
      ],
    },
  ],
  revenue: [
    {
      strategy_level: 'Conservative',
      expected_churn_after: 20,
      expected_profit_uplift_pct: 8,
      description:
        'Steady revenue growth via gentle plan optimization and add-on adoption without pressuring price-sensitive users.',
      parameter_tuning: [
        {
          parameter: 'Average monthly spending',
          current: 65,
          target: 90,
          rationale: 'Recommend right-sized plans that better match usage.',
        },
        {
          parameter: 'Offer acceptance rate',
          current: 18,
          target: 30,
          rationale: 'Contextual add-on offers at moments of high usage.',
        },
        {
          parameter: 'Last top up amount',
          current: 12,
          target: 25,
          rationale: 'Bonus-credit promotions encourage larger top-ups.',
        },
      ],
    },
    {
      strategy_level: 'Balanced',
      expected_churn_after: 17,
      expected_profit_uplift_pct: 15,
      description:
        'Growth through targeted upsell of data and voice bundles paired with dynamic promotional scoring.',
      parameter_tuning: [
        {
          parameter: 'Total Data used',
          current: 3.2,
          target: 12,
          rationale: 'Promote data packs to heavy streamers to grow ARPU.',
        },
        {
          parameter: 'Current plan price',
          current: 12,
          target: 40,
          rationale: 'Migrate users to value tiers with clear feature upgrades.',
        },
        {
          parameter: 'Promotion score',
          current: 12,
          target: 45,
          rationale: 'Sharpen promo targeting to lift conversion efficiency.',
        },
      ],
    },
    {
      strategy_level: 'Aggressive',
      expected_churn_after: 15,
      expected_profit_uplift_pct: 24,
      description:
        'Maximize ARPU with premium bundles, cross-sell of family plans, and high-value top-up incentives.',
      parameter_tuning: [
        {
          parameter: 'Average monthly spending',
          current: 65,
          target: 180,
          rationale: 'Premium bundle migration and cross-sell drive spend.',
        },
        {
          parameter: 'Total minutes used',
          current: 40,
          target: 220,
          rationale: 'Unlimited voice add-ons increase engagement and revenue.',
        },
        {
          parameter: 'Current plan price',
          current: 12,
          target: 120,
          rationale: 'Position flagship plans to high-usage customers.',
        },
      ],
    },
  ],
  satisfaction: [
    {
      strategy_level: 'Conservative',
      expected_churn_after: 19,
      expected_profit_uplift_pct: 5,
      description:
        'Improve baseline experience by cutting support friction and speeding up ticket resolution.',
      parameter_tuning: [
        {
          parameter: 'Support ticket',
          current: 3,
          target: 2,
          rationale: 'Knowledge-base improvements reduce ticket volume.',
        },
        {
          parameter: 'Customer service calls',
          current: 4,
          target: 3,
          rationale: 'Smarter IVR routing resolves issues on first contact.',
        },
        {
          parameter: 'Offer acceptance rate',
          current: 30,
          target: 45,
          rationale: 'Relevant, well-timed offers improve perceived value.',
        },
      ],
    },
    {
      strategy_level: 'Balanced',
      expected_churn_after: 16,
      expected_profit_uplift_pct: 10,
      description:
        'Lift satisfaction through personalized engagement and stickiness-building loyalty programs.',
      parameter_tuning: [
        {
          parameter: 'Stickness score',
          current: 50,
          target: 72,
          rationale: 'Loyalty rewards and habit-forming features raise stickiness.',
        },
        {
          parameter: 'Promotion score',
          current: 40,
          target: 65,
          rationale: 'Personalized promotions increase satisfaction and engagement.',
        },
        {
          parameter: 'Days active',
          current: 200,
          target: 520,
          rationale: 'Engagement nudges keep customers actively using the service.',
        },
      ],
    },
    {
      strategy_level: 'Aggressive',
      expected_churn_after: 12,
      expected_profit_uplift_pct: 16,
      description:
        'Premium experience program with white-glove support, proactive care, and best-in-class responsiveness.',
      parameter_tuning: [
        {
          parameter: 'Support ticket',
          current: 3,
          target: 0,
          rationale: 'Proactive monitoring resolves issues before customers report them.',
        },
        {
          parameter: 'Customer service calls',
          current: 4,
          target: 1,
          rationale: 'Dedicated priority lines and rapid resolution cut call volume.',
        },
        {
          parameter: 'Offer acceptance rate',
          current: 30,
          target: 70,
          rationale: 'Highly tailored offers earn strong customer trust and uptake.',
        },
      ],
    },
  ],
};
 
export default function Page(): React.JSX.Element {
  const { vision, setVision } = useVision();
  const { data: session } = useSession();
 
  const { showSnackbar } = useSnackbar();
  const [selectedGoal, setSelectedGoal] = React.useState<GoalType | null>(null);
  const [churnRes, setChurnRes] = React.useState<boolean | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const [aiRes, setAiRes] = React.useState<any>([]);
  const [selectedStrategyIndex, setSelectedStrategyIndex] = React.useState<number | null>(null);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [openClearDialog, setOpenClearDialog] = React.useState(false);
 
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChurnFormData>({
    resolver: zodResolver(churnSchema),
    defaultValues: {
      currentChurnRate: '25',
      expectedChurnRate: '',
    },
  });
 
  const onSubmit = (data: ChurnFormData) => {
    setChurnRes(true);
  };
 
  const expectedChurnRate = watch('expectedChurnRate');
  const currentChurnRate = watch('currentChurnRate');
 
  const factor = parseFloat(expectedChurnRate) / parseFloat(currentChurnRate);
 
  const parameters = {
    retention: [
      {
        label: 'Customer Satisfaction Rating',
        min: 0,
        max: 10,
        current: 6,
        expected: Math.min(10, 6 + Math.floor(factor * 4)),
      },
      {
        label: 'Customer Service Calls (Monthly Avg)',
        min: 0,
        max: 10,
        current: 5,
        expected: Math.max(0, 5 - Math.floor(factor * 3)),
      },
      {
        label: 'Days Active',
        min: 0,
        max: 1000,
        current: 200,
        expected: Math.min(1000, 200 + Math.floor(factor * 500)),
      },
      {
        label: 'Average Monthly Spending (₹)',
        min: 0,
        max: 10000,
        current: 500,
        expected: Math.min(10000, 500 + Math.floor(factor * 3000)),
      },
      {
        label: 'Offer Acceptance Rate (%)',
        min: 0,
        max: 100,
        current: 30,
        expected: Math.min(100, 30 + Math.floor(factor * 50)),
      },
      {
        label: 'Support Tickets Raised (Monthly Avg)',
        min: 0,
        max: 10,
        current: 3,
        expected: Math.max(0, 3 - Math.floor(factor * 2)),
      },
    ],
    revenue: [
      {
        label: 'Average monthly spending',
        min: 0,
        max: 1000,
        current: 65,
        expected: Math.min(10000, Math.round(500 + 7000 * factor)),
      },
      {
        label: 'Total minutes used',
        min: 0,
        max: 1000,
        current: 40,
        expected: Math.min(10000, Math.round(300 + 6000 * factor)),
      },
      {
        label: 'Total Data used',
        min: 0,
        max: 500,
        current: 3.2,
        expected: Math.min(500, Math.round(100 + 350 * factor)),
      },
      {
        label: 'Offer acceptance rate',
        min: 0,
        max: 100,
        current: 18,
        expected: Math.min(100, Math.round(20 + 70 * factor)),
      },
      {
        label: 'Current plan price',
        min: 0,
        max: 3000,
        current: 12,
        expected: Math.min(3000, Math.round(200 + 2000 * factor)),
      },
      {
        label: 'Last top up amount',
        min: 0,
        max: 2000,
        current: 12,
        expected: Math.min(2000, Math.round(50 + 1500 * factor)),
      },
      {
        label: 'Promotion score',
        min: 0,
        max: 100,
        current: 12,
        expected: Math.min(100, Math.round(30 + 50 * factor)),
      },
    ],
    satisfaction: [
      {
        label: 'Support ticket',
        current: Math.max(0, Math.round(3 - 2.5 * factor)),
        expected: Math.max(0, Math.round(3 - 2.5 * factor)),
        min: 0,
        max: 10,
      },
      {
        label: 'Customer service calls',
        current: Math.max(0, Math.round(4 - 2.5 * factor)),
        expected: Math.max(0, Math.round(4 - 2.5 * factor)),
        min: 0,
        max: 10,
      },
      {
        label: 'Offer acceptance rate',
        current: Math.min(100, Math.round(30 + 50 * factor)),
        expected: Math.min(100, Math.round(30 + 50 * factor)),
        min: 0,
        max: 100,
      },
      {
        label: 'Promotion score',
        current: Math.min(100, Math.round(40 + 50 * factor)),
        expected: Math.min(100, Math.round(40 + 50 * factor)),
        min: 0,
        max: 100,
      },
      {
        label: 'Stickness score',
        current: Math.min(100, Math.round(50 + 40 * factor)),
        expected: Math.min(100, Math.round(50 + 40 * factor)),
        min: 0,
        max: 100,
      },
      {
        label: 'Days active',
        current: Math.min(1000, Math.round(200 + 700 * factor)),
        expected: Math.min(1000, Math.round(200 + 700 * factor)),
        min: 0,
        max: 1000,
      },
      {
        label: 'Current plan price',
        current: Math.min(3000, Math.round(200 + 1000 * factor)),
        expected: Math.min(3000, Math.round(200 + 1000 * factor)),
        min: 0,
        max: 3000,
      },
    ],
  };
 
  const getAIRecomendations = async () => {
    startTransition(async () => {
      // NOTE: ML APIs are temporarily unavailable — serving dummy strategies
      // per goal so the UI stays functional. Swap back to the real API calls
      // (generateRetentionStrategies / generateRevenueStrategies /
      // generateSatsficationStrategies) once the endpoints are back online.
      await new Promise((resolve) => setTimeout(resolve, 900));
 
      if (selectedGoal === 'retention') {
        setAiRes(dummyStrategies.retention);
      } else if (selectedGoal === 'revenue') {
        setAiRes(dummyStrategies.revenue);
      } else if (selectedGoal === 'satisfaction') {
        setAiRes(dummyStrategies.satisfaction);
      }
    });
  };
 
  const handleConfirmUseCase = async () => {
    if (selectedStrategyIndex === null || aiRes === null) return;
 
    setIsSaving(true);
    try {
      setVision(selectedGoal);
 
      const payload = {
        userId: session?.user?.id,
        vision: selectedGoal,
        aiRecommendation: aiRes,
        selectedStrategy: aiRes[selectedStrategyIndex],
        expectedChurnRate: expectedChurnRate,
      };
 
      saveVision(payload)
        .then((res) => {
          setVision(res);
        })
        .catch((err) => {
          console.error('Error saving use case:', err);
          showSnackbar('Failed to save use case', 'error');
        });
      showSnackbar('Use case saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving use case:', error);
      showSnackbar('Failed to save use case', 'error');
    } finally {
      setIsSaving(false);
    }
  };
 
  React.useEffect(() => {
    setSelectedGoal(vision?.vision ?? null);
    setChurnRes(false);
    setAiRes(vision?.airecommendation ?? null);
    setSelectedStrategyIndex(
      vision?.airecommendation?.findIndex(
        (strategy) => JSON.stringify(strategy) === JSON.stringify(vision.selectedstrategy)
      ) ?? null
    );
    if (vision?.expectedchurnrate) {
      setValue('expectedChurnRate', vision.expectedchurnrate);
      setChurnRes(true);
    }
  }, [vision]);
 
  async function handleClearUseCase(params: type) {
    setOpenClearDialog(false);
    setIsSaving(true);
    try {
      const payload = {
        userId: session?.user?.id,
        vision: null,
        aiRecommendation: null,
        selectedStrategy: null,
        expectedChurnRate: null,
      };
      const res = await saveVision(payload);
      setVision(res);
      setSelectedGoal(null);
      setSelectedStrategyIndex(null);
      setAiRes(null);
      showSnackbar('Use case cleared successfully.', 'success');
    } catch (err) {
      showSnackbar('Failed to clear use case.', 'error');
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <Box>
      <NavHeaders text="Persona Vision" />
 
      <Grid container alignItems="center" sx={{ mb: 1 }}>
        <Grid item xs={12} lg={4}>
          <Box sx={{ width: 250, mx: 'auto' }}>
            <DotLottieReact src="/assets/fly.lottie" loop autoplay />
          </Box>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Unlock the full potential of your business by choosing a strategic objective that aligns with your vision.
            Whether your focus is on boosting customer retention, maximizing revenue streams, or innovating new value
            pathways — your decision here sets the foundation for everything that follows.
          </Typography>
 
          <Typography variant="body2" sx={{ mb: 2 }}>
            Each goal is infused with targeted KPIs and intelligent insights designed to empower smarter, data-driven
            actions. Our AI-powered modules will personalize your journey, helping you decode patterns, predict
            behaviors, and implement strategies with precision.
          </Typography>
        </Grid>
      </Grid>
      {/* <Divider sx={{ my: 2 }} /> */}
      <Typography variant="h6" fontWeight="medium" align="center" mb={3} color="primary">
        Select Your Primary Business Goal
      </Typography>
      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 4 }}>
        {[
          {
            key: 'retention',
            title: 'Retention',
            subtitle: `Current Retention Rate: ${currentChurnRate}%`,
          },
          {
            key: 'revenue',
            title: 'Revenue Maximization',
            subtitle: 'Current Revenue Rate: 15%',
          },
          {
            key: 'satisfaction',
            title: 'Customer Satisfaction & Experience',
            subtitle: 'Customer Satisfaction Rate: 5%',
          },
        ].map((goal) => (
          <Card
            key={goal.key}
            sx={{
              height: 100,
              width: '100%',
              border: selectedGoal === goal.key ? '2px solid #1976d2' : '1px solid #e0e0e0',
              boxShadow: selectedGoal === goal.key ? 6 : 1,
              transition: 'all 0.3s ease',
              borderRadius: 2,
              backgroundColor: selectedGoal === goal.key ? '#e3f2fd' : '#fff',
              '&:hover': {
                boxShadow: 4,
                borderColor: '#90caf9',
              },
            }}
          >
            <CardActionArea
              onClick={() => {
                setSelectedGoal(goal.key as 'retention' | 'revenue' | 'satisfaction');
                setChurnRes(false);
              }}
              sx={{ height: '100%' }}
            >
              <CardContent sx={{ py: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} align="center" gutterBottom>
                  {goal.title}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  {goal.subtitle}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
 
      {selectedGoal !== null && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Stack spacing={2} direction="column">
              <Card elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Typography gutterBottom>Enter Retention Rate Metrics</Typography>
                  <Grid container spacing={2} alignItems="center" direction="row">
                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.currentChurnRate}>
                        <Controller
                          name="currentChurnRate"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              disabled
                              {...field}
                              id="current-churn"
                              label="Current Retention Rate"
                              variant="outlined"
                              placeholder="e.g. 10%"
                              size="small"
                            />
                          )}
                        />
                        <FormHelperText>{errors.currentChurnRate?.message}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.expectedChurnRate}>
                        <Controller
                          name="expectedChurnRate"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              id="outlined-basic"
                              label="Expected Retention Rate"
                              variant="outlined"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setChurnRes(false);
                              }}
                              placeholder="e.g. 10%"
                              size="small"
                            />
                          )}
                        />
                        <FormHelperText>{errors.expectedChurnRate?.message}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} textAlign="right">
                      <Button type="submit" variant="contained">
                        Submit Rates
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Card>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            {churnRes && (
              <Card elevation={3} sx={{ p: 1, borderRadius: 3, minHeight: '100px' }}>
                <RetentionParameterChart
                  expected={parseFloat(expectedChurnRate)}
                  parameters={parameters[selectedGoal]}
                />
              </Card>
            )}
          </Grid>
          <Grid item xs={12} md={12}>
            <Card elevation={3} sx={{ p: 2, borderRadius: 3 }}>
              <Grid container spacing={2} alignItems="center" direction="column">
                <Grid item>
                  <Typography gutterBottom>🤖 AI Agent Recommendations</Typography>
                </Grid>
                <Grid item>
                  <LoadingButton
                    disabled={!churnRes}
                    loading={isPending}
                    loadingPosition="start"
                    color="primary"
                    fullWidth
                    sx={{ mb: 3, p: 1, minWidth: '350px' }}
                    onClick={getAIRecomendations}
                  >
                    {isPending ? 'Consulting the AI agent...' : 'Generate AI Solutions'}
                  </LoadingButton>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack spacing={3} direction="row">
              {!isPending &&
                aiRes !== null &&
                aiRes?.map((strategy, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card
                      elevation={selectedStrategyIndex === index ? 6 : 2}
                      onClick={() => setSelectedStrategyIndex(index)}
                      sx={{
                        cursor: 'pointer',
                        height: '100%',
                        borderRadius: 3,
                        bgcolor: selectedStrategyIndex === index ? '#e3f2fd' : '#f9f9f9',
                        p: 0.5,
                        border: selectedStrategyIndex === index ? '2px solid #1976d2' : '1px solid #ccc',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: 5,
                        },
                      }}
                    >
                      <CardContent>
                        <Stack spacing={1.5}>
                          <Typography variant="h6" fontWeight="bold">
                            {strategy.strategy_level} Strategy
                          </Typography>
 
                          <Stack direction="row" spacing={1}>
                            <Chip label={`↓ Churn: ${strategy.expected_churn_after}%`} color="warning" size="small" />
                            <Chip
                              label={`↑ Profit: +${strategy.expected_profit_uplift_pct}%`}
                              color="success"
                              size="small"
                            />
                          </Stack>
 
                          <Typography variant="body2" color="text.secondary">
                            {strategy.description}
                          </Typography>
 
                          <Divider />
 
                          <Typography variant="subtitle2" fontWeight={600}>
                            Parameter Tuning
                          </Typography>
 
                          <List dense disablePadding>
                            {strategy.parameter_tuning.map((param, idx) => (
                              <ListItem key={idx} disableGutters sx={{ alignItems: 'flex-start', pb: 1 }}>
                                <ListItemText
                                  primary={`${param.parameter}: ${param.current} → ${param.target}`}
                                  secondary={param.rationale}
                                  primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }}
                                  secondaryTypographyProps={{ fontSize: 12 }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={() => setOpenClearDialog(true)}
              disabled={selectedStrategyIndex === null || isSaving}
            >
              Clear Use Case
            </Button>
          </Grid>
 
          <Grid item xs={6}>
            <Button
              fullWidth
              type="submit"
              variant="outlined"
              onClick={handleConfirmUseCase}
              disabled={selectedStrategyIndex === null || isSaving}
            >
              Confirm Use case
            </Button>
          </Grid>
        </Grid>
      )}
 
      {openClearDialog && (
        <ConfirmDialog
          open={openClearDialog}
          title="Clear Use Case"
          description="Are you sure you want to clear the saved use case? This will remove all AI recommendations."
          confirmText="Clear Anyway"
          cancelText="Cancel"
          confirmColor="error"
          onClose={() => setOpenClearDialog(false)}
          onConfirm={handleClearUseCase}
        />
      )}
    </Box>
  );
}
 
 