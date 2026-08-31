import React, { useState } from 'react';
import { Lock, Gift, ArrowLeft, X } from 'lucide-react';

// Aquí configuras tus 7 cartas.
// Para DESBLOQUEAR una carta: colócale un enlace en 'imgUrl' y un mensaje en 'text'.
// Si 'imgUrl' se queda vacío (''), la carta aparecerá bloqueada con un candado.
const CARDS_DATA = [
  { id: 1, imgUrl: '', text: '¡Feliz cumpleaños Vanessa! Que tengas un día hermoso.' },
  { id: 2, imgUrl: '', text: '' },
  { id: 3, imgUrl: '', text: '' },
  { id: 4, imgUrl: '', text: '' },
  { id: 5, imgUrl: '', text: '' },
  { id: 6, imgUrl: '', text: '' },
  { id: 7, imgUrl: '', text: '' },
];

interface CardsProps {
  onBack: () => void;
}

export default function Cards({ onBack }: CardsProps) {
  const [selectedCard, setSelectedCard] = useState<typeof CARDS_DATA[0] | null>(null);

  return (
    <div className="min-h-screen bg-[#1a181b] p-6 sm:p-12 font-['Inter',sans-serif] text-white flex flex-col items-center">
      
      {/* Botón de regreso */}
      <button 
        onClick={onBack}
        className="self-start flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={24} />
        <span className="uppercase tracking-widest text-sm font-semibold">Volver al inicio</span>
      </button>

      <h1 
        className="text-center text-white mb-12"
        style={{ fontFamily: '"Anton", sans-serif', fontSize: 'clamp(40px, 8vw, 80px)', lineHeight: 1, letterSpacing: '0.02em' }}
      >
        TUS SORPRESAS
      </h1>

      {/* Grilla de 7 Cartas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl">
        {CARDS_DATA.map((card) => {
          const isUnlocked = card.imgUrl !== '';

          return (
            <div 
              key={card.id} 
              onClick={() => isUnlocked && setSelectedCard(card)}
              className={`relative aspect-[3/4] rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                isUnlocked 
                  ? 'bg-[#FFC0CB] border-[#FFB6C1] cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(255,182,193,0.4)]' 
                  : 'bg-zinc-800/50 border-zinc-700 cursor-not-allowed opacity-70'
              }`}
            >
              {isUnlocked ? (
                <>
                  <Gift size={48} className="text-[#800080] mb-2" strokeWidth={1.5} />
                  <span className="text-[#800080] font-bold tracking-widest text-sm">ABRIR</span>
                </>
              ) : (
                <>
                  <Lock size={40} className="text-zinc-500 mb-2" strokeWidth={1.5} />
                  <span className="text-zinc-500 font-medium tracking-widest text-xs">BLOQUEADA</span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal / Carta Volteada al hacer clic */}
      {selectedCard && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedCard(null)}
        >
          <div 
            className="relative bg-[#1a181b] border-2 border-[#800080] p-6 rounded-3xl max-w-md w-full flex flex-col items-center shadow-[0_0_40px_rgba(128,0,128,0.3)]"
            onClick={(e) => e.stopPropagation()} // Evita que al hacer clic en la tarjeta se cierre el modal
          >
            <button 
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/20 rounded-full p-1"
            >
              <X size={24} />
            </button>

            <img 
              src={selectedCard.imgUrl} 
              alt="Sorpresa" 
              className="w-full h-auto max-h-[50vh] object-contain rounded-xl mb-6 bg-black/20" 
            />
            
            <p className="text-center font-medium text-lg leading-relaxed text-white/90">
              {selectedCard.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}