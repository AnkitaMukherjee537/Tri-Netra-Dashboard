import React from 'react';
import { Activity, ShieldCheck, Clock, Camera } from 'lucide-react';

const KPICards = ({ stats }) => {
  const defaultStats = {
    total_detected: 0,
    avg_confidence: 0,
    active_cameras: 0,
    avg_response_time_mins: 0
  };

  const data = stats || defaultStats;

  const cards = [
    {
      title: "Total Detected",
      value: data.total_detected,
      icon: <Activity size={24} className="text-primary" />,
      bg: "bg-primary/20",
      trend: "+12% this week"
    },
    {
      title: "Accuracy",
      value: `${data.avg_confidence}%`,
      icon: <ShieldCheck size={24} className="text-success" />,
      bg: "bg-success/20",
      trend: "+2.1% improvement"
    },
    {
      title: "Avg Response",
      value: `${data.avg_response_time_mins} min`,
      icon: <Clock size={24} className="text-warning" />,
      bg: "bg-warning/20",
      trend: "-1.5 min faster"
    },
    {
      title: "Active Cameras",
      value: data.active_cameras,
      icon: <Camera size={24} className="text-accent" />,
      bg: "bg-accent/20",
      trend: "All systems online"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className="glass-panel p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br from-white to-transparent blur-2xl group-hover:opacity-20 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-textmuted text-sm font-medium">{card.title}</h3>
            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
            <div className="text-xs text-textmuted flex items-center">
              <span className="text-success mr-1">↑</span> {card.trend}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
