import { useRef, useEffect, useState } from 'react'
import otakAi from './otak_ai.json'

function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [tebakan, setTebakan] = useState("Menunggu Tangan...")

  // --- 1. MEMUAT OTAK AI DARI JSON ---
  const w_hidden = otakAi.weights_input_hidden
  const w_output = otakAi.weights_hidden_output
  const b_hidden = otakAi.bias_hidden
  const b_output = otakAi.bias_output

  // --- 2. FUNGSI MATEMATIKA AI (Pengganti NumPy) ---
  const denseLayer = (X, W, b) => {
    let output = new Array(W[0].length).fill(0)
    for (let j = 0; j < W[0].length; j++) {
      let sum = 0
      for (let i = 0; i < X.length; i++) {
        sum += X[i] * W[i][j]
      }
      output[j] = sum + b[0][j]
    }
    return output
  }

  const applySigmoid = (arr) => {
    return arr.map(x => {
      let clipped = Math.max(-500, Math.min(500, x))
      return 1 / (1 + Math.exp(-clipped))
    })
  }

  // --- 3. MENYALAKAN MEDIAPIPE & KAMERA ---
  useEffect(() => {
    const videoElement = videoRef.current
    const canvasElement = canvasRef.current
    const canvasCtx = canvasElement.getContext('2d')

    // Panggil MediaPipe dari objek 'window' bawaan script HTML
    const Hands = window.Hands
    const Camera = window.Camera

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      }
    })

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })

    hands.onResults((hasil) => {
      canvasCtx.save()
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)

      canvasCtx.translate(canvasElement.width, 0)
      canvasCtx.scale(-1, 1)
      canvasCtx.drawImage(hasil.image, 0, 0, canvasElement.width, canvasElement.height)

      if (hasil.multiHandLandmarks && hasil.multiHandLandmarks.length > 0) {
        const handLandmarks = hasil.multiHandLandmarks[0]

        canvasCtx.fillStyle = "#3b82f6" // Titik warna biru Tailwind
        let data_koordinat = []

        for (let i = 0; i < handLandmarks.length; i++) {
          const lm = handLandmarks[i]
          data_koordinat.push(lm.x, lm.y)

          canvasCtx.beginPath()
          canvasCtx.arc(lm.x * canvasElement.width, lm.y * canvasElement.height, 6, 0, 2 * Math.PI)
          canvasCtx.fill()
        }

        // --- 4. FORWARD PASS ---
        const hidden_input = denseLayer(data_koordinat, w_hidden, b_hidden)
        const hidden_output = applySigmoid(hidden_input)

        const final_input = denseLayer(hidden_output, w_output, b_output)
        const final_output = applySigmoid(final_input)

        let maxIndex = 0
        let maxValue = final_output[0]
        for (let i = 1; i < final_output.length; i++) {
          if (final_output[i] > maxValue) {
            maxValue = final_output[i]
            maxIndex = i
          }
        }

        setTebakan(`ANGKA ${maxIndex + 1}`)
      } else {
        setTebakan("Menunggu Tangan...")
      }
      canvasCtx.restore()
    })

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement })
      },
      width: 640,
      height: 480
    })
    camera.start()

    return () => {
      camera.stop()
    }
  }, [])

  // --- 5. TAMPILAN USER INTERFACE ---
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-5 font-sans text-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-lg mb-2">
          Deteksi Gestur 5 Jari AI
        </h1>
        <p className="text-slate-400 text-lg">Arahkan tanganmu ke kamera!</p>
      </div>

      <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.3)] border-4 border-slate-700">
        <video ref={videoRef} className="hidden" playsInline></video>
        <canvas
          ref={canvasRef}
          className="w-[640px] h-[480px] bg-black max-w-full"
          width="640"
          height="480"
        ></canvas>

        <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 px-8 py-3 rounded-full font-bold text-2xl shadow-xl transition-colors duration-300 ${tebakan === "Menunggu Tangan..."
          ? "bg-rose-500/90 text-white"
          : "bg-emerald-500/90 text-slate-900"
          }`}>
          {tebakan}
        </div>
      </div>
    </div>
  )
}

export default App