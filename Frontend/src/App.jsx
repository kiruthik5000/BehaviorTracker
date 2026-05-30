import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import DSARevision from './pages/DSARevision';
import NeonIDE from './pages/NeonIDE';
import Sidebar from './components/Sidebar';

// We create a wrapper layout that keeps the Sidebar persistent
function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <Sidebar showCopilot={false} />
      <main className="flex-1 ml-[320px] p-10 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dsa" element={<Layout><DSARevision /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/workbench" element={<NeonIDE />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
