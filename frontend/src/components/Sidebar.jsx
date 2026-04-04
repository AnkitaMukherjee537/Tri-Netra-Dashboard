import React from 'react';
import { Home, AlertTriangle, BarChart3, Settings, Camera, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <Home size={20} /> },
    { id: 'alerts', name: 'Live Alerts', icon: <AlertTriangle size={20} /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'cameras', name: 'Cameras', icon: <Camera size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-panel/80 border-r border-white/5 flex flex-col justify-between fixed top-0 left-0 pt-6 pb-4">
      <div>
        <div className="px-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Camera size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-accent bg-clip-text text-transparent">Tri-Netra</h1>
              <p className="text-xs text-textmuted">EmergencyEye AI</p>
            </div>
          </div>
        </div>

        <nav className="px-3 space-y-1">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.icon}
              <span className="font-medium">{tab.name}</span>
            </div>
          ))}
        </nav>
      </div>

      <div className="px-3">
        <div className="nav-item text-danger hover:bg-danger/10 hover:text-danger">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
