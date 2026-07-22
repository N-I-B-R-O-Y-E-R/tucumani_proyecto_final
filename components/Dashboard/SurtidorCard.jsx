export default function SurtidorCard({ surtidor }) {
  // Validación para evitar divisiones por cero o nulos
  const nivel = Number(surtidor.nivel_actual) || 0;
  const capacidad = Number(surtidor.capacidad) || 1;
  const porcentaje = (nivel / capacidad) * 100;
  
  const colorBarra = porcentaje < 30 ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Surtidor #{surtidor.numero}</h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
          {surtidor.combustible}
        </span>
      </div>
      
      <div className="mb-2 flex justify-between text-sm text-gray-600">
        <span>Nivel: {nivel} / {capacidad} {surtidor.unidad}</span>
        <span className="font-bold">{porcentaje.toFixed(1)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
        <div 
          className={`h-2.5 rounded-full ${colorBarra} transition-all duration-500 ease-in-out`} 
          style={{ width: `${Math.min(porcentaje, 100)}%` }}
        ></div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
          BIN: {Number(surtidor.estadoBinario).toString(2).padStart(3, '0')}
        </span>
      </div>
    </div>
  );
}