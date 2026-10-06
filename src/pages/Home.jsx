import React from 'react';
import { Orbit, Images, Eye, Compass } from 'lucide-react';
import { CosmicButton } from '../components/CosmicButton.jsx';

export const Home = ({
  onExploreTelescopes,
  onExploreGallery,
  onExploreComparison
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden">
      {/* 1. Full-Screen Cinematic Space Video Background at Native Quality */}
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/space-background.mp4" type="video/mp4" />
      </video>

      {/* 2. Dark Transparent Overlay Preserving Video Clarity */}
      <div className="hero-overlay" />

      {/* 3. Centered Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center">
        {/* Top Astrophysics Tag */}
        <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#EA9162] uppercase bg-[#18100C]/85 border border-[rgba(234,145,98,0.35)] px-4 py-1.5 rounded-full backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(234,145,98,0.20)]">
          <Compass className="w-3.5 h-3.5 text-[#EA9162]" />
          <span>MULTI-WAVELENGTH SPACE OBSERVATORY</span>
          <span className="text-[#9F8D84]">·</span>
          <span>WEBB & HUBBLE</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-heading font-extrabold text-[#FFFFFF] tracking-tight leading-none drop-shadow-[0_4px_25px_rgba(234,145,98,0.30)]">
          COSMIC LENS
        </h1>

        {/* Subtitle */}
        <h2 className="mt-5 text-xl sm:text-2xl lg:text-3xl font-heading font-semibold text-[#EA9162] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          Explore the Universe Through Different Cosmic Lenses
        </h2>

        {/* Supporting description */}
        <p className="mt-4 text-base sm:text-lg text-[#F5EDE8]/90 max-w-2xl leading-relaxed text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Discover how James Webb and Hubble reveal the universe through different wavelengths, images, models, and scientific views.
        </p>

        {/* Main CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <CosmicButton
            onClick={onExploreTelescopes}
            variant="primary"
            size="lg"
            icon={<Orbit className="w-4.5 h-4.5" />}
            iconPosition="left"
          >
            EXPLORE TELESCOPES
          </CosmicButton>

          <CosmicButton
            onClick={onExploreGallery}
            variant="secondary"
            size="lg"
            icon={<Images className="w-4.5 h-4.5" />}
            iconPosition="left"
          >
            EXPLORE GALLERY
          </CosmicButton>

          <CosmicButton
            onClick={onExploreComparison}
            variant="secondary"
            size="lg"
            icon={<Eye className="w-4.5 h-4.5" />}
            iconPosition="left"
          >
            COMPARE OBSERVATIONS
          </CosmicButton>
        </div>

        {/* Feature quick links */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl text-left">
          <div
            onClick={onExploreTelescopes}
            className="p-4 bg-[#0D0A08]/85 backdrop-blur-md border border-[rgba(234,145,98,0.25)] hover:border-[#EA9162] hover:shadow-[0_0_20px_rgba(234,145,98,0.25)] rounded-2xl transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#EA9162] mb-1.5">
              <span>01. 3D OBSERVATORIES</span>
              <Orbit className="w-4 h-4 text-[#EA9162] group-hover:rotate-45 transition-transform" />
            </div>
            <h3 className="text-sm font-semibold text-[#FFFFFF] group-hover:text-[#EA9162] transition-colors">
              James Webb & Hubble Space Telescopes
            </h3>
            <p className="text-xs text-[#C7B8B0] mt-1 leading-relaxed">
              Examine full 3D CAD models, optics, and solar arrays with interactive component telemetry.
            </p>
          </div>

          <div
            onClick={onExploreComparison}
            className="p-4 bg-[#0D0A08]/85 backdrop-blur-md border border-[rgba(234,145,98,0.25)] hover:border-[#EA9162] hover:shadow-[0_0_20px_rgba(234,145,98,0.25)] rounded-2xl transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#EA9162] mb-1.5">
              <span>02. DUAL PERSPECTIVES</span>
              <Eye className="w-4 h-4 text-[#EA9162] group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-semibold text-[#FFFFFF] group-hover:text-[#EA9162] transition-colors">
              Side-by-Side Wavelength Comparison
            </h3>
            <p className="text-xs text-[#C7B8B0] mt-1 leading-relaxed">
              Slide between Hubble visible light and Webb infrared visions of identical cosmic targets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
