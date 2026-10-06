import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Upload,
  Layers,
  Sun,
  Lightbulb,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Galaxy } from './Galaxy.jsx';

// Configure Draco decoder to use local offline decoders in /draco/
try {
  useGLTF.setDecoderPath('/draco/');
  useGLTF.preload('/models/jwst.glb', '/draco/');
  useGLTF.preload('/models/hubble.glb', '/draco/');
} catch (e) {
  // Preload graceful catch
}

// In-Canvas telemetry loading badge
const ModelCanvasLoader = ({ telescopeName }) => (
  <Html center>
    <div className="flex flex-col items-center gap-2.5 p-4 bg-[#0D0A08]/92 border border-[rgba(234,145,98,0.30)] rounded-2xl backdrop-blur-md shadow-2xl text-center whitespace-nowrap">
      <div className="w-7 h-7 rounded-full border-2 border-[rgba(234,145,98,0.20)] border-t-[#EA9162] animate-spin" />
      <div className="space-y-0.5">
        <div className="text-xs font-mono text-[#EA9162] font-semibold tracking-wider uppercase">
          STREAMING 3D OBSERVATORY
        </div>
        <div className="text-[11px] font-mono text-[#9F8D84]">
          {telescopeName || 'Telescope'} · NASA Telemetry Model
        </div>
      </div>
    </div>
  </Html>
);

// Real NASA 3D Model with auto-scaling, centering and part highlighting
const RealGLTFModel = ({ url, telescopeId, selectedPartId, wireframe }) => {
  const { scene } = useGLTF(url, '/draco/');

  // Clone scene so multiple viewers or remounts don't mutate or detach the original
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map((m) => m.clone());
        } else {
          child.material = child.material.clone();
        }
      }
    });
    return clone;
  }, [scene]);

  // Compute normalized bounding scale and center offset
  const { scaleFactor, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    // Set ideal target dimension in viewport
    const targetDim = telescopeId === 'jwst' ? 3.4 : 3.2;
    const s = targetDim / maxDim;
    return {
      scaleFactor: s,
      centerOffset: new THREE.Vector3(-center.x * s, -center.y * s, -center.z * s)
    };
  }, [clonedScene, telescopeId]);

  // Apply materials, wireframe, and component highlights
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];

        // Determine if this mesh corresponds to selectedPartId
        let isPartMatch = false;
        if (selectedPartId) {
          const nodeName = (child.name || '').toLowerCase();
          const matNames = materials.map((m) => (m.name || '').toLowerCase()).join(' ');

          if (telescopeId === 'jwst') {
            if (selectedPartId === 'primary-mirror') {
              isPartMatch =
                matNames.includes('mirror') ||
                matNames.includes('gold') ||
                nodeName.includes('mirror') ||
                nodeName.includes('primary');
            } else if (selectedPartId === 'secondary-mirror') {
              isPartMatch =
                matNames.includes('topreflector') ||
                matNames.includes('bracket') ||
                nodeName.includes('secondary') ||
                nodeName.includes('reflector');
            } else if (selectedPartId === 'sunshield') {
              isPartMatch =
                matNames.includes('foil') ||
                matNames.includes('purpley') ||
                nodeName.includes('sunshield') ||
                nodeName.includes('layer');
            } else if (selectedPartId === 'isim') {
              isPartMatch =
                matNames.includes('instrument') ||
                matNames.includes('sc_rad') ||
                matNames.includes('greyfla') ||
                nodeName.includes('isim');
            } else if (selectedPartId === 'spacecraft-bus') {
              isPartMatch =
                matNames.includes('solar') ||
                matNames.includes('bottom-box') ||
                matNames.includes('sc_post') ||
                nodeName.includes('bus');
            }
          } else if (telescopeId === 'hubble') {
            if (selectedPartId === 'primary-mirror') {
              isPartMatch =
                nodeName.includes('mirror') ||
                nodeName.includes('primary') ||
                nodeName.includes('ao_light') ||
                nodeName.includes('alpha_tex') ||
                matNames.includes('ao_light');
            } else if (selectedPartId === 'aperture-door') {
              isPartMatch =
                nodeName.includes('door') ||
                nodeName.includes('adoor') ||
                nodeName.includes('sunshade') ||
                nodeName.includes('hinge') ||
                nodeName.includes('tex_01') ||
                nodeName.includes('ao_1') ||
                matNames.includes('tex_01') ||
                matNames.includes('ao_1');
            } else if (selectedPartId === 'solar-panels') {
              isPartMatch =
                nodeName.startsWith('sa') ||
                nodeName.includes('wing') ||
                nodeName.includes('solar') ||
                nodeName.includes('shiny_panel') ||
                nodeName.includes('tex_02') ||
                matNames.includes('shiny_panel') ||
                matNames.includes('tex_02');
            } else if (selectedPartId === 'equipment-bay') {
              isPartMatch =
                nodeName.includes('esm') ||
                nodeName.includes('acs') ||
                nodeName.includes('nicm') ||
                nodeName.includes('costar') ||
                nodeName.includes('hga') ||
                nodeName.includes('cryobox') ||
                nodeName.includes('fp_structure') ||
                nodeName.includes('foil') ||
                nodeName.includes('_root') ||
                nodeName.includes('tex_03') ||
                matNames.includes('foil') ||
                matNames.includes('tex_03') ||
                matNames.includes('nasa_logo');
            }
          }
        }

        materials.forEach((mat) => {
          mat.wireframe = wireframe;
          if (selectedPartId) {
            if (isPartMatch) {
              mat.emissive = new THREE.Color('#EA9162');
              mat.emissiveIntensity = 0.85;
              mat.transparent = false;
              mat.opacity = 1.0;
            } else {
              mat.emissiveIntensity = 0.0;
              mat.transparent = true;
              mat.opacity = 0.35;
            }
          } else {
            mat.emissiveIntensity = 0.0;
            mat.transparent = false;
            mat.opacity = 1.0;
          }
          mat.needsUpdate = true;
        });
      }
    });
  }, [clonedScene, telescopeId, selectedPartId, wireframe]);

  return (
    <group position={centerOffset} scale={scaleFactor}>
      <primitive object={clonedScene} />
    </group>
  );
};

