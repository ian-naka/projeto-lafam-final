interface MapaVisualProps {
  latitude: string;
  longitude: string;
}

const MapaVisual = ({ latitude, longitude }: MapaVisualProps) => {
  const latitudeNormalizada = latitude.trim();
  const longitudeNormalizada = longitude.trim();

  if (!latitudeNormalizada || !longitudeNormalizada) {
    return (
      <div className="mapa-vazio">
        Informe coordenadas no formato latitude, longitude.
      </div>
    );
  }

  return (
    <iframe
      className="mapa-iframe"
      src={`https://maps.google.com/maps?q=${latitudeNormalizada},${longitudeNormalizada}&hl=pt-BR&z=14&output=embed`}
      title="Mapa da postagem"
      loading="lazy"
    />
  );
};

export default MapaVisual;
