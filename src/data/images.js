/**
 * Static Astronomical Images Catalog — Single Source of Truth
 * Exactly 6 astronomical images organized into 3 objects:
 * 1. Canes Venatici (Hubble & James Webb)
 * 2. Monoceros (Hubble & James Webb)
 * 3. Unicorn (Hubble & James Webb)
 * 
 * Used identically across Gallery and Compare.
 */

export const telescopeImages = [
  {
    id: "canes-venatici",
    objectName: "Canes Venatici",
    name: "Canes Venatici",
    title: "Canes Venatici",
    category: "Spiral Galaxy",
    typeDisplay: "Spiral Galaxy",
    constellation: "Canes Venatici",
    distance: "27 million light-years",
    description: "The magnificent spiral galaxy in Canes Venatici observed across complementary electromagnetic spectra by Hubble and James Webb.",
    hubble: "/images/hubble-canes-venatici.jpeg",
    jamesWebb: "/images/james-webb-canes-venatici.jpeg",
    hubbleTitle: "Canes Venatici — Hubble Space Telescope",
    jamesWebbTitle: "Canes Venatici — James Webb Space Telescope",
    hubbleDescription: "Hubble Space Telescope optical observation highlighting graceful spiral arms, young blue star clusters, and dark dust filaments.",
    jamesWebbDescription: "James Webb Space Telescope mid-infrared observation tracing the intricate skeletal network of glowing interstellar dust.",
    hubbleWavelength: "Visible Light (Optical)",
    jamesWebbWavelength: "Mid-Infrared (MIRI)",
    observations: [
      {
        telescopeId: "hubble",
        telescopeName: "Hubble Space Telescope",
        wavelength: "Visible Light",
        spectralRange: "0.4 – 0.7 μm (ACS / WFC3)",
        image: "/images/hubble-canes-venatici.jpeg",
        description: "Optical view capturing hot young stars, clusters, and silhouette dust lanes."
      },
      {
        telescopeId: "jwst",
        telescopeName: "James Webb Space Telescope",
        wavelength: "Mid-Infrared",
        spectralRange: "7.7 – 21 μm (MIRI)",
        image: "/images/james-webb-canes-venatici.jpeg",
        description: "Mid-infrared revelation cutting through dust to highlight glowing warm organic molecules and protostellar cores."
      }
    ]
  },
  {
    id: "monoceros",
    objectName: "Monoceros",
    name: "Monoceros",
    title: "Monoceros",
    category: "Variable Star & Outflow",
    typeDisplay: "Stellar Outflow & Nebula",
    constellation: "Monoceros",
    distance: "20,000 light-years",
    description: "Cosmic structures in the Monoceros constellation, contrasting Hubble's optical light echo with Webb's infrared starbirth view.",
    hubble: "/images/monoceros-hubble.jpeg",
    jamesWebb: "/images/monoceros-james.jpeg",
    hubbleTitle: "Monoceros — Hubble Space Telescope",
    jamesWebbTitle: "Monoceros — James Webb Space Telescope",
    hubbleDescription: "Hubble Space Telescope optical portrait of the expanding spherical light echo illuminating dusty shells around V838 Monocerotis.",
    jamesWebbDescription: "James Webb Space Telescope infrared observation penetrating deep nebular clouds to resolve energetic protostellar jets.",
    hubbleWavelength: "Visible Light",
    jamesWebbWavelength: "Near-Infrared",
    observations: [
      {
        telescopeId: "hubble",
        telescopeName: "Hubble Space Telescope",
        wavelength: "Visible Light",
        spectralRange: "0.4 – 0.8 μm (ACS)",
        image: "/images/monoceros-hubble.jpeg",
        description: "Stunning light echo propagating across concentric rings of interstellar dust."
      },
      {
        telescopeId: "jwst",
        telescopeName: "James Webb Space Telescope",
        wavelength: "Near-Infrared",
        spectralRange: "1.5 – 4.7 μm (NIRCam)",
        image: "/images/monoceros-james.jpeg",
        description: "Piercing infrared imaging showcasing energetic bipolar outflows and supersonic bow shocks."
      }
    ]
  },
  {
    id: "unicorn",
    objectName: "Unicorn",
    name: "Unicorn",
    title: "Unicorn",
    category: "Deep Stellar Field",
    typeDisplay: "Starfield & Molecular Cloud",
    constellation: "Unicorn (Monoceros)",
    distance: "Deep Milky Way Field",
    description: "Deep astronomical realm in the Unicorn constellation, demonstrating how optical and infrared instruments perceive dense cosmic fields.",
    hubble: "/images/hubble-unicorn.jpeg",
    jamesWebb: "/images/james-webb-unicorn.jpeg",
    hubbleTitle: "Unicorn — Hubble Space Telescope",
    jamesWebbTitle: "Unicorn — James Webb Space Telescope",
    hubbleDescription: "Hubble optical deep survey resolving hundreds of thousands of individual stars contrasted against cold obscuring dust lanes.",
    jamesWebbDescription: "James Webb Space Telescope infrared revelation piercing through opaque gas clouds to expose hidden stars and glowing dust bubbles.",
    hubbleWavelength: "Visible Light",
    jamesWebbWavelength: "Infrared",
    observations: [
      {
        telescopeId: "hubble",
        telescopeName: "Hubble Space Telescope",
        wavelength: "Visible Light",
        spectralRange: "0.3 – 0.8 μm (WFC3)",
        image: "/images/hubble-unicorn.jpeg",
        description: "Dense starfield populated with optical stellar points and cold dark dust silhouettes."
      },
      {
        telescopeId: "jwst",
        telescopeName: "James Webb Space Telescope",
        wavelength: "Infrared",
        spectralRange: "0.6 – 5.0 μm (NIRCam)",
        image: "/images/james-webb-unicorn.jpeg",
        description: "Infrared penetrating view revealing embedded protostars and glowing dust ring structures."
      }
    ]
  }
];

