import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Sliders, Cpu, Zap, RefreshCw, AlertTriangle, Image as ImageIcon } from 'lucide-react'

const easing = [0.16, 1, 0.3, 1]

export default function ModelPlayground() {
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [confThreshold, setConfThreshold] = useState(0.35)
  const [iouThreshold, setIouThreshold] = useState(0.25)
  const [predictions, setPredictions] = useState([])
  const [latency, setLatency] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const [scale, setScale] = useState({ x: 1, y: 1 })

  // Track rendering scale ratios when resizing window or swapping images
  const calculateScale = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight, clientWidth, clientHeight } = imageRef.current
      setScale({
        x: clientWidth / naturalWidth,
        y: clientHeight / naturalHeight
      })
    }
  }

  useEffect(() => {
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setPredictions([])
      setLatency(null)
      setError(null)
    }
  }

  // Fire Inference API Loop against local server port 8000
  const runInference = async () => {
    if (!image) return
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', image)

    try {
      const response = await fetch(
        `https://green-ai-backend-ujd6.onrender.com/predict?conf_threshold=${confThreshold}&iou_threshold=${iouThreshold}`,
        { method: 'POST', body: formData }
      )

      if (!response.ok) throw new Error('Inference server failed to respond execution frames.')
      
      const data = await response.json()
      setPredictions(data.predictions)
      setLatency(data.inference_time_ms)
      setTimeout(calculateScale, 100) // minor delay to ensure DOM dimensions reflect accurately
    } catch (err) {
      setError(err.message || 'Could not connect to the local FastAPI backend.')
    } finally {
      setLoading(false)
    }
  }

  // Trigger rerun automatically if thresholds shift while image is active
  useEffect(() => {
    if (image) runInference()
  }, [confThreshold, iouThreshold])

  return (
    <section className="py-24 px-6 bg-white text-charcoal font-body border-t border-emerald-deep/5">
      <div className="max-w-6xl mx-auto">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-leaf-green text-xs font-bold tracking-widest uppercase block mb-3">Live Edge Evaluation Node</span>
          <h2 className="font-heading text-4xl font-extrabold text-emerald-deep tracking-tight mb-4">Test Custom Model Graph</h2>
          <p className="text-sage-muted text-sm leading-relaxed">
            Upload custom drone imagery snapshots to observe the compiled ONNX model distinguish and frame crops from weed clusters using localized CPU cycles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT INTERACTION CONTROLS - 4 COLS */}
          <div className="lg:col-span-4 bg-alabaster border border-emerald-deep/5 p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 border-b border-emerald-deep/5 pb-4">
              <Sliders className="w-4 h-4 text-leaf-green" />
              <h3 className="font-heading font-bold text-emerald-deep">Execution Hyperparameters</h3>
            </div>

            {/* CONFIDENCE SLIDER */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-deep">Confidence Threshold</span>
                <span className="text-leaf-green font-mono">{confThreshold}</span>
              </div>
              <input 
                type="range" min="0.05" max="1.0" step="0.05" value={confThreshold}
                onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
                className="w-full accent-leaf-green bg-emerald-deep/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[10px] text-sage-muted">Minimum scoring boundary required to accept prediction bounding frames.</p>
            </div>

            {/* IOU SLIDER */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-deep">NMS IoU Threshold</span>
                <span className="text-leaf-green font-mono">{iouThreshold}</span>
              </div>
              <input 
                type="range" min="0.05" max="1.0" step="0.05" value={iouThreshold}
                onChange={(e) => setIouThreshold(parseFloat(e.target.value))}
                className="w-full accent-leaf-green bg-emerald-deep/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[10px] text-sage-muted">Overlapping bounding box area constraints used for suppression loops.</p>
            </div>

            {/* PERFORMANCE LOG CHIPS */}
            {latency !== null && (
              <div className="pt-4 border-t border-emerald-deep/5 grid grid-cols-2 gap-3">
                <div className="bg-white border border-emerald-deep/5 p-3 rounded-xl text-center">
                  <Zap className="w-4 h-4 text-leaf-green mx-auto mb-1" />
                  <span className="text-[10px] uppercase text-sage-muted block">CPU Speed</span>
                  <span className="text-sm font-extrabold text-emerald-deep font-mono">{latency}ms</span>
                </div>
                <div className="bg-white border border-emerald-deep/5 p-3 rounded-xl text-center">
                  <Cpu className="w-4 h-4 text-emerald-deep mx-auto mb-1" />
                  <span className="text-[10px] uppercase text-sage-muted block">Objects Found</span>
                  <span className="text-sm font-extrabold text-emerald-deep font-mono">{predictions.length}</span>
                </div>
              </div>
            )}

            {/* FILE UPLOAD BUTTON */}
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-emerald-deep/10 hover:border-leaf-green/40 rounded-2xl cursor-pointer bg-white transition-all duration-300 group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                <Upload className="w-6 h-6 text-sage-muted group-hover:text-leaf-green transition-colors mb-2" />
                <p className="text-xs font-bold text-emerald-deep mb-1">Select Field Image File</p>
                <p className="text-[10px] text-sage-muted">JPG, PNG up to 10MB</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>

            {error && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl flex items-start gap-2 border border-red-100">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* RIGHT INTERACTIVE PREVIEW CANVAS - 8 COLS */}
          <div className="lg:col-span-8 bg-alabaster border border-emerald-deep/5 rounded-3xl p-4 min-h-[400px] flex items-center justify-center relative overflow-hidden">
            {previewUrl ? (
              <div ref={containerRef} className="relative inline-block select-none max-w-full">
                <img 
                  ref={imageRef} src={previewUrl} alt="Prediction Canvas" 
                  onLoad={calculateScale} className="max-w-full h-auto rounded-xl shadow-sm block max-h-[550px]"
                />
                
                {/* DYNAMIC METRIC BOXES MAP OVERLAY */}
                {predictions.map((pred, idx) => {
                  const [x1, y1, x2, y2] = pred.box
                  const boxStyle = {
                    left: `${x1 * scale.x}px`,
                    top: `${y1 * scale.y}px`,
                    width: `${(x2 - x1) * scale.x}px`,
                    height: `${(y2 - y1) * scale.y}px`,
                    borderColor: pred.class_id === 0 ? '#10B981' : '#3B82F6' // Green for Crops, Blue for Weeds
                  }

                  return (
                    <div 
                      key={idx} style={boxStyle}
                      className="absolute border-2 pointer-events-none group transition-all duration-150"
                    >
                      {/* LABEL BADGE */}
                      <span 
                        style={{ backgroundColor: boxStyle.borderColor }}
                        className="absolute bottom-full left-0 text-[9px] text-white font-mono font-bold tracking-wide px-1.5 py-0.5 whitespace-nowrap rounded-t"
                      >
                        {pred.class_name} {Math.round(pred.confidence * 100)}%
                      </span>
                    </div>
                  )
                })}

                {/* VISUAL LOADING STATE SPINNER SHIELD */}
                {loading && (
                  <div className="absolute inset-0 bg-emerald-deep/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <div className="bg-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 text-xs font-bold text-emerald-deep">
                      <RefreshCw className="w-4 h-4 animate-spin text-leaf-green" /> Running Core Execution Graph...
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-deep/5 text-sage-muted flex items-center justify-center mx-auto">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-emerald-deep">No Image Selected</p>
                <p className="text-[11px] text-sage-muted max-w-xs mx-auto">
                  Pick an agricultural image snippet using the control menu to monitor inference vectors live.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  )
}