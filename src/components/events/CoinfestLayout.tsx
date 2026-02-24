import React from 'react';
import './CoinfestLayout.css';

const CoinfestLayout: React.FC = () => {
    return (
        <div className="coinfest-container">
            <main className="coinfest-grid">
                <div className="coinfest-title coinfest-title--primary">
                    <span className="coinfest-text-light">The World's Largest</span>
                    <span className="coinfest-text-bold">Crypto Festival</span>
                </div>

                <div className="coinfest-cover">
                    <a
                        href="https://coinfest.asia/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="https://cdn.prod.website-files.com/649044701cae1638344b8612/686b99bb52eac66c215ad6cd_ca25_Thumbnails_Full_The_Moon_64a7262311.png"
                            alt="Coinfest Asia 2025 - Full Moon"
                        />
                    </a>
                </div>

                <ul className="coinfest-info">
                    <li>
                        <span className="coinfest-text-bold">Global Crypto Hub</span>
                        <span className="coinfest-text-light">10k+ Attendees, 90+ Countries</span>
                    </li>
                    <li>
                        <span className="coinfest-text-bold">Nuanu Creative City</span>
                        <span className="coinfest-text-light">Bali, Indonesia</span>
                    </li>
                    <li>
                        <span className="coinfest-text-bold">21<sup>st</sup> - 22<sup>nd</sup> August 2025</span>
                        <span className="coinfest-text-light">Doors open at <strong>9:00 AM</strong></span>
                        <span className="coinfest-text-light">Insights, Networking & Parties</span>
                    </li>
                    <li>
                        <span className="coinfest-text-light">Theme: <strong>FULL MOON</strong></span>
                    </li>
                </ul>

                <div className="coinfest-title coinfest-title--secondary">
                    <span className="coinfest-text-light">Coinfest Asia</span>
                    <span className="coinfest-text-bold">2025</span>
                </div>
            </main>
        </div>
    );
};

export default CoinfestLayout;
