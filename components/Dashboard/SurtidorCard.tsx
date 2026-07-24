import React from 'react';

interface SurtidorProps {
  surtidor: {
    id: number;
    numero: number;
    combustible: string;
    capacidad: number;
    nivel: number;
    estado: string;
  };
}

export default function SurtidorCard({ surtidor }: SurtidorProps) {
  const porcentaje = (surtidor.nivel / surtidor.capacidad) * 100;
  
  const colorAlerta = porcentaje < 20 ? 'bg-red-500' : porcentaje < 50 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="p-5 border rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-gray-800">Surtidor #{surtidor.numero}</h3>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${surtidor.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {surtidor.estado}
        </span>
      </div>
      
      <p className="text-gray-600 font-medium mb-2">{surtidor.combustible}</p>
      
      {/* Barra de nivel de combustible */}
      <div className="mt-3 h-4 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300">
        <div 
          className={`h-full ${colorAlerta} transition-all duration-500 ease-in-out`} 
          style={{ width: `${Math.max(0, porcentaje)}%` }}
        ></div>
      </div>
      
      <p className="text-sm mt-2 text-right font-mono text-gray-700">
        {surtidor.nivel.toFixed(2)}L / {surtidor.capacidad}L
      </p>
    </div>
  );
}