// Renders the RingLoop mark into the PNG icons the installable app needs.
// Run once after changing the logo: node scripts/make-icons.mjs
import sharp from "sharp";

const ring = `
  <path d="M447.7 688.7 A188 188 0 1 1 576.3 688.7" fill="none" stroke="#fff" stroke-width="56" stroke-linecap="round"/>
  <g fill="#fff"><circle cx="432" cy="512" r="36"/><circle cx="512" cy="512" r="36"/><circle cx="592" cy="512" r="36"/></g>`;
const grad = `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a6cf2"/><stop offset="1" stop-color="#1741c9"/></linearGradient></defs>`;

// Rounded tile on transparent — browser tabs / desktop installs
const tile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${grad}<rect width="1024" height="1024" rx="232" fill="url(#g)"/>${ring}</svg>`;
// Full-bleed square, mark inside the 80% safe zone — Android adaptive icons & iOS (which rounds it itself)
const square = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${grad}<rect width="1024" height="1024" fill="url(#g)"/><g transform="translate(512 512) scale(1.12) translate(-512 -512)">${ring}</g></svg>`;

const out = [
  ["public/icons/icon-192.png", tile, 192],
  ["public/icons/icon-512.png", tile, 512],
  ["public/icons/maskable-512.png", square, 512],
  ["src/app/apple-icon.png", square, 180],
];
for (const [file, svg, size] of out) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(file);
  console.log("wrote", file);
}
