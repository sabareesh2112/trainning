const { spawn } = require('child_process');
const fs = require('fs');

const width = 1280;
const height = 720;
const fps = 30;
const durationSec = 8;
const totalFrames = fps * durationSec;

if (!fs.existsSync('public/videos')) {
  fs.mkdirSync('public/videos', { recursive: true });
}

const ffmpeg = spawn('ffmpeg', [
  '-y',
  '-f', 'rawvideo',
  '-pix_fmt', 'rgb24',
  '-s', `${width}x${height}`,
  '-r', `${fps}`,
  '-i', '-',
  '-c:v', 'libx264',
  '-pix_fmt', 'yuv420p',
  '-preset', 'veryfast',
  '-crf', '18',
  '-movflags', '+faststart',
  'public/videos/space-background.mp4'
]);

ffmpeg.stderr.on('data', () => {});
ffmpeg.on('close', (code) => {
  console.log('FFmpeg finished with code:', code);
  if (fs.existsSync('public/videos/space-background.mp4')) {
    const stat = fs.statSync('public/videos/space-background.mp4');
    console.log('Generated video size:', (stat.size / 1024 / 1024).toFixed(2), 'MB');
  }
});

// Fixed star field
const numStars = 600;
const stars = [];
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() < 0.85 ? 1 : (Math.random() < 0.95 ? 2 : 3),
    brightness: 0.35 + Math.random() * 0.65,
    twinkleFreq: 1 + Math.random() * 4,
    color: Math.random() < 0.6 ? [234, 145, 98] : (Math.random() < 0.8 ? [255, 230, 200] : [242, 176, 142])
  });
}

const frameBuffer = Buffer.alloc(width * height * 3);

// Center of black hole (placed dynamically like the user's video, tilted accretion disk)
const bhX = width * 0.70;
const bhY = height * 0.50;
const eventHorizonR = 115;
const photonRingR = 142;
const diskInnerR = 155;
const diskOuterR = 510;

async function generate() {
  for (let f = 0; f < totalFrames; f++) {
    const t = f / totalFrames; // 0 to 1 loop
    const angleOffset = t * Math.PI * 2;

    // Clear frame
    frameBuffer.fill(4); // subtle near-black

    // Draw background stars
    for (let s = 0; s < numStars; s++) {
      const star = stars[s];
      const twinkle = 0.6 + 0.4 * Math.sin(t * Math.PI * 2 * star.twinkleFreq + s);
      const b = star.brightness * twinkle;
      const px = Math.floor(star.x);
      const py = Math.floor(star.y);
      if (px >= 0 && px < width && py >= 0 && py < height) {
        const idx = (py * width + px) * 3;
        frameBuffer[idx] = Math.min(255, frameBuffer[idx] + star.color[0] * b * 0.7);
        frameBuffer[idx + 1] = Math.min(255, frameBuffer[idx + 1] + star.color[1] * b * 0.7);
        frameBuffer[idx + 2] = Math.min(255, frameBuffer[idx + 2] + star.color[2] * b * 0.7);
      }
    }

    // Draw black hole and accretion disk
    for (let y = 0; y < height; y++) {
      const dy = y - bhY;
      const dyScaled = dy / 0.42; // compressed vertically to form perspective disk plane
      for (let x = 0; x < width; x++) {
        const dx = x - bhX;
        const distDisk = Math.sqrt(dx * dx + dyScaled * dyScaled);
        const distBH = Math.sqrt(dx * dx + dy * dy);

        const pIdx = (y * width + x) * 3;

        // Event Horizon: black hole shadow
        if (distBH < eventHorizonR) {
          frameBuffer[pIdx] = 2;
          frameBuffer[pIdx + 1] = 1;
          frameBuffer[pIdx + 2] = 1;
          continue;
        }

        // Photon Ring (thin brilliant Einstein ring around shadow)
        if (distBH >= eventHorizonR && distBH < photonRingR) {
          const ringFactor = 1 - Math.abs(distBH - (eventHorizonR + 8)) / 20;
          if (ringFactor > 0) {
            const bright = Math.pow(ringFactor, 2) * 2.3;
            frameBuffer[pIdx] = Math.min(255, frameBuffer[pIdx] + 255 * bright);
            frameBuffer[pIdx + 1] = Math.min(255, frameBuffer[pIdx + 1] + 215 * bright);
            frameBuffer[pIdx + 2] = Math.min(255, frameBuffer[pIdx + 2] + 165 * bright);
          }
        }

        // Accretion disk
        if (distDisk >= diskInnerR && distDisk <= diskOuterR) {
          const rNorm = (distDisk - diskInnerR) / (diskOuterR - diskInnerR); // 0 at inner, 1 at outer
          const diskAngle = Math.atan2(dyScaled, dx) + angleOffset * 2.5;

          // Swirling plasma streaks
          const spiral1 = Math.sin(diskAngle * 6 + distDisk * 0.05);
          const spiral2 = Math.cos(diskAngle * 14 - distDisk * 0.08);
          const texture = 0.5 + 0.3 * spiral1 + 0.2 * spiral2;

          // Radial falloff: brightest near inner edge (ISCO), fading smoothly outward
          const radialIntensity = Math.pow(1 - rNorm, 1.8) * Math.sin(rNorm * Math.PI);
          
          // Doppler beaming asymmetry (approaching side on left is brighter)
          const doppler = 1.0 - 0.45 * Math.cos(Math.atan2(dyScaled, dx));

          // Behind black hole shadow mask
          const isBehindBH = (dy < 0) && (distBH < eventHorizonR * 1.05);
          if (isBehindBH) continue;

          const intensity = radialIntensity * texture * doppler * 3.0;

          if (intensity > 0.01) {
            // Warm amber / gold color gradient (#FFF0D0 -> #EA9162 -> #7A3015)
            const r = Math.min(255, intensity * 255);
            const g = Math.min(255, intensity * (165 + (1 - rNorm) * 55));
            const b = Math.min(255, intensity * (75 + (1 - rNorm) * 90));

            frameBuffer[pIdx] = Math.min(255, frameBuffer[pIdx] + r);
            frameBuffer[pIdx + 1] = Math.min(255, frameBuffer[pIdx + 1] + g);
            frameBuffer[pIdx + 2] = Math.min(255, frameBuffer[pIdx + 2] + b);
          }
        }

        // Gravitational lensing upper arc (warped image of the back of the disk)
        const lensDist = Math.abs(distBH - (eventHorizonR + 25));
        if (lensDist < 45 && dy < 0) {
          const arcFactor = (1 - lensDist / 45) * Math.pow(Math.cos(dx / (eventHorizonR * 1.5)), 2);
          if (arcFactor > 0) {
            const lAngle = Math.atan2(dy, dx) + angleOffset * 1.8;
            const arcNoise = 0.7 + 0.3 * Math.sin(lAngle * 8);
            const arcInt = arcFactor * arcNoise * 1.5;

            frameBuffer[pIdx] = Math.min(255, frameBuffer[pIdx] + 255 * arcInt);
            frameBuffer[pIdx + 1] = Math.min(255, frameBuffer[pIdx + 1] + 195 * arcInt);
            frameBuffer[pIdx + 2] = Math.min(255, frameBuffer[pIdx + 2] + 135 * arcInt);
          }
        }
      }
    }

    const canWrite = ffmpeg.stdin.write(frameBuffer);
    if (!canWrite) {
      await new Promise(resolve => ffmpeg.stdin.once('drain', resolve));
    }
  }

  ffmpeg.stdin.end();
}

generate();