// ==========================================
// 1. HIGH-PRECISION 3D MODEL: JAMES WEBB SPACE TELESCOPE (JWST)
// ==========================================
const JWSTModel = ({ selectedPartId, wireframe }) => {
  // Gold mirror material
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: '#F0BA42',
    metalness: 0.96,
    roughness: 0.12,
    wireframe
  });

  // Warm stellar highlight material when part is clicked
  const highlightMaterial = new THREE.MeshStandardMaterial({
    color: '#EA9162',
    emissive: '#783515',
    emissiveIntensity: 0.7,
    metalness: 0.85,
    roughness: 0.2,
    wireframe
  });

  // Sunshield space-facing side (silvery aluminum)
  const sunshieldTopMaterial = new THREE.MeshStandardMaterial({
    color: '#D8DEE4',
    metalness: 0.88,
    roughness: 0.25,
    wireframe,
    side: THREE.DoubleSide
  });

  // Sunshield sun-facing side (pinkish silicon-doped kapton)
  const sunshieldSunMaterial = new THREE.MeshStandardMaterial({
    color: '#D4927C',
    metalness: 0.85,
    roughness: 0.3,
    wireframe,
    side: THREE.DoubleSide
  });

  // Carbon composite truss & aft optics material
  const compositeMaterial = new THREE.MeshStandardMaterial({
    color: '#242120',
    metalness: 0.6,
    roughness: 0.45,
    wireframe
  });

  // Spacecraft bus & solar panels material
  const solarMaterial = new THREE.MeshStandardMaterial({
    color: '#B86D48',
    metalness: 0.8,
    roughness: 0.28,
    wireframe
  });

  const busMaterial = new THREE.MeshStandardMaterial({
    color: '#423B36',
    metalness: 0.7,
    roughness: 0.35,
    wireframe
  });

  // 18 Hexagonal primary mirror segments
  const hexRadius = 0.42;
  const hexPositions = [];
  // Inner ring: 6 hexagons
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    hexPositions.push([Math.cos(angle) * hexRadius * 1.732, Math.sin(angle) * hexRadius * 1.732, 0.4]);
  }
  // Outer ring: 12 hexagons
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const dist = (i % 2 === 0) ? hexRadius * 3.464 : hexRadius * 3;
    hexPositions.push([Math.cos(angle) * dist, Math.sin(angle) * dist, 0.38 - (dist * 0.03)]);
  }

  const isPrimarySelected = selectedPartId === 'primary-mirror';
  const isSecondarySelected = selectedPartId === 'secondary-mirror';
  const isSunshieldSelected = selectedPartId === 'sunshield';
  const isIsimSelected = selectedPartId === 'isim';
  const isBusSelected = selectedPartId === 'spacecraft-bus';

  return (
    <group position={[0, -0.2, 0]}>
      {/* 1. Primary Mirror 18 Hexagons */}
      <group>
        {hexPositions.map((pos, idx) => (
          <group key={idx} position={pos}>
            <mesh
              rotation={[0, 0, Math.PI / 6]}
              material={isPrimarySelected ? highlightMaterial : goldMaterial}
            >
              <cylinderGeometry args={[hexRadius * 0.98, hexRadius * 0.98, 0.05, 6]} />
            </mesh>
            {/* Hex mounting backing pad */}
            <mesh position={[0, 0, -0.04]} material={compositeMaterial}>
              <cylinderGeometry args={[hexRadius * 0.7, hexRadius * 0.7, 0.03, 6]} />
            </mesh>
          </group>
        ))}

        {/* Central Aft Optics Subsystem (AOS) Tower */}
        <mesh position={[0, 0, 0.55]} rotation={[Math.PI / 2, 0, 0]} material={compositeMaterial}>
          <cylinderGeometry args={[0.22, 0.28, 0.4, 6]} />
        </mesh>
      </group>

      {/* 2. Secondary Mirror & Tripod Mast */}
      <group>
        <mesh
          position={[0, 0, 2.3]}
          rotation={[Math.PI / 2, 0, 0]}
          material={isSecondarySelected ? highlightMaterial : goldMaterial}
        >
          <cylinderGeometry args={[0.32, 0.32, 0.08, 24]} />
        </mesh>
        {/* Secondary Mirror Bezel */}
        <mesh position={[0, 0, 2.25]} rotation={[Math.PI / 2, 0, 0]} material={compositeMaterial}>
          <cylinderGeometry args={[0.36, 0.36, 0.04, 24]} />
        </mesh>

        {/* 3 Carbon-fiber tripod struts */}
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => {
          const x = Math.cos(angle) * 1.45;
          const y = Math.sin(angle) * 1.45;
          return (
            <line key={idx}>
              <bufferGeometry
                attach="geometry"
                onUpdate={(self) => {
                  const points = [
                    new THREE.Vector3(x, y, 0.4),
                    new THREE.Vector3(0, 0, 2.3)
                  ];
                  self.setFromPoints(points);
                }}
              />
              <lineBasicMaterial
                attach="material"
                color={isSecondarySelected ? '#EA9162' : '#F2B08E'}
                linewidth={3}
              />
            </line>
          );
        })}
      </group>

      {/* 3. 5-Layer Kite Sunshield with Realistic Geometry */}
      <group position={[0, -0.6, -0.2]} rotation={[Math.PI / 8, 0, 0]}>
        {[0, 0.08, 0.16, 0.24, 0.32].map((zOffset, idx) => (
          <group key={idx} position={[0, 0, -zOffset]}>
            <mesh material={isSunshieldSelected ? highlightMaterial : (idx >= 3 ? sunshieldSunMaterial : sunshieldTopMaterial)}>
              <bufferGeometry
                attach="geometry"
                onUpdate={(self) => {
                  // Tennis-court kite shaped profile
                  const vertices = new Float32Array([
                    0, 2.8, 0,
                    2.4, 0, 0,
                    0, -2.8, 0,
                    0, 2.8, 0,
                    0, -2.8, 0,
                    -2.4, 0, 0
                  ]);
                  self.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                  self.computeVertexNormals();
                }}
              />
            </mesh>
          </group>
        ))}

        {/* Sunshield Side Spreader Booms & Spacers */}
        <mesh position={[2.4, 0, -0.16]} material={compositeMaterial}>
          <boxGeometry args={[0.08, 0.8, 0.36]} />
        </mesh>
        <mesh position={[-2.4, 0, -0.16]} material={compositeMaterial}>
          <boxGeometry args={[0.08, 0.8, 0.36]} />
        </mesh>
      </group>

      {/* 4. ISIM Module (Integrated Science Instrument Module) */}
      <mesh
        position={[0, 0, -0.1]}
        material={isIsimSelected ? highlightMaterial : compositeMaterial}
      >
        <boxGeometry args={[1.7, 1.5, 0.55]} />
      </mesh>
      {/* ISIM Heat Radiator Panels */}
      <mesh position={[0, 0.9, -0.1]} material={sunshieldTopMaterial}>
        <boxGeometry args={[1.5, 0.25, 0.05]} />
      </mesh>

      {/* 5. Spacecraft Bus & Solar Panel */}
      <group position={[0, -1.2, -0.6]}>
        <mesh material={isBusSelected ? highlightMaterial : busMaterial}>
          <boxGeometry args={[1.3, 0.85, 0.65]} />
        </mesh>

        {/* Deployable Solar Array Wing (Angled sunward) */}
        <mesh
          position={[0, -0.7, 0]}
          rotation={[Math.PI / 4, 0, 0]}
          material={isBusSelected ? highlightMaterial : solarMaterial}
        >
          <boxGeometry args={[2.5, 0.65, 0.05]} />
        </mesh>

        {/* High-Gain Antenna Dish */}
        <mesh position={[0.7, -0.2, -0.4]} rotation={[0.4, 0.8, 0]} material={sunshieldTopMaterial}>
          <cylinderGeometry args={[0.3, 0.1, 0.12, 16]} />
        </mesh>
      </group>
    </group>
  );
};

