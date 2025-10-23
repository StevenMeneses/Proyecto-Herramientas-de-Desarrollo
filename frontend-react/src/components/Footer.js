import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* POLICY LINES */}
          <div className="footer-section">
            <h4>POLICY LINES</h4>
            <ul>
              <li><a href="/terms">Terms and Conditions</a></li>
              <li><a href="/story">Our Story</a></li>
              <li><a href="/delivery">Our delivery terms</a></li>
              <li><a href="/join">Join us to get 15% off your first order</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li className="email">contact@marly.com</li>
              <li className="email">For wholesale inquiries: wholesale@marly.com</li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/wholesale">Drop us your email</a></li>
              <li><a href="/shipping">Shipping Policy</a></li>
              <li><a href="/returns">Returns - Exchange - Repairs</a></li>
              <li><a href="/exchange">Exchange & Returns Policy</a></li>
            </ul>
          </div>
          
          {/* QUICK LINES */}
          <div className="footer-section">
            <h4>QUICK LINES</h4>
            <ul>
              <li><a href="/shop-all">SHOP ALL</a></li>
              <li><a href="/best">Best over earphones 500</a></li>
              <li><a href="/dose">Dose Losses</a></li>
              <li><a href="/makeup">Makeup water? Keep all delivery</a></li>
              <li><a href="/makeup-water">Makeup water?</a></li>
            </ul>
          </div>
          
          {/* CONTACT US */}
          <div className="footer-section">
            <h4>CONTACT US</h4>
            <ul>
              <li><a href="/contact">Our Story</a></li>
              <li><a href="/team">Our team</a></li>
              <li><a href="/delivery-info">Delivery information</a></li>
              <li><a href="/join-insider">Join us to get 15% off your first order</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/contact-form">Contact Us</a></li>
              <li className="email">contact@marly.com</li>
              <li className="email">For wholesale services and space: wholesale@marly.com</li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/email-list">Drop us your email</a></li>
              <li><a href="/shipping-info">Shipping Policy</a></li>
              <li><a href="/returns-info">Postage - Exchange - Repairs</a></li>
              <li><a href="/exchange-info">Exchange & Repair Policy</a></li>
            </ul>
          </div>
          
          {/* BE AN INSIDER */}
          <div className="footer-section">
            <h4>BE AN INSIDER</h4>
            <div className="newsletter">
              <p>Join our newsletter for updates and offers</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button type="submit">Subscribe</button>
              </div>
              <div className="social-links">
                <button className="social-btn" title="Instagram">
                  <i className="fab fa-instagram"></i>
                </button>
                <button className="social-btn" title="Facebook">
                  <i className="fab fa-facebook"></i>
                </button>
                <button className="social-btn" title="Pinterest">
                  <i className="fab fa-pinterest"></i>
                </button>
                <button className="social-btn" title="TikTok">
                  <i className="fab fa-tiktok"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-brand">
            <h3>MARLY</h3>
            <p>@ 2025 MARLY Handmade</p>
          </div>
          <div className="payment-methods">
            <span>We accept:</span>
            <i className="fab fa-cc-visa" title="Visa"></i>
            <i className="fab fa-cc-mastercard" title="MasterCard"></i>
            <i className="fab fa-cc-paypal" title="PayPal"></i>
            <i className="fab fa-cc-apple-pay" title="Apple Pay"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;