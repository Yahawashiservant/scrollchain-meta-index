"use client"
import { useEffect, useRef } from "react"

const frag = `
precision highp float;
uniform float time;
uniform vec2 resolution;

// simple luxury bloom + lattice lines
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 x){
  vec2 i = floor(x);
  vec2 f = fract(x);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main(){
  vec2 uv = gl_FragCoord.xy / resolution;
  float t = time * 0.25;

  // lattice bloom
  float n = noise(uv * 8.0 + t);
  float lines = smoothstep(0.48, 0.5, abs(sin(uv.y*20.0 + t*2.0))) * 0.6;

  vec3 base = vec3(0.03, 0.05, 0.08);
  vec3 glow = vec3(0.1, 0.4, 0.9) * (n * 0.6 + lines);

  // glass gradient
  vec3 glass = mix(vec3(0.12,0.14,0.18), vec3(0.2,0.22,0.28), uv.y);

  vec3 color = base + glass + glow;
  color = pow(color, vec3(0.9)); // gamma adjust
  gl_FragColor = vec4(color, 0.6);
}
`

export default function ShaderVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

    const vs = gl.createShader(gl.VERTEX_SHADER)
    if (!vs) return
    gl.shaderSource(vs, "attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}")
    gl.compileShader(vs)

    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    if (!fs) return
    gl.shaderSource(fs, frag)
    gl.compileShader(fs)

    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl["useProgram"](prog)

    const buf = gl.createBuffer()
    if (!buf) return
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const pLoc = gl.getAttribLocation(prog, "p")
    gl.enableVertexAttribArray(pLoc)
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0)

    const timeLoc = gl.getUniformLocation(prog, "time")
    const resLoc = gl.getUniformLocation(prog, "resolution")

    function resize() {
      canvas.width = canvas.clientWidth * window.devicePixelRatio
      canvas.height = canvas.clientHeight * window.devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const start = performance.now()
    let animationId: number
    function frame() {
      const t = (performance.now() - start) / 1000
      if (timeLoc) gl.uniform1f(timeLoc, t)
      if (resLoc) gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      animationId = requestAnimationFrame(frame)
    }
    frame()

    return () => {
      window.removeEventListener("resize", resize)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl">
      <canvas ref={canvasRef} className="w-full h-56" />
      <div className="absolute inset-0 pointer-events-none mix-blend-screen" />
    </div>
  )
}
