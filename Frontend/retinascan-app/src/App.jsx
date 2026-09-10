import React, { useState } from 'react';
import Header    from './components/Header.jsx';
import Footer    from './components/Footer.jsx';
import Home      from './components/Home.jsx';
import Upload    from './components/Upload.jsx';
import Processing from './components/Processing.jsx';
import Results   from './components/Results.jsx';
import Queue     from './components/Queue.jsx';
import Canvas    from './components/Canvas.jsx';
import Referral  from './components/Referral.jsx';
import { allPatients, demoPresets, imagePaths } from './data.js';

// Golden path: home → upload → processing → results → queue → canvas → referral
const SCREENS = ['home','upload','processing','results','queue','canvas','referral'];

export default function App() {
  const [screen, setScreen]   = useState('home');
  const [patient, setPatient] = useState(demoPresets[2]);
  const [selectedEye, setSelectedEye] = useState('od');
  const [heatmapUrl, setHeatmapUrl] = useState('');
  const [severity, setSeverity] = useState(2);

  function navigate(to) {
    if (SCREENS.includes(to)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setScreen(to);
    }
  }

  function onSelectPatient(p) {
    setPatient(p);
    const sev = p?.severity ?? 2;
    setSeverity(sev);
    setSelectedEye('od');
    setHeatmapUrl(`/images/heatmap_${sev}_od.jpg`);
  }

  const handleUpload = async (file) => {
    setScreen('processing');
    const baseName = file.name.split('.')[0];
    const parts = baseName.split('_');
    let sev = 0;
    if (parts.length > 1 && !isNaN(parseInt(parts[1]))) {
      sev = parseInt(parts[1]);
    } else if (!isNaN(parseInt(baseName))) {
      sev = parseInt(baseName);
    }
    setSeverity(sev);
    setSelectedEye('od');

    const matched = allPatients.find(p => p.severity === sev) || demoPresets.find(p => p.severity === sev) || {
      id: `#DR-${Math.floor(10000 + Math.random() * 90000)}`,
      name: file.name,
      severity: sev,
      label: `Level ${sev} Retinopathy`,
      confidence: 96.0
    };
    setPatient(matched);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('http://localhost:8000/upload', { method: 'POST', body: formData });
      if (response.ok) {
        const data = await response.json();
        setHeatmapUrl(data.heatmap_url || `/images/heatmap_${sev}_od.jpg`);
      } else {
        setHeatmapUrl(imagePaths[sev]?.heatmap || `/images/heatmap_${sev}_od.jpg`);
      }
    } catch (error) {
      setHeatmapUrl(imagePaths[sev]?.heatmap || `/images/heatmap_${sev}_od.jpg`);
    }

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setScreen('results');
    }, 2800);
  };

  // Processing screen has its own full-screen dark background — no header/footer
  if (screen === 'processing') {
    return (
      <Processing
        navigate={navigate}
        patient={patient}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header screen={screen} navigate={navigate} />

      <div className="flex-1 flex flex-col">
        {screen === 'home'     && <Home     navigate={navigate} />}
        {screen === 'upload'   && (
          <Upload
            navigate={navigate}
            onSelectPatient={onSelectPatient}
            handleUpload={handleUpload}
          />
        )}
        {screen === 'results'  && (
          <Results
            navigate={navigate}
            patient={patient}
            severity={severity}
            selectedEye={selectedEye}
            setSelectedEye={setSelectedEye}
            heatmapUrl={heatmapUrl}
            onQueue={() => navigate('queue')}
          />
        )}
        {screen === 'queue'    && (
          <Queue
            navigate={navigate}
            patient={patient}
            severity={severity}
            selectedEye={selectedEye}
          />
        )}
        {screen === 'canvas'   && (
          <Canvas
            navigate={navigate}
            patient={patient}
            severity={severity}
            selectedEye={selectedEye}
            setSelectedEye={setSelectedEye}
            heatmapUrl={heatmapUrl}
            onRefer={() => navigate('referral')}
            onBack={() => navigate('queue')}
          />
        )}
        {screen === 'referral' && (
          <Referral
            navigate={navigate}
            patient={patient}
            severity={severity}
            selectedEye={selectedEye}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
