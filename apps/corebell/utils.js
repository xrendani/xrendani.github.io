export function perlinNoise(x, y) {
  // Simple Perlin noise implementation (or use a library like 'noisejs')
  return Math.sin(x) * Math.cos(y);
}
