import React, { useEffect, useRef } from 'react';
import { useAudio } from '@/contexts/AudioProvider';
import { STATIONS } from '@/data/stations';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import './PremiumPlayer.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

const PremiumPlayer = () => {
    const {
        isPlaying,
        togglePlay,
        currentSong,
        currentStation,
        volume,
        setVolume,
        changeStation
    } = useAudio();

    const swiperRef = useRef<any>(null);

    // Sync swiper with external station changes
    useEffect(() => {
        if (swiperRef.current) {
            const index = STATIONS.findIndex(s => s.id === currentStation);
            if (index !== -1 && swiperRef.current.activeIndex !== index) {
                swiperRef.current.slideTo(index);
            }
        }
    }, [currentStation]);

    const handleSlideChange = (swiper: any) => {
        const stationId = STATIONS[swiper.activeIndex].id;
        if (stationId !== currentStation) {
            changeStation(stationId);
        }
    };

    const songTitle = currentSong?.title || 'Web3 Radio';
    const artistName = currentSong?.artist || 'Live Stream';
    const imageUrl = currentSong?.artwork || STATIONS.find(s => s.id === currentStation)?.image_url;

    return (
        <div className="premium-player-container">
            <div className="album-cover">
                <Swiper
                    effect={'coverflow'}
                    centeredSlides={true}
                    initialSlide={STATIONS.findIndex(s => s.id === currentStation)}
                    slidesPerView={'auto'}
                    grabCursor={true}
                    spaceBetween={40}
                    coverflowEffect={{
                        rotate: 25,
                        stretch: 0,
                        depth: 50,
                        modifier: 1,
                        slideShadows: false,
                    }}
                    modules={[EffectCoverflow, Navigation]}
                    className="swiper"
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={handleSlideChange}
                >
                    {STATIONS.map((station) => {
                        const isActive = station.id === currentStation;
                        const imgSrc = isActive && currentSong?.artwork
                            ? currentSong.artwork
                            : station.image_url;
                        return (
                            <SwiperSlide key={station.id} className="swiper-slide">
                                <div className="relative w-full h-full">
                                    {/* Station logo base layer — always present */}
                                    <img
                                        src={station.image_url}
                                        alt={station.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        style={{ opacity: isActive && currentSong?.artwork ? 0 : 1, transition: 'opacity 0.6s ease' }}
                                    />
                                    {/* Artwork overlay — fades in when active and has artwork */}
                                    {isActive && currentSong?.artwork && (
                                        <img
                                            src={currentSong.artwork}
                                            alt={currentSong?.title || station.name}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            style={{ opacity: 1, transition: 'opacity 0.6s ease' }}
                                        />
                                    )}
                                </div>
                                <div className="overlay"></div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>

            <div className="music-player">
                <h1>{songTitle}</h1>
                <p className="font-bold text-white/90">{artistName}</p>

                <div className="slider-wrapper">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        id="progress"
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                    />
                    <span className="slider-watermark">web3radio</span>
                </div>

                <div className="controls">
                    <button className="backward" onClick={() => swiperRef.current?.slidePrev()}>
                        <SkipBack size={18} />
                    </button>
                    <button className="play-pause-btn" onClick={togglePlay}>
                        {isPlaying ? (
                            <Pause size={32} id="controlIcon" />
                        ) : (
                            <Play size={32} id="controlIcon" className="translate-x-0.5" />
                        )}
                    </button>
                    <button className="forward" onClick={() => swiperRef.current?.slideNext()}>
                        <SkipForward size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PremiumPlayer;
