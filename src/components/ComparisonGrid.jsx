import { motion } from 'framer-motion'

const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] }

export default function ComparisonGrid() {
  return (
    <section className="py-24 px-6 bg-alabaster flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={transition}
        className="mb-12 text-center"
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-emerald-deep tracking-tight">
          Precision Matrix Analysis
        </h2>
        <p className="mt-4 text-sage-muted font-body max-w-xl mx-auto">
          Ground Truth Annotations vs. Real-Time CPU Predictions
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...transition, duration: 1.2 }}
        whileHover={{ scale: 1.02 }}
        className="relative w-full max-w-5xl h-[85vh] bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-4 shadow-2xl overflow-hidden"
      >
        <div className="w-full h-full rounded-2xl overflow-y-auto custom-scrollbar">
          <img 
            src="/onnx_vs_ground_truth_grid.jpg" 
            alt="Model Comparison Grid" 
            className="w-full h-auto block" 
          />
        </div>
        
        <div className="absolute top-8 left-8 bg-alabaster/80 backdrop-blur-sm text-emerald-deep px-4 py-2 rounded-full text-xs font-heading font-bold tracking-wider shadow-lg">
          GROUND TRUTH
        </div>
        <div className="absolute top-8 right-8 bg-emerald-deep/80 backdrop-blur-sm text-alabaster px-4 py-2 rounded-full text-xs font-heading font-bold tracking-wider shadow-lg">
          ONNX PREDICTIONS
        </div>
      </motion.div>
    </section>
  )
}