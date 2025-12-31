import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Generator from './components/Generator'
import CustomCursor from './components/ui/CustomCursor'

function App() {
  return (
    <>
      <CustomCursor />
      <div className="interactive-bg" id="interactiveBg"></div>
      <div className="noise-overlay"></div>

      <Header />
      <Hero />

      <div className="container main-content">
        {/* Features Section */}
        <section id="features" className="features-section">
          <h2 className="section-title">WHY <span className="gradient-text">FANCYFONT</span>?</h2>
          <div className="features-grid">
            <div className="feature-card glass-panel">
              <div className="feature-icon"><i className="fa-solid fa-bolt"></i></div>
              <h3>Zalgo Glitch</h3>
              <p>Create chaos with our advanced glitch text engine. Adjustable intensity for maximum distortion.</p>
            </div>
            <div className="feature-card glass-panel">
              <div className="feature-icon"><i className="fa-solid fa-layer-group"></i></div>
              <h3>80+ Typestyles</h3>
              <p>From gothic to bubble, script to runes. We have every aesthetic covered.</p>
            </div>
            <div className="feature-card glass-panel">
              <div className="feature-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
              <h3>Smart Deco</h3>
              <p>Instant text wrapping with premium sparkles, wings, and unicode art.</p>
            </div>
          </div>
        </section>

        <Generator />

        <Footer />
      </div>
    </>
  )
}

export default App
