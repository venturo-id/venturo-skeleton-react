import type { IconifyName } from 'src/shared/ui/iconify';

import { m } from 'framer-motion';
import { useMemo, useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';

import { useTranslate } from 'src/locales';
import { Label } from 'src/shared/ui/label';
import { Iconify } from 'src/shared/ui/iconify';

// ----------------------------------------------------------------------

interface KpiRow {
  kpi: string;
  percent: string;
  bobot: number;
  achievement: number | string;
}

interface CascadeCardData {
  role: string;
  kpis: KpiRow[];
  total: string;
  totalColor: 'error' | 'warning' | 'success';
}

interface StrategicKpiData {
  label: string;
  sublabel: string;
  value: string;
  color: 'error' | 'warning' | 'success' | 'info';
  icon: IconifyName;
}

interface TeamData {
  total: number;
  excellent: number;
  attention: number;
}

interface DashboardData {
  strategic: StrategicKpiData[];
  team: TeamData;
  cascade: CascadeCardData[];
}

// ----------------------------------------------------------------------

// SVG Circular Progress Gauge for premium UI stats
interface CircularProgressGaugeProps {
  value: string;
  size?: number;
  strokeWidth?: number;
  color?: 'error' | 'warning' | 'success' | 'info' | 'primary';
}

function CircularProgressGauge({
  value,
  size = 52,
  strokeWidth = 4,
  color = 'primary',
}: CircularProgressGaugeProps) {
  const theme = useTheme();

  const percentage = value === '-' ? 0 : parseFloat(value);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  const paletteColor = theme.vars.palette[color === 'primary' ? 'primary' : color].main;
  const trackColor = varAlpha(
    theme.vars.palette[color === 'primary' ? 'primary' : color].mainChannel,
    0.12
  );

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Outer track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress Arc */}
        {value !== '-' && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={paletteColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        )}
      </svg>
      <Typography
        variant="caption"
        component="div"
        sx={{
          position: 'absolute',
          fontWeight: 800,
          color: value === '-' ? 'text.disabled' : `${color}.main`,
          fontSize: '0.7rem',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

// Deterministic mock data generator based on department, year, and quarter selections
function generateData(dept: string, year: number, quarter: string): DashboardData {
  // exact screenshot mockup: Operations + 2025 + Q3
  if (dept === 'operations' && year === 2025 && quarter === 'q3') {
    return {
      strategic: [
        {
          label: 'Man Count',
          sublabel: 'KPI Team',
          value: '6%',
          color: 'error',
          icon: 'solar:users-group-rounded-bold',
        },
        {
          label: 'Client Feedback',
          sublabel: 'KPI Project',
          value: '8.5',
          color: 'success',
          icon: 'solar:chat-round-dots-bold',
        },
      ],
      team: {
        total: 53,
        excellent: 0,
        attention: 0,
      },
      cascade: [
        {
          role: 'Project Manager',
          kpis: [
            { kpi: 'Contract Compliance (cc, aging)', percent: '0%', bobot: 60, achievement: 0 },
            { kpi: 'Slow Query', percent: '-', bobot: 20, achievement: '-' },
            { kpi: 'Service Uptime', percent: '-', bobot: 20, achievement: '-' },
          ],
          total: '0%',
          totalColor: 'error',
        },
        {
          role: 'Tech Lead',
          kpis: [
            {
              kpi: 'Story Point Efficiency (AI Validated)',
              percent: '-',
              bobot: 60,
              achievement: '-',
            },
            { kpi: 'Ticket Resolution Time', percent: '0%', bobot: 20, achievement: 0 },
            {
              kpi: 'Ticket Count (input manual / vira wa / sentry)',
              percent: '100%',
              bobot: 20,
              achievement: 20,
            },
          ],
          total: '20%',
          totalColor: 'error',
        },
        {
          role: 'Programmer',
          kpis: [
            { kpi: 'Code Quality (Lint Checks)', percent: '95%', bobot: 40, achievement: 38 },
            { kpi: 'Task Completion Rate', percent: '80%', bobot: 40, achievement: 32 },
            { kpi: 'Bug Count (Zero Bugs Objective)', percent: '100%', bobot: 20, achievement: 20 },
          ],
          total: '90%',
          totalColor: 'success',
        },
      ],
    };
  }

  // Otherwise generate dynamic but mathematically consistent results
  const seed =
    (dept === 'operations' ? 10 : 20) +
    (year - 2022) +
    (quarter === 'q1' ? 1 : quarter === 'q2' ? 2 : quarter === 'q3' ? 3 : 4);
  const isOps = dept === 'operations';

  if (isOps) {
    const manCountVal = Math.min(25, Math.max(1, ((seed * 3) % 20) + 2));
    const manCountColor = manCountVal > 15 ? 'error' : manCountVal > 8 ? 'warning' : 'success';
    const clientFeedbackVal = (7.0 + (seed % 9) * 0.3).toFixed(1);
    const feedbackColor =
      parseFloat(clientFeedbackVal) >= 8.5
        ? 'success'
        : parseFloat(clientFeedbackVal) >= 7.8
          ? 'warning'
          : 'error';

    const pmCc = Math.min(100, Math.max(0, 50 + ((seed * 7) % 45)));
    const pmSq = seed % 3 === 0 ? '-' : Math.min(100, Math.max(0, 65 + ((seed * 3) % 35))) + '%';
    const pmSu = Math.min(100, Math.max(0, 95 + ((seed * 2) % 6))) + '%';

    const pmKpis = [
      {
        kpi: 'Contract Compliance (cc, aging)',
        percent: pmCc + '%',
        bobot: 60,
        achievement: Math.round((pmCc / 100) * 60),
      },
      {
        kpi: 'Slow Query',
        percent: pmSq,
        bobot: 20,
        achievement: pmSq === '-' ? '-' : Math.round((parseFloat(pmSq) / 100) * 20),
      },
      {
        kpi: 'Service Uptime',
        percent: pmSu,
        bobot: 20,
        achievement: Math.round((parseFloat(pmSu) / 100) * 20),
      },
    ];

    let pmSum = 0;
    pmKpis.forEach((k) => {
      if (typeof k.achievement === 'number') pmSum += k.achievement;
    });
    const pmTotal = pmSum + '%';
    const pmTotalColor = pmSum >= 80 ? 'success' : pmSum >= 50 ? 'warning' : 'error';

    const tlSpe = seed % 4 === 0 ? '-' : Math.min(100, Math.max(0, 70 + ((seed * 4) % 25))) + '%';
    const tlTrt = Math.min(100, Math.max(0, 50 + ((seed * 6) % 45)));
    const tlTc = Math.min(100, Math.max(0, 75 + ((seed * 5) % 25)));

    const tlKpis = [
      {
        kpi: 'Story Point Efficiency (AI Validated)',
        percent: tlSpe,
        bobot: 60,
        achievement: tlSpe === '-' ? '-' : Math.round((parseFloat(tlSpe) / 100) * 60),
      },
      {
        kpi: 'Ticket Resolution Time',
        percent: tlTrt + '%',
        bobot: 20,
        achievement: Math.round((tlTrt / 100) * 20),
      },
      {
        kpi: 'Ticket Count (input manual / vira wa / sentry)',
        percent: tlTc + '%',
        bobot: 20,
        achievement: Math.round((tlTc / 100) * 20),
      },
    ];

    let tlSum = 0;
    tlKpis.forEach((k) => {
      if (typeof k.achievement === 'number') tlSum += k.achievement;
    });
    const tlTotal = tlSum + '%';
    const tlTotalColor = tlSum >= 80 ? 'success' : tlSum >= 50 ? 'warning' : 'error';

    const prQ = Math.min(100, Math.max(0, 80 + ((seed * 2) % 20)));
    const prC = Math.min(100, Math.max(0, 70 + ((seed * 4) % 30)));
    const prB = Math.min(100, Math.max(0, 90 + ((seed * 3) % 11)));

    const prKpis = [
      {
        kpi: 'Code Quality (Lint Checks)',
        percent: prQ + '%',
        bobot: 40,
        achievement: Math.round((prQ / 100) * 40),
      },
      {
        kpi: 'Task Completion Rate',
        percent: prC + '%',
        bobot: 40,
        achievement: Math.round((prC / 100) * 40),
      },
      {
        kpi: 'Bug Count (Zero Bugs Objective)',
        percent: prB + '%',
        bobot: 20,
        achievement: Math.round((prB / 100) * 20),
      },
    ];

    let prSum = 0;
    prKpis.forEach((k) => {
      if (typeof k.achievement === 'number') prSum += k.achievement;
    });
    const prTotal = prSum + '%';
    const prTotalColor = prSum >= 80 ? 'success' : prSum >= 50 ? 'warning' : 'error';

    return {
      strategic: [
        {
          label: 'Man Count',
          sublabel: 'KPI Team',
          value: manCountVal + '%',
          color: manCountColor,
          icon: 'solar:users-group-rounded-bold',
        },
        {
          label: 'Client Feedback',
          sublabel: 'KPI Project',
          value: clientFeedbackVal,
          color: feedbackColor,
          icon: 'solar:chat-round-dots-bold',
        },
      ],
      team: {
        total: 45 + (seed % 15),
        excellent: Math.max(0, (seed % 6) - 1),
        attention: Math.max(0, seed % 3),
      },
      cascade: [
        { role: 'Project Manager', kpis: pmKpis, total: pmTotal, totalColor: pmTotalColor },
        { role: 'Tech Lead', kpis: tlKpis, total: tlTotal, totalColor: tlTotalColor },
        { role: 'Programmer', kpis: prKpis, total: prTotal, totalColor: prTotalColor },
      ],
    };
  } else {
    // Administration department
    const recRate = Math.min(100, Math.max(60, 75 + ((seed * 3) % 25)));
    const recColor = recRate >= 85 ? 'success' : recRate >= 70 ? 'warning' : 'error';
    const budgetVal = Math.min(100, Math.max(50, 70 + ((seed * 4) % 30)));
    const budgetColor = budgetVal >= 92 ? 'error' : budgetVal >= 80 ? 'success' : 'warning';

    const amPc = Math.min(100, Math.max(70, 80 + ((seed * 2) % 20)));
    const amSu = Math.min(100, Math.max(90, 96 + ((seed * 1) % 5)));
    const amVm = Math.min(100, Math.max(60, 70 + ((seed * 3) % 30)));

    const amKpis = [
      {
        kpi: 'Policy & Regulatory Compliance',
        percent: amPc + '%',
        bobot: 50,
        achievement: Math.round((amPc / 100) * 50),
      },
      {
        kpi: 'Internal Systems Uptime',
        percent: amSu + '%',
        bobot: 30,
        achievement: Math.round((amSu / 100) * 30),
      },
      {
        kpi: 'Vendor & Contract Management',
        percent: amVm + '%',
        bobot: 20,
        achievement: Math.round((amVm / 100) * 20),
      },
    ];

    let amSum = 0;
    amKpis.forEach((k) => (amSum += typeof k.achievement === 'number' ? k.achievement : 0));
    const amTotal = amSum + '%';
    const amTotalColor = amSum >= 80 ? 'success' : amSum >= 50 ? 'warning' : 'error';

    const hrEr = Math.min(100, Math.max(80, 82 + ((seed * 1) % 18)));
    const hrPr = Math.min(100, Math.max(70, 88 + ((seed * 2) % 13)));
    const hrOa = Math.min(100, Math.max(65, 75 + ((seed * 3) % 25)));

    const hrKpis = [
      {
        kpi: 'Employee Retention Rate',
        percent: hrEr + '%',
        bobot: 40,
        achievement: Math.round((hrEr / 100) * 40),
      },
      {
        kpi: 'Performance Review Completion Rate',
        percent: hrPr + '%',
        bobot: 40,
        achievement: Math.round((hrPr / 100) * 40),
      },
      {
        kpi: 'Office Operations Audit Score',
        percent: hrOa + '%',
        bobot: 20,
        achievement: Math.round((hrOa / 100) * 20),
      },
    ];

    let hrSum = 0;
    hrKpis.forEach((k) => (hrSum += typeof k.achievement === 'number' ? k.achievement : 0));
    const hrTotal = hrSum + '%';
    const hrTotalColor = hrSum >= 80 ? 'success' : hrSum >= 50 ? 'warning' : 'error';

    const stQr = Math.min(100, Math.max(70, 78 + ((seed * 2) % 22)));
    const stDp = Math.min(100, Math.max(80, 82 + ((seed * 3) % 18)));
    const stDa = Math.min(100, Math.max(90, 94 + ((seed * 1) % 6)));

    const stKpis = [
      {
        kpi: 'Query Response & SLA Time',
        percent: stQr + '%',
        bobot: 40,
        achievement: Math.round((stQr / 100) * 40),
      },
      {
        kpi: 'Document Processing Accuracy',
        percent: stDp + '%',
        bobot: 40,
        achievement: Math.round((stDp / 100) * 40),
      },
      {
        kpi: 'Master Data Integrity Score',
        percent: stDa + '%',
        bobot: 20,
        achievement: Math.round((stDa / 100) * 20),
      },
    ];

    let stSum = 0;
    stKpis.forEach((k) => (stSum += typeof k.achievement === 'number' ? k.achievement : 0));
    const stTotal = stSum + '%';
    const stTotalColor = stSum >= 80 ? 'success' : stSum >= 50 ? 'warning' : 'error';

    return {
      strategic: [
        {
          label: 'Recruitment Rate',
          sublabel: 'KPI HR',
          value: recRate + '%',
          color: recColor,
          icon: 'solar:user-plus-bold',
        },
        {
          label: 'Budget Utilization',
          sublabel: 'KPI Finance',
          value: budgetVal + '%',
          color: budgetColor,
          icon: 'solar:bill-list-bold',
        },
      ],
      team: {
        total: 12 + (seed % 6),
        excellent: Math.max(0, seed % 3),
        attention: Math.max(0, (seed % 2) - 1),
      },
      cascade: [
        { role: 'Administration Manager', kpis: amKpis, total: amTotal, totalColor: amTotalColor },
        { role: 'HR Generalist / Lead', kpis: hrKpis, total: hrTotal, totalColor: hrTotalColor },
        {
          role: 'Office Operations Coordinator',
          kpis: stKpis,
          total: stTotal,
          totalColor: stTotalColor,
        },
      ],
    };
  }
}

// ----------------------------------------------------------------------

export function HomeView() {
  const { t } = useTranslate('home');
  const theme = useTheme();

  // Dropdown States
  const [department, setDepartment] = useState<string>('operations');
  const [year, setYear] = useState<number>(2025);
  const [quarter, setQuarter] = useState<string>('q3');

  // Custom User Editing States
  const [dataOverrides, setDataOverrides] = useState<Record<string, DashboardData>>({});
  const [editOpen, setEditOpen] = useState(false);
  const [editContext, setEditContext] = useState<{
    cardIndex: number;
    kpiIndex: number;
    kpiName: string;
    percentValue: string;
  } | null>(null);

  // Active Key
  const activeKey = `${department}-${year}-${quarter}`;

  // Read data (use override if user edited it, otherwise default)
  const activeData = useMemo(() => {
    if (dataOverrides[activeKey]) {
      return dataOverrides[activeKey];
    }
    return generateData(department, year, quarter);
  }, [department, year, quarter, dataOverrides, activeKey]);

  // Color tint helper for background highlights
  const tint = (color: 'error' | 'warning' | 'success' | 'info' | 'primary') =>
    varAlpha(theme.vars.palette[color === 'primary' ? 'primary' : color].mainChannel, 0.08);

  // Generate Year Range (2022 to recent year 2026)
  const years = [2026, 2025, 2024, 2023, 2022];

  // Quarters dictionary
  const quarters = [
    { value: 'q1', label: 'Q1 (Jan - Mar)' },
    { value: 'q2', label: 'Q2 (Apr - Jun)' },
    { value: 'q3', label: 'Q3 (Jul - Sep)' },
    { value: 'q4', label: 'Q4 (Okt - Des)' },
  ];

  // Open Edit Modal
  const handleOpenEdit = (cardIndex: number, kpiIndex: number, kpiName: string, curVal: string) => {
    setEditContext({
      cardIndex,
      kpiIndex,
      kpiName,
      percentValue: curVal === '-' ? '' : curVal.replace('%', ''),
    });
    setEditOpen(true);
  };

  // Close Edit Modal
  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditContext(null);
  };

  // Save Custom KPI Value
  const handleSaveKpi = () => {
    if (!editContext) return;
    const { cardIndex, kpiIndex, percentValue } = editContext;

    // Build key values
    const cleanedVal = percentValue.trim();
    let newPercent = '-';
    let newAch: number | string = '-';

    if (cleanedVal !== '' && cleanedVal !== '-') {
      const parsedNum = parseFloat(cleanedVal);
      if (!isNaN(parsedNum)) {
        newPercent = parsedNum + '%';
        newAch = Math.round((parsedNum / 100) * activeData.cascade[cardIndex].kpis[kpiIndex].bobot);
      }
    }

    // Clone active state
    const updatedData = JSON.parse(JSON.stringify(activeData)) as DashboardData;
    const targetKpi = updatedData.cascade[cardIndex].kpis[kpiIndex];
    targetKpi.percent = newPercent;
    targetKpi.achievement = newAch;

    // Recalculate Card Total
    let totalAchSum = 0;
    updatedData.cascade[cardIndex].kpis.forEach((k) => {
      if (typeof k.achievement === 'number') {
        totalAchSum += k.achievement;
      }
    });

    updatedData.cascade[cardIndex].total = totalAchSum + '%';
    updatedData.cascade[cardIndex].totalColor =
      totalAchSum >= 80 ? 'success' : totalAchSum >= 50 ? 'warning' : 'error';

    // Update strategic KPI widgets as well to reflect changes (mock update)
    if (cardIndex === 0 && kpiIndex === 0 && newPercent !== '-') {
      // If Project Manager Contract Compliance was updated, update client feedback/man count alert slightly
      updatedData.strategic[0].value = newPercent;
      updatedData.strategic[0].color = parseFloat(newPercent) >= 80 ? 'success' : 'error';
    }

    setDataOverrides((prev) => ({
      ...prev,
      [activeKey]: updatedData,
    }));

    handleCloseEdit();
  };

  // Mapping level colors and icons
  const getLevelMeta = (index: number) => {
    switch (index) {
      case 0:
        return {
          color: 'primary' as const,
          icon: 'solar:user-rounded-bold' as const,
        };
      case 1:
        return {
          color: 'info' as const,
          icon: 'solar:verified-check-bold' as const,
        };
      case 2:
      default:
        return {
          color: 'success' as const,
          icon: 'solar:settings-bold' as const,
        };
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* HEADER SECTION */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        spacing={3}
        sx={{ mb: 4 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              p: 1.2,
              borderRadius: 1.5,
              background: `linear-gradient(135deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.info.main} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 16px 0 ${varAlpha(theme.vars.palette.primary.mainChannel, 0.24)}`,
            }}
          >
            <Iconify icon="solar:chart-square-outline" width={32} sx={{ color: 'white' }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(90deg, ${theme.vars.palette.text.primary} 0%, ${theme.vars.palette.primary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('title')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {t('subtitle')}
            </Typography>
          </Box>
        </Stack>

        {/* SELECTORS BLOCK */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'background.neutral',
            border: `1px solid ${theme.vars.palette.divider}`,
            boxShadow: theme.customShadows?.card,
          }}
        >
          {/* Department Selector */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="dept-select-label">{t('selectors.department')}</InputLabel>
            <Select
              labelId="dept-select-label"
              id="dept-select"
              value={department}
              label={t('selectors.department')}
              onChange={(e) => setDepartment(e.target.value)}
              sx={{ borderRadius: 1.5 }}
            >
              <MenuItem value="operations">Operations</MenuItem>
              <MenuItem value="administration">Administration</MenuItem>
            </Select>
          </FormControl>

          {/* Year Selector */}
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="year-select-label">{t('selectors.year')}</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={year}
              label={t('selectors.year')}
              onChange={(e) => setYear(Number(e.target.value))}
              sx={{ borderRadius: 1.5 }}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Quarter Selector */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="quarter-select-label">{t('selectors.quarter')}</InputLabel>
            <Select
              labelId="quarter-select-label"
              id="quarter-select"
              value={quarter}
              label={t('selectors.quarter')}
              onChange={(e) => setQuarter(e.target.value)}
              sx={{ borderRadius: 1.5 }}
            >
              {quarters.map((q) => (
                <MenuItem key={q.value} value={q.value}>
                  {q.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {/* DASHBOARD CORE CONTENT */}
      <Box
        sx={{
          display: 'grid',
          gap: 4,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
        }}
      >
        {/* LEFT COLUMN: STRATEGIC KPI & TEAM (Span 4) */}
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
          <Stack spacing={4}>
            {/* Strategic KPI Card */}
            <Card
              sx={{
                p: 3,
                position: 'relative',
                overflow: 'visible',
                border: `1px solid ${varAlpha(theme.vars.palette.dividerChannel, 0.8)}`,
                boxShadow: `0 8px 32px 0 ${varAlpha(theme.vars.palette.common.blackChannel, 0.04)}`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  borderRadius: '4px 0 0 4px',
                  bgcolor: 'primary.main',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: tint('primary'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                  }}
                >
                  <Iconify icon="solar:chart-square-outline" width={22} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {t('strategicKpi.title')}
                </Typography>
              </Stack>

              <Stack spacing={2.5}>
                {activeData.strategic.map((kpi) => (
                  <Paper
                    key={kpi.label}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: theme.transitions.create(['transform', 'box-shadow']),
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customShadows?.z8,
                        borderColor: `${kpi.color}.main`,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 1.5,
                          bgcolor: tint(kpi.color),
                          color: `${kpi.color}.main`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Iconify icon={kpi.icon} width={24} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {kpi.label.startsWith('strategicKpi.') ? t(kpi.label) : kpi.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                          {kpi.sublabel.startsWith('strategicKpi.')
                            ? t(kpi.sublabel)
                            : kpi.sublabel}
                        </Typography>
                      </Box>
                    </Stack>
                    <Label
                      variant="filled"
                      color={kpi.color === 'info' ? 'primary' : kpi.color}
                      sx={{
                        fontSize: '0.85rem',
                        py: 1.8,
                        px: 1.5,
                        fontWeight: 800,
                        borderRadius: 1,
                      }}
                    >
                      {kpi.value}
                    </Label>
                  </Paper>
                ))}
              </Stack>
            </Card>

            {/* Team Stats Card */}
            <Card
              sx={{
                p: 3,
                position: 'relative',
                overflow: 'visible',
                border: `1px solid ${varAlpha(theme.vars.palette.dividerChannel, 0.8)}`,
                boxShadow: `0 8px 32px 0 ${varAlpha(theme.vars.palette.common.blackChannel, 0.04)}`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  borderRadius: '4px 0 0 4px',
                  bgcolor: 'info.main',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: tint('info'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'info.main',
                  }}
                >
                  <Iconify icon="solar:users-group-rounded-bold-duotone" width={22} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {t('team.title')}
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: tint('primary'),
                    textAlign: 'center',
                    border: `1px dashed ${theme.vars.palette.primary.light}`,
                  }}
                >
                  <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 800 }}>
                    {activeData.team.total}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {t('team.totalMembers')}
                  </Typography>
                </Box>

                <Stack spacing={1.5}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Iconify
                        icon="solar:verified-check-bold"
                        sx={{ color: 'success.main' }}
                        width={20}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {t('team.excellentPerformers')}
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle1" sx={{ color: 'success.main', fontWeight: 700 }}>
                      {activeData.team.excellent}
                    </Typography>
                  </Paper>

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Iconify
                        icon="solar:danger-triangle-bold"
                        sx={{ color: 'error.main' }}
                        width={20}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {t('team.needsAttention')}
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle1" sx={{ color: 'error.main', fontWeight: 700 }}>
                      {activeData.team.attention}
                    </Typography>
                  </Paper>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Box>

        {/* RIGHT COLUMN: CASCADE KPI LAYOUT (Span 8) */}
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
          <Stack spacing={0} alignItems="center" sx={{ width: '100%' }}>
            {activeData.cascade.map((card, cardIndex) => {
              const cardRole = card.role.startsWith('cascadeKpi.') ? t(card.role) : card.role;
              const isLast = cardIndex === activeData.cascade.length - 1;
              const levelMeta = getLevelMeta(cardIndex);

              return (
                <Stack key={card.role} spacing={0} sx={{ width: '100%' }} alignItems="center">
                  {/* Cascade Level Card */}
                  <Card
                    component={m.div}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: cardIndex * 0.1 }}
                    sx={{
                      p: 3.5,
                      width: '100%',
                      position: 'relative',
                      overflow: 'visible',
                      border: `1px solid ${theme.vars.palette.divider}`,
                      boxShadow: theme.customShadows?.card,
                      transition: theme.transitions.create([
                        'transform',
                        'box-shadow',
                        'border-color',
                      ]),
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        borderColor: `${levelMeta.color}.main`,
                        boxShadow: `0 12px 32px -4px ${varAlpha(theme.vars.palette[levelMeta.color].mainChannel, 0.12)}`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '5px',
                        height: '100%',
                        borderRadius: '4px 0 0 4px',
                        bgcolor: `${levelMeta.color}.main`,
                      },
                    }}
                  >
                    {/* Card Header & Circular Gauge */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2.5 }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 1,
                            bgcolor: `${levelMeta.color}.main`,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Iconify icon={levelMeta.icon} width={22} />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                            {cardRole}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.disabled', fontWeight: 700 }}
                          >
                            Level {cardIndex + 1}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.disabled', fontWeight: 700 }}
                          >
                            TOTAL
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 800, color: 'text.secondary' }}
                          >
                            Achievement
                          </Typography>
                        </Box>
                        <CircularProgressGauge
                          value={card.total}
                          color={card.totalColor}
                          size={52}
                        />
                      </Stack>
                    </Stack>

                    {/* KPI Table */}
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{ borderRadius: 1.5, borderColor: 'divider' }}
                    >
                      <Table size="small">
                        <TableHead sx={{ bgcolor: 'background.neutral' }}>
                          <TableRow>
                            <TableCell
                              sx={{
                                fontWeight: 800,
                                py: 1.2,
                                width: '55%',
                                textTransform: 'uppercase',
                                fontSize: '0.72rem',
                                letterSpacing: 0.5,
                              }}
                            >
                              {t('cascadeKpi.table.kpi')}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                fontWeight: 800,
                                py: 1.2,
                                width: '15%',
                                textTransform: 'uppercase',
                                fontSize: '0.72rem',
                                letterSpacing: 0.5,
                              }}
                            >
                              %
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                fontWeight: 800,
                                py: 1.2,
                                width: '15%',
                                textTransform: 'uppercase',
                                fontSize: '0.72rem',
                                letterSpacing: 0.5,
                              }}
                            >
                              {t('cascadeKpi.table.weight')}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                fontWeight: 800,
                                py: 1.2,
                                width: '15%',
                                textTransform: 'uppercase',
                                fontSize: '0.72rem',
                                letterSpacing: 0.5,
                              }}
                            >
                              {t('cascadeKpi.table.achievement')}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {card.kpis.map((row, rIndex) => (
                            <TableRow
                              key={row.kpi}
                              hover
                              onClick={() =>
                                handleOpenEdit(cardIndex, rIndex, row.kpi, row.percent)
                              }
                              sx={{
                                cursor: 'pointer',
                                transition: theme.transitions.create('background-color'),
                              }}
                            >
                              <TableCell sx={{ fontWeight: 600, color: 'text.secondary', py: 1.5 }}>
                                {row.kpi}
                              </TableCell>
                              <TableCell align="center" sx={{ py: 1.5 }}>
                                <Label
                                  variant="soft"
                                  color={
                                    row.percent === '-'
                                      ? 'default'
                                      : parseFloat(row.percent) === 0
                                        ? 'error'
                                        : parseFloat(row.percent) >= 80
                                          ? 'success'
                                          : 'warning'
                                  }
                                  sx={{ fontWeight: 700 }}
                                >
                                  {row.percent}
                                </Label>
                              </TableCell>
                              <TableCell align="center" sx={{ fontWeight: 700, py: 1.5 }}>
                                {row.bobot}
                              </TableCell>
                              <TableCell align="center" sx={{ py: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: 800,
                                    color:
                                      row.achievement === '-'
                                        ? 'text.disabled'
                                        : Number(row.achievement) === 0
                                          ? 'error.main'
                                          : 'text.primary',
                                  }}
                                >
                                  {row.achievement}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Card>

                  {/* Connected Dotted Path / Flow Arrow separator */}
                  {!isLast && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 2,
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          width: '2px',
                          height: '24px',
                          borderLeft: `2px dotted ${theme.vars.palette[levelMeta.color].main}`,
                          mb: 0.5,
                        }}
                      />
                      <Iconify
                        icon="solar:double-alt-arrow-down-bold-duotone"
                        width={24}
                        sx={{
                          color: `${getLevelMeta(cardIndex + 1).color}.main`,
                          animation: 'pulse 2s infinite ease-in-out',
                          '@keyframes pulse': {
                            '0%, 100%': { transform: 'scale(1)', opacity: 0.6 },
                            '50%': { transform: 'scale(1.15)', opacity: 1 },
                          },
                        }}
                      />
                      <Box
                        sx={{
                          width: '2px',
                          height: '24px',
                          borderLeft: `2px dotted ${theme.vars.palette[getLevelMeta(cardIndex + 1).color].main}`,
                          mt: 0.5,
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </Box>

      {/* EDIT MODAL FOR KPI VALUES */}
      <Dialog open={editOpen} onClose={handleCloseEdit} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:pen-bold" width={24} sx={{ color: 'primary.main' }} />
          Edit KPI Achievement
        </DialogTitle>
        <DialogContent dividers>
          {editContext && (
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                  KPI TARGET
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {editContext.kpiName}
                </Typography>
              </Box>

              <TextField
                autoFocus
                label="Percentage Value (%)"
                placeholder="Enter score (e.g. 85) or '-' for no data"
                fullWidth
                value={editContext.percentValue}
                onChange={(e) =>
                  setEditContext((prev) =>
                    prev ? { ...prev, percentValue: e.target.value } : null
                  )
                }
                helperText="Provide a numeric percentage (0-100) or leave blank / type '-' if no data is available."
                variant="outlined"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveKpi} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
