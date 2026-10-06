import React from 'react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-[#080706] border-t border-[rgba(234,145,98,0.20)] mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-heading font-bold text-[#FFFFFF]">
                COSMIC LENS
              </span>
              <span className="text-xs font-mono text-[#EA9162] px-2 py-0.5 bg-[#120D0A] rounded border border-[rgba(234,145,98,0.30)]">
                v1.0
              </span>
            </div>
            <p className="text-xs text-[#C7B8B0] max-w-sm leading-relaxed">
              Interactive space exploration platform illustrating how James Webb and Hubble observe identical astronomical objects across multi-wavelength electromagnetic spectra.
            </p>
            <div className="text-[11px] font-mono text-[#9F8D84]">
              Data sources: NASA, ESA, CSA, and STScI.
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold text-[#EA9162] uppercase tracking-wider block">
              OBSERVATORIES
            </span>
            <ul className="space-y-1.5 text-xs text-[#C7B8B0]">
              <li>
                <button
                  onClick={() => onNavigate('telescopes')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  James Webb Space Telescope (JWST)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('telescopes')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Hubble Space Telescope (HST)
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold text-[#EA9162] uppercase tracking-wider block">
              EXPLORATION
            </span>
            <ul className="space-y-1.5 text-xs text-[#C7B8B0]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Cinematic Landing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('telescopes')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Telescope Fleet & 3D Optics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Multi-Wavelength Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('compare')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Side-by-Side Comparison
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[rgba(234,145,98,0.15)] flex flex-col sm:flex-row items-center justify-between text-xs text-[#C7B8B0] font-mono gap-4">
          <div>
            © {new Date().getFullYear()} COSMIC LENS — Explore the Universe Through Different Cosmic Lenses.
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#9F8D84]">
            <span>Infrared · Visible · Ultraviolet</span>
            <span>·</span>
            <span>NASA Archive</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
