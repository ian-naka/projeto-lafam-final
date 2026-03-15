import React from 'react';

interface MapaGoogleProps {
  coordenadas: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MapaGoogle: React.FC<MapaGoogleProps> = ({ coordenadas, handleInputChange }) => {
  // extrai latitude e longitude para o mapa
  let lat = '', lng = '';
  const coordParts = coordenadas.split(',').map(c => c.trim());
  if (coordParts.length === 2 && !isNaN(Number(coordParts[0])) && !isNaN(Number(coordParts[1]))) {
    lat = coordParts[0];
    lng = coordParts[1];
  }

  return (
    <div className="bg-white shadow-sm border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">
        localização
      </div>
      <div className="p-4 flex flex-col gap-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">coordenadas (lat, lng)</label>
          <input
            type="text"
            name="coordenadas"
            value={coordenadas}
            onChange={handleInputChange}
            placeholder="-21.7664, -43.3444"
            className="w-full border border-gray-300 p-2 outline-none focus:border-[#a5002c]"
          />
        </div>

        {/* renderização do mapa */}
        {lat && lng && (
          <div className="mt-2 w-full h-[200px] border border-gray-300 bg-gray-100 overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`http://googleusercontent.com/maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
              title="mapa de coordenadas"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapaGoogle;
