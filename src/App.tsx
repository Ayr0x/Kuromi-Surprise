import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import Cards from './Cards';

// Asegúrate de tener el archivo en esta ruta:
import backgroundMusic from './assets/music/KUROMI Theme Song.mp3';

const IMAGES = [
  { src: 'https://imgur.com/1ySQlUo.png', bg: '#565656', panel: '#6b6b6b' },
  { src: 'https://imgur.com/PJWh0Xz.png', bg: '#4e2c4b', panel: '#693a56' },
  { src: 'https://imgur.com/CMlO7vg.png', bg: '#eea1e3', panel: '#f4b5eb' },
];

const GRAIN_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E`;

type Role = 'center' | 'left' | 'right';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false); // NUEVO: Estado para la pantalla de inicio
  const [showCards, setShowCards] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Estados para la música
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    IMAGES.forEach((img) => {
      const image = new Image();
      image.src = img.src;
    });
  }, []);

  // Función para entrar y reproducir la música
  const handleEnter = () => {
    setHasEntered(true);
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => console.log("El navegador bloqueó el autoplay"));
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const navigate = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => {
      if (direction === 'next') return (prev + 1) % 3;
      return (prev + 2) % 3;
    });
    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  const getRole = (index: number): Role => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + 2) % 3) return 'left';
    return 'right';
  };

  const getRoleStyles = (role: Role) => {
    const baseTransition = 'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)';
    const baseStyle = {
      transition: baseTransition,
      willChange: 'transform, filter, opacity, left',
      position: 'absolute' as const,
      aspectRatio: '0.6 / 1',
    };

    switch (role) {
      case 'center':
        return {
          ...baseStyle,
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '55%' : '85%',
          bottom: isMobile ? '28%' : '20%',
        };
      case 'left':
        return {
          ...baseStyle,
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '20%' : '28%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '40%' : '22%',
        };
      case 'right':
        return {
          ...baseStyle,
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '80%' : '72%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '40%' : '22%',
        };
    }
  };

  return (
    <>
      {/* Audio global */}
      <audio ref={audioRef} src={backgroundMusic} loop />

      {/* PANTALLA DE INICIO (El usuario debe hacer clic para entrar) */}
      {!hasEntered && (
        <div className="fixed inset-0 bg-[#1a181b] z-[200] flex flex-col items-center justify-center">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: 0.2,
              backgroundImage: `url("${GRAIN_SVG}")`,
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat',
            }}
          />
          <h1 
            className="text-white text-center mb-8 px-4"
            style={{ fontFamily: '"Anton", sans-serif', fontSize: 'clamp(40px, 8vw, 80px)', letterSpacing: '0.02em' }}
          >
            UNA SORPRESA TE ESPERA
          </h1>
          <button 
            onClick={handleEnter}
            className="relative px-8 py-4 bg-[#800080] text-white font-bold rounded-full text-lg sm:text-xl hover:scale-110 hover:bg-[#9370DB] transition-all shadow-[0_0_30px_rgba(128,0,128,0.6)] animate-bounce font-['Inter']"
          >
            HAZ CLIC PARA ABRIR
          </button>
        </div>
      )}

      {/* Solo mostramos el reproductor y el resto si ya entró */}
      {hasEntered && (
        <>
          {/* Reproductor de música flotante */}
          <div className="fixed top-6 right-4 sm:top-8 sm:right-8 z-[100] flex items-center gap-3 bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/20">
            <button 
              onClick={togglePlay} 
              className="text-white hover:scale-110 transition-transform"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <div className="flex items-center gap-2">
              {volume === 0 ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={handleVolume}
                className="w-20 sm:w-24 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {showCards ? (
            <Cards onBack={() => setShowCards(false)} />
          ) : (
            <div
              className="relative w-full overflow-hidden"
              style={{
                backgroundColor: IMAGES[activeIndex].bg,
                transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
                fontFamily: '"Inter", sans-serif',
              }}
            >
              <div className="relative w-full h-screen overflow-hidden">
                
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    zIndex: 50,
                    opacity: 0.4,
                    backgroundImage: `url("${GRAIN_SVG}")`,
                    backgroundSize: '200px 200px',
                    backgroundRepeat: 'repeat',
                  }}
                />

                <div
                  className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
                  style={{
                    zIndex: 2,
                    top: '18%',
                    fontFamily: '"Anton", sans-serif',
                    fontSize: 'clamp(90px, 28vw, 380px)',
                    fontWeight: 900,
                    color: 'white',
                    opacity: 1,
                    lineHeight: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Vanessa
                </div>

                <div
                  className="absolute top-6 left-4 sm:left-8 text-xs font-semibold uppercase text-white"
                  style={{ zIndex: 60, opacity: 0.9, letterSpacing: '0.18em' }}
                >
                  By: Ryam
                </div>

                <div className="absolute inset-0" style={{ zIndex: 3 }}>
                  {IMAGES.map((img, index) => {
                    const role = getRole(index);
                    const style = getRoleStyles(role);

                    return (
                      <div key={index} style={style}>
                        <img
                          src={img.src}
                          alt={`Toonhub Character ${index + 1}`}
                          draggable="false"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            objectPosition: 'bottom center',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div
                  className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
                  style={{ zIndex: 60, maxWidth: '320px' }}
                >
                  <p
                    className="mb-2 sm:mb-3 text-base sm:text-[22px] font-bold uppercase text-white"
                    style={{ opacity: 0.95, letterSpacing: '0.02em' }}
                  >
                    SEMANA CUMPLEAÑERO
                  </p>
                  <p
                    className="hidden sm:block text-xs sm:text-sm text-white mb-4 sm:mb-5"
                    style={{ opacity: 0.85, lineHeight: 1.6 }}
                  >
                    Escogi a kuromi como personaje de este carrusel porque se que te encanta y desde que apareciste en mi vida y comenzaste a mencionarla, tambien se hizo parte de mi.
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate('prev')}
                      className="group flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-transparent border-2 border-white text-white"
                      style={{ transition: 'transform 150ms, background-color 150ms' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.08)';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <ArrowLeft size={26} strokeWidth={2.25} />
                    </button>
                    <button
                      onClick={() => navigate('next')}
                      className="group flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-transparent border-2 border-white text-white"
                      style={{ transition: 'transform 150ms, background-color 150ms' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.08)';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <ArrowRight size={26} strokeWidth={2.25} />
                    </button>
                  </div>
                </div>

                <div
                  className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10"
                  style={{ zIndex: 60 }}
                >
                  <button
                    onClick={() => setShowCards(true)}
                    className="flex items-center gap-2 sm:gap-3 text-white bg-transparent border-none cursor-pointer p-0 transition-opacity duration-200"
                    style={{
                      fontFamily: '"Anton", sans-serif',
                      fontSize: 'clamp(20px, 4vw, 56px)',
                      fontWeight: 400,
                      opacity: 0.95,
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                      textTransform: 'uppercase',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.95')}
                  >
                    DISCOVER IT
                    <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}