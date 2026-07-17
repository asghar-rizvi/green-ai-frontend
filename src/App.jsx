import Hero from './components/Hero'
import Metrics from './components/Metrics'
import ComparisonGrid from './components/ComparisonGrid'
import Footer from './components/Footer'
import ModelPlayground from './components/ModelPlayground'

export default function App() {
  return (
    <main className="bg-alabaster min-h-screen w-full">
      <Hero />
      <Metrics />
      <ComparisonGrid />
      <ModelPlayground />
      <Footer />
    </main>
  )
}