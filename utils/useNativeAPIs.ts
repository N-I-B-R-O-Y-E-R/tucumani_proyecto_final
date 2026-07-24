'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useNativeAPIs() {
  const [comandoReconocido, setComandoReconocido] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();

  const hablar = (texto: string) => {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const iniciarEscuchaGlobal = () => {
    // @ts-expect-error API del navegador
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta comandos de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      hablar("No pude escucharte bien, intenta de nuevo.");
    };

    recognition.start();

    recognition.onresult = (event: { results: { transcript: string }[][] }) => {
      const comando = event.results[0][0].transcript.toLowerCase();
      setComandoReconocido(comando);
      
      // 🧠 Lógica Avanzada usando Regex (Atrapa sinónimos y errores fonéticos)
      
      if (comando.match(/venta|vender|cobrar/)) {
        hablar("Abriendo el módulo de ventas.");
        router.push('/ventas');
      } 
      else if (comando.match(/dashboard|inicio|principal|panel/)) {
        hablar("Volviendo al panel de inicio.");
        router.push('/');
      } 
      else if (comando.match(/surtidor|surtidores|inventario|gestor|máquina/)) {
        hablar("Navegando al gestor de surtidores.");
        router.push('/surtidores');
      } 
      // Atención al match de "deporte" para atrapar el error común (Corregido a comentario válido de TS)
      else if (comando.match(/reporte|reportes|exportar|deporte|deportes|informe/)) {
        hablar("Abriendo los reportes financieros del sistema.");
        router.push('/reportes');
      } 
      else if (comando.match(/consejo|ayuda|qué hago/)) {
        const consejos = [
          "Recuerda revisar la tabla de alertas. Las notificaciones rojas indican mantenimientos urgentes.",
          "El sistema utiliza aritmética binaria internamente para auditar los totales. Exporta un Excel para verificar.",
          "El botón flotante te permite navegar sin usar el mouse, solo di la sección a la que quieres ir."
        ];
        hablar("Aquí tienes un consejo: " + consejos[Math.floor(Math.random() * consejos.length)]);
      } 
      else {
        hablar("Disculpa, no entendí la instrucción. Puedes decir: ir a gestor, abrir ventas, o dame un consejo.");
      }
    };
  };

  const copiarAlPortapapeles = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      alert("Reporte copiado exitosamente");
    } catch (err) {
      console.error("Error al copiar: ", err);
    }
  };

  return { iniciarEscuchaGlobal, comandoReconocido, copiarAlPortapapeles, hablar, isListening };
}