'use client'
import './home.css';

export default function Home() {

  return (
    <div>
      <nav className="navbar">
        <ul className="nav-links">
          <div className="logo">KontentFlow</div>
          <div className='navcontainer'>
            <div className="divider"></div>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#contact">Contact</a></li>
            <div className="divider"></div>
          </div>

          <button className="get-started" onClick={() => { window.location.href = '/login' }}>Get Started</button>
        </ul>
      </nav>
      <section className="hero">
        <div className="grain-overlay"></div>
        <div className="hero-content-box">
          <h1>
            <span>Your</span> <span id='aitext'>Content</span> <span id='aitext'>Workflow,</span><br />
            <span>Simplified</span> <span>with</span> <span id='aitext'>AI.</span>
          </h1>
          <p>Create and schedule content using AI.</p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => { window.location.href = '/login' }}>Get Started</button>
            <button className="secondary-btn">Learn More</button>
          </div>
        </div>
      </section>
      <section className="how-it-works" id='features'>
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create</h3>
            <p>Write a simple idea or topic, and KontentFlow will turn it into content for you.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Schedule</h3>
            <p>Choose your date, time, and platforms. KontentFlow will handle posting across all your social channels.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Track & Analyze</h3>
            <p>{`Monitor performance, track engagement, and see what's working.`}</p>
          </div>
        </div>
      </section>
      <div className="section-divider"></div>

      <section className="pricing-section" id='pricing'>
        <h2>Pricing</h2>
        <div className="pricing-plans">
          <div className="plan">
            <h3>Starter</h3>
            <div className="price">$0<span style={{ fontSize: '1rem' }}>/month</span></div>
            <ul>
              <li>Basic Features</li>
              <li>Community Support</li>
              <li>Up to 3 Projects</li>
            </ul>
            <button>Get Started</button>
          </div>

          <div className="plan">
            <h3>Pro</h3>
            <div className="price">$12<span style={{ fontSize: '1rem' }}>/month</span></div>
            <ul>
              <li>All Starter Features</li>
              <li>Unlimited Projects</li>
              <li>Priority Support</li>
            </ul>
            <button>Upgrade Now</button>
          </div>

          <div className="plan">
            <h3>Enterprise</h3>
            <div className="price">Custom</div>
            <ul>
              <li>Dedicated Manager</li>
              <li>Custom Integrations</li>
              <li>Onboarding Support</li>
            </ul>
            <button>Contact Sales</button>
          </div>
        </div>
      </section>
      <footer>
        <div className="footer">
          <div className="footer-logo">KontentFlow</div>
          <div className="footer-section">
            <div className="footer-subheading">Email</div>
            <a href="mailto:support@kontentflow.com" className="footer-email">support@kontentflow.com</a>
          </div>
        </div>
        <div className="footer-copyright">
          © 2025 KontentFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
