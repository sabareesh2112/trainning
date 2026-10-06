import React, { useState } from 'react';
import { telescopeImages, galleryItems } from '../data/images.js';
import { ImageDetailModal } from './ImageDetailModal.jsx';
import { CosmicButton } from './CosmicButton.jsx';
import { Columns, Eye, Sparkles, Orbit, SlidersHorizontal, Info } from 'lucide-react';

export const ImageGallery = ({
  onNavigateToComparison,
  onNavigateToTelescope,
  onNavigateToSketch
}) => {
  const [activeModalImage, setActiveModalImage] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Gallery Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[rgba(234,145,98,0.20)] pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#EA9162] uppercase tracking-wider">
            <span>ASTRONOMICAL OBSERVATORY REPOSITORY</span>
            <span className="text-[#9F8D84]">·</span>
            <span>HUBBLE & JAMES WEBB DUAL PERSPECTIVES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#FFFFFF] mt-1">
            Astronomical Image Gallery
          </h1>
          <p className="text-sm text-[#C7B8B0] mt-1.5 max-w-2xl leading-relaxed">
            Direct observational imagery from humanity's premier space observatories. Explore how identical cosmic targets in Canes Venatici, Monoceros, and Unicorn reveal radically different physics across visible and infrared light.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3 py-1.5 bg-[#120D0A] border border-[rgba(234,145,98,0.25)] rounded-lg text-xs font-mono text-[#F2B08E] flex items-center gap-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#EA9162]" />
            <span>3 Target Objects · 6 Multi-Wavelength Images</span>
          </div>
        </div>
      </div>

      {/* 3 Astronomical Objects with Side-by-Side Telescope Images */}
      <div className="space-y-12">
        {telescopeImages.map((obj, idx) => {
          const hubbleItem = galleryItems.find((g) => g.id === `${obj.id}-hubble`);
          const jwstItem = galleryItems.find((g) => g.id === `${obj.id}-jwst`);

          return (
            <section
              key={obj.id}
              className="bg-[#0D0A08] border border-[rgba(234,145,98,0.22)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden group/section"
            >
              {/* Object Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[rgba(234,145,98,0.20)] gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#EA9162]">
                    <span className="px-2 py-0.5 bg-[#18100C] rounded border border-[rgba(234,145,98,0.30)] font-semibold">
                      0{idx + 1}
                    </span>
                    <span className="text-[#9F8D84]">·</span>
                    <span className="uppercase tracking-wider">{obj.category}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#FFFFFF] mt-1 tracking-tight">
                    {obj.objectName}
                  </h2>
                  <p className="text-xs text-[#C7B8B0] mt-1 max-w-2xl leading-relaxed">
                    {obj.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <CosmicButton
                    onClick={() => onNavigateToComparison(obj.id)}
                    variant="secondary"
                    size="sm"
                    icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
                    iconPosition="left"
                  >
                    Compare in Detail
                  </CosmicButton>
                </div>
              </div>

              {/* Dual Telescope Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* 1. Hubble Space Telescope Card */}
                <div className="bg-[#120D0A] border border-[rgba(234,145,98,0.20)] hover:border-[#EA9162] rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-[0_0_25px_rgba(234,145,98,0.20)] group">
                  <div
                    onClick={() => setActiveModalImage(hubbleItem)}
                    className="relative aspect-4/3 w-full bg-[#080706] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={obj.hubble}
                      alt={`${obj.objectName} - Hubble Space Telescope`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    <div className="absolute top-3 left-3 bg-[#080706]/90 backdrop-blur-md border border-[rgba(234,145,98,0.30)] px-2.5 py-1 rounded-md text-xs font-mono text-[#FFFFFF] flex items-center gap-1.5 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EA9162]" />
                      <span className="font-semibold text-[#EA9162]">Hubble Space Telescope</span>
                    </div>

                    <div className="absolute top-3 right-3 bg-[#080706]/90 backdrop-blur-md border border-[rgba(234,145,98,0.30)] px-2 py-0.5 rounded text-[11px] font-mono text-[#F2B08E]">
                      {obj.hubbleWavelength}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#080706]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-xs font-mono text-[#F5EDE8] flex items-center gap-1.5 bg-[#080706]/90 px-3 py-1.5 rounded-lg border border-[rgba(234,145,98,0.30)]">
                        <Eye className="w-3.5 h-3.5 text-[#EA9162]" /> Click to inspect high-resolution
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-[#9F8D84]">
                        <span>Hubble Space Telescope (HST)</span>
                        <span>{obj.distance}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#FFFFFF] group-hover:text-[#F2B08E] transition-colors mt-0.5">
                        {obj.objectName} — Hubble
                      </h3>
                      <p className="text-xs text-[#C7B8B0] mt-1.5 leading-relaxed">
                        {obj.hubbleDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[rgba(234,145,98,0.18)] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#EA9162]">
                        Optical Astronomy
                      </span>
                      <button
                        onClick={() => setActiveModalImage(hubbleItem)}
                        className="text-xs font-mono text-[#EA9162] hover:text-[#FFD2BE] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Fullscreen View
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. James Webb Space Telescope Card */}
                <div className="bg-[#120D0A] border border-[rgba(234,145,98,0.20)] hover:border-[#EA9162] rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-[0_0_25px_rgba(234,145,98,0.20)] group">
                  <div
                    onClick={() => setActiveModalImage(jwstItem)}
                    className="relative aspect-4/3 w-full bg-[#080706] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={obj.jamesWebb}
                      alt={`${obj.objectName} - James Webb Space Telescope`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    <div className="absolute top-3 left-3 bg-[#080706]/90 backdrop-blur-md border border-[rgba(234,145,98,0.30)] px-2.5 py-1 rounded-md text-xs font-mono text-[#FFFFFF] flex items-center gap-1.5 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EA9162]" />
                      <span className="font-semibold text-[#EA9162]">James Webb Space Telescope</span>
                    </div>

                    <div className="absolute top-3 right-3 bg-[#080706]/90 backdrop-blur-md border border-[rgba(234,145,98,0.30)] px-2 py-0.5 rounded text-[11px] font-mono text-[#F2B08E]">
                      {obj.jamesWebbWavelength}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#080706]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-xs font-mono text-[#F5EDE8] flex items-center gap-1.5 bg-[#080706]/90 px-3 py-1.5 rounded-lg border border-[rgba(234,145,98,0.30)]">
                        <Eye className="w-3.5 h-3.5 text-[#EA9162]" /> Click to inspect high-resolution
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-[#9F8D84]">
                        <span>James Webb Space Telescope (JWST)</span>
                        <span>{obj.distance}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#FFFFFF] group-hover:text-[#F2B08E] transition-colors mt-0.5">
                        {obj.objectName} — James Webb
                      </h3>
                      <p className="text-xs text-[#C7B8B0] mt-1.5 leading-relaxed">
                        {obj.jamesWebbDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[rgba(234,145,98,0.18)] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#EA9162]">
                        Infrared Astronomy
                      </span>
                      <button
                        onClick={() => setActiveModalImage(jwstItem)}
                        className="text-xs font-mono text-[#EA9162] hover:text-[#FFD2BE] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Fullscreen View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* High-Resolution Modal */}
      <ImageDetailModal
        image={activeModalImage}
        onClose={() => setActiveModalImage(null)}
        onCompareWithTelescope={(objId) => onNavigateToComparison(objId)}
        onView3D={(telId) => onNavigateToTelescope(telId)}
        onViewSketch={(telId) => onNavigateToSketch(telId)}
      />
    </div>
  );
};

export default ImageGallery;
