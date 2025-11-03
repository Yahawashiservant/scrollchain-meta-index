"use client"
import { useEffect, useRef } from "react"
import type { AudioEngine } from "@/lib/audioEngine"

export default function ShaderSpectrum({
  engine,
  channel = "Master",
}: {
  engine: AudioEngine
  channel?: "Bass" | "Pad" | "Drum" | "Lead" | "Master"
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false })
    if (!gl) return

    // Vertex shader
    const vsSrc = `
    attribute vec2 p;
    void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

    // Fragment shader with spectrum line visualization
    const fsSrc = `
    precision highp float;
    uniform float time;
    uniform vec2 resolution;
    uniform sampler2D uSpectrum;
    uniform float uBins;

    void main(){
      vec2 uv = gl_FragCoord.xy / resolution;
      float t = time * 0.25;

      // Glass base
      vec3 glass = mix(vec3(0.10,0.12,0.16), vec3(0.18,0.22,0.28), uv.y);

      // Sample spectrum
      float bin = floor(uv.x * uBins);
      float amp = texture2D(uSpectrum, vec2(bin / uBins, 0.5)).r;

      // Neon spectrum line
      float yLine = 0.9 - amp * 0.8;
      float line = smoothstep(0.008, 0.0, abs(uv.y - yLine));

      vec3 glow = vec3(0.1, 0.6, 1.0) * line;

      // Subtle waves
      float waves = 0.05 * sin(uv.y * 30.0 + t * 2.0) * sin(uv.x * 20.0 + t);
      vec3 color = glass + glow + vec3(waves);

      gl_FragColor = vec4(pow(color, vec3(0.9)), 0.6);
    }`

    function compile(type: number, src: string) {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsSrc))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsSrc))
    gl.linkProgram(prog)
    gl["useProgram"](prog)

    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const pLoc = gl.getAttribLocation(prog, "p")
    gl.enableVertexAttribArray(pLoc)
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0)

    const timeLoc = gl.getUniformLocation(prog, "time")
    const resLoc = gl.getUniformLocation(prog, "resolution")
    const binsLoc = gl.getUniformLocation(prog, "uBins")
    const specLoc = gl.getUniformLocation(prog, "uSpectrum")

    // Create spectrum texture
    const tex = gl.createTexture()!
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.uniform1i(specLoc, 0)

    function resize() {
      canvas.width = canvas.clientWidth * devicePixelRatio
      canvas.height = canvas.clientHeight * devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    addEventListener("resize", resize)

    const start = performance.now()
    let rafId: number

    function frame() {
      const t = (performance.now() - start) / 1000
      engine.sampleSpectra()
      const spec = engine.getSpectrum(channel)
      const bins = spec.length

      // Upload spectrum as texture
      const rgba = new Uint8Array(bins * 4)
      for (let i = 0; i < bins; i++) {
        const v = spec[i]
        rgba[i * 4 + 0] = v
        rgba[i * 4 + 1] = 0
        rgba[i * 4 + 2] = 0
        rgba[i * 4 + 3] = 255
      }
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, bins, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, rgba)

      gl.uniform1f(timeLoc, t)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.uniform1f(binsLoc, bins)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafId = requestAnimationFrame(frame)
    }
    frame()

    return () => {
      removeEventListener("resize", resize)
      cancelAnimationFrame(rafId)
    }
  }, [engine, channel])

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl">
      <canvas ref={canvasRef} className="w-full h-24" />
    </div>
  )
}
