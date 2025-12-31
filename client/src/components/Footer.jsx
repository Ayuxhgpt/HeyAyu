import React from 'react';

export default function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <div className="brand">
                    <h4>FANCY<span className="gradient-text">FONT</span> PRO</h4>
                    <p>Developed by <span className="dev-name">Sukoon</span></p>
                </div>
                <div className="socials">
                    <a href="https://instagram.com/4xSukoon" target="_blank" rel="noopener noreferrer" className="social-link">
                        <i className="fa-brands fa-instagram"></i> 4xSukoon
                    </a>
                </div>
            </div>
            <div className="footer-bottom">
                <p className="tiny-text">© 2025 SUKOON DEV. ALL RIGHTS RESERVED. UNBEATABLE PERFORMANCE.</p>
            </div>
        </footer>
    );
}
