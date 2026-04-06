import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, Activity, AlertOctagon, CheckCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Cameras = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const processIntervalRef = useRef(null);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setErrorMsg('Please upload a valid video file format (e.g. mp4).');
        return;
      }
      setErrorMsg('');
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setDetectionResult(null);
    }
  };

  const processFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !videoSrc) return;
    const video = videoRef.current;
    if (video.paused || video.ended) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Capture the frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      setIsProcessing(true);
      // Simulate AI endpoint processing latency
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Random generation for local simulation
      const randomWeight = Math.random();
      let severity = 'Low';
      if (randomWeight > 0.90) severity = 'High';
      else if (randomWeight > 0.75) severity = 'Medium';
      
      const confidence = (Math.random() * (0.99 - 0.70) + 0.70).toFixed(2);
      
      const result = { severity, confidence };
      setDetectionResult(result);
      setErrorMsg('');
      
      // Push high/medium severities to backend to trigger live alerts seamlessly
      if (severity === 'High' || severity === 'Medium') {
        try {
          await fetch(`${API_BASE_URL}/add_accident`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lat: 22.5726 + (Math.random() * 0.05 - 0.025),
              lng: 88.3639 + (Math.random() * 0.05 - 0.025),
              severity,
              confidence: parseFloat(confidence),
              location_name: "Camera Feed Detection"
            })
          });
        } catch(e) { 
           // Ignore silently as per requirement not to break if backend doesn't respond
        }
      }
    } catch (error) {
      setErrorMsg('Frame processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (videoSrc) {
      processIntervalRef.current = setInterval(processFrame, 1500); // 1.5 seconds intervals
    }
    return () => {
      if (processIntervalRef.current) {
        clearInterval(processIntervalRef.current);
      }
    };
  }, [videoSrc]);

  const triggerFileUpload = () => fileInputRef.current.click();

  const getSeverityColor = (severity) => {
    if (severity === 'High') return 'text-danger bg-danger/10 border-danger/20';
    if (severity === 'Medium') return 'text-warning bg-warning/10 border-warning/20';
    return 'text-success bg-success/10 border-success/20';
  };

  const getSeverityIcon = (severity) => {
    if (severity === 'High') return <AlertOctagon size={24} className="text-danger" />;
    if (severity === 'Medium') return <AlertTriangle size={24} className="text-warning" />;
    return <CheckCircle size={24} className="text-success" />;
  };

  return (
    <div className="flex flex-col space-y-6 h-full">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-white">Camera Feeds</h2>
          <p className="text-textmuted text-sm mt-1">Live video stream edge processing & AI inference center.</p>
        </div>
        <div className="flex items-center space-x-4">
          <input 
            type="file" 
            accept="video/*" 
            ref={fileInputRef} 
            onChange={handleVideoUpload} 
            className="hidden"
          />
          <button 
            onClick={triggerFileUpload}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-lg shadow-primary/20"
          >
            <Upload size={18} />
            <span>Upload Feed</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
        {/* Main Camera View */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="bg-panel border border-white/5 rounded-2xl overflow-hidden relative shadow-2xl flex-1 flex flex-col min-h-[450px]">
            <div className="bg-background/50 px-4 py-3 border-b border-white/5 flex justify-between items-center z-10 w-full absolute top-0 left-0">
              <div className="flex items-center space-x-2 drop-shadow-md">
                <Camera size={18} className="text-white" />
                <span className="font-medium text-white">CAM_01 - Highway Monitor</span>
              </div>
              <div className="flex items-center space-x-3">
                {videoSrc && (
                   <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-danger/10 border border-danger/20 text-danger text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                     <span className="w-2 h-2 rounded-full bg-danger animate-pulse"></span>
                     <span>Live Analysis</span>
                   </span>
                )}
              </div>
            </div>
            
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden h-full">
              {videoSrc ? (
                <video 
                  ref={videoRef}
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center text-textmuted space-y-4">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center relative">
                    <Camera size={32} className="opacity-50" />
                    <div className="absolute top-0 right-0 w-4 h-4 bg-danger rounded-full border-2 border-black"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-white/50">Camera offline</p>
                    <p className="text-sm mt-1">Upload a video to simulate CCTV feed</p>
                  </div>
                </div>
              )}
              
              {/* Overlay graphics */}
              {videoSrc && (
                <div className="absolute inset-0 pointer-events-none border border-primary/10 p-8 flex flex-col justify-between pt-16">
                   <div className="flex justify-between">
                     <div className="text-success font-mono text-xs opacity-70 mix-blend-difference drop-shadow-sm">REC // AI ENABLED</div>
                   </div>
                   <div className="flex justify-between items-end">
                     <div className="w-16 h-16 border-l-2 border-b-2 border-primary/50 drop-shadow-lg text-primary text-xs flex items-end ml-1 mb-1">
                     </div>
                     <div className="w-16 h-16 border-r-2 border-b-2 border-primary/50 drop-shadow-lg"></div>
                   </div>
                </div>
              )}
            </div>
          </div>
          
          {errorMsg && (
            <div className="mt-4 p-3 bg-danger/10 border border-danger/20 text-danger text-sm rounded-lg flex items-center space-x-2">
               <AlertTriangle size={16} />
               <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Inference Status Board */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          <div className="bg-panel border border-white/5 rounded-2xl p-5 flex-1 relative overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center border-b border-white/5 pb-3">
              <Activity size={18} className="mr-2 text-primary" />
              Inference Status
            </h3>
            
            <div className="space-y-6 relative z-10 flex-1">
              <div className="p-4 bg-background/50 rounded-xl border border-white/5">
                 <div className="text-textmuted text-xs uppercase tracking-wider mb-1">Processor</div>
                 <div className="flex items-center space-x-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${videoSrc ? 'bg-success animate-pulse' : 'bg-textmuted'}`}></div>
                    <span className={`font-semibold ${videoSrc ? 'text-white' : 'text-textmuted'}`}>
                      {videoSrc ? 'Detecting' : 'Idle'}
                    </span>
                 </div>
                 {isProcessing && videoSrc && (
                    <div className="mt-3 text-xs text-primary flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Extracting frame...
                    </div>
                 )}
              </div>

              {detectionResult ? (
                <div className={`p-4 rounded-xl border ${getSeverityColor(detectionResult.severity)} transition-all duration-300 shadow-md`}>
                   <div className="text-xs uppercase tracking-wider mb-2 opacity-70 font-semibold">Latest Snapshot</div>
                   <div className="flex justify-between items-start mb-2">
                     <div className="flex items-center space-x-2">
                       {getSeverityIcon(detectionResult.severity)}
                       <span className="text-lg font-bold">{detectionResult.severity}</span>
                     </div>
                   </div>
                   <div className="mt-4 bg-black/30 p-2.5 rounded-lg flex justify-between items-center">
                     <span className="text-xs opacity-80 uppercase tracking-widest text-[#ccc]">Confidence Score</span>
                     <span className="font-mono font-medium">
                       {Math.round(detectionResult.confidence * 100)}%
                     </span>
                   </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-white/5 bg-background/30 flex flex-col items-center justify-center py-8 text-center h-[160px]">
                   <Activity size={32} className="text-textmuted mb-3 opacity-30" />
                   <p className="text-sm text-textmuted">Awaiting frame data</p>
                </div>
              )}

              {/* Informational Tip */}
              <div className="mt-auto pt-4 text-xs text-textmuted border-t border-white/5">
                Frames captured every 1.5s via HTML5 canvas to prevent memory leaks and minimize client load. High severity incidents are pushed to Live Alerts.
              </div>
            </div>

            {/* Hidden canvas for frame extraction */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cameras;
