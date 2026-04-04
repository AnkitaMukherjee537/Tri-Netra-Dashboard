import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const AnalyticsCharts = ({ accidents }) => {
  // Aggregate data for Line Chart: Accidents over time (simulated hours for demo)
  // To make it look good statically, we will generate fake hour data if needed, or aggregate from accidents.
  const hoursData = Array.from({ length: 6 }).map((_, i) => ({
    time: `${i * 4}:00`,
    accidents: Math.floor(Math.random() * 20) + 5
  }));

  // Bar chart: Severity distribution
  const severityCount = { High: 0, Medium: 0, Low: 0 };
  accidents.forEach(a => {
    if (severityCount[a.severity] !== undefined) severityCount[a.severity]++;
  });
  
  const barData = [
    { name: 'High', count: severityCount.High, color: '#EF4444' },
    { name: 'Medium', count: severityCount.Medium, color: '#F59E0B' },
    { name: 'Low', count: severityCount.Low, color: '#10B981' }
  ];

  // Pie chart: Accuracy vs False Positives
  // Simulating 92% accuracy, 8% false positives
  const pieData = [
    { name: 'Accurate', value: 92 },
    { name: 'False Positive', value: 8 }
  ];
  const COLORS = ['#3B82F6', '#ef4444']; // Primary blue vs Red

  // Area chart: Response time trend
  const responseData = [
    { day: 'Mon', time: 12 }, { day: 'Tue', time: 15 }, { day: 'Wed', time: 9 },
    { day: 'Thu', time: 10 }, { day: 'Fri', time: 8 }, { day: 'Sat', time: 6 }, { day: 'Sun', time: 7 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-panel/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur text-xs">
          <p className="text-white mb-1 font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color || entry.fill }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pb-10">
      
      {/* Line Chart */}
      <div className="glass-panel p-5 h-80">
        <h3 className="text-textmuted text-sm font-semibold mb-4">Accidents Over 24 Hours</h3>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={hoursData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="accidents" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#0F172A' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="glass-panel p-5 h-80">
        <h3 className="text-textmuted text-sm font-semibold mb-4">Severity Distribution</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={barData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} width={60} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff10' }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Area Chart */}
      <div className="glass-panel p-5 h-80">
        <h3 className="text-textmuted text-sm font-semibold mb-4">Avg Response Time (Mins) Trend</h3>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={responseData}>
            <defs>
              <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="time" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorTime)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="glass-panel p-5 h-80">
        <h3 className="text-textmuted text-sm font-semibold mb-4">System Accuracy</h3>
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default AnalyticsCharts;
