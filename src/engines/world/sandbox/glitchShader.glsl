#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_texture;
uniform float u_intensity;
uniform float u_seed;

in vec2 v_uv;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32 + u_seed);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = v_uv;
  vec2 pixel = 1.0 / max(u_resolution, vec2(1.0));
  float strength = clamp(u_intensity, 0.0, 1.0);

  float scanBand = floor(uv.y * 90.0);
  float bandNoise = hash(vec2(scanBand, floor(u_time * 18.0)));
  float tearMask = step(1.0 - strength * 0.42, bandNoise);
  float tear = (bandNoise - 0.5) * 0.085 * strength * tearMask;

  float organic = noise(vec2(uv.y * 18.0, u_time * 2.2 + u_seed));
  uv.x += tear + (organic - 0.5) * 0.015 * strength;

  float chroma = (1.0 + sin(u_time * 5.0 + uv.y * 40.0)) * strength;
  vec2 redOffset = vec2(1.8 + chroma * 2.4, 0.0) * pixel;
  vec2 blueOffset = vec2(-(1.5 + chroma * 2.1), 0.0) * pixel;

  float r = texture(u_texture, uv + redOffset).r;
  float g = texture(u_texture, uv).g;
  float b = texture(u_texture, uv + blueOffset).b;
  float a = texture(u_texture, uv).a;

  float line = sin(uv.y * u_resolution.y * 1.35 + u_time * 24.0);
  float scanline = 1.0 - (0.08 * strength * smoothstep(0.2, 1.0, line));
  vec3 color = vec3(r, g, b) * scanline;

  float block = step(0.985 - strength * 0.2, hash(floor(uv * vec2(28.0, 16.0)) + floor(u_time * 10.0)));
  color += vec3(0.05, 0.9, 0.45) * block * strength;

  outColor = vec4(color, a);
}
