"use client"
import { useEffect, useRef } from "react"
import type { AudioEngine } from "@/lib/audioEngine"

export default function Spectrogram({
  engine,
  sourceKey = "Master",
}: {
  engine: AudioEngine
  sourceKey?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false })
    if (!gl) return

    const vsSrc = `attribute vec2 p;varying vec2 vUV;void main(){vUV=(p+1.0)/2.0;gl_Position=vec4(p,0.0,1.0);}`
    const fsSrc = `
    precision highp float;
    varying vec2 vUV;
    uniform sampler2D uTex;
    void main(){
      vec3 base = vec3(0.10,0.12,0.16);
      vec3 tex = texture2D(uTex, vec2(vUV.x, 1.0 - vUV.y)).rgb;
      vec3 color = base + vec3(tex.r*0.1, tex.r*0.6, tex.r*1.0);
      gl_FragColor = vec4(pow(color, vec3(0.9)), 0.7);
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

    const tex = gl.createTexture()!
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.uniform1i(gl.getUniformLocation(prog, "uTex"), 0)

    let bins = engine.getSpectrum(sourceKey).length
    const width = 1024
    const history = new Uint8Array(width * bins * 4)
    let writeX = 0

    function uploadRow() {
      const spec = engine.getSpectrum(sourceKey)
      bins = spec.length
      for (let y = 0; y < bins; y++) {
        const v = spec[y]
        const idx = (y * width + writeX) * 4
        history[idx + 0] = v
        history[idx + 1] = 0
        history[idx + 2] = 0
        history[idx + 3] = 255
      }
      writeX = (writeX + 1) % width
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, bins, 0, gl.RGBA, gl.UNSIGNED_BYTE, history)
    }

    function resize() {
      canvas.width = canvas.clientWidth * devicePixelRatio
      canvas.height = canvas.clientHeight * devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    addEventListener("resize", resize)

    function frame() {
      engine.sampleSpectra()
      uploadRow()
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      requestAnimationFrame(frame)
    }
    frame()

    return () => removeEventListener("resize", resize)
  }, [engine, sourceKey])

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl">
      <canvas ref={canvasRef} className="w-full h-32" />
    </div>
  )
}
