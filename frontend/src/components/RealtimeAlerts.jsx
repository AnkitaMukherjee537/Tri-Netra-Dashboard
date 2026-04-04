import React from 'react';
import { AlertCircle, Clock, MapPin, Activity } from 'lucide-react';

const RealtimeAlerts = ({ accidents }) => {
  return (
    <div className="glass-panel p-5 flex flex-col h-full max-h-[450px]">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <AlertCircle size={20} className="text-warning" />
          Real-time Alerts
        </h2>
        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full animate-pulse-slow">Live Feed</span>
      </div>
      
      <div className="overflow-y-auto pr-2 space-y-3 flex-1 flex flex-col">
        {accidents.length === 0 ? (
          <div className="text-center text-textmuted py-10 my-auto">
            <Activity className="mx-auto mb-2 opacity-50" size={32} />
            <p>No recent alerts detected.</p>
          </div>
        ) : (
          accidents.map((accident) => (
            <div 
              key={accident.id} 
              className={`p-3 rounded-lg border-l-4 bg-black/20 hover:bg-white/5 transition-colors duration-200 cursor-pointer ${
                accident.severity === 'High' ? 'border-danger' : 
                accident.severity === 'Medium' ? 'border-warning' : 'border-success'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-semibold ${
                  accident.severity === 'High' ? 'text-danger' : 
                  accident.severity === 'Medium' ? 'text-warning' : 'text-success'
                }`}>
                  {accident.severity} Severity Alert
                </span>
                <span className="text-xs text-textmuted flex items-center">
                  <Clock size={12} className="mr-1" />
                  {new Date(accident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit' })}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-white mb-2">
                <MapPin size={14} className="text-primary mr-1" />
                {accident.location_name}
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-textmuted">Confidence: {Math.round(accident.confidence * 100)}%</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  accident.status === 'Resolved' ? 'bg-success/20 text-success' :
                  accident.status === 'Ambulance Dispatched' ? 'bg-primary/20 text-primary' :
                  'bg-warning/20 text-warning'
                }`}>
                  {accident.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RealtimeAlerts;
