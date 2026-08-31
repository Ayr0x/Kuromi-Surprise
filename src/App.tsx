import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Cards from './Cards'; // Importamos la nueva pantalla de sorpresas

// 1. Nuevas imágenes de Kuromi (exactas y en orden) y colores asociados
const IMAGES = [
  {
    src: 'https://imgur.com/1ySQlUo.png', // Kuromi con Cubo Rubik
    bg: '#565656', // Color de fondo original
    panel: '#6b6b6b' // Color de panel original
  },
  {
    src: 'https://imgur.com/PJWh0Xz.png', // Kuromi Bruja en escoba
    bg: '#4e2c4b', // Púrpura mágico
    panel: '#693a56' // Púrpura medio
  },
  {
    src: 'https://imgur.com/CMlO7vg.png', // Kuromi sonriendo
    bg: '#eea1e3', // Rosa claro
    panel: '#f4b5eb' // Rosa
  },
];

const GRAIN_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E`;

// Redefinimos los roles para solo 3 imágenes
type Role = 'center' | 'left' | 'right';

export default function App() {
  const [showCards, setShowCards] = useState(false); // Estado para controlar qué pantalla se ve
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize for isMobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload images on mount (solo las 3)
  useEffect(() => {
    IMAGES.forEach((img) => {
      const image = new Image();
      image.src = img.src;
    });
  }, []);

  const navigate = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Actualizamos la navegación para 3 elementos (activeIndex va de 0 a 2)
    setActiveIndex((prev) => {
      if (direction === 'next') return (prev + 1) % 3;
      return (prev + 2) % 3; // equivalent to (prev - 1 + 3) % 3
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  // Obtenemos los roles para 3 imágenes
  const getRole = (index: number): Role => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + 2) % 3) return 'left'; // Anterior
    return 'right'; // (activeIndex + 1) % 3 // Siguiente
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
          // Altura ajustada y bottom aumentado para subir la imagen principal
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
          // Subimos las imágenes laterales
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
          // Subimos las imágenes laterales
          bottom: isMobile ? '40%' : '22%',
        };
    }
  };

  // Si showCards es verdadero, mostramos la nueva pantalla de cartas y ocultamos el carrusel
  if (showCards) {
    return <Cards onBack={() => setShowCards(false)} />;
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <div className="relative w-full h-screen overflow-hidden">
        
        {/* 1. Grain overlay */}
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

        {/* 2. Giant ghost text "Vanessa" */}
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

        {/* 3. Top-left brand label */}
        <div
          className="absolute top-6 left-4 sm:left-8 text-xs font-semibold uppercase text-white"
          style={{ zIndex: 60, opacity: 0.9, letterSpacing: '0.18em' }}
        >
          By: Ryam
        </div>

        {/* 4. Carousel Items (solo 3) */}
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

        {/* 5. Bottom-left text + nav buttons */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: '320px' }}
        >
          <p
            className="mb-2 sm:mb-3 text-base sm:text-[22px] font-bold uppercase text-white"
            style={{ opacity: 0.95, letterSpacing: '0.02em' }}
          >
            SEMANA CUMPLEAÑERA
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

        {/* 6. Bottom-right link (Convertido en Botón para abrir las cartas) */}
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
            POR AQUI SEÑORITA
            <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
          </button>
        </div>

      </div>
    </div>
  );
}