// Flat list of the exactly 6 telescope images (2 per object) for individual card viewing
export const galleryItems = [
  {
    id: "canes-venatici-hubble",
    objectId: "canes-venatici",
    objectName: "Canes Venatici",
    telescope: "Hubble Space Telescope",
    telescopeId: "hubble",
    telescopeName: "Hubble Space Telescope",
    shortName: "Hubble",
    title: "Canes Venatici",
    subtitle: "Hubble Space Telescope",
    wavelength: "Visible Light",
    wavelengthDetail: "Optical (0.4 – 0.7 μm)",
    image: "/images/hubble-canes-venatici.jpeg",
    description: "Hubble Space Telescope optical observation highlighting graceful spiral arms, young blue star clusters, and dark dust filaments.",
    instrument: "ACS / WFC3",
    distance: "27 million light-years"
  },
  {
    id: "canes-venatici-jwst",
    objectId: "canes-venatici",
    objectName: "Canes Venatici",
    telescope: "James Webb Space Telescope",
    telescopeId: "jwst",
    telescopeName: "James Webb Space Telescope",
    shortName: "James Webb",
    title: "Canes Venatici",
    subtitle: "James Webb Space Telescope",
    wavelength: "Mid-Infrared",
    wavelengthDetail: "Mid-Infrared (7.7 – 21 μm)",
    image: "/images/james-webb-canes-venatici.jpeg",
    description: "James Webb Space Telescope mid-infrared observation tracing the intricate skeletal network of glowing interstellar dust.",
    instrument: "MIRI",
    distance: "27 million light-years"
  },
  {
    id: "monoceros-hubble",
    objectId: "monoceros",
    objectName: "Monoceros",
    telescope: "Hubble Space Telescope",
    telescopeId: "hubble",
    telescopeName: "Hubble Space Telescope",
    shortName: "Hubble",
    title: "Monoceros",
    subtitle: "Hubble Space Telescope",
    wavelength: "Visible Light",
    wavelengthDetail: "Optical (0.4 – 0.8 μm)",
    image: "/images/monoceros-hubble.jpeg",
    description: "Hubble Space Telescope optical portrait of the expanding spherical light echo illuminating dusty shells around V838 Monocerotis.",
    instrument: "ACS",
    distance: "20,000 light-years"
  },
  {
    id: "monoceros-jwst",
    objectId: "monoceros",
    objectName: "Monoceros",
    telescope: "James Webb Space Telescope",
    telescopeId: "jwst",
    telescopeName: "James Webb Space Telescope",
    shortName: "James Webb",
    title: "Monoceros",
    subtitle: "James Webb Space Telescope",
    wavelength: "Near-Infrared",
    wavelengthDetail: "Near-Infrared (1.5 – 4.7 μm)",
    image: "/images/monoceros-james.jpeg",
    description: "James Webb Space Telescope infrared observation penetrating deep nebular clouds to resolve energetic protostellar jets.",
    instrument: "NIRCam",
    distance: "20,000 light-years"
  },
  {
    id: "unicorn-hubble",
    objectId: "unicorn",
    objectName: "Unicorn",
    telescope: "Hubble Space Telescope",
    telescopeId: "hubble",
    telescopeName: "Hubble Space Telescope",
    shortName: "Hubble",
    title: "Unicorn",
    subtitle: "Hubble Space Telescope",
    wavelength: "Visible Light",
    wavelengthDetail: "Optical (0.3 – 0.8 μm)",
    image: "/images/hubble-unicorn.jpeg",
    description: "Hubble optical deep survey resolving hundreds of thousands of individual stars contrasted against cold obscuring dust lanes.",
    instrument: "WFC3",
    distance: "Deep Galactic Field"
  },
  {
    id: "unicorn-jwst",
    objectId: "unicorn",
    objectName: "Unicorn",
    telescope: "James Webb Space Telescope",
    telescopeId: "jwst",
    telescopeName: "James Webb Space Telescope",
    shortName: "James Webb",
    title: "Unicorn",
    subtitle: "James Webb Space Telescope",
    wavelength: "Infrared",
    wavelengthDetail: "Infrared (0.6 – 5.0 μm)",
    image: "/images/james-webb-unicorn.jpeg",
    description: "James Webb Space Telescope infrared revelation piercing through opaque gas clouds to expose hidden stars and glowing dust bubbles.",
    instrument: "NIRCam",
    distance: "Deep Galactic Field"
  }
];

export const GALLERY_IMAGES = galleryItems;
export const galleryImages = galleryItems;
export const images = telescopeImages;
export default telescopeImages;
