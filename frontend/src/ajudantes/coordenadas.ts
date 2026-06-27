export function montarCoordenadas(latitude: string, longitude: string): string {
  const latitudeNormalizada = latitude.trim();
  const longitudeNormalizada = longitude.trim();

  if (!latitudeNormalizada || !longitudeNormalizada) {
    return '';
  }

  return `${latitudeNormalizada}, ${longitudeNormalizada}`;
}

export function extrairLatitudeLongitude(coordenadas?: string): {
  latitude: string;
  longitude: string;
} {
  if (!coordenadas) {
    return {
      latitude: '',
      longitude: '',
    };
  }

  const [latitude = '', longitude = ''] = coordenadas.split(',').map((item) => item.trim());

  return {
    latitude,
    longitude,
  };
}
