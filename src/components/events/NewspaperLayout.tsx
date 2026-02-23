import React from 'react';
import './NewspaperLayout.css';

const NewspaperLayout: React.FC = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="newspaper-container">
            <div className="newspaper-inner">
                <header>
                    <nav>
                        <div className="row">
                            <h1 className="logo">The Web3radio</h1>
                            <div className="sub">
                                <p className="item date">www.webthreeradio.xyz</p>
                                <p className="item paper">The best source for decentralized news</p>
                                <p className="item temperature">{formattedDate}</p>
                            </div>
                        </div>
                    </nav>
                </header>

                <section className="headline">
                    <main>
                        <h1>Web3Radio V2 Revolutionizes Decentralized Broadcasting</h1>
                        <div className="publish">
                            <span className="publish-date">{formattedDate} ·</span>
                            <span className="author">Antigravity</span>
                        </div>
                        <img src="/images/news/studio.png" alt="Futuristic Studio" />
                        <p>Web3Radio has officially launched its V2 update, bringing a seamless integration of on-chain data and real-time audio streaming. The new platform allows listeners to engage with their favorite stations while earning rewards and participating in DAO governance. This milestone marks a significant step forward for the decentralized audio ecosystem, bridging the gap between traditional radio and blockchain technology.</p>
                        <a className="btn btn-secondary" href="#">Read More</a>
                    </main>

                    <div className="side">
                        <h2>Solana Ecosystem Sees Unprecedented Growth</h2>
                        <div className="publish">
                            <span className="publish-date">22 February, 2026 ·</span>
                            <span className="author">Web3 Insider</span>
                        </div>
                        <img src="/images/news/crypto.png" style={{ objectFit: 'cover', height: '175px', width: '100%' }} alt="Crypto Market" />
                        <p>The Solana network has experienced a massive surge in active users and developer activity over the first quarter of 2026. Experts attribute this growth to the increasing adoption of high-performance dApps and the success of several prize-linked yield (PLY) protocols. As institutional interest continues to rise, Solana's position as a leading Layer 1 blockchain is being further solidified, paving the way for more innovative decentralized applications.</p>
                        <a className="btn btn-secondary" href="#">Read More</a>
                    </div>
                </section>

                <section className="extra-news">
                    <div className="news">
                        <h2 className="serif">Smart Contract Security: Best Practices</h2>
                        <div className="publish">
                            <span className="publish-date">20 February, 2026 ·</span>
                            <span className="author">Tech Audit</span>
                        </div>
                        <p>As the DeFi space continues to evolve, security remains a top priority. Recent audits reveal that even the most robust protocols can have vulnerabilities if best practices are not strictly followed. Developers are encouraged to implement multi-layered security checks, utilize formal verification tools, and conduct regular bug bounties to ensure the safety of user funds in the ever-expanding Web3 landscape.</p>
                    </div>

                    <div className="news">
                        <p>The transition from Web2 to Web3 is not just about technology; it's about a fundamental shift in how we perceive ownership and digital identity. Community-led initiatives are at the heart of this movement, empowering individuals to take control of their data and participate in the governance of the platforms they use. As we move deeper into 2026, the emphasis on transparency and decentralization will only continue to grow, reshaping the future of the internet.</p>
                        <a className="btn btn-secondary" href="#">Read More</a>
                    </div>

                    <div className="news">
                        <h2>JOB: Senior Solidity Developer</h2>
                        <div className="publish">
                            <span className="publish-date">18 February, 2026 ·</span>
                            <span className="author">DeFi Labs</span>
                        </div>
                        <img src="/images/news/jobs.png" alt="High Tech Office" />
                        <p>Leading DeFi protocol is seeking an experienced Solidity developer to spearhead the implementation of new cross-chain features. Join a team of visionaries dedicated to building the next generation of financial infrastructure.</p>
                        <a className="btn btn-secondary" href="#">Apply Now</a>
                    </div>

                    <div className="news">
                        <h2>JOB: Community Manager</h2>
                        <div className="publish">
                            <span className="publish-date">15 February, 2026 ·</span>
                            <span className="author">NFT Collective</span>
                        </div>
                        <p>Are you passionate about NFTs and community building? An emerging NFT collection is looking for a creative Community Manager to lead engagement efforts and foster a vibrant ecosystem of creators and collectors.</p>
                        <a className="btn btn-secondary" href="#">Apply Now</a>
                    </div>

                    <div className="news">
                        <h2>BITCOIN HITS NEW ALL-TIME HIGH ABOVE $150K</h2>
                        <div className="publish">
                            <span className="publish-date">12 February, 2026 ·</span>
                            <span className="author">Market Watch</span>
                        </div>
                        <img src="/images/news/crypto.png" style={{ objectFit: 'cover', height: '175px', width: '100%' }} alt="Bitcoin Moon" />
                        <p>In a historic move, Bitcoin has surpassed the $150,000 mark, driven by widespread institutional adoption and favorable regulatory developments. The market sentiment remains bullish as investors flock to the digital gold.</p>
                        <a className="btn btn-secondary" href="#">Read More</a>
                    </div>

                    <div className="news">
                        <h2 className="serif">The Rise of DAO-led Governance in Media</h2>
                        <div className="publish">
                            <span className="publish-date">10 February, 2026 ·</span>
                            <span className="author">DAO Digest</span>
                        </div>
                        <p>Decentralized Autonomous Organizations (DAOs) are revolutionizing the media industry by allowing content creators and consumers to directly participate in decision-making processes. From funding independent journalism to curate radio playlists, DAOs are ensuring that media remains representative and unbiased in the digital age.</p>
                        <a className="btn btn-secondary" href="#">Read More</a>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default NewspaperLayout;
