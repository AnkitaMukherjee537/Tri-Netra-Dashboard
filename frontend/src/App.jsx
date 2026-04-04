import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import KPICards from './components/KPICards';
const LiveMap = React.lazy(() => import('./components/LiveMap'));
import RealtimeAlerts from './components/RealtimeAlerts';
import AnalyticsCharts from './components/AnalyticsCharts';
import Cameras from './components/Cameras';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [accidents, setAccidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('');
  
  // Ref to keep track of previous top accident ID to detect new ones
  const latestAccidentId = useRef(null);

  const fetchAccidents = async () => {
    try {
      const url = filterSeverity 
        ? `${API_BASE_URL}/accidents?severity=${filterSeverity}`
        : `${API_BASE_URL}/accidents`;
        
      const response = await fetch(url, { cache: 'no-store' });
      const data = await response.json();
      
      if (data.success) {
        setAccidents(data.data);
        setStats(data.stats);
        
        // Check for new accidents if we are not filtering and have data
        if (!filterSeverity && data.data.length > 0) {
          const currentTopId = data.data[0].id;
          if (latestAccidentId.current && latestAccidentId.current !== currentTopId) {
            // New alert! Play sound and show toast
            playAlertSound();
            toast.error(`New ${data.data[0].severity} Severity Alert at ${data.data[0].location_name}!`, {
               theme: "dark",
               position: "top-right"
            });
          }
          latestAccidentId.current = currentTopId;
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Sound effect simulation function using HTML5 Audio (no external deps needed if straightforward)
  // Generating a short synthetic beep for demo purposes as we don't have a local .mp3
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // 800Hz
      oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch(e) {
      console.log('Audio contextual play blocked by browser. User interaction needed.');
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAccidents();
    
    // Poll every 5 seconds
    const interval = setInterval(fetchAccidents, 5000);
    return () => clearInterval(interval);
  }, [filterSeverity]); // Re-run effect when filter changes so we fetch filtered immediately


  // View Renderer based on active tab
  const renderContent = () => {
    if (activeTab === 'dashboard' || activeTab === 'alerts') {
      return (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">System Dashboard</h2>
              <p className="text-textmuted text-sm mt-1">Real-time accident detection monitoring network.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
                <span className="text-sm font-medium text-success">Systems Online</span>
              </div>
              <select 
                className="bg-panel border border-white/10 text-sm rounded-lg px-3 py-2 text-white outline-none focus:border-primary transition-colors"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
              >
                <option value="">All Severities</option>
                <option value="High">High Severity</option>
                <option value="Medium">Medium Severity</option>
                <option value="Low">Low Severity</option>
              </select>
            </div>
          </div>
          
          <KPICards stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <React.Suspense fallback={
                <div className="glass-panel w-full h-[450px] flex items-center justify-center">
                  <div className="animate-pulse text-textmuted">Loading Map Component...</div>
                </div>
              }>
                <LiveMap accidents={accidents} />
              </React.Suspense>
            </div>
            <div className="lg:col-span-1">
              <RealtimeAlerts accidents={accidents} />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Analytics Overview</h2>
            <AnalyticsCharts accidents={accidents} />
          </div>
        </>
      );
    } else if (activeTab === 'analytics') {
      return (
        <div>
           <h2 className="text-2xl font-bold text-white mb-6">Deep Analytics</h2>
           <AnalyticsCharts accidents={accidents} />
        </div>
      );
    } else if (activeTab === 'cameras') {
      return <Cameras />;
    } else {
      return (
        <div className="flex items-center justify-center h-full text-textmuted">
          <p className="text-xl">Module under construction.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex bg-background min-h-screen font-sans text-textmain selection:bg-primary/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {renderContent()}
      </main>
      
      <ToastContainer />
    </div>
  );
}

export default App;
