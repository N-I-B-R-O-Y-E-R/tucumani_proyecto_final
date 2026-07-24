'use client';
import { useNativeAPIs } from '../utils/useNativeAPIs';
import { usePathname } from 'next/navigation';

export default function FloatingVoiceAssistant() {
  const { iniciarEscuchaGlobal, isListening, comandoReconocido } = useNativeAPIs();
  const pathname = usePathname();

  // No mostrar el asistente de voz en la pantalla de login
  if (pathname === '/login') return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3 no-print">
      {comandoReconocido && !isListening && (
        <div className="bg-white px-4 py-3 rounded-2xl rounded-br-none shadow-xl border border-gray-200 text-sm font-medium text-slate-700 max-w-xs text-right animate-bounce-short">
          🗣️ &quot;{comandoReconocido}&quot;
        </div>
      )}

      {isListening && (
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold animate-pulse flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          Escuchando comando...
        </div>
      )}
      
      <button
        onClick={iniciarEscuchaGlobal}
        disabled={isListening}
        className={`h-16 w-16 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center border-4 ${
          isListening 
            ? 'bg-red-500 border-red-300 animate-pulse' 
            : 'bg-slate-900 border-slate-700 hover:bg-blue-600 hover:border-blue-400'
        }`}
        title="Asistente de Voz Inteligente"
      >
        <span className="text-3xl">🎤</span>
      </button>
    </div>
  );
}