// ==========================================
// 2. HIGH-PRECISION 3D MODEL: HUBBLE SPACE TELESCOPE (HST)
// ==========================================
const HubbleModel = ({ selectedPartId, wireframe }) => {
  // Silver aluminized Teflon MLI insulation material
  const silverMaterial = new THREE.MeshStandardMaterial({
    color: '#D8DEE4',
    metalness: 0.92,
    roughness: 0.2,
    wireframe
  });

  // Dark interior knife-edge optical baffle
  const interiorBaffleMaterial = new THREE.MeshStandardMaterial({
    color: '#1C1917',
    metalness: 0.2,
    roughness: 0.85,
    wireframe
  });

  // Warm stellar highlight material
  const highlightMaterial = new THREE.MeshStandardMaterial({
    color: '#EA9162',
    emissive: '#783515',
    emissiveIntensity: 0.7,
    metalness: 0.85,
    roughness: 0.2,
    wireframe
  });

  // Rigid Gallium-Arsenide Solar Panels
  const solarPanelMaterial = new THREE.MeshStandardMaterial({
    color: '#2A221C',
    metalness: 0.75,
    roughness: 0.35,
    wireframe
  });

  const solarBorderMaterial = new THREE.MeshStandardMaterial({
    color: '#EA9162',
    metalness: 0.8,
    roughness: 0.3,
    wireframe
  });

  // Gold astronaut handrails & hardware
  const handrailMaterial = new THREE.MeshStandardMaterial({
    color: '#E5A93C',
    metalness: 0.9,
    roughness: 0.2,
    wireframe
  });

  const isPrimarySelected = selectedPartId === 'primary-mirror';
  const isApertureSelected = selectedPartId === 'aperture-door';
  const isSolarSelected = selectedPartId === 'solar-panels';
  const isEquipmentSelected = selectedPartId === 'equipment-bay';

  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      {/* 1. Forward Light Shield Cylinder */}
      <mesh
        position={[0, 1.4, 0]}
        material={isApertureSelected ? highlightMaterial : silverMaterial}
      >
        <cylinderGeometry args={[0.92, 0.92, 1.6, 32, 1, true]} />
      </mesh>
      {/* Inner dark baffle lining */}
      <mesh position={[0, 1.4, 0]} material={interiorBaffleMaterial}>
        <cylinderGeometry args={[0.9, 0.9, 1.58, 32, 1, true]} />
      </mesh>

      {/* 2. Aperture Door (Hinged Open at 45°) */}
      <mesh
        position={[0, 2.25, -0.42]}
        rotation={[Math.PI / 4, 0, 0]}
        material={isApertureSelected ? highlightMaterial : silverMaterial}
      >
        <cylinderGeometry args={[0.92, 0.92, 0.06, 32]} />
      </mesh>

      {/* 3. Central Section & Primary Mirror (2.4m) */}
      <mesh
        position={[0, 0, 0]}
        material={isPrimarySelected ? highlightMaterial : silverMaterial}
      >
        <cylinderGeometry args={[0.96, 0.96, 1.4, 32]} />
      </mesh>
      {/* Inside Concave Primary Mirror Disk */}
      <mesh position={[0, 0.4, 0]} material={isPrimarySelected ? highlightMaterial : silverMaterial}>
        <cylinderGeometry args={[0.88, 0.88, 0.08, 32]} />
      </mesh>

      {/* 4. Equipment Bay (Aft Shroud) */}
      <mesh
        position={[0, -1.25, 0]}
        material={isEquipmentSelected ? highlightMaterial : silverMaterial}
      >
        <cylinderGeometry args={[1.22, 1.22, 1.25, 32]} />
      </mesh>
      {/* Aft berthing ring */}
      <mesh position={[0, -1.9, 0]} material={silverMaterial}>
        <torusGeometry args={[0.7, 0.06, 16, 32]} />
      </mesh>

      {/* 5. Dual Solar Array Wings on Steerable Booms */}
      <group>
        {/* Left Solar Wing */}
        <group position={[2.5, 0, 0]}>
          <mesh
            rotation={[0, 0, Math.PI / 2]}
            material={isSolarSelected ? highlightMaterial : solarPanelMaterial}
          >
            <boxGeometry args={[0.04, 2.4, 0.85]} />
          </mesh>
          <mesh
            rotation={[0, 0, Math.PI / 2]}
            material={isSolarSelected ? highlightMaterial : solarBorderMaterial}
          >
            <boxGeometry args={[0.05, 2.45, 0.04]} />
          </mesh>
        </group>

        {/* Right Solar Wing */}
        <group position={[-2.5, 0, 0]}>
          <mesh
            rotation={[0, 0, Math.PI / 2]}
            material={isSolarSelected ? highlightMaterial : solarPanelMaterial}
          >
            <boxGeometry args={[0.04, 2.4, 0.85]} />
          </mesh>
          <mesh
            rotation={[0, 0, Math.PI / 2]}
            material={isSolarSelected ? highlightMaterial : solarBorderMaterial}
          >
            <boxGeometry args={[0.05, 2.45, 0.04]} />
          </mesh>
        </group>

        {/* Central Solar Array Strut Boom */}
        <line>
          <bufferGeometry
            attach="geometry"
            onUpdate={(self) => {
              self.setFromPoints([
                new THREE.Vector3(-2.5, 0, 0),
                new THREE.Vector3(2.5, 0, 0)
              ]);
            }}
          />
          <lineBasicMaterial
            attach="material"
            color={isSolarSelected ? '#EA9162' : '#F2B08E'}
            linewidth={3}
          />
        </line>
      </group>

      {/* 6. High-Gain Antennas (HGA) */}
      <group position={[0, -0.6, 1.4]} rotation={[0.4, 0, 0]}>
        <mesh material={silverMaterial}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
        </mesh>
        <mesh position={[0, 0.35, 0]} material={handrailMaterial}>
          <sphereGeometry args={[0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      </group>
      <group position={[0, -0.6, -1.4]} rotation={[-0.4, 0, 0]}>
        <mesh material={silverMaterial}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
        </mesh>
        <mesh position={[0, 0.35, 0]} material={handrailMaterial}>
          <sphereGeometry args={[0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      </group>
    </group>
  );
};

// ==========================================
// 3. MAIN INTERACTIVE 3D VIEWER CONTAINER
// ==========================================
export const Telescope3DViewer = ({
  telescopeId,
  telescopeName,
  modelUrl,
  parts = [],
  selectedPartId,
  onSelectPart
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [lightingMode, setLightingMode] = useState('studio');
  const [modelSource, setModelSource] = useState('realistic'); // 'realistic' (NASA GLTF) | 'schematic' (CAD Mesh)
  const [customModelBlobUrl, setCustomModelBlobUrl] = useState(null);
  const [customModelName, setCustomModelName] = useState(null);
  const [modelLoadError, setModelLoadError] = useState(false);
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const fileInputRef = useRef(null);

  const defaultModelUrl = telescopeId === 'jwst' ? '/models/jwst.glb' : '/models/hubble.glb';
  const effectiveModelUrl = customModelBlobUrl || modelUrl || defaultModelUrl;

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomModelBlobUrl(url);
      setCustomModelName(file.name);
      setModelSource('realistic');
      setModelLoadError(false);
    }
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const selectedPart = parts.find((p) => p.id === selectedPartId);
  const wireframe = lightingMode === 'wireframe';

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[#080706] border border-[rgba(234,145,98,0.25)] rounded-2xl flex flex-col shadow-[0_4px_30px_rgba(8,7,6,0.9)] ${
        isFullscreen ? 'h-screen rounded-none' : 'h-[520px]'
      }`}
    >
      {/* Top Telemetry & Control Bar in Warm Stellar Space Theme */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0D0A08]/90 border-b border-[rgba(234,145,98,0.20)] backdrop-blur-md z-20 relative">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold text-[#EA9162] tracking-wider uppercase">
            3D SPATIAL TELEMETRY
          </span>
          <span className="text-xs text-[#9F8D84]">·</span>
          <span className="text-xs text-[#F5EDE8] font-medium">{telescopeName}</span>
          {customModelName && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#F2B08E] bg-[#18100C] px-2 py-0.5 rounded border border-[rgba(234,145,98,0.30)]">
              <CheckCircle2 className="w-3 h-3 text-[#EA9162]" /> Custom: {customModelName}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Model Source Toggle: NASA Realistic vs CAD Schematic */}
          <div className="flex items-center bg-[#120D0A] border border-[rgba(234,145,98,0.25)] rounded-lg p-0.5 mr-1">
            <button
              onClick={() => setModelSource('realistic')}
              title="NASA Realistic 3D Model"
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                modelSource === 'realistic'
                  ? 'bg-[#18100C] text-[#EA9162] font-semibold border border-[rgba(234,145,98,0.35)] shadow-[0_0_8px_rgba(234,145,98,0.2)]'
                  : 'text-[#C7B8B0] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#EA9162]" />
              <span className="hidden sm:inline">NASA 3D</span>
            </button>
            <button
              onClick={() => setModelSource('schematic')}
              title="CAD Schematic Geometry"
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                modelSource === 'schematic'
                  ? 'bg-[#18100C] text-[#EA9162] font-semibold border border-[rgba(234,145,98,0.35)] shadow-[0_0_8px_rgba(234,145,98,0.2)]'
                  : 'text-[#C7B8B0] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#EA9162]" />
              <span className="hidden sm:inline">Schematic</span>
            </button>
          </div>

          <div className="flex items-center bg-[#120D0A] border border-[rgba(234,145,98,0.25)] rounded-lg p-0.5 mr-1">
            <button
              onClick={() => setLightingMode('studio')}
              title="Studio Warm Starlight"
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                lightingMode === 'studio'
                  ? 'bg-[#18100C] text-[#EA9162] font-semibold'
                  : 'text-[#C7B8B0] hover:text-white'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('sunlit')}
              title="Direct Solar Illumination"
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                lightingMode === 'sunlit'
                  ? 'bg-[#18100C] text-[#EA9162] font-semibold'
                  : 'text-[#C7B8B0] hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('wireframe')}
              title="Technical CAD Wireframe"
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                lightingMode === 'wireframe'
                  ? 'bg-[#18100C] text-[#EA9162] font-semibold'
                  : 'text-[#C7B8B0] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
            className="p-1.5 text-[#C7B8B0] hover:text-[#EA9162] hover:bg-[#120D0A] rounded border border-transparent hover:border-[rgba(234,145,98,0.25)] transition-colors cursor-pointer"
          >
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset Camera"
            className="p-1.5 text-[#C7B8B0] hover:text-[#EA9162] hover:bg-[#120D0A] rounded border border-transparent hover:border-[rgba(234,145,98,0.25)] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".glb,.gltf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import Your Own 3D Model (.glb / .gltf)"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#F5EDE8] bg-[#120D0A] hover:bg-[#18100C] border border-[rgba(234,145,98,0.30)] hover:border-[#EA9162] rounded-lg transition-colors cursor-pointer shadow-[0_0_10px_rgba(234,145,98,0.1)]"
          >
            <Upload className="w-3.5 h-3.5 text-[#EA9162]" />
            <span className="hidden sm:inline">Import Model</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 text-[#C7B8B0] hover:text-[#EA9162] hover:bg-[#120D0A] rounded border border-transparent hover:border-[rgba(234,145,98,0.25)] transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Stage with Visual Layering:
          Layer 0: Galaxy Animated Background
          Layer 10: Transparent 3D Canvas
          Layer 20: 3D Controls and Parts Mode UI
      */}
      <div className="relative flex-1 w-full h-full bg-[#080706] overflow-hidden">
        {/* Layer 0: Animated Galaxy Background Layer */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
          <div style={{ width: '1080px', height: '1080px', position: 'relative' }}>
            <Galaxy 
              starSpeed={0.5} 
              density={1.8} 
              hueShift={140} 
              speed={1} 
              glowIntensity={0.3} 
              saturation={0} 
              mouseRepulsion 
              repulsionStrength={2} 
              twinkleIntensity={0.6} 
              rotationSpeed={0.1} 
              transparent 
            /> 
          </div>
        </div>

        {/* Layer 10: Transparent 3D Canvas Layer */}
        <Canvas
          camera={{ position: [0, 1.2, 4.5], fov: 45 }}
          className="relative z-10 w-full h-full bg-transparent"
          gl={{ antialias: true, alpha: true }}
        >
          {lightingMode === 'sunlit' ? (
            <>
              <ambientLight intensity={0.65} color="#F5EDE8" />
              <directionalLight position={[10, 12, 8]} intensity={3.2} color="#FFFFFF" />
              <directionalLight position={[-8, -6, -6]} intensity={0.9} color="#FFD2BE" />
            </>
          ) : (
            <>
              <ambientLight intensity={0.95} color="#FFF8F4" />
              <directionalLight position={[6, 8, 8]} intensity={2.5} color="#FFFFFF" />
              <directionalLight position={[-8, 6, -6]} intensity={1.6} color="#EA9162" />
              <directionalLight position={[0, -6, 6]} intensity={1.0} color="#F2B08E" />
              <pointLight position={[0, 0, 7]} intensity={0.8} color="#FFFFFF" />
            </>
          )}

          <OrbitControls
            ref={controlsRef}
            autoRotate={autoRotate}
            autoRotateSpeed={0.9}
            enableDamping
            dampingFactor={0.08}
            minDistance={1.2}
            maxDistance={15}
          />

          <Center>
            <Suspense fallback={<ModelCanvasLoader telescopeName={telescopeName} />}>
              {modelSource === 'realistic' && !modelLoadError ? (
                <RealGLTFModel
                  url={effectiveModelUrl}
                  telescopeId={telescopeId}
                  selectedPartId={selectedPartId}
                  wireframe={wireframe}
                />
              ) : telescopeId === 'jwst' ? (
                <JWSTModel
                  selectedPartId={selectedPartId}
                  wireframe={wireframe}
                />
              ) : (
                <HubbleModel
                  selectedPartId={selectedPartId}
                  wireframe={wireframe}
                />
              )}
            </Suspense>
          </Center>
        </Canvas>

        {/* Layer 20: Parts Mode Ribbon */}
        {parts.length > 0 && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 overflow-x-auto pb-1 z-20 pointer-events-auto">
            <span className="text-[11px] font-mono text-[#C7B8B0] bg-[#080706]/92 px-2.5 py-1.5 rounded-lg border border-[rgba(234,145,98,0.20)] whitespace-nowrap">
              PARTS MODE:
            </span>
            <button
              onClick={() => onSelectPart(null)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all whitespace-nowrap border cursor-pointer ${
                selectedPartId === null
                  ? 'bg-[#EA9162] text-[#080706] font-semibold border-[#EA9162] shadow-[0_0_12px_rgba(234,145,98,0.35)]'
                  : 'bg-[#0D0A08]/92 text-[#C7B8B0] hover:text-white border-[rgba(234,145,98,0.20)] hover:border-[rgba(234,145,98,0.40)]'
              }`}
            >
              All Components
            </button>
            {parts.map((part) => (
              <button
                key={part.id}
                onClick={() => onSelectPart(part.id === selectedPartId ? null : part.id)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all whitespace-nowrap border cursor-pointer ${
                  selectedPartId === part.id
                    ? 'bg-[#EA9162] text-[#080706] font-semibold border-[#EA9162] shadow-[0_0_12px_rgba(234,145,98,0.40)]'
                    : 'bg-[#0D0A08]/92 text-[#C7B8B0] hover:text-white border-[rgba(234,145,98,0.20)] hover:border-[rgba(234,145,98,0.40)]'
                }`}
              >
                {part.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Component Information Drawer in Warm Space Theme */}
      {selectedPart && (
        <div className="p-4 bg-[#0D0A08] border-t border-[rgba(234,145,98,0.25)] animate-fadeIn relative z-20">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-[#EA9162] uppercase tracking-wider font-semibold">
                  COMPONENT SPECIFICATION
                </span>
                <span className="text-xs text-[#9F8D84]">·</span>
                <h4 className="text-sm font-semibold text-[#FFFFFF]">{selectedPart.name}</h4>
              </div>
              <p className="text-xs text-[#C7B8B0] leading-relaxed max-w-3xl">
                {selectedPart.description}
              </p>
            </div>
            <button
              onClick={() => onSelectPart(null)}
              className="text-xs text-[#C7B8B0] hover:text-[#EA9162] ml-4 font-mono whitespace-nowrap cursor-pointer"
            >
              [Close]
            </button>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[rgba(234,145,98,0.15)] flex flex-wrap items-center gap-x-6 gap-y-1 text-xs font-mono">
            <span className="text-[#F2B08E]">
              <span className="text-[#9F8D84]">SPECS: </span>
              {selectedPart.technicalSpecs}
            </span>
            {selectedPart.materials && (
              <span className="text-[#F2B08E]">
                <span className="text-[#9F8D84]">MATERIAL: </span>
                {selectedPart.materials}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Telescope3DViewer;
