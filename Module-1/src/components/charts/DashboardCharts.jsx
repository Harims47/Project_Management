import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// Custom Tooltip component for standard styling
const CustomChartTooltip = ({ active, payload, label, prefix = '$' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-brandDark-card border border-gray-150 dark:border-gray-800 p-3 rounded-lg shadow-lg text-left">
        {label && <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>}
        {payload.map((item, idx) => (
          <p key={idx} className="text-sm font-black" style={{ color: item.color }}>
            {item.name}: {prefix}{item.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// 1. Reusable Line Chart
export const LineChart = ({
  data,
  xKey,
  series = [], // [{ key: 'revenue', color: '#1552A6', name: 'Revenue' }]
  height = 300,
  prefix = '$',
  showGrid = true,
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />}
          <XAxis 
            dataKey={xKey} 
            stroke="currentColor" 
            className="text-gray-400 dark:text-gray-500 text-xs font-semibold"
            tickLine={false}
            dy={10}
          />
          <YAxis 
            stroke="currentColor" 
            className="text-gray-400 dark:text-gray-500 text-xs font-semibold"
            tickLine={false}
            dx={-10}
            tickFormatter={(tick) => `${prefix}${tick >= 1000 ? `${(tick / 1000).toFixed(0)}k` : tick}`}
          />
          <Tooltip content={<CustomChartTooltip prefix={prefix} />} />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}
          />
          {series.map(s => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name || s.key}
              stroke={s.color || '#1552A6'}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. Reusable Bar Chart
export const BarChart = ({
  data,
  xKey,
  series = [], // [{ key: 'value', color: '#28B6E8', name: 'Active Contracts' }]
  height = 300,
  prefix = '',
  showGrid = true,
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />}
          <XAxis 
            dataKey={xKey} 
            stroke="currentColor" 
            className="text-gray-400 dark:text-gray-500 text-xs font-semibold"
            tickLine={false}
            dy={10}
          />
          <YAxis 
            stroke="currentColor" 
            className="text-gray-400 dark:text-gray-500 text-xs font-semibold"
            tickLine={false}
            dx={-10}
          />
          <Tooltip content={<CustomChartTooltip prefix={prefix} />} />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}
          />
          {series.map(s => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name || s.key}
              fill={s.color || '#28B6E8'}
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 3. Reusable Pie / Donut Chart
export const PieChart = ({
  data = [], // [{ name: 'On Track', value: 400 }]
  height = 300,
  colors = ['#1552A6', '#28B6E8', '#EC008C', '#10b981'],
  innerRadius = 0, // set > 0 for donut (e.g. 60)
  outerRadius = 80,
  prefix = '',
}) => {
  return (
    <div style={{ width: '100%', height }} className="flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={innerRadius > 0 ? 3 : 0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomChartTooltip prefix={prefix} />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
