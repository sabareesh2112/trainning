import React, { useState } from 'react';
import { telescopes } from '../data/telescopes.js';
import { telescopeImages } from '../data/images.js';
import { ComparisonViewer } from '../components/ComparisonViewer.jsx';
import { WavelengthSpectrum } from '../components/WavelengthSpectrum.jsx';
import { CosmicButton } from '../components/CosmicButton.jsx';
import { Orbit, SlidersHorizontal, CheckCircle2, Sparkles, Eye } from 'lucide-react';

export const Compare = ({
  initialObjectId = 'canes-venatici',
  initialTelescopes = ['jwst', 'hubble'],
  onNavigateToTelescope
}) => {
  const [activeTab, setActiveTab] = useState('objects'); // 'objects' | 'telescopes'
  const [selectedObjectId, setSelectedObjectId] = useState(initialObjectId);

  const activeObject =
    telescopeImages.find((o) => o.id === selectedObjectId) || telescopeImages[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header in Warm Stellar Space Theme */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[rgba(234,145,98,0.20)] pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#EA9162] uppercase tracking-wider">
            <span>MULTI-SPECTRAL OBSERVATORY</span>
            <span className="text-[#9F8D84]">·</span>
            <span>SIDE-BY-SIDE SCIENTIFIC ANALYSIS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#FFFFFF] mt-1">
            Cosmic Comparison System
          </h1>
          <p className="text-sm text-[#C7B8B0] mt-1 max-w-2xl leading-relaxed">
            Directly compare how the identical astronomical targets appear through the optical eyes of Hubble and the infrared vision of James Webb, using the shared image repository.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-[#0D0A08] border border-[rgba(234,145,98,0.25)] rounded-full p-1 shadow-[0_0_15px_rgba(234,145,98,0.1)]">
          <button
            onClick={() => setActiveTab('objects')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono rounded-full transition-all cursor-pointer ${
              activeTab === 'objects'
                ? 'bg-[#18100C] text-[#EA9162] font-semibold border border-[rgba(234,145,98,0.35)] shadow-sm'
                : 'text-[#C7B8B0] hover:text-[#FFFFFF]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Compare Astronomical Objects</span>
          </button>
          <button
            onClick={() => setActiveTab('telescopes')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono rounded-full transition-all cursor-pointer ${
              activeTab === 'telescopes'
                ? 'bg-[#18100C] text-[#EA9162] font-semibold border border-[rgba(234,145,98,0.35)] shadow-sm'
                : 'text-[#C7B8B0] hover:text-[#FFFFFF]'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>Compare Telescopes (JWST vs Hubble)</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Compare Astronomical Objects (Canes Venatici, Monoceros, Unicorn) */}
      {activeTab === 'objects' && (
        <div className="space-y-6">
          {/* Target Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-[#9F8D84] tracking-wider px-1">
              <span>SELECT CELESTIAL TARGET:</span>
              <span className="text-[#EA9162]">SAME DATA AS GALLERY</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {telescopeImages.map((obj) => {
                const isSelected = obj.id === activeObject.id;
                return (
                  <button
                    key={obj.id}
                    onClick={() => setSelectedObjectId(obj.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-[#18100C] border-[#EA9162] shadow-[0_0_20px_rgba(234,145,98,0.25)]'
                        : 'bg-[#0D0A08] border-[rgba(234,145,98,0.20)] hover:border-[rgba(234,145,98,0.45)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#EA9162] uppercase">
                        {obj.category}
                      </span>
                      {isSelected && <Sparkles className="w-3.5 h-3.5 text-[#EA9162]" />}
                    </div>
                    <h3 className="text-base font-semibold text-[#FFFFFF] group-hover:text-[#F2B08E] transition-colors mt-1">
                      {obj.objectName}
                    </h3>
                    <p className="text-xs text-[#C7B8B0] line-clamp-1 mt-1">
                      {obj.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#9F8D84] mt-2 pt-2 border-t border-[rgba(234,145,98,0.15)]">
                      <span>Hubble (Optical)</span>
                      <span>·</span>
                      <span className="text-[#EA9162]">Webb (Infrared)</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Split / Grid Comparison Viewer */}
          <ComparisonViewer
            object={activeObject}
            onSelectTelescope={onNavigateToTelescope}
          />

          {/* Scientific Context Card for Active Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0D0A08] border border-[rgba(234,145,98,0.22)] rounded-2xl p-6 shadow-xl">
            <div className="space-y-2 border-b md:border-b-0 md:border-r border-[rgba(234,145,98,0.18)] pb-4 md:pb-0 md:pr-6">
              <div className="flex items-center gap-2 text-xs font-mono text-[#EA9162]">
                <span className="w-2 h-2 rounded-full bg-[#EA9162]" />
                <span className="font-semibold">HUBBLE OBSERVATION PERSPECTIVE</span>
              </div>
              <h4 className="text-sm font-semibold text-[#FFFFFF]">
                {activeObject.hubbleTitle}
              </h4>
              <p className="text-xs text-[#C7B8B0] leading-relaxed">
                {activeObject.hubbleDescription}
              </p>
              <div className="text-[11px] font-mono text-[#9F8D84] pt-2">
                Spectral Window: <span className="text-[#F5EDE8]">{activeObject.hubbleWavelength}</span>
              </div>
            </div>

            <div className="space-y-2 md:pl-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#EA9162]">
                <span className="w-2 h-2 rounded-full bg-[#EA9162]" />
                <span className="font-semibold">JAMES WEBB OBSERVATION PERSPECTIVE</span>
              </div>
              <h4 className="text-sm font-semibold text-[#FFFFFF]">
                {activeObject.jamesWebbTitle}
              </h4>
              <p className="text-xs text-[#C7B8B0] leading-relaxed">
                {activeObject.jamesWebbDescription}
              </p>
              <div className="text-[11px] font-mono text-[#9F8D84] pt-2">
                Spectral Window: <span className="text-[#F5EDE8]">{activeObject.jamesWebbWavelength}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Compare Telescopes (James Webb vs Hubble ONLY) */}
      {activeTab === 'telescopes' && (
        <div className="space-y-6">
          <div className="p-4 bg-[#0D0A08] border border-[rgba(234,145,98,0.20)] rounded-2xl space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-mono text-[#EA9162] uppercase tracking-wider font-semibold">
                ACTIVE OBSERVATORIES:
              </span>
              <span className="text-xs font-mono text-[#C7B8B0]">
                James Webb Space Telescope (JWST) vs Hubble Space Telescope (HST)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {telescopes.map((tel) => (
                <div
                  key={tel.id}
                  className="p-3.5 rounded-xl border text-left transition-all flex items-center justify-between bg-[#120D0A] border-[rgba(234,145,98,0.35)] shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase text-[#EA9162] font-semibold">
                        {tel.shortName}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#EA9162]" />
                    </div>
                    <h4 className="text-sm font-semibold text-[#FFFFFF] mt-0.5">
                      {tel.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#F2B08E] mt-1 block">
                      {tel.primaryWavelength}
                    </span>
                  </div>
                  <CosmicButton
                    onClick={() => onNavigateToTelescope(tel.id)}
                    variant="secondary"
                    size="sm"
                  >
                    View 3D
                  </CosmicButton>
                </div>
              ))}
            </div>
          </div>

          {/* Side-by-Side Specifications Matrix */}
          <div className="bg-[#0D0A08] border border-[rgba(234,145,98,0.25)] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[rgba(234,145,98,0.20)] bg-[#120D0A]">
                    <th className="p-4 text-[#EA9162] font-semibold uppercase tracking-wider">
                      PARAMETER
                    </th>
                    {telescopes.map((tel) => (
                      <th
                        key={tel.id}
                        className="p-4 text-[#FFFFFF] font-heading text-sm font-bold border-l border-[rgba(234,145,98,0.15)]"
                      >
                        {tel.shortName}
                        <span className="block text-[11px] font-mono text-[#9F8D84] font-normal mt-0.5">
                          {tel.agency}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(234,145,98,0.15)]">
                  <tr>
                    <td className="p-4 text-[#C7B8B0] font-medium">Primary Aperture</td>
                    {telescopes.map((tel) => (
                      <td key={tel.id} className="p-4 text-[#FFFFFF] border-l border-[rgba(234,145,98,0.15)] font-semibold text-[#F2B08E]">
                        {tel.mirrorSize}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-[#C7B8B0] font-medium">Spectral Bandwidth</td>
                    {telescopes.map((tel) => (
                      <td key={tel.id} className="p-4 text-[#FFFFFF] border-l border-[rgba(234,145,98,0.15)]">
                        {tel.wavelengthRange}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-[#C7B8B0] font-medium">Operational Orbit</td>
                    {telescopes.map((tel) => (
                      <td key={tel.id} className="p-4 text-[#FFFFFF] border-l border-[rgba(234,145,98,0.15)]">
                        {tel.location} ({tel.orbitAltitude})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-[#C7B8B0] font-medium">Primary Mission Focus</td>
                    {telescopes.map((tel) => (
                      <td key={tel.id} className="p-4 text-[#C7B8B0] border-l border-[rgba(234,145,98,0.15)] leading-relaxed">
                        {tel.mainPurpose}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-[#C7B8B0] font-medium">Launch & Status</td>
                    {telescopes.map((tel) => (
                      <td key={tel.id} className="p-4 text-[#FFFFFF] border-l border-[rgba(234,145,98,0.15)]">
                        {tel.launchDate} · <span className="text-[#EA9162]">{tel.status}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-[#C7B8B0] font-medium">3D Spatial Model</td>
                    {telescopes.map((tel) => (
                      <td key={tel.id} className="p-4 border-l border-[rgba(234,145,98,0.15)]">
                        <CosmicButton
                          onClick={() => onNavigateToTelescope(tel.id)}
                          variant="primary"
                          size="sm"
                        >
                          Explore {tel.shortName} in 3D
                        </CosmicButton>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Electromagnetic Spectrum Visualization */}
      <div className="mt-8">
        <WavelengthSpectrum onSelectTelescope={onNavigateToTelescope} />
      </div>
    </div>
  );
};

export default Compare;
