import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Home } from './pages/Home.jsx';
import { Telescopes } from './pages/Telescopes.jsx';
import { TelescopeDetails } from './pages/TelescopeDetails.jsx';
import { Compare } from './pages/Compare.jsx';
import { Gallery } from './pages/Gallery.jsx';
import { ThreeDExplorer } from './pages/ThreeDExplorer.jsx';
import { GlobalSearchModal } from './components/GlobalSearchModal.jsx';
import { Footer } from './components/Footer.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeTelescopeId, setActiveTelescopeId] = useState('jwst');
  const [activeObjectId, setActiveObjectId] = useState('canes-venatici');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchResultNavigation = (page, id) => {
    if (page === 'telescopes' && id) {
      setActiveTelescopeId(id);
      setActiveTab('telescopes');
    } else if ((page === 'compare' || page === 'comparison') && id) {
      setActiveObjectId(id);
      setActiveTab('compare');
    } else if (page === 'gallery') {
      setActiveTab('gallery');
    } else {
      setActiveTab(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080706] text-[#F5EDE8] flex flex-col font-sans selection:bg-[#EA9162]/30 selection:text-[#FFD2BE]">
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <Home
            onExploreTelescopes={() => handleNavigate('telescopes')}
            onExploreGallery={() => handleNavigate('gallery')}
            onExploreComparison={() => handleNavigate('compare')}
          />
        )}

        {activeTab === 'telescopes' && (
          <Telescopes
            initialTelescopeId={activeTelescopeId}
            onNavigateToComparison={(telId) => {
              if (telId) setActiveTelescopeId(telId);
              handleNavigate('compare');
            }}
            onNavigateToDetails={(telId) => {
              setActiveTelescopeId(telId);
              handleNavigate('telescope-details');
            }}
          />
        )}

        {activeTab === 'telescope-details' && (
          <TelescopeDetails
            telescopeId={activeTelescopeId}
            onBack={() => handleNavigate('telescopes')}
            onNavigateToComparison={() => handleNavigate('compare')}
          />
        )}

        {(activeTab === 'comparison' || activeTab === 'compare') && (
          <Compare
            initialObjectId={activeObjectId}
            onNavigateToTelescope={(telId) => {
              setActiveTelescopeId(telId);
              handleNavigate('telescopes');
            }}
          />
        )}

        {activeTab === 'gallery' && (
          <Gallery
            onNavigateToComparison={(objId, telId) => {
              if (objId) setActiveObjectId(objId);
              if (telId) setActiveTelescopeId(telId);
              handleNavigate('compare');
            }}
            onNavigateToTelescope={(telId) => {
              if (telId) setActiveTelescopeId(telId);
              handleNavigate('telescopes');
            }}
            onNavigateToSketch={(telId) => {
              if (telId) setActiveTelescopeId(telId);
              handleNavigate('telescopes');
            }}
          />
        )}

        {activeTab === '3d-explorer' && (
          <ThreeDExplorer
            onNavigateToComparison={(objId) => {
              if (objId) setActiveObjectId(objId);
              handleNavigate('compare');
            }}
          />
        )}
      </main>

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToResult={handleSearchResultNavigation}
      />

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
