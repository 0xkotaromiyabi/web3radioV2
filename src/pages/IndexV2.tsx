import React from 'react';
import { useAudio } from '@/contexts/AudioProvider';
import NavBar from '@/components/navigation/NavBar';
import { STATIONS } from '@/data/stations';
import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useDisconnect } from 'wagmi';
import UnifiedTipComponent from '@/components/wallet/UnifiedTipComponent';
import CryptoTicker from '@/components/ui/CryptoTicker';
import { MessageSquare, Volume2, Volume1, VolumeX, Share2 } from 'lucide-react';
import ListeningTimeTracker from '@/components/radio/ListeningTimeTracker';
import { ShareModal } from '@/components/radio/ShareModal';
const IndexV2 = () => {
  const { isPlaying, volume, togglePlay, setVolume, currentStation, currentSong, changeStation } = useAudio();
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  // Unified AppKit State
  const { open: openAppKit } = useAppKit();
  const { address, isConnected, caipAddress } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();
  const { disconnect } = useDisconnect();

  const stationData = STATIONS.find(s => s.id === currentStation) || STATIONS[0];

  const artistName = currentSong?.artist || "Web3Radio";
  const songTitle = currentSong?.title || stationData.name;
  const albumTitle = currentSong?.album || stationData.genre;
  const albumArt = currentSong?.artwork || stationData.image_url || 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/83141/incubus-make-yourself.jpg';

  // Detect if connected to Solana or EVM
  const isSolana = caipAddress && String(caipAddress).startsWith('solana:');
  const networkName = caipNetwork?.name || 'Unknown';

  return (
    <div className="min-h-screen w-full bg-[#fef29c] relative overflow-y-auto font-['Raleway',_sans-serif] text-[#515044] flex flex-col items-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Raleway:400,300,700');

        /* ===== DESKTOP (769px+) — Original horizontal layout ===== */
        .music-player-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          padding-top: 80px;
          padding-bottom: 20px;
        }

        .music-player-container {
          display: inline-block;
          height: 370px;
          position: relative;
          width: 460px;
          z-index: 10;
        }

        .music-player-container:after {
          filter: blur(8px);
          background-color: rgba(0,0,0,0.4);
          bottom: -2px;
          content: ' ';
          display: block;
          height: 10px;
          left: 19px;
          position: absolute;
          transform: rotate(-3deg);
          width: 70%;
          z-index: 0;
        }

        .music-player {
          background-color: #fff;
          height: 370px;
          padding: 40px 250px 40px 40px;
          position: absolute;
          text-align: right;
          width: 460px;
          z-index: 3;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .player-content-container {
          top: 50%;
          position: relative;
          transform: translateY(-50%);
        }

        .artist-name {
          font-size: 28px;
          font-weight: 400;
          margin: 0 0 0.75em 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .album-title {
          font-weight: 200;
          font-size: 24px;
          margin: 0 0 1.75em 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-title {
          font-size: 18px;
          font-weight: 200;
          margin: 0 0 1.5em 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .album {
          box-shadow: 3px 3px 15px rgba(0,0,0,0.4);
          height: 315px;
          margin-left: 250px;
          margin-top: 27px;
          position: relative;
          width: 315px;
          z-index: 10;
        }

        .album-art {
          background-color: #fff;
          height: 315px;
          position: relative;
          width: 315px;
          z-index: 10;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        .vinyl {
          animation: spin 3s linear infinite;
          transition: all 500ms ease-in-out;
          background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/83141/vinyl.png');
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          border-radius: 100%;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          height: 300px;
          left: 0;
          position: absolute;
          top: 8px;
          width: 300px;
          z-index: 5;
          will-change: transform, left;
        }

        .vinyl-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40%;
          height: 40%;
          border-radius: 100%;
          background-position: center;
          background-size: cover;
          z-index: 6;
        }

        .is-playing .vinyl {
          left: 55%;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .music-player-controls {
          text-align: center;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .control-btn {
          filter: grayscale(1) brightness(0);
          border-radius: 100%;
          display: inline-block;
          height: 44px;
          width: 44px;
          cursor: pointer;
          transition: all 200ms;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .control-btn:hover {
          opacity: 0.7;
        }

        .control-back { background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/83141/backwards.svg'); }
        .control-forwards { background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/83141/forwards.svg'); }
        .control-play { 
          background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/83141/play.svg'); 
        }
        .is-playing .control-play { 
          background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/83141/pause.svg'); 
        }

        /* ===== TABLET (481px — 768px) — Compact horizontal ===== */
        @media (max-width: 768px) {
          .music-player-wrapper {
            padding-top: 60px;
          }
          .music-player-container {
            width: 360px;
            height: 290px;
          }
          .music-player {
            width: 360px;
            height: 290px;
            padding: 24px 200px 24px 24px;
          }
          .artist-name { font-size: 20px; }
          .album-title { font-size: 17px; margin-bottom: 1.2em; }
          .song-title { font-size: 14px; }
          .album {
            height: 240px;
            width: 240px;
            margin-left: 200px;
            margin-top: 25px;
          }
          .album-art {
            height: 240px;
            width: 240px;
          }
          .vinyl {
            height: 230px;
            width: 230px;
            top: 5px;
          }
          .control-btn {
            height: 38px;
            width: 38px;
          }
        }

        /* ===== MOBILE (≤480px) — Stacked vertical layout ===== */
        @media (max-width: 480px) {
          .music-player-wrapper {
            padding-top: 30px;
            padding-bottom: 10px;
          }
          .music-player-container {
            width: 90vw;
            max-width: 320px;
            height: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .music-player-container:after {
            display: none;
          }
          .music-player {
            position: relative;
            width: 100%;
            height: auto;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 16px 16px;
            order: 2;
          }
          .player-content-container {
            position: static;
            transform: none;
          }
          .artist-name {
            font-size: 18px;
            margin-bottom: 0.4em;
          }
          .album-title {
            font-size: 15px;
            margin-bottom: 0.8em;
          }
          .song-title {
            font-size: 13px;
            margin-bottom: 1em;
          }
          .music-player-controls {
            justify-content: center;
          }
          .control-btn {
            height: 40px;
            width: 40px;
          }
          .album {
            position: relative;
            margin-left: 0;
            margin-top: 0;
            width: 100%;
            height: 0;
            padding-bottom: 100%;
            border-radius: 16px 16px 0 0;
            overflow: hidden;
            order: 1;
          }
          .album-art {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 16px 16px 0 0;
          }
          .vinyl {
            display: none;
          }
          .is-playing .vinyl {
            display: none;
          }
        }
      `}</style>

      <NavBar />

      <div className="flex flex-col items-center mb-12 px-4 mt-20 md:mt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tighter text-[#515044]/80">WEB3RADIO</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30 mb-2">Decentralized Radio Station</p>
        </div>
      </div>

      {/* Crypto Price Ticker */}
      <CryptoTicker />

      <div className="music-player-wrapper">
        <div className={`music-player-container ${isPlaying ? 'is-playing' : ''}`}>
          <div className="music-player">
            <div className="player-content-container">
              <h1 className="artist-name">{artistName}</h1>
              <h2 className="album-title">{albumTitle}</h2>
              <h3 className="song-title">"{songTitle}"</h3>
              <div className="music-player-controls">
                <div className="control-btn control-back"></div>
                <div className="control-btn control-play" onClick={togglePlay}></div>
                <div className="control-btn control-forwards"></div>
              </div>
            </div>
          </div>

          <div className="album">
            <div className="album-art" style={{ backgroundImage: `url(${albumArt})` }}></div>
            <div className="vinyl" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
              <div className="vinyl-center" style={{ backgroundImage: `url(${albumArt})` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Volume & Share Controls Below Player */}
      <div className="w-[90%] md:w-[70%] max-w-[460px] mx-auto mt-2 mb-8 px-6 py-4 bg-white/60 backdrop-blur-md border border-[#515044]/10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center justify-between gap-6 relative z-10 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3 flex-1">
          {volume === 0 ? <VolumeX className="w-5 h-5 text-[#515044]/60" /> : volume < 50 ? <Volume1 className="w-5 h-5 text-[#515044]/60" /> : <Volume2 className="w-5 h-5 text-[#515044]/60" />}
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full h-1.5 appearance-none rounded-full cursor-pointer shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] focus:outline-none"
            style={{
              background: `linear-gradient(to right, #515044 0%, #515044 ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`
            }}
          />
          <span className="text-xs font-bold text-[#515044] w-8 text-right tabular-nums block">{volume}</span>
        </div>

        <div className="w-px h-8 bg-[#515044]/10 shrink-0" />

        <button
          onClick={() => setIsShareModalOpen(true)}
          className="p-3 rounded-full bg-white border border-[#515044]/10 hover:bg-[#515044] hover:text-white text-[#515044] transition-all shadow-sm group relative"
          title="Share Station"
        >
          <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Listening Time Information (Minimalist text-based) */}
      <ListeningTimeTracker isPlaying={isPlaying} />

      {/* Unified Button Container (70% Width) */}
      <div className="w-[90%] md:w-[70%] z-20 space-y-12 pb-32 mt-12">
        {/* Station Selection */}
        <div className="space-y-4">
          <p className="text-center text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Frequency</p>
          <div className="flex flex-wrap justify-center gap-3">
            {STATIONS.map((station) => (
              <div key={station.id} className="flex flex-col items-center gap-2">
                <button
                  onClick={() => changeStation(station.id)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border whitespace-nowrap ${currentStation === station.id
                    ? 'bg-[#515044] text-white border-[#515044] scale-105 shadow-lg'
                    : 'bg-white/90 text-[#515044] border-[#515044]/10 hover:bg-white hover:border-[#515044]/30 shadow-md hover:shadow-lg'
                    }`}
                >
                  {station.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet & Tip Section */}
        <div className="pt-10 border-t border-[#515044]/10 flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-6 text-center">Connect Wallet to Support Contributor</p>

          <div className="flex flex-col items-center gap-6 w-full">
            {/* Single Unified Connect Button */}
            {!isConnected ? (
              <button
                onClick={() => openAppKit()}
                className="px-8 py-4 bg-[#515044] text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-black hover:scale-105 transition-all flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Connect Wallet
              </button>
            ) : (
              <div className="flex flex-col items-center gap-3">
                {/* Connected Status */}
                <button
                  onClick={() => openAppKit({ view: 'Account' })}
                  className="px-6 py-3 bg-white border border-[#515044]/20 text-[#515044] rounded-2xl font-mono text-[10px] shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-bold text-[9px] uppercase tracking-wider text-[#515044]/50 mr-1">{networkName}</span>
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </button>

                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => openAppKit({ view: 'Networks' })}
                    className="text-[10px] font-bold text-[#515044]/60 hover:text-[#515044] underline underline-offset-4"
                  >
                    Switch Network
                  </button>
                  <button
                    onClick={() => disconnect()}
                    className="text-[10px] font-bold text-red-500/40 hover:text-red-500 underline underline-offset-4"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            )}

            {/* Unified Tipping Hub */}
            {isConnected && <UnifiedTipComponent />}
          </div>
        </div>

      </div>

      {/* Share Modal Popup */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentSong={currentSong || null}
        stationName={stationData.name}
      />
    </div>
  );
};

export default IndexV2